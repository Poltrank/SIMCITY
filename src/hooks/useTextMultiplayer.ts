import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PrefeitoCityState,
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
  NegotiationNotification,
  DirectAidEvent,
  IntermunicipalLoan,
} from '../types/textGame';
import { sounds } from '../audio/soundManager';
import { worldSync } from '../services/multiplayerSync';

interface UseTextMultiplayerOptions {
  onReceiveDirectAid?: (amount: number, fromMayor: string, fromCity: string) => void;
  onTreatyProposed?: (treaty: RegionalTreaty) => void;
  onTreatyRatified?: (treaty: RegionalTreaty) => void;
  onLoanProposed?: (loan: IntermunicipalLoan) => void;
  onLoanResponded?: (loanId: string, accepted: boolean) => void;
  onLoanAccepted?: (loan: IntermunicipalLoan) => void;
  onLoanRejected?: (loanId: string) => void;
}

export const DEFAULT_NEIGHBORING_MAYORS: Record<string, RegionalMayorProfile> = {
  may_serra_alta: {
    id: 'may_serra_alta',
    name: 'Prefeito Fernando Silveira',
    cityName: 'Serra Alta',
    party: 'PROGRESSISTAS',
    role: 'mayor_north',
    color: '#3b82f6',
    population: 185000,
    treasury: 14200000,
    jobs: 88000,
    unemploymentRate: 5.4,
    touristsPerMonth: 28000,
    oilProductionBpd: 0,
    goldProductionKg: 42,
    energyProductionMw: 620,
    energySurplusMw: 240,
    fiscalRating: 'A',
    approvalRating: 74,
    isOnline: true,
    lastUpdated: Date.now(),
  },
  may_vale_verde: {
    id: 'may_vale_verde',
    name: 'Prefeita Dra. Helena Rios',
    cityName: 'Vale Verde',
    party: 'REDE SUSTENTÁVEL',
    role: 'mayor_south',
    color: '#10b981',
    population: 142000,
    treasury: 8900000,
    jobs: 62000,
    unemploymentRate: 6.2,
    touristsPerMonth: 48000,
    oilProductionBpd: 0,
    goldProductionKg: 0,
    energyProductionMw: 180,
    energySurplusMw: -20,
    fiscalRating: 'A',
    approvalRating: 81,
    isOnline: true,
    lastUpdated: Date.now(),
  },
  may_porto_real: {
    id: 'may_porto_real',
    name: 'Prefeito Carlos Drummond',
    cityName: 'Porto Real',
    party: 'UNIÃO METROPOLITANA',
    role: 'mayor_east',
    color: '#f59e0b',
    population: 310000,
    treasury: 22500000,
    jobs: 165000,
    unemploymentRate: 7.1,
    touristsPerMonth: 34000,
    oilProductionBpd: 2800,
    goldProductionKg: 0,
    energyProductionMw: 320,
    energySurplusMw: 10,
    fiscalRating: 'B',
    approvalRating: 68,
    isOnline: true,
    lastUpdated: Date.now(),
  },
};

/**
 * Merges new profiles into existing ones, ensuring real players always appear FIRST
 * and are never overwritten by static bot defaults.
 */
export function mergeMayorsWithRealFirst(
  existingProfiles: Record<string, RegionalMayorProfile>,
  newProfiles: Record<string, any>
): Record<string, RegionalMayorProfile> {
  const merged: Record<string, RegionalMayorProfile> = {};

  // 1. First add real players (from newProfiles then existingProfiles)
  Object.entries(newProfiles || {}).forEach(([id, prof]) => {
    if (prof && prof.isRealPlayer) {
      merged[id] = prof;
    }
  });
  Object.entries(existingProfiles || {}).forEach(([id, prof]) => {
    if (prof && prof.isRealPlayer && !merged[id]) {
      merged[id] = prof;
    }
  });

  // 2. Then default neighboring mayors (bots)
  Object.entries(DEFAULT_NEIGHBORING_MAYORS).forEach(([id, prof]) => {
    if (!merged[id]) {
      merged[id] = prof;
    }
  });

  // 3. Any other profiles from server
  Object.entries(newProfiles || {}).forEach(([id, prof]) => {
    if (prof && !merged[id]) {
      merged[id] = prof;
    }
  });

  return merged;
}

