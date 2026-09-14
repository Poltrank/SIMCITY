import mqtt, { MqttClient } from 'mqtt';
import {
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
  DirectAidEvent,
  IntermunicipalLoan,
} from '../types/textGame';

// Shared global topic and central cloud storage for all players
export const GLOBAL_WORLD_TOPIC = 'prefeito_sim_brasil_v2/mundo_ao_vivo';
export const CLOUD_ROOM_ENDPOINT = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0a18b905907ce';

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

interface CloudRoomState {
  room: string;
  mayors: Record<string, RegionalMayorProfile>;
  treaties: RegionalTreaty[];
  chat: RegionalChatMessage[];
  aid: DirectAidEvent[];
  lastUpdate: number;
}

type SyncListener = (payload: WorldSyncPayload) => void;

class GlobalWorldSyncService {
  private client: MqttClient | null = null;
  private listeners: Set<SyncListener> = new Set();
  private isConnected: boolean = false;
  private currentBrokerIndex: number = 0;
  private brokers: string[] = [
    'wss://test.mosquitto.org:8081',
    'wss://broker.emqx.io:8084/mqtt',
  ];
  private pendingBroadcasts: WorldSyncPayload[] = [];
  private isSyncingCloud: boolean = false;
  private knownMessageIds: Set<string> = new Set();

  constructor() {
    this.connectMqtt();
    this.startCloudPoller();
  }

  private startCloudPoller() {
    if (typeof window === 'undefined') return;

    // Fast cloud sync interval every 1.8 seconds over standard HTTPS port 443 (works everywhere)
    setInterval(() => {
      this.syncWithCloud();
    }, 1800);

    // Initial sync
    setTimeout(() => {
      this.syncWithCloud();
    }, 300);
  }

  private async syncWithCloud() {
    if (this.isSyncingCloud) return;
    this.isSyncingCloud = true;

    try {
      // 1. Fetch current cloud state
      const res = await fetch(CLOUD_ROOM_ENDPOINT, {
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        this.isConnected = true;
        const body = await res.json();
        const state: CloudRoomState = body.data || {
          room: 'BRASIL',
          mayors: {},
          treaties: [],
          chat: [],
          aid: [],
          lastUpdate: Date.now(),
        };

        // Notify listeners of all active other mayors
        const now = Date.now();
        if (state.mayors) {
          Object.values(state.mayors).forEach((mayor) => {
            // Check if active in the last 3 minutes
            if (mayor && mayor.id && (!mayor.lastUpdated || now - mayor.lastUpdated < 180000)) {
              this.notifyListeners({
                type: 'heartbeat',
                senderId: mayor.id,
                senderName: mayor.name,
                senderCity: mayor.cityName,
                profile: mayor,
                timestamp: mayor.lastUpdated || now,
              });
            }
          });
        }

        // Notify of any new chat messages
        if (Array.isArray(state.chat)) {
          state.chat.slice(-10).forEach((msg) => {
            if (msg && msg.id && !this.knownMessageIds.has(msg.id)) {
              this.knownMessageIds.add(msg.id);
              this.notifyListeners({
                type: 'chat',
                senderId: 'cloud',
                message: msg,
                timestamp: Date.now(),
              });
            }
          });
        }

        // Notify of any treaties
        if (Array.isArray(state.treaties)) {
          state.treaties.forEach((treaty) => {
            if (treaty && treaty.id) {
              const key = `treaty_${treaty.id}_${treaty.status}`;
              if (!this.knownMessageIds.has(key)) {
                this.knownMessageIds.add(key);
                this.notifyListeners({
                  type: treaty.status === 'active' ? 'treaty_ratified' : 'treaty_proposed',
                  senderId: 'cloud',
                  treaty,
                  timestamp: treaty.timestamp || Date.now(),
                });
              }
            }
          });
        }

        // Process any queued pending broadcast actions
        if (this.pendingBroadcasts.length > 0) {
          const toSend = [...this.pendingBroadcasts];
          this.pendingBroadcasts = [];

          let stateChanged = false;
          toSend.forEach((p) => {
            if (p.type === 'heartbeat' && p.profile) {
              state.mayors[p.profile.id] = p.profile;
              stateChanged = true;
            } else if (p.type === 'chat' && p.message) {
              state.chat = [...(state.chat || []).slice(-30), p.message];
              this.knownMessageIds.add(p.message.id);
              stateChanged = true;
            } else if (p.type === 'treaty_proposed' && p.treaty) {
              state.treaties = [p.treaty, ...(state.treaties || []).filter((t) => t.id !== p.treaty!.id)];
              stateChanged = true;
            } else if ((p.type === 'treaty_ratified' || p.type === 'treaty_rejected') && p.treaty) {
              state.treaties = (state.treaties || []).map((t) =>
                t.id === p.treaty!.id ? { ...t, status: p.type === 'treaty_ratified' ? 'active' : 'rejected' } : t
              );
              stateChanged = true;
            } else if (p.type === 'direct_aid' && p.aidEvent) {
              state.aid = [p.aidEvent, ...(state.aid || []).slice(-10)];
              stateChanged = true;
            }
          });

          if (stateChanged) {
            state.lastUpdate = Date.now();
            await fetch(CLOUD_ROOM_ENDPOINT, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: body.name || 'simcity_brasil_unified_room_v2', data: state }),
            });
          }
        }
      }
    } catch (e) {
      // Cloud sync will retry on next tick
    } finally {
      this.isSyncingCloud = false;
    }
  }

  private connectMqtt() {
    if (typeof window === 'undefined') return;

    try {
      const brokerUrl = this.brokers[this.currentBrokerIndex];
      // Keep client ID <= 22 characters for MQTT 3.1 compatibility
      let clientId = localStorage.getItem('prefeito_mqtt_cid');
      if (!clientId) {
        clientId = 'pf_' + Math.random().toString(36).substring(2, 8);
        localStorage.setItem('prefeito_mqtt_cid', clientId);
      }

      this.client = mqtt.connect(brokerUrl, {
        clientId: `${clientId}_${Date.now().toString(36).slice(-4)}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 3000,
        keepalive: 20,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.client?.subscribe(GLOBAL_WORLD_TOPIC, { qos: 0 });
      });

      this.client.on('message', (topic, message) => {
        if (topic === GLOBAL_WORLD_TOPIC) {
          try {
            const raw = message.toString();
            const data: WorldSyncPayload = JSON.parse(raw);
            this.notifyListeners(data);
          } catch (e) {}
        }
      });

      this.client.on('error', () => {
        this.rotateBroker();
      });
    } catch (err) {}
  }

  private rotateBroker() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch (e) {}
      this.client = null;
    }
    this.currentBrokerIndex = (this.currentBrokerIndex + 1) % this.brokers.length;
    setTimeout(() => this.connectMqtt(), 3000);
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
      } catch (e) {}
    });
  }

  public broadcast(payload: Omit<WorldSyncPayload, 'timestamp'>) {
    const fullPayload: WorldSyncPayload = {
      ...payload,
      timestamp: Date.now(),
    };

    // Queue for cloud sync over HTTPS
    this.pendingBroadcasts.push(fullPayload);
    // Trigger immediate cloud push
    this.syncWithCloud();

    // Also send via MQTT if connected
    if (this.client && this.isConnected) {
      try {
        this.client.publish(GLOBAL_WORLD_TOPIC, JSON.stringify(fullPayload), { qos: 0 });
      } catch (e) {}
    }
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const worldSync = new GlobalWorldSyncService();
