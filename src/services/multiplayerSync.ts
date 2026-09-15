import mqtt, { MqttClient } from 'mqtt';
import {
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
  DirectAidEvent,
  IntermunicipalLoan,
} from '../types/textGame';

// Shared global topic
export const GLOBAL_WORLD_TOPIC = 'prefeito_sim_brasil_v3/mundo_ao_vivo';

// 4 Dedicated Cloud Player Slots (each player writes exclusively to their own slot to eliminate race-conditions)
export const DEDICATED_SLOTS = [
  { id: 'ff808181a09d98f701a0a19ce0000814', slot: 1, name: 'simcity_player_slot_1' },
  { id: 'ff808181a09d98f701a0a19d00fa0815', slot: 2, name: 'simcity_player_slot_2' },
  { id: 'ff808181a09d98f701a0a19d375d0816', slot: 3, name: 'simcity_player_slot_3' },
  { id: 'ff808181a09d98f701a0a19e50a90817', slot: 4, name: 'simcity_player_slot_4' },
];

export const ALL_SLOTS_URL =
  'https://api.restful-api.dev/objects?' + DEDICATED_SLOTS.map((s) => 'id=' + s.id).join('&');

export interface WorldSyncPayload {
  type:
    | 'heartbeat'
    | 'chat'
    | 'treaty_proposed'
    | 'treaty_ratified'
    | 'treaty_rejected'
    | 'direct_aid'
    | 'loan_proposed'
    | 'loan_responded'
    | 'ping_greeting';
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

export interface OutboxItem {
  id: string;
  payload: WorldSyncPayload;
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
    'wss://test.mosquitto.org:8081',
  ];

  private localPlayerId: string = '';
  private localProfile: RegionalMayorProfile | null = null;
  private myAssignedSlotId: string = '';
  private outbox: OutboxItem[] = [];
  private processedEventIds: Set<string> = new Set();
  private isSyncingCloud: boolean = false;
  private cloudInterval: any = null;

  constructor() {
    // Restore assigned slot if previously stored
    if (typeof window !== 'undefined') {
      try {
        this.myAssignedSlotId = localStorage.getItem('prefeito_assigned_slot_id') || '';
      } catch (e) {}
    }

    this.connectMqtt();
    this.startCloudPoller();
  }

  public setLocalPlayer(playerId: string, profile: RegionalMayorProfile) {
    this.localPlayerId = playerId;
    this.localProfile = profile;
    this.determineDedicatedSlot();
  }

  private determineDedicatedSlot() {
    const cleanId = (this.localPlayerId || '').toLowerCase();
    const cleanName = (this.localProfile?.name || '').toLowerCase();

    // Priority deterministic assignment to prevent collisions:
    if (cleanId.includes('cassio') || cleanName.includes('cassio')) {
      this.myAssignedSlotId = DEDICATED_SLOTS[0].id; // Slot 1 for Cássio
    } else if (cleanId.includes('lais') || cleanName.includes('lais')) {
      this.myAssignedSlotId = DEDICATED_SLOTS[1].id; // Slot 2 for Laís
    }
    if (typeof window !== 'undefined' && this.myAssignedSlotId) {
      try {
        localStorage.setItem('prefeito_assigned_slot_id', this.myAssignedSlotId);
      } catch (e) {}
    }
  }

  private startCloudPoller() {
    if (typeof window === 'undefined') return;

    // Resilient HTTPS polling every 2.5 seconds to prevent rate-limiting
    this.cloudInterval = setInterval(() => {
      this.syncWithCloud();
    }, 2500);

    // Initial immediate sync
    setTimeout(() => {
      this.syncWithCloud();
    }, 200);
  }

  public syncNow() {
    this.syncWithCloud();
  }