export function useTextMultiplayer(
  cityState: PrefeitoCityState,
  options?: UseTextMultiplayerOptions
) {
  // Unified single world for all players: Brasil
  const [roomId, setRoomId] = useState<string>('BRASIL');

  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [myRole, setMyRole] = useState<'mayor_north' | 'mayor_south' | 'spectator'>('mayor_north');

  // Synchronously initialize player ID based on authenticated user or unique ID
  const [myPlayerId, setMyPlayerId] = useState<string>(() => {
    try {
      const cur = localStorage.getItem('prefeito_current_user_v2');
      if (cur) {
        const user = JSON.parse(cur);
        if (user && user.username) {
          return 'usr_' + user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
        }
      }
    } catch (e) {}
    let pid = localStorage.getItem('prefeito_player_id_v2');
    if (!pid) {
      pid = 'usr_' + Math.random().toString(36).substr(2, 8);
      localStorage.setItem('prefeito_player_id_v2', pid);
    }
    return pid;
  });

  const [otherMayors, setOtherMayors] = useState<Record<string, RegionalMayorProfile>>(() => {
    try {
      const saved = localStorage.getItem('prefeito_persisted_profiles_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out legacy ghost accounts
        const cleaned: Record<string, RegionalMayorProfile> = {};
        Object.entries(parsed).forEach(([k, v]: [string, any]) => {
          if (v && v.cityName !== 'Porto da Aliança') {
            cleaned[k] = v;
          }
        });
        return mergeMayorsWithRealFirst(DEFAULT_NEIGHBORING_MAYORS, cleaned);
      }
    } catch (e) {}
    return DEFAULT_NEIGHBORING_MAYORS;
  });
  const [treaties, setTreaties] = useState<RegionalTreaty[]>([]);
  const [chatMessages, setChatMessages] = useState<RegionalChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'lobby' | 'treaties' | 'chat'>('lobby');

  // Notifications for incoming negotiations and treaties
  const [notifications, setNotifications] = useState<NegotiationNotification[]>([]);
  const [activeAlertNotification, setActiveAlertNotification] = useState<NegotiationNotification | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const activeRoomRef = useRef<string>('BRASIL');
  activeRoomRef.current = 'BRASIL';

  const cityStateRef = useRef<PrefeitoCityState>(cityState);
  cityStateRef.current = cityState;

  // Track previous partner ID to celebrate when partner connects
  const prevPartnerIdRef = useRef<string | null>(null);

  // Helper to build city profile payload
  const buildProfilePayload = useCallback((state: PrefeitoCityState, role: string, pid: string): RegionalMayorProfile => {
    return {
      id: pid,
      name: state.mayorName || 'Prefeito',
      cityName: state.cityName || 'Município',
      role: role || 'mayor_north',
      party: state.party,
      color: role === 'mayor_north' ? '#3b82f6' : '#10b981',
      population: state.population,
      treasury: state.treasury,
      jobs: state.jobs,
      unemploymentRate: state.unemploymentRate,
      touristsPerMonth: state.touristsPerMonth,
      oilProductionBpd: state.oilProductionBpd,
      goldProductionKg: state.goldProductionKg,
      energyProductionMw: state.energyProductionMw,
      energySurplusMw: state.energySurplusMw,
      fiscalRating: state.fiscalRating,
      approvalRating: state.approvalRating,
      isOnline: true,
      isRealPlayer: true,
      lastUpdated: Date.now(),
    };
  }, []);

  // Universal Heartbeat + Sync: Sends fresh profile and gets room state in 1 roundtrip
  const sendHeartbeatHttp = useCallback(async (targetRoom: string, pid: string) => {
    try {
      const currentProfile = buildProfilePayload(cityStateRef.current, myRole, pid);
      const res = await fetch('/api/multiplayer/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: targetRoom,
          playerId: pid,
          profile: currentProfile,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.room) {
          setIsConnected(true);
          if (data.room.cityProfiles) {
            setOtherMayors((prev) => {
              const merged = mergeMayorsWithRealFirst(prev, data.room.cityProfiles);
              // Check if partner newly joined
              const partners = Object.values(merged).filter((m) => m.id !== pid && m.isRealPlayer);
              if (partners.length > 0 && prevPartnerIdRef.current !== partners[0].id) {
                prevPartnerIdRef.current = partners[0].id;
                try {
                  sounds.playCelebration();
                } catch (e) {}
              }
              return merged;
            });
          }
          if (data.room.regionalTreaties) {
            setTreaties(data.room.regionalTreaties);
          }
          if (data.room.chatMessages) {
            setChatMessages(data.room.chatMessages);
          }
        }
      }
    } catch (e) {
      // Fallback to GET polling if POST network fails
      try {
        const res = await fetch(`/api/multiplayer/room/${encodeURIComponent(targetRoom)}?playerId=${encodeURIComponent(pid)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.room) {
            setIsConnected(true);
            if (data.room.cityProfiles) {
              setOtherMayors((prev) => mergeMayorsWithRealFirst(prev, data.room.cityProfiles));
            }
          }
        }
      } catch (err) {}
    }
  }, [buildProfilePayload, myRole]);

  // HTTP Join - Establishes presence on the server immediately
  const joinRoomHttp = useCallback(async (cleanRoom: string, pid: string, state: PrefeitoCityState) => {
    try {
      const profile = buildProfilePayload(state, myRole, pid);
      const res = await fetch('/api/multiplayer/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: cleanRoom,
          playerId: pid,
          playerName: state.mayorName,
          cityName: state.cityName,
          party: state.party,
          profile,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.room) {
          setIsConnected(true);
          if (data.yourPlayer) {
            setMyRole(data.yourPlayer.role);
          }
          if (data.room.cityProfiles) {
            setOtherMayors((prev) => mergeMayorsWithRealFirst(prev, data.room.cityProfiles));
          }
          if (data.room.regionalTreaties) {
            setTreaties(data.room.regionalTreaties);
          }
          if (data.room.chatMessages) {
            setChatMessages(data.room.chatMessages);
          }
        }
      }
    } catch (e) {
      // Ignore initial network lag
    }
  }, [buildProfilePayload, myRole]);

  const connectToRoom = useCallback(
    (targetRoomId: string) => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {}
      }

      const cleanRoom = 'BRASIL';
      setRoomId('BRASIL');
      activeRoomRef.current = 'BRASIL';

      // Clean URL params since the game world is now automatically unified for everyone
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('sala');
        url.searchParams.delete('room');
        url.searchParams.delete('r');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      } catch (e) {}

      // Immediately register via HTTP REST (instant feedback & mobile fallback)
      joinRoomHttp(cleanRoom, myPlayerId, cityState);

      // Connect via WebSocket for real-time live events
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/multiplayer`;
      let ws: WebSocket;
      try {
        ws = new WebSocket(wsUrl);
      } catch (err) {
        console.warn('WebSocket init failed, relying on HTTP polling:', err);
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        const profile = buildProfilePayload(cityState, myRole, myPlayerId);

        // Join room
        ws.send(
          JSON.stringify({
            type: 'join_room',
            roomId: cleanRoom,
            playerId: myPlayerId,
            playerName: cityState.mayorName,
            cityName: cityState.cityName,
            party: cityState.party,
            profile,
          })
        );

        // Keep-alive ping
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'room_state') {
            if (data.room.yourPlayer) {
              setMyRole(data.room.yourPlayer.role);
            }
            if (data.room.cityProfiles) {
              setOtherMayors((prev) => mergeMayorsWithRealFirst(prev, data.room.cityProfiles));
            }
            if (data.room.regionalTreaties) {
              setTreaties(data.room.regionalTreaties);
            }
            if (data.room.chatMessages) {
              setChatMessages(data.room.chatMessages);
            }
          }

          if (data.type === 'city_profiles_update') {
            if (data.cityProfiles) {
              setOtherMayors((prev) => mergeMayorsWithRealFirst(prev, data.cityProfiles));
            }
          }

          if (data.type === 'player_joined') {
            if (data.chatMessage) {
              setChatMessages((prev) => [...prev, data.chatMessage]);
            }
            if (data.cityProfiles) {
              setOtherMayors((prev) => mergeMayorsWithRealFirst(prev, data.cityProfiles));
            }
            if (data.player && data.player.id !== myPlayerId) {
              sounds.playSuccess();
              const joinNotif: NegotiationNotification = {
                id: 'join_' + Date.now(),
                type: 'aid_received',
                title: '🎉 Prefeita(o) Conectada(o)!',
                senderMayor: data.player.name,
                senderCity: data.player.cityName,
                senderRole: data.player.role,
                message: `${data.player.name} conectou a cidade ${data.player.cityName} na sua Região! Vocês já podem negociar tratados, trocar energia e prestar socorro mútuo!`,
                timestamp: Date.now(),
                read: false,
              };
              setActiveAlertNotification(joinNotif);
              setNotifications((prev) => [joinNotif, ...prev]);
            }
          }

          // Inbound Treaty Proposal Notification
          if (data.type === 'regional_treaty_proposed') {
            setTreaties(data.regionalTreaties || []);

            const isFromOther = data.treaty && data.fromMayorName && !data.fromMayorName.includes(cityState.mayorName);
            if (isFromOther) {
              const notif: NegotiationNotification = {
                id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                type: 'treaty_proposed',
                title: `Nova Proposta: ${data.treaty.title}`,
                senderMayor: data.fromMayorName || 'Prefeito Vizinho',
                senderCity: 'Distrito Parceiro',
                senderRole: data.fromMayorRole || 'mayor_south',
                targetRole: data.targetMayorRole,
                message: data.treaty.details || 'Tratado bilateral submetido para deliberação executiva.',
                treatyId: data.treaty.id,
                amount: data.treaty.amount,
                monthlyCostOrPrice: data.treaty.monthlyCostOrPrice,
                timestamp: Date.now(),
                read: false,
              };

              setActiveAlertNotification(notif);
              setNotifications((prev) => [notif, ...prev]);
              sounds.playStamp();

              if (options?.onTreatyProposed) {
                options.onTreatyProposed(data.treaty);
              }
            }
          }

          // Inbound Treaty Ratification / Veto Notification
          if (data.type === 'regional_treaty_updated') {
            setTreaties(data.regionalTreaties || []);
            if (data.sysMsg) {
              setChatMessages((prev) => [...prev, data.sysMsg]);
            }

            if (data.treaty) {
              const isMyProposal = data.treaty.fromMayorName && data.treaty.fromMayorName.includes(cityState.mayorName);
              if (isMyProposal) {
                const notif: NegotiationNotification = {
                  id: 'notif_resp_' + Date.now(),
                  type: data.accepted ? 'treaty_ratified' : 'treaty_rejected',
                  title: data.accepted ? `Tratado Ratificado!` : `Tratado Vetado`,
                  senderMayor: 'Gabinete Vizinho',
                  senderCity: 'Cúpula Regional',
                  senderRole: data.treaty.targetMayorRole,
                  message: data.accepted
                    ? `O Prefeito parceiro aceitou e sancionou "${data.treaty.title}". O convênio já está em vigor!`
                    : `O Prefeito parceiro decidiu vetar o tratado "${data.treaty.title}".`,
                  treatyId: data.treaty.id,
                  timestamp: Date.now(),
                  read: false,
                };
                setActiveAlertNotification(notif);
                setNotifications((prev) => [notif, ...prev]);

                if (data.accepted) {
                  sounds.playFanfare();
                  if (options?.onTreatyRatified) {
                    options.onTreatyRatified(data.treaty);
                  }
                } else {
                  sounds.playAlert();
                }
              }
            }
          }

          // Direct Municipal Aid Notification
          if (data.type === 'direct_aid_transferred') {
            const event: DirectAidEvent = data.aidEvent;
            if (data.sysMsg) {
              setChatMessages((prev) => [...prev, data.sysMsg]);
            }

            if (event && event.fromMayorName && !event.fromMayorName.includes(cityState.mayorName)) {
              const notif: NegotiationNotification = {
                id: 'notif_aid_' + Date.now(),
                type: 'aid_received',
                title: `Socorro Municipal: R$ ${event.amount.toLocaleString()}`,
                senderMayor: event.fromMayorName,
                senderCity: event.fromCityName,
                senderRole: event.fromRole,
                targetRole: event.targetRole,
                message: `Transferência bancária emergencial creditada diretamente na conta única do Tesouro Municipal!`,
                amount: event.amount,
                timestamp: Date.now(),
                read: false,
              };

              setActiveAlertNotification(notif);
              setNotifications((prev) => [notif, ...prev]);
              sounds.playCash();

              if (options?.onReceiveDirectAid) {
                options.onReceiveDirectAid(event.amount, event.fromMayorName, event.fromCityName);
              }
            }
          }

          if (data.type === 'chat_message') {
            if (data.message) {
              setChatMessages((prev) => [...prev, data.message]);
              sounds.playTick();
            }
          }

          if (data.type === 'intermunicipal_loan_proposed') {
            if (data.sysMsg) {
              setChatMessages((prev) => [...prev, data.sysMsg]);
            }
            const loan: IntermunicipalLoan = data.loan;
            if (loan && data.senderId !== myPlayerId) {
              const notif: NegotiationNotification = {
                id: 'notif_loan_' + Date.now(),
                type: 'loan_proposed',
                title: `Oferta de Empréstimo: R$ ${loan.principal.toLocaleString()}`,
                senderMayor: loan.lenderMayor,
                senderCity: loan.lenderCity,
                senderRole: 'mayor_north',
                targetRole: 'mayor_south',
                message: `O município de ${loan.lenderCity} ofereceu linha de crédito de R$ ${loan.principal.toLocaleString()} com taxa de ${loan.interestRateMonthly}% a.m. em ${loan.totalInstallments} parcelas mensais de R$ ${loan.installmentValue.toLocaleString()}. Motivo: ${loan.purpose}.`,
                loanDetails: loan,
                timestamp: Date.now(),
                read: false,
              };

              setActiveAlertNotification(notif);
              setNotifications((prev) => [notif, ...prev]);
              sounds.playStamp();

              if (options?.onLoanProposed) {
                options.onLoanProposed(loan);
              }
            }
          }

          if (data.type === 'intermunicipal_loan_updated') {
            if (data.sysMsg) {
              setChatMessages((prev) => [...prev, data.sysMsg]);
            }
            const loan: IntermunicipalLoan = data.loan;
            if (data.accepted) {
              sounds.playCash();
              if (options?.onLoanAccepted) {
                options.onLoanAccepted(loan);
              }
              if (options?.onLoanResponded) {
                options.onLoanResponded(loan.id, true);
              }
            } else {
              sounds.playAlert();
              if (options?.onLoanRejected) {
                options.onLoanRejected(loan.id);
              }
              if (options?.onLoanResponded) {
                options.onLoanResponded(loan.id, false);
              }
            }
          }
        } catch (err) {
          console.error('Multiplayer msg error:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    },
    [cityState, myPlayerId, options]
  );

  const syncCityProfileToWs = (ws: WebSocket, pid: string, state: PrefeitoCityState) => {
    if (ws.readyState === WebSocket.OPEN) {
      const profile: RegionalMayorProfile = {
        id: pid,
        name: state.mayorName,
        cityName: state.cityName,
        role: myRole,
        color: myRole === 'mayor_north' ? '#3b82f6' : '#10b981',
        population: state.population,
        treasury: state.treasury,
        jobs: state.jobs,
        unemploymentRate: state.unemploymentRate,
        touristsPerMonth: state.touristsPerMonth,
        oilProductionBpd: state.oilProductionBpd,
        goldProductionKg: state.goldProductionKg,
        energyProductionMw: state.energyProductionMw,
        energySurplusMw: state.energySurplusMw,
        fiscalRating: state.fiscalRating,
        approvalRating: state.approvalRating,
        lastUpdated: Date.now(),
      };

      ws.send(
        JSON.stringify({
          type: 'sync_city_profile',
          roomId,
          playerId: pid,
          profile,
        })
      );
    }
  };

  // Sync city profile via HTTP REST
  const syncCityProfileHttp = useCallback(
    async (room: string, pid: string, state: PrefeitoCityState) => {
      try {
        const profile = buildProfilePayload(state, myRole, pid);
        await fetch('/api/multiplayer/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: room,
            playerId: pid,
            profile,
          }),
        });
      } catch (e) {}
    },
    [buildProfilePayload, myRole]
  );

  // Keep city profile synced on city changes (both WebSocket and HTTP)
  useEffect(() => {
    if (myPlayerId) {
      if (wsRef.current && isConnected) {
        syncCityProfileToWs(wsRef.current, myPlayerId, cityState);
      }
      syncCityProfileHttp(activeRoomRef.current, myPlayerId, cityState);
    }
  }, [
    cityState.mayorName,
    cityState.cityName,
    cityState.party,
    cityState.population,
    cityState.treasury,
    cityState.jobs,
    cityState.unemploymentRate,
    cityState.oilProductionBpd,
    cityState.goldProductionKg,
    cityState.energySurplusMw,
    cityState.touristsPerMonth,
    cityState.approvalRating,
    cityState.fiscalRating,
    isConnected,
    myPlayerId,
    syncCityProfileHttp,
  ]);

  // Keep local player profile updated in worldSync service
  useEffect(() => {
    const profile = buildProfilePayload(cityState, myRole, myPlayerId);
    worldSync.setLocalPlayer(myPlayerId, profile);
  }, [cityState, myRole, myPlayerId, buildProfilePayload]);

  // Auto-connect to Brasil room on mount and maintain background heartbeat
  useEffect(() => {
    connectToRoom('BRASIL');

    // Fast heartbeat & sync: sends city state and gets other players every 2 seconds
    const pollInterval = setInterval(() => {
      sendHeartbeatHttp('BRASIL', myPlayerId);

      // Broadcast to Global Live World via cloud sync
      try {
        const currentProfile = buildProfilePayload(cityStateRef.current, myRole, myPlayerId);
        worldSync.broadcast({
          type: 'heartbeat',
          senderId: myPlayerId,
          senderName: cityStateRef.current.mayorName,
          senderCity: cityStateRef.current.cityName,
          profile: currentProfile,
        });
      } catch (e) {}
    }, 2000);

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPlayerId]);

  // Subscribe to Global Live World cloud sync (MQTT broker across all networks & devices)
  useEffect(() => {
    const unsubscribe = worldSync.subscribe((payload) => {
      // Ignore messages from self or phantom/ghost accounts
      if (payload.senderId === myPlayerId) return;
      if (payload.senderCity === 'Porto da Aliança' || payload.profile?.cityName === 'Porto da Aliança') return;
      if (
        cityStateRef.current.mayorName &&
        payload.profile?.name &&
        payload.profile.name.toLowerCase().trim() === cityStateRef.current.mayorName.toLowerCase().trim()
      ) {
        return;
      }

      if (payload.type === 'heartbeat' && payload.profile) {
        setIsConnected(true);
        const partnerProfile = payload.profile;
        setOtherMayors((prev) => {
          const updated = { ...prev, [partnerProfile.id]: partnerProfile };
          try {
            const realOnes: Record<string, RegionalMayorProfile> = {};
            (Object.values(updated) as RegionalMayorProfile[]).forEach((m) => {
              if (m.isRealPlayer && m.cityName !== 'Porto da Aliança') realOnes[m.id] = m;
            });
            localStorage.setItem('prefeito_persisted_profiles_v2', JSON.stringify(realOnes));
          } catch (e) {}

          if (prevPartnerIdRef.current !== partnerProfile.id) {
            prevPartnerIdRef.current = partnerProfile.id;
            try {
              sounds.playCelebration();
            } catch (e) {}
            const joinNotif: NegotiationNotification = {
              id: 'join_' + Date.now(),
              type: 'aid_received',
              title: '🎉 Prefeita(o) Conectada(o) Ao Vivo!',
              senderMayor: partnerProfile.name,
              senderCity: partnerProfile.cityName,
              senderRole: partnerProfile.role || 'mayor_south',
              message: `${partnerProfile.name} conectou a cidade ${partnerProfile.cityName} ao vivo no Mundo Regional! Vocês já estão no mesmo mundo e podem cooperar e negociar!`,
              timestamp: Date.now(),
              read: false,
            };
            setActiveAlertNotification(joinNotif);
            setNotifications((n) => [joinNotif, ...n]);
          }
          return updated;
        });
      }

      if (payload.type === 'ping_greeting') {
        try {
          sounds.playCash();
        } catch (e) {}
        const greetNotif: NegotiationNotification = {
          id: 'greet_' + Date.now(),
          type: 'aid_received',
          title: `👋 Saudação de ${payload.senderName || 'Prefeita(o)'}!`,
          senderMayor: payload.senderName || 'Prefeita(o) Parceira(o)',
          senderCity: payload.senderCity || 'Cidade Parceira',
          senderRole: 'mayor_south',
          message: `${payload.senderName} (${payload.senderCity}) enviou uma saudação oficial diplomática ao vivo! Conexão ativa em tempo real!`,
          timestamp: Date.now(),
          read: false,
        };
        setActiveAlertNotification(greetNotif);
        setNotifications((n) => [greetNotif, ...n]);
      }

      if (payload.type === 'chat' && payload.message) {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === payload.message!.id)) return prev;
          return [...prev, payload.message!];
        });
        try {
          sounds.playTick();
        } catch (e) {}
      }

      if (payload.type === 'treaty_proposed' && payload.treaty) {
        const treaty = payload.treaty;
        setTreaties((prev) => [treaty, ...prev.filter((t) => t.id !== treaty.id)]);
        const notif: NegotiationNotification = {
          id: 'notif_tr_' + Date.now(),
          type: 'treaty_proposed',
          title: `Nova Proposta: ${treaty.title}`,
          senderMayor: payload.senderName || 'Prefeito Parceiro',
          senderCity: payload.senderCity || 'Município Parceiro',
          senderRole: 'mayor_south',
          message: treaty.details,
          treatyId: treaty.id,
          amount: treaty.amount,
          monthlyCostOrPrice: treaty.monthlyCostOrPrice,
          timestamp: Date.now(),
          read: false,
        };
        setActiveAlertNotification(notif);
        setNotifications((n) => [notif, ...n]);
        try {
          sounds.playStamp();
        } catch (e) {}
        options?.onTreatyProposed?.(treaty);
      }

      if ((payload.type === 'treaty_ratified' || payload.type === 'treaty_rejected') && payload.treaty) {
        const isAccepted = payload.type === 'treaty_ratified';
        setTreaties((prev) =>
          prev.map((t) =>
            t.id === payload.treaty!.id
              ? { ...t, status: isAccepted ? 'active' : 'rejected' }
              : t
          )
        );
        const notif: NegotiationNotification = {
          id: 'notif_tr_resp_' + Date.now(),
          type: isAccepted ? 'treaty_ratified' : 'treaty_rejected',
          title: isAccepted ? `Tratado Ratificado!` : `Tratado Vetado`,
          senderMayor: payload.senderName || 'Prefeito Parceiro',
          senderCity: payload.senderCity || 'Cúpula Regional',
          senderRole: 'mayor_south',
          message: isAccepted
            ? `O gabinete parceiro aprovou e sancionou "${payload.treaty.title}". O convênio já está em vigor!`
            : `O gabinete parceiro vetou "${payload.treaty.title}".`,
          treatyId: payload.treaty.id,
          timestamp: Date.now(),
          read: false,
        };
        setActiveAlertNotification(notif);
        setNotifications((n) => [notif, ...n]);
        if (isAccepted) {
          try {
            sounds.playFanfare();
          } catch (e) {}
          options?.onTreatyRatified?.(payload.treaty);
        } else {
          try {
            sounds.playAlert();
          } catch (e) {}
        }
      }

      if (payload.type === 'direct_aid' && payload.aidEvent) {
        const event = payload.aidEvent;
        const notif: NegotiationNotification = {
          id: 'notif_aid_' + Date.now(),
          type: 'aid_received',
          title: `Socorro Municipal: R$ ${event.amount.toLocaleString()}`,
          senderMayor: event.fromMayorName,
          senderCity: event.fromCityName,
          senderRole: event.fromRole,
          message: `Transferência emergencial de R$ ${event.amount.toLocaleString()} recebida com sucesso da Prefeitura de ${event.fromCityName}!`,
          amount: event.amount,
          timestamp: Date.now(),
          read: false,
        };
        setActiveAlertNotification(notif);
        setNotifications((n) => [notif, ...n]);
        try {
          sounds.playCash();
        } catch (e) {}
        options?.onReceiveDirectAid?.(event.amount, event.fromMayorName, event.fromCityName);
      }

      if (payload.type === 'loan_proposed' && payload.loan) {
        const loan = payload.loan;
        const notif: NegotiationNotification = {
          id: 'notif_loan_' + Date.now(),
          type: 'loan_proposed',
          title: `Oferta de Empréstimo: R$ ${loan.principal.toLocaleString()}`,
          senderMayor: loan.lenderMayor,
          senderCity: loan.lenderCity,
          senderRole: 'mayor_north',
          message: `${loan.lenderCity} ofereceu R$ ${loan.principal.toLocaleString()} a ${loan.interestRateMonthly}% a.m. em ${loan.totalInstallments} parcelas. Motivo: ${loan.purpose}.`,
          loanDetails: loan,
          timestamp: Date.now(),
          read: false,
        };
        setActiveAlertNotification(notif);
        setNotifications((n) => [notif, ...n]);
        try {
          sounds.playStamp();
        } catch (e) {}
        options?.onLoanProposed?.(loan);
      }

      if (payload.type === 'loan_responded' && payload.loan) {
        if (payload.loanAccepted) {
          try {
            sounds.playCash();
          } catch (e) {}
          options?.onLoanAccepted?.(payload.loan);
        } else {
          try {
            sounds.playAlert();
          } catch (e) {}
          options?.onLoanRejected?.(payload.loan.id);
        }
      }
    });

    return unsubscribe;
  }, [myPlayerId, options]);

  // Ratification countdown timer for pending treaties (60 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setTreaties((prev) => {
        let changed = false;
        const updated = prev.map((t) => {
          if (t.status === 'pending_ratification') {
            const nextSec = t.ratificationSecondsRemaining - 1;
            if (nextSec <= 0) {
              changed = true;
              return {
                ...t,
                ratificationSecondsRemaining: 0,
                status: 'active' as const,
              };
            }
            return {
              ...t,
              ratificationSecondsRemaining: nextSec,
            };
          }
          return t;
        });

        if (changed) {
          sounds.playFanfare();
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Propose a regional treaty (dispatches to WS and HTTP)
  const proposeTreaty = useCallback(
    (treatyDraft: {
      type: RegionalTreaty['type'];
      title: string;
      details: string;
      amount: number;
      monthlyCostOrPrice: number;
      targetMayorRole?: string;
      targetMayorName?: string;
      targetCityName?: string;
    }) => {
      sounds.playStamp();
      const now = Date.now();
      const targetRole = treatyDraft.targetMayorRole || (myRole === 'mayor_north' ? 'mayor_south' : 'mayor_north');

      const newTreaty: RegionalTreaty = {
        id: 'treaty_' + now + '_' + Math.random().toString(36).substr(2, 4),
        fromMayorRole: myRole,
        fromMayorName: `${cityState.mayorName} (${cityState.cityName})`,
        targetMayorRole: targetRole,
        targetMayorName: treatyDraft.targetMayorName || 'Prefeito Vizinho',
        targetCityName: treatyDraft.targetCityName || 'Município Vizinho',
        type: treatyDraft.type,
        title: treatyDraft.title,
        details: treatyDraft.details,
        amount: treatyDraft.amount,
        monthlyCostOrPrice: treatyDraft.monthlyCostOrPrice,
        status: 'pending_ratification',
        startTime: now,
        ratificationSecondsRemaining: 60,
        timestamp: now,
      };

      setTreaties((prev) => [newTreaty, ...prev]);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'propose_regional_treaty',
            roomId,
            playerId: myPlayerId,
            treaty: newTreaty,
          })
        );
      }

      // Broadcast to Global Live World via cloud MQTT
      worldSync.broadcast({
        type: 'treaty_proposed',
        senderId: myPlayerId,
        senderName: cityState.mayorName,
        senderCity: cityState.cityName,
        treaty: newTreaty,
      });

      // Also send via HTTP REST
      fetch('/api/multiplayer/treaty/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          treaty: newTreaty,
        }),
      }).catch(() => {});
    },
    [myRole, cityState, roomId, myPlayerId]
  );

  // Respond to a treaty (dispatches to WS and HTTP)
  const respondToTreaty = useCallback(
    (treatyId: string, accept: boolean) => {
      if (accept) {
        sounds.playStamp();
      } else {
        sounds.playAlert();
      }

      setTreaties((prev) =>
        prev.map((t) => (t.id === treatyId ? { ...t, status: accept ? 'active' : 'rejected' } : t))
      );

      const matchedTreaty = treaties.find((t) => t.id === treatyId);
      worldSync.broadcast({
        type: accept ? 'treaty_ratified' : 'treaty_rejected',
        senderId: myPlayerId,
        senderName: cityState.mayorName,
        senderCity: cityState.cityName,
        treaty: matchedTreaty ? { ...matchedTreaty, status: accept ? 'active' : 'rejected' } : ({ id: treatyId, title: 'Tratado Regional' } as any),
      });

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'respond_regional_treaty',
            roomId,
            treatyId,
            accept,
          })
        );
      }

      // Also send via HTTP REST
      fetch('/api/multiplayer/treaty/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          treatyId,
          accept,
        }),
      }).catch(() => {});
    },
    [roomId, treaties, myPlayerId, cityState]
  );

  // Send chat message (dispatches to WS and HTTP)
  const sendChatMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const senderName = `${cityState.mayorName} (${cityState.cityName})`;
      const localMsg: RegionalChatMessage = {
        id: 'msg_local_' + Date.now(),
        sender: senderName,
        role: myRole,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, localMsg]);

      worldSync.broadcast({
        type: 'chat',
        senderId: myPlayerId,
        senderName,
        message: localMsg,
      });

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'chat_message',
            roomId,
            sender: senderName,
            role: myRole,
            text: text.trim(),
          })
        );
      }

      // Also send via HTTP REST
      fetch('/api/multiplayer/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          sender: senderName,
          role: myRole,
          text: text.trim(),
        }),
      }).catch(() => {});
    },
    [roomId, cityState, myRole, myPlayerId]
  );

  // Direct Aid (dispatches to WS and HTTP)
  const sendDirectAid = useCallback(
    (amount: number, category: 'financeira' | 'energia' | 'agua' = 'financeira', note?: string) => {
      if (amount <= 0) return;
      sounds.playCash();

      const targetRole = myRole === 'mayor_north' ? 'mayor_south' : 'mayor_north';
      const aidEvent = {
        id: 'aid_' + Date.now(),
        timestamp: Date.now(),
        fromMayorName: cityState.mayorName,
        fromCityName: cityState.cityName,
        fromRole: myRole,
        targetRole,
        amount,
        category,
        note: note || 'Cooperação intermunicipal emergencial',
      };

      worldSync.broadcast({
        type: 'direct_aid',
        senderId: myPlayerId,
        senderName: cityState.mayorName,
        senderCity: cityState.cityName,
        aidEvent,
      });

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'direct_aid_transfer',
            roomId,
            ...aidEvent,
          })
        );
      }

      // Also send via HTTP REST
      fetch('/api/multiplayer/aid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          aidEvent,
        }),
      }).catch(() => {});
    },
    [myRole, cityState, roomId, myPlayerId]
  );

  // Propose Loan (dispatches to WS and HTTP)
  const proposeLoan = useCallback(
    (loanData: {
      borrowerMayor: string;
      borrowerCity: string;
      principal: number;
      interestRateMonthly: number;
      totalInstallments: number;
      purpose: string;
    }) => {
      if (loanData.principal <= 0) return;
      sounds.playStamp();

      const totalInterest = loanData.principal * (loanData.interestRateMonthly / 100) * loanData.totalInstallments;
      const totalRepayment = Math.round(loanData.principal + totalInterest);
      const installmentValue = Math.round(totalRepayment / loanData.totalInstallments);

      const loan: IntermunicipalLoan = {
        id: 'loan_' + Date.now(),
        lenderRole: 'mayor_north',
        lenderMayor: cityState.mayorName,
        lenderCity: cityState.cityName,
        borrowerRole: 'mayor_south',
        borrowerMayor: loanData.borrowerMayor,
        borrowerCity: loanData.borrowerCity,
        principal: loanData.principal,
        interestRateMonthly: loanData.interestRateMonthly,
        totalInstallments: loanData.totalInstallments,
        remainingInstallments: loanData.totalInstallments,
        installmentValue,
        totalRepayment,
        purpose: loanData.purpose,
        timestamp: Date.now(),
        status: 'pending',
      };

      worldSync.broadcast({
        type: 'loan_proposed',
        senderId: myPlayerId,
        senderName: cityState.mayorName,
        senderCity: cityState.cityName,
        loan,
      });

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'propose_intermunicipal_loan',
            roomId,
            loan,
          })
        );
      }

      // Also send via HTTP REST
      fetch('/api/multiplayer/loan/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          loan,
          senderId: myPlayerId,
        }),
      }).catch(() => {});
    },
    [cityState, roomId, myPlayerId]
  );

  // Respond to Loan (dispatches to WS and HTTP)
  const respondToLoan = useCallback(
    (loan: IntermunicipalLoan | string, accept: boolean) => {
      if (accept) {
        sounds.playStamp();
      } else {
        sounds.playAlert();
      }

      const loanObj = typeof loan === 'string' ? { id: loan } : loan;

      worldSync.broadcast({
        type: 'loan_responded',
        senderId: myPlayerId,
        senderName: cityState.mayorName,
        senderCity: cityState.cityName,
        loan: loanObj as any,
        loanAccepted: accept,
      });

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'respond_intermunicipal_loan',
            roomId,
            loan: loanObj,
            accept,
          })
        );
      }

      // Also send via HTTP REST
      fetch('/api/multiplayer/loan/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          loan: loanObj,
          accept,
        }),
      }).catch(() => {});
    },
    [roomId]
  );

  const dismissAlertNotification = useCallback(() => {
    setActiveAlertNotification(null);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setActiveAlertNotification(null);
  }, []);

  // Helper to share invite link with partner/girlfriend
  const shareRoomLink = useCallback(() => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const url = `${origin}${pathname}?sala=${encodeURIComponent(roomId)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    return url;
  }, [roomId]);

  // Identify connected real players (e.g. girlfriend, friend)
  const realPlayers: RegionalMayorProfile[] = (Object.values(otherMayors) as RegionalMayorProfile[]).filter(
    (m: RegionalMayorProfile) =>
      m.id !== myPlayerId &&
      m.isRealPlayer &&
      m.cityName !== 'Porto da Aliança' &&
      (!m.name || !cityState.mayorName || m.name.toLowerCase().trim() !== cityState.mayorName.toLowerCase().trim()) &&
      (!m.cityName || !cityState.cityName || m.cityName.toLowerCase().trim() !== cityState.cityName.toLowerCase().trim())
  );
  const partnerMayor: RegionalMayorProfile | null = realPlayers.length > 0 ? realPlayers[0] : null;
  const isPartnerOnline = partnerMayor
    ? partnerMayor.isOnline !== false && (!partnerMayor.lastUpdated || Date.now() - partnerMayor.lastUpdated < 180000)
    : false;

  const sendPingGreeting = useCallback((targetMayorId?: string) => {
    sounds.playCash();
    worldSync.broadcast({
      type: 'ping_greeting',
      senderId: myPlayerId,
      senderName: cityState.mayorName,
      senderCity: cityState.cityName,
    });
  }, [myPlayerId, cityState.mayorName, cityState.cityName]);

  const forceRefresh = useCallback(() => {
    worldSync.syncNow();
    sendHeartbeatHttp(roomId, myPlayerId);
  }, [roomId, myPlayerId, sendHeartbeatHttp]);

  return {
    roomId,
    isConnected,
    myRole,
    myPlayerId,
    otherMayors,
    partnerMayor,
    isPartnerOnline,
    realPlayers,
    treaties,
    chatMessages,
    activeTab,
    setActiveTab,
    notifications,
    activeAlertNotification,
    activeNegotiation: activeAlertNotification,
    dismissAlertNotification,
    clearNegotiationNotification: dismissAlertNotification,
    clearNotifications,
    connectToRoom,
    proposeTreaty,
    respondToTreaty,
    sendChatMessage,
    sendDirectAid,
    proposeLoan,
    respondToLoan,
    shareRoomLink,
    sendPingGreeting,
    forceRefresh,
  };
}
