import mqtt, { MqttClient } from 'mqtt';
import {
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
  DirectAidEvent,
  IntermunicipalLoan,
} from '../types/textGame';

// Shared global topic for all players who enter the game
export const GLOBAL_WORLD_TOPIC = 'prefeito_sim_brasil_v1/mundo_ao_vivo';

export interface WorldSyncPayload {
  type:
    | 'heartbeat'
    | 'chat'
    | 'treaty_proposed'
    | 'treaty_ratified'
    | 'treaty_rejected'
    | 'direct_aid'
    | 'loan_proposed'
    | 'loan_responded';
  senderId: string;
  senderName?: string;
  senderCity?: string;
  profile?: RegionalMayorProfile;
  message?: RegionalChatMessage;
  treaty?: RegionalTreaty;
  aidEvent?: DirectAidEvent;
  loan?: IntermunicipalLoan;
  loanAccepted?: boolean;
  timestamp: number;
}

type SyncListener = (payload: WorldSyncPayload) => void;

class GlobalWorldSyncService {
  private client: MqttClient | null = null;
  private listeners: Set<SyncListener> = new Set();
  private isConnected: boolean = false;
  private currentBrokerIndex: number = 0;
  private brokers: string[] = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
  ];

  constructor() {
    this.connect();
  }

  private connect() {
    if (typeof window === 'undefined') return;

    try {
      const brokerUrl = this.brokers[this.currentBrokerIndex];
      // Unique client ID per browser session
      let clientId = localStorage.getItem('prefeito_mqtt_client_id');
      if (!clientId) {
        clientId = 'prefeito_cli_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('prefeito_mqtt_client_id', clientId);
      }

      this.client = mqtt.connect(brokerUrl, {
        clientId: `${clientId}_${Date.now().toString(36)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
        keepalive: 20,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.client?.subscribe(GLOBAL_WORLD_TOPIC, { qos: 0 }, (err) => {
          if (!err) {
            console.log('[WorldSync] Subscribed to Global Live World topic:', GLOBAL_WORLD_TOPIC);
          }
        });
      });

      this.client.on('message', (topic, message) => {
        if (topic === GLOBAL_WORLD_TOPIC) {
          try {
            const raw = message.toString();
            const data: WorldSyncPayload = JSON.parse(raw);
            this.notifyListeners(data);
          } catch (e) {
            console.warn('[WorldSync] Failed to parse message:', e);
          }
        }
      });

      this.client.on('error', (err) => {
        console.warn('[WorldSync] Broker error, trying next broker:', err);
        this.rotateBroker();
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });
    } catch (err) {
      console.warn('[WorldSync] Initialization error:', err);
    }
  }

  private rotateBroker() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch (e) {}
      this.client = null;
    }
    this.currentBrokerIndex = (this.currentBrokerIndex + 1) % this.brokers.length;
    setTimeout(() => this.connect(), 2000);
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(payload: WorldSyncPayload) {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (e) {
        console.error('[WorldSync] Listener error:', e);
      }
    });
  }

  public broadcast(payload: Omit<WorldSyncPayload, 'timestamp'>) {
    const fullPayload: WorldSyncPayload = {
      ...payload,
      timestamp: Date.now(),
    };

    if (this.client && this.isConnected) {
      try {
        this.client.publish(GLOBAL_WORLD_TOPIC, JSON.stringify(fullPayload), { qos: 0 });
      } catch (e) {
        console.warn('[WorldSync] Publish error:', e);
      }
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const worldSync = new GlobalWorldSyncService();