  public async syncWithCloud() {
    if (this.isSyncingCloud) return;
    this.isSyncingCloud = true;

    try {
      const now = Date.now();
      this.determineDedicatedSlot();

      // 1. Fetch all 4 player slots in a single fast GET request
      const res = await fetch(ALL_SLOTS_URL, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        this.isSyncingCloud = false;
        return;
      }

      this.isConnected = true;
      const slotsArray: Array<{ id: string; name: string; data?: any }> = await res.json();

      // 2. Claim or verify our slot assignment
      let assignedSlot = slotsArray.find((s) => s.id === this.myAssignedSlotId);

      // If we don't have an assigned slot yet, or someone else took it:
      if (!assignedSlot || (assignedSlot.data?.playerId && assignedSlot.data.playerId !== this.localPlayerId)) {
        // Check if any slot currently has our playerId
        const existingMine = slotsArray.find((s) => s.data?.playerId === this.localPlayerId);
        if (existingMine) {
          this.myAssignedSlotId = existingMine.id;
          assignedSlot = existingMine;
        } else {
          // Find first vacant slot (where lastSeen is > 30s ago or empty)
          const vacant = slotsArray.find(
            (s) => !s.data?.lastSeen || now - s.data.lastSeen > 30000
          );
          if (vacant) {
            this.myAssignedSlotId = vacant.id;
            assignedSlot = vacant;
          } else {
            // Pick the oldest one
            const sorted = [...slotsArray].sort(
              (a, b) => (a.data?.lastSeen || 0) - (b.data?.lastSeen || 0)
            );
            this.myAssignedSlotId = sorted[0]?.id || DEDICATED_SLOTS[0].id;
            assignedSlot = sorted[0];
          }
        }

        try {
          localStorage.setItem('prefeito_assigned_slot_id', this.myAssignedSlotId);
        } catch (e) {}
      }

      // 3. If local profile exists, push our own data to our slot (via PUT)
      if (this.localPlayerId && this.localProfile && assignedSlot) {
        const slotConfig = DEDICATED_SLOTS.find((s) => s.id === this.myAssignedSlotId) || DEDICATED_SLOTS[0];
        const mySlotData = {
          slot: slotConfig.slot,
          playerId: this.localPlayerId,
          mayorName: this.localProfile.name,
          cityName: this.localProfile.cityName,
          profile: {
            ...this.localProfile,
            isRealPlayer: true,
            isOnline: true,
            lastUpdated: now,
          },
          lastSeen: now,
          outbox: this.outbox.slice(-15),
        };

        // Fire PUT in background without blocking polling
        fetch(`https://api.restful-api.dev/objects/${this.myAssignedSlotId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: slotConfig.name,
            data: mySlotData,
          }),
        }).catch(() => {});
      }

      // 4. Process all OTHER slots (other real mayors online!)
      for (const otherSlot of slotsArray) {
        if (!otherSlot || otherSlot.id === this.myAssignedSlotId) continue;
        const otherData = otherSlot.data;
        if (!otherData || !otherData.playerId || otherData.playerId === this.localPlayerId) continue;

        // FILTER GHOST ACCOUNTS:
        // Ignore phantom test city "Porto da Aliança"
        if (otherData.cityName === 'Porto da Aliança') continue;

        // Ignore duplicate of self (e.g. if otherData has the same mayor name as local player)
        if (
          this.localProfile &&
          otherData.mayorName &&
          otherData.mayorName.toLowerCase().trim() === this.localProfile.name.toLowerCase().trim()
        ) {
          continue;
        }

        // Check if online with clock skew tolerance up to 3 minutes
        const isOnline = otherData.lastSeen && (Math.abs(now - otherData.lastSeen) < 180000 || now - otherData.lastSeen < 180000);
        if (otherData.profile && isOnline) {
          const partnerProfile: RegionalMayorProfile = {
            ...otherData.profile,
            isRealPlayer: true,
            isOnline: true,
            lastUpdated: otherData.lastSeen || now,
          };

          // Notify listeners of the active real mayor!
          this.notifyListeners({
            type: 'heartbeat',
            senderId: otherData.playerId,
            senderName: otherData.mayorName,
            senderCity: otherData.cityName,
            profile: partnerProfile,
            timestamp: otherData.lastSeen || now,
          });

          // Check other player's outbox for incoming events (chats, treaties, aid, loans)
          if (Array.isArray(otherData.outbox)) {
            for (const item of otherData.outbox) {
              if (item && item.id && !this.processedEventIds.has(item.id)) {
                this.processedEventIds.add(item.id);
                if (item.payload) {
                  this.notifyListeners(item.payload);
                }
              }
            }
          }
        }
      }
    } catch (e) {
      // Cloud sync failure will automatically retry on next tick
    } finally {
      this.isSyncingCloud = false;
    }
  }

  private connectMqtt() {
    if (typeof window === 'undefined') return;

    try {
      const brokerUrl = this.brokers[this.currentBrokerIndex];
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

    if (payload.type === 'heartbeat' && payload.profile) {
      this.localProfile = payload.profile;
      this.localPlayerId = payload.senderId;
    }

    // Add to outbox for cloud slot replication
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.processedEventIds.add(eventId);
    this.outbox.push({
      id: eventId,
      payload: fullPayload,
      timestamp: Date.now(),
    });

    // Immediate cloud push
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
