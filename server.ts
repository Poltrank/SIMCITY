import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- MULTIPLAYER ROOMS & TWO MAYORS STATE ---
interface MayorPlayer {
  id: string;
  name: string;
  role: 'mayor_north' | 'mayor_south' | 'spectator';
  color: string;
  cursor?: { x: number; y: number };
  treasury: number;
  population: number;
}

interface RoomTradeOffer {
  id: string;
  fromMayor: 'mayor_north' | 'mayor_south';
  type: 'money_aid' | 'power_deal' | 'water_deal' | 'emergency_fire';
  amount: number; // money amount or MW power or liters
  price: number;  // recurring cost or one-time cost
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

interface RoomState {
  id: string;
  name: string;
  createdAt: number;
  players: Record<string, MayorPlayer>;
  cityProfiles: Record<string, any>;
  regionalTreaties: any[];
  mapTilesUpdate: Record<string, any>; // key: `${x}_${y}`
  tradeOffers: RoomTradeOffer[];
  chatMessages: { id: string; sender: string; text: string; time: string; role: string }[];
  activeDeals: {
    powerToSouth: number; // MW being exported north -> south
    powerPrice: number;
    waterToSouth: number;
    waterPrice: number;
  };
}

const rooms: Record<string, RoomState> = {};

function getOrCreateRoom(roomId: string): RoomState {
  const cleanId = roomId.toUpperCase().trim() || 'REGIAO1';
  if (!rooms[cleanId]) {
    rooms[cleanId] = {
      id: cleanId,
      name: `Região Metropolitana ${cleanId}`,
      createdAt: Date.now(),
      players: {},
      cityProfiles: {},
      regionalTreaties: [],
      mapTilesUpdate: {},
      tradeOffers: [],
      chatMessages: [
        {
          id: 'sys-1',
          sender: 'Consórcio Metropolitano',
          text: `Região ${cleanId} fundada! Conecte dois dispositivos para governarem como Prefeitos vizinhos, negociar turistas, energia e petróleo.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'system',
        },
      ],
      activeDeals: {
        powerToSouth: 0,
        powerPrice: 0,
        waterToSouth: 0,
        waterPrice: 0,
      },
    };
  }
  return rooms[cleanId];
}

// Persistent Server-side Cloud Game Saves
const savedGameStates: Record<string, { state: any; savedAt: number; cityName: string; mayorName: string }> = {};

// Save state online automatically
app.post('/api/game/save', (req, res) => {
  try {
    const { key, state } = req.body;
    if (!key || !state) {
      return res.status(400).json({ error: 'Missing key or state' });
    }
    const cleanKey = String(key).trim().toLowerCase();
    savedGameStates[cleanKey] = {
      state,
      savedAt: Date.now(),
      cityName: state.cityName || 'Município',
      mayorName: state.mayorName || 'Prefeito',
    };
    return res.json({ success: true, savedAt: savedGameStates[cleanKey].savedAt });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

// Load state online
app.get('/api/game/load/:key', (req, res) => {
  const cleanKey = String(req.params.key).trim().toLowerCase();
  const found = savedGameStates[cleanKey];
  if (!found) {
    return res.status(404).json({ error: 'Nenhum jogo salvo online para esta chave.' });
  }
  return res.json({ success: true, ...found });
});

// Regional Economic Ranking of All Cities
app.get('/api/game/ranking', (req, res) => {
  const list = Object.values(savedGameStates).map((entry) => {
    const s = entry.state;
    return {
      cityName: s.cityName || entry.cityName,
      mayorName: s.mayorName || entry.mayorName,
      party: s.party || 'SEM PARTIDO',
      treasury: s.treasury || 0,
      monthlyRevenue: s.monthlyRevenue || 0,
      monthlyExpenses: s.monthlyExpenses || 0,
      netMonthly: s.netMonthly || 0,
      population: s.population || 0,
      jobs: s.jobs || 0,
      unemploymentRate: s.unemploymentRate || 0,
      fiscalRating: s.fiscalRating || 'B',
      approvalRating: s.approvalRating || 50,
      securityIndex: s.securityIndex || 50,
      healthIndex: s.healthIndex || 50,
      educationIndex: s.educationIndex || 50,
      infrastructureIndex: s.infrastructureIndex || 50,
      savedAt: entry.savedAt,
    };
  });

  list.sort((a, b) => b.treasury - a.treasury);
  return res.json({ ranking: list });
});

// API endpoint to inspect room status
app.get('/api/rooms/:id', (req, res) => {
  const room = getOrCreateRoom(req.params.id);
  res.json({
    id: room.id,
    playersCount: Object.keys(room.players).length,
    activeDeals: room.activeDeals,
  });
});

// Setup WebSocket Server for Real-Time 2-Mayor Multiplayer (scoped to /api/multiplayer)
const wss = new WebSocketServer({ server, path: '/api/multiplayer' });

interface ClientWS extends WebSocket {
  roomId?: string;
  playerId?: string;
  isAlive?: boolean;
}

function broadcastToRoom(roomId: string, message: any, excludeWs?: ClientWS) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    const ws = client as ClientWS;
    if (ws.readyState === WebSocket.OPEN && ws.roomId === roomId && ws !== excludeWs) {
      ws.send(data);
    }
  });
}

wss.on('connection', (ws: ClientWS) => {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      const { type, roomId, playerId } = data;

      if (type === 'join_room') {
        const room = getOrCreateRoom(roomId);
        ws.roomId = room.id;
        ws.playerId = playerId;

        // Auto-assign role if needed: first mayor is north, second is south
        const existingRoles = Object.values(room.players).map((p) => p.role);
        let assignedRole: 'mayor_north' | 'mayor_south' | 'spectator' = 'spectator';
        if (!existingRoles.includes('mayor_north')) {
          assignedRole = 'mayor_north';
        } else if (!existingRoles.includes('mayor_south')) {
          assignedRole = 'mayor_south';
        }

        const newPlayer: MayorPlayer = {
          id: playerId,
          name: data.playerName || (assignedRole === 'mayor_north' ? 'Prefeito Norte' : assignedRole === 'mayor_south' ? 'Prefeito Sul' : 'Observador'),
          role: data.preferredRole || assignedRole,
          color: assignedRole === 'mayor_north' ? '#3b82f6' : assignedRole === 'mayor_south' ? '#10b981' : '#a855f7',
          treasury: 25000,
          population: 150,
        };

        room.players[playerId] = newPlayer;

        // Send full room state to joined player
        ws.send(
          JSON.stringify({
            type: 'room_state',
            room: {
              id: room.id,
              players: room.players,
              cityProfiles: room.cityProfiles,
              regionalTreaties: room.regionalTreaties,
              mapTilesUpdate: room.mapTilesUpdate,
              tradeOffers: room.tradeOffers,
              chatMessages: room.chatMessages,
              activeDeals: room.activeDeals,
              yourPlayer: newPlayer,
            },
          })
        );

        // Announce to others
        broadcastToRoom(
          room.id,
          {
            type: 'player_joined',
            player: newPlayer,
            chatMessage: {
              id: 'sys_' + Date.now(),
              sender: 'Sistema',
              text: `${newPlayer.name} (${newPlayer.role === 'mayor_north' ? 'Distrito Norte' : 'Distrito Sul'}) conectou!`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              role: 'system',
            },
          },
          ws
        );
      }

      // Tile built or demolished in real time
      if (type === 'tile_action' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room && data.tile) {
          const key = `${data.tile.x}_${data.tile.y}`;
          room.mapTilesUpdate[key] = data.tile;

          broadcastToRoom(
            ws.roomId,
            {
              type: 'tile_action',
              tile: data.tile,
              actorRole: data.actorRole,
              actorName: data.actorName,
            },
            ws
          );
        }
      }

      // Batch tiles (e.g. dragging a whole avenue)
      if (type === 'batch_tiles_action' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room && Array.isArray(data.tiles)) {
          data.tiles.forEach((tile: any) => {
            room.mapTilesUpdate[`${tile.x}_${tile.y}`] = tile;
          });

          broadcastToRoom(
            ws.roomId,
            {
              type: 'batch_tiles_action',
              tiles: data.tiles,
              actorRole: data.actorRole,
            },
            ws
          );
        }
      }

      // Cursor movement across screens
      if (type === 'cursor_move' && ws.roomId && ws.playerId) {
        const room = rooms[ws.roomId];
        if (room && room.players[ws.playerId]) {
          room.players[ws.playerId].cursor = data.cursor;
          broadcastToRoom(
            ws.roomId,
            {
              type: 'cursor_move',
              playerId: ws.playerId,
              cursor: data.cursor,
            },
            ws
          );
        }
      }

      // Trade & Aid Offers (Money, Electricity, Water, Firefighters)
      if (type === 'create_trade_offer' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room) {
          const offer: RoomTradeOffer = {
            id: 'trade_' + Date.now(),
            fromMayor: data.fromMayor,
            type: data.offerType,
            amount: data.amount,
            price: data.price,
            status: 'pending',
            timestamp: Date.now(),
          };
          room.tradeOffers.push(offer);

          broadcastToRoom(ws.roomId, {
            type: 'new_trade_offer',
            offer,
          });
        }
      }

      // Respond to Trade Offer
      if (type === 'respond_trade_offer' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room) {
          const offer = room.tradeOffers.find((o) => o.id === data.offerId);
          if (offer) {
            offer.status = data.accept ? 'accepted' : 'rejected';

            if (data.accept) {
              if (offer.type === 'power_deal') {
                room.activeDeals.powerToSouth += offer.amount;
                room.activeDeals.powerPrice += offer.price;
              } else if (offer.type === 'water_deal') {
                room.activeDeals.waterToSouth += offer.amount;
                room.activeDeals.waterPrice += offer.price;
              }
            }

            broadcastToRoom(ws.roomId, {
              type: 'trade_offer_updated',
              offer,
              activeDeals: room.activeDeals,
            });
          }
        }
      }

      // Chat Message between Mayors
      if (type === 'chat_message' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room && data.text) {
          const msg = {
            id: 'msg_' + Date.now(),
            sender: data.sender || 'Prefeito',
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: data.role || 'mayor',
          };
          room.chatMessages.push(msg);
          if (room.chatMessages.length > 50) room.chatMessages.shift();

          broadcastToRoom(ws.roomId, {
            type: 'chat_message',
            message: msg,
          });
        }
      }

      // Sync Municipal Profile (Population, Treasury, Oil, Gold, Energy, Tourists, Jobs)
      if (type === 'sync_city_profile' && ws.roomId && ws.playerId) {
        const room = rooms[ws.roomId];
        if (room && data.profile) {
          room.cityProfiles[ws.playerId] = {
            ...data.profile,
            id: ws.playerId,
            lastUpdated: Date.now(),
          };

          broadcastToRoom(ws.roomId, {
            type: 'city_profiles_update',
            cityProfiles: room.cityProfiles,
          });
        }
      }

      // Propose Regional Bilateral Treaty (Takes 60s for ratification!)
      if (type === 'propose_regional_treaty' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room && data.treaty) {
          const now = Date.now();
          const treaty = {
            ...data.treaty,
            id: 'treaty_' + now + '_' + Math.random().toString(36).substr(2, 4),
            startTime: now,
            ratificationSecondsRemaining: 60,
            status: 'pending_ratification',
            timestamp: now,
          };
          room.regionalTreaties.push(treaty);

          // Announce in chat
          const sysMsg = {
            id: 'msg_treaty_' + now,
            sender: 'Cúpula Regional',
            text: `📜 NOVA NEGOCIAÇÃO: ${data.treaty.fromMayorName || 'Prefeito'} propôs o tratado "${treaty.title}" para apreciação da Câmara e Gabinete vizinho!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: 'system',
          };
          room.chatMessages.push(sysMsg);

          broadcastToRoom(ws.roomId, {
            type: 'regional_treaty_proposed',
            treaty,
            regionalTreaties: room.regionalTreaties,
            sysMsg,
            senderId: ws.playerId,
            fromMayorName: data.treaty.fromMayorName,
            fromMayorRole: data.treaty.fromMayorRole,
            targetMayorRole: data.treaty.targetMayorRole,
          });
        }
      }

      // Respond to Regional Treaty (Accept or Reject)
      if (type === 'respond_regional_treaty' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room) {
          const treaty = room.regionalTreaties.find((t) => t.id === data.treatyId);
          if (treaty) {
            treaty.status = data.accept ? 'active' : 'rejected';

            // Add announcement in regional chat
            const sysMsg = {
              id: 'msg_sys_' + Date.now(),
              sender: 'Consórcio Metropolitano',
              text: data.accept
                ? `🏛️ TRATADO RATIFICADO: "${treaty.title}" foi aprovado e entrou em vigor entre as cidades!`
                : `❌ TRATADO VETADO: "${treaty.title}" foi arquivado pelo Prefeito vizinho.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              role: 'system',
            };
            room.chatMessages.push(sysMsg);

            broadcastToRoom(ws.roomId, {
              type: 'regional_treaty_updated',
              treaty,
              regionalTreaties: room.regionalTreaties,
              sysMsg,
              responderId: ws.playerId,
              accepted: data.accept,
            });
          }
        }
      }

      // Direct Aid Transfer between Mayors (Immediate Negotiation & Relief)
      if (type === 'direct_aid_transfer' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room) {
          const aidEvent = {
            id: 'aid_' + Date.now(),
            fromMayorName: data.fromMayorName || 'Prefeito Vizinho',
            fromCityName: data.fromCityName || 'Município Parceiro',
            fromRole: data.fromRole,
            targetRole: data.targetRole,
            amount: Number(data.amount) || 0,
            category: data.category || 'financeira',
            note: data.note || 'Socorro e cooperação mútua metropolitana',
            timestamp: Date.now(),
          };

          const sysMsg = {
            id: 'msg_aid_' + Date.now(),
            sender: 'Cúpula Metropolitana',
            text: `🤝 SOCORRO BILATERAL: ${aidEvent.fromMayorName} (${aidEvent.fromCityName}) transferiu R$ ${aidEvent.amount.toLocaleString()} de auxílio para a cidade parceira!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: 'system',
          };
          room.chatMessages.push(sysMsg);

          broadcastToRoom(ws.roomId, {
            type: 'direct_aid_transferred',
            aidEvent,
            sysMsg,
          });
        }
      }

      // Propose Intermunicipal Loan (between Mayors)
      if (type === 'propose_intermunicipal_loan' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room && data.loan) {
          const loan = {
            ...data.loan,
            id: 'loan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            status: 'pending',
            timestamp: Date.now(),
          };

          const sysMsg = {
            id: 'msg_loan_' + Date.now(),
            sender: 'Banco de Desenvolvimento Regional',
            text: `🏛️ PROPOSTA DE EMPRÉSTIMO: O Prefeito ${loan.lenderMayor} (${loan.lenderCity}) ofereceu crédito de R$ ${Number(loan.principal).toLocaleString()} a ${loan.interestRateMonthly}% a.m. para ${loan.borrowerCity}!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: 'system',
          };
          room.chatMessages.push(sysMsg);

          broadcastToRoom(ws.roomId, {
            type: 'intermunicipal_loan_proposed',
            loan,
            sysMsg,
            senderId: ws.playerId,
          });
        }
      }

      // Respond to Intermunicipal Loan (Accept or Reject)
      if (type === 'respond_intermunicipal_loan' && ws.roomId) {
        const room = rooms[ws.roomId];
        if (room && data.loan) {
          const accepted = !!data.accept;
          const loan = {
            ...data.loan,
            status: accepted ? 'active' : 'rejected',
          };

          const sysMsg = {
            id: 'msg_loan_resp_' + Date.now(),
            sender: 'Consórcio Metropolitano',
            text: accepted
              ? `✅ EMPRÉSTIMO APROVADO: O Prefeito ${loan.borrowerMayor} (${loan.borrowerCity}) aceitou a linha de crédito de R$ ${Number(loan.principal).toLocaleString()}! Valores transferidos.`
              : `❌ EMPRÉSTIMO RECUSADO: A proposta de mútuo financeiro entre ${loan.lenderCity} e ${loan.borrowerCity} foi recusada.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: 'system',
          };
          room.chatMessages.push(sysMsg);

          broadcastToRoom(ws.roomId, {
            type: 'intermunicipal_loan_updated',
            loan,
            accepted,
            sysMsg,
            responderId: ws.playerId,
          });
        }
      }
    } catch (err) {
      console.error('WebSocket message handling error:', err);
    }
  });

  ws.on('close', () => {
    if (ws.roomId && ws.playerId) {
      const room = rooms[ws.roomId];
      if (room && room.players[ws.playerId]) {
        const leaving = room.players[ws.playerId];
        delete room.players[ws.playerId];
        broadcastToRoom(ws.roomId, {
          type: 'player_left',
          playerId: ws.playerId,
          playerName: leaving.name,
        });
      }
    }
  });
});

// Periodic heartbeat
setInterval(() => {
  wss.clients.forEach((client) => {
    const ws = client as ClientWS;
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 25000);

// Setup Vite or Static Serving
async function startApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SimCity Server & WebSocket listening on port ${PORT}`);
  });
}

startApp();
