import { useState, useEffect, useRef, useCallback } from 'react';
import { Tile } from '../types';

export interface MayorPlayer {
  id: string;
  name: string;
  role: 'mayor_north' | 'mayor_south' | 'spectator';
  color: string;
  cursor?: { x: number; y: number };
  treasury: number;
  population: number;
}

export interface TradeOffer {
  id: string;
  fromMayor: 'mayor_north' | 'mayor_south';
  type: 'money_aid' | 'power_deal' | 'water_deal' | 'emergency_fire';
  amount: number;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  role: string;
}

export interface ActiveDeals {
  powerToSouth: number;
  powerPrice: number;
  waterToSouth: number;
  waterPrice: number;
}

export function useMultiplayer(
  onRemoteTileAction?: (tile: Tile, actorRole: string, actorName: string) => void,
  onRemoteBatchTiles?: (tiles: Tile[], actorRole: string) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<Record<string, MayorPlayer>>({});
  const [myPlayer, setMyPlayer] = useState<MayorPlayer | null>(null);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeDeals, setActiveDeals] = useState<ActiveDeals>({
    powerToSouth: 0,
    powerPrice: 0,
    waterToSouth: 0,
    waterPrice: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const playerIdRef = useRef<string>('player_' + Math.random().toString(36).substring(2, 9));

  // Connect to room via WebSocket
  const joinRoom = useCallback((targetRoomId: string, playerName: string, preferredRole?: string) => {
    const cleanRoom = targetRoomId.toUpperCase().trim() || 'REGIAO1';
    setRoomId(cleanRoom);

    // If existing socket is open, close it
    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/api/multiplayer`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: 'join_room',
          roomId: cleanRoom,
          playerId: playerIdRef.current,
          playerName,
          preferredRole,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'room_state') {
          setPlayers(data.room.players || {});
          setTradeOffers(data.room.tradeOffers || []);
          setChatMessages(data.room.chatMessages || []);
          setActiveDeals(data.room.activeDeals || { powerToSouth: 0, powerPrice: 0, waterToSouth: 0, waterPrice: 0 });
          if (data.room.yourPlayer) {
            setMyPlayer(data.room.yourPlayer);
          }
        }

        if (data.type === 'player_joined') {
          setPlayers((prev) => ({ ...prev, [data.player.id]: data.player }));
          if (data.chatMessage) {
            setChatMessages((prev) => [...prev, data.chatMessage]);
          }
        }

        if (data.type === 'player_left') {
          setPlayers((prev) => {
            const copy = { ...prev };
            delete copy[data.playerId];
            return copy;
          });
          setChatMessages((prev) => [
            ...prev,
            {
              id: 'sys_' + Date.now(),
              sender: 'Sistema',
              text: `${data.playerName} desconectou.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              role: 'system',
            },
          ]);
        }

        if (data.type === 'tile_action' && data.tile) {
          onRemoteTileAction?.(data.tile, data.actorRole, data.actorName);
        }

        if (data.type === 'batch_tiles_action' && Array.isArray(data.tiles)) {
          onRemoteBatchTiles?.(data.tiles, data.actorRole);
        }

        if (data.type === 'cursor_move' && data.playerId) {
          setPlayers((prev) => {
            if (!prev[data.playerId]) return prev;
            return {
              ...prev,
              [data.playerId]: {
                ...prev[data.playerId],
                cursor: data.cursor,
              },
            };
          });
        }

        if (data.type === 'new_trade_offer') {
          setTradeOffers((prev) => [data.offer, ...prev]);
        }

        if (data.type === 'trade_offer_updated') {
          setTradeOffers((prev) =>
            prev.map((o) => (o.id === data.offer.id ? data.offer : o))
          );
          if (data.activeDeals) {
            setActiveDeals(data.activeDeals);
          }
        }

        if (data.type === 'chat_message') {
          setChatMessages((prev) => [...prev, data.message]);
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsConnected(false);
    };
  }, [onRemoteTileAction, onRemoteBatchTiles]);

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setRoomId(null);
    setMyPlayer(null);
    setPlayers({});
    setIsConnected(false);
  }, []);

  // Broadcast tile placement/removal to other mayor
  const broadcastTileAction = useCallback(
    (tile: Tile) => {
      if (wsRef.current && isConnected && roomId) {
        wsRef.current.send(
          JSON.stringify({
            type: 'tile_action',
            roomId,
            playerId: playerIdRef.current,
            actorRole: myPlayer?.role || 'mayor',
            actorName: myPlayer?.name || 'Prefeito',
            tile,
          })
        );
      }
    },
    [isConnected, roomId, myPlayer]
  );

  // Broadcast batch tiles (e.g. roads, zones drag)
  const broadcastBatchTiles = useCallback(
    (tiles: Tile[]) => {
      if (wsRef.current && isConnected && roomId) {
        wsRef.current.send(
          JSON.stringify({
            type: 'batch_tiles_action',
            roomId,
            playerId: playerIdRef.current,
            actorRole: myPlayer?.role || 'mayor',
            tiles,
          })
        );
      }
    },
    [isConnected, roomId, myPlayer]
  );

  // Broadcast cursor / camera focus point
  const broadcastCursor = useCallback(
    (x: number, y: number) => {
      if (wsRef.current && isConnected && roomId) {
        wsRef.current.send(
          JSON.stringify({
            type: 'cursor_move',
            roomId,
            playerId: playerIdRef.current,
            cursor: { x, y },
          })
        );
      }
    },
    [isConnected, roomId]
  );

  // Propose a Trade / Aid Deal to partner mayor
  const sendTradeOffer = useCallback(
    (offerType: 'money_aid' | 'power_deal' | 'water_deal' | 'emergency_fire', amount: number, price: number) => {
      if (wsRef.current && isConnected && roomId && myPlayer) {
        wsRef.current.send(
          JSON.stringify({
            type: 'create_trade_offer',
            roomId,
            playerId: playerIdRef.current,
            fromMayor: myPlayer.role,
            offerType,
            amount,
            price,
          })
        );
      }
    },
    [isConnected, roomId, myPlayer]
  );

  // Accept or reject offer
  const respondTradeOffer = useCallback(
    (offerId: string, accept: boolean) => {
      if (wsRef.current && isConnected && roomId) {
        wsRef.current.send(
          JSON.stringify({
            type: 'respond_trade_offer',
            roomId,
            offerId,
            accept,
          })
        );
      }
    },
    [isConnected, roomId]
  );

  // Send Chat message
  const sendChatMessage = useCallback(
    (text: string) => {
      if (wsRef.current && isConnected && roomId && myPlayer && text.trim()) {
        wsRef.current.send(
          JSON.stringify({
            type: 'chat_message',
            roomId,
            playerId: playerIdRef.current,
            sender: myPlayer.name,
            role: myPlayer.role,
            text: text.trim(),
          })
        );
      }
    },
    [isConnected, roomId, myPlayer]
  );

  // Auto-connect if URL has ?room=XYZ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom && !roomId) {
        joinRoom(urlRoom, 'Prefeito Convidado');
      }
    }
  }, [joinRoom, roomId]);

  return {
    isConnected,
    roomId,
    myPlayer,
    players,
    tradeOffers,
    chatMessages,
    activeDeals,
    joinRoom,
    leaveRoom,
    broadcastTileAction,
    broadcastBatchTiles,
    broadcastCursor,
    sendTradeOffer,
    respondTradeOffer,
    sendChatMessage,
  };
}
