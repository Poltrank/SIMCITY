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

interface UseTextMultiplayerOptions {
  onReceiveDirectAid?: (amount: number, fromMayor: string, fromCity: string) => void;
  onTreatyProposed?: (treaty: RegionalTreaty) => void;
  onTreatyRatified?: (treaty: RegionalTreaty) => void;
  onLoanProposed?: (loan: IntermunicipalLoan) => void;
  onLoanResponded?: (loanId: string, accepted: boolean) => void;
  onLoanAccepted?: (loan: IntermunicipalLoan) => void;
  onLoanRejected?: (loanId: string) => void;
}

export function useTextMultiplayer(
  cityState: PrefeitoCityState,
  options?: UseTextMultiplayerOptions
) {
  const [roomId, setRoomId] = useState<string>('BRASIL1');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [myRole, setMyRole] = useState<'mayor_north' | 'mayor_south' | 'spectator'>('mayor_north');
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [otherMayors, setOtherMayors] = useState<Record<string, RegionalMayorProfile>>({});
  const [treaties, setTreaties] = useState<RegionalTreaty[]>([]);
  const [chatMessages, setChatMessages] = useState<RegionalChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'lobby' | 'treaties' | 'chat'>('lobby');

  // Notifications for incoming negotiations and treaties
  const [notifications, setNotifications] = useState<NegotiationNotification[]>([]);
  const [activeAlertNotification, setActiveAlertNotification] = useState<NegotiationNotification | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number | null>(null);

  // Initialize or load player ID
  useEffect(() => {
    let pid = localStorage.getItem('prefeito_player_id');
    if (!pid) {
      pid = 'may_' + Math.random().toString(36).substr(2, 8);
      localStorage.setItem('prefeito_player_id', pid);
    }
    setMyPlayerId(pid);
  }, []);

  const connectToRoom = useCallback(
    (targetRoomId: string) => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const cleanRoom = targetRoomId.toUpperCase().trim() || 'BRASIL1';
      setRoomId(cleanRoom);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/multiplayer`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        const pid = myPlayerId || 'may_' + Math.random().toString(36).substr(2, 6);

        // Join room
        ws.send(
          JSON.stringify({
            type: 'join_room',
            roomId: cleanRoom,
            playerId: pid,
            playerName: cityState.mayorName,
          })
        );

        // Sync initial city profile
        syncCityProfileToWs(ws, pid, cityState);

        // Keep-alive ping
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
              setOtherMayors(data.room.cityProfiles);
            }
            if (data.room.regionalTreaties) {
              setTreaties(data.room.regionalTreaties);
            }
            if (data.room.chatMessages) {
              setChatMessages(data.room.chatMessages);
            }
          }

          if (data.type === 'city_profiles_update') {
            setOtherMayors(data.cityProfiles || {});
          }

          if (data.type === 'player_joined') {
            if (data.chatMessage) {
              setChatMessages((prev) => [...prev, data.chatMessage]);
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

  // Keep city profile synced on city changes
  useEffect(() => {
    if (wsRef.current && isConnected && myPlayerId) {
      syncCityProfileToWs(wsRef.current, myPlayerId, cityState);
    }
  }, [
    cityState.population,
    cityState.treasury,
    cityState.oilProductionBpd,
    cityState.goldProductionKg,
    cityState.energySurplusMw,
    cityState.touristsPerMonth,
    cityState.approvalRating,
    isConnected,
    myPlayerId,
  ]);

  // Propose a regional treaty (Takes 60s for cartório ratification!)
  const proposeTreaty = useCallback(
    (treatyDraft: {
      type: RegionalTreaty['type'];
      title: string;
      details: string;
      amount: number;
      monthlyCostOrPrice: number;
    }) => {
      if (!wsRef.current || !isConnected) return;
      sounds.playStamp();

      const targetRole = myRole === 'mayor_north' ? 'mayor_south' : 'mayor_north';

      wsRef.current.send(
        JSON.stringify({
          type: 'propose_regional_treaty',
          roomId,
          playerId: myPlayerId,
          treaty: {
            fromMayorRole: myRole,
            fromMayorName: `${cityState.mayorName} (${cityState.cityName})`,
            targetMayorRole: targetRole,
            type: treatyDraft.type,
            title: treatyDraft.title,
            details: treatyDraft.details,
            amount: treatyDraft.amount,
            monthlyCostOrPrice: treatyDraft.monthlyCostOrPrice,
          },
        })
      );
    },
    [isConnected, myRole, cityState, roomId, myPlayerId]
  );

  const respondToTreaty = useCallback(
    (treatyId: string, accept: boolean) => {
      if (!wsRef.current || !isConnected) return;
      if (accept) {
        sounds.playStamp();
      } else {
        sounds.playAlert();
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'respond_regional_treaty',
          roomId,
          treatyId,
          accept,
        })
      );
    },
    [isConnected, roomId]
  );

  const sendChatMessage = useCallback(
    (text: string) => {
      if (!wsRef.current || !isConnected || !text.trim()) return;

      wsRef.current.send(
        JSON.stringify({
          type: 'chat_message',
          roomId,
          sender: `${cityState.mayorName} (${cityState.cityName})`,
          role: myRole,
          text: text.trim(),
        })
      );
    },
    [isConnected, roomId, cityState, myRole]
  );

  const sendDirectAid = useCallback(
    (amount: number, category: 'financeira' | 'energia' | 'agua' = 'financeira', note?: string) => {
      if (!wsRef.current || !isConnected || amount <= 0) return;
      sounds.playCash();

      const targetRole = myRole === 'mayor_north' ? 'mayor_south' : 'mayor_north';

      wsRef.current.send(
        JSON.stringify({
          type: 'direct_aid_transfer',
          roomId,
          fromMayorName: cityState.mayorName,
          fromCityName: cityState.cityName,
          fromRole: myRole,
          targetRole,
          amount,
          category,
          note: note || 'Cooperação intermunicipal emergencial',
        })
      );
    },
    [isConnected, myRole, cityState, roomId]
  );

  const proposeLoan = useCallback(
    (loanData: {
      borrowerMayor: string;
      borrowerCity: string;
      principal: number;
      interestRateMonthly: number;
      totalInstallments: number;
      purpose: string;
    }) => {
      if (!wsRef.current || !isConnected || loanData.principal <= 0) return;
      sounds.playStamp();

      const totalInterest = (loanData.principal * (loanData.interestRateMonthly / 100)) * loanData.totalInstallments;
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

      wsRef.current.send(
        JSON.stringify({
          type: 'propose_intermunicipal_loan',
          roomId,
          loan,
        })
      );
    },
    [isConnected, cityState, roomId]
  );

  const respondToLoan = useCallback(
    (loan: IntermunicipalLoan | string, accept: boolean) => {
      if (!wsRef.current || !isConnected) return;
      if (accept) {
        sounds.playStamp();
      } else {
        sounds.playAlert();
      }

      const loanObj = typeof loan === 'string' ? { id: loan } : loan;

      wsRef.current.send(
        JSON.stringify({
          type: 'respond_intermunicipal_loan',
          roomId,
          loan: loanObj,
          accept,
        })
      );
    },
    [isConnected, roomId]
  );

  const dismissAlertNotification = useCallback(() => {
    setActiveAlertNotification(null);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setActiveAlertNotification(null);
  }, []);

  return {
    roomId,
    isConnected,
    myRole,
    myPlayerId,
    otherMayors,
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
  };
}
