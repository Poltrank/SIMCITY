import React, { useState } from 'react';
import { MayorPlayer, TradeOffer, ChatMessage, ActiveDeals } from '../hooks/useMultiplayer';
import { sounds } from '../audio/soundManager';
import {
  Users,
  Copy,
  Check,
  Zap,
  Droplets,
  DollarSign,
  Flame,
  Send,
  Share2,
  ShieldCheck,
  Building2,
  HelpCircle,
  X,
  MessageSquare,
  ArrowRightLeft,
  Sparkles,
  Link,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  roomId: string | null;
  myPlayer: MayorPlayer | null;
  players: Record<string, MayorPlayer>;
  tradeOffers: TradeOffer[];
  chatMessages: ChatMessage[];
  activeDeals: ActiveDeals;
  treasury: number;
  powerCapacity: number;
  waterCapacity: number;
  onJoinRoom: (roomId: string, name: string, role?: string) => void;
  onLeaveRoom: () => void;
  onSendTradeOffer: (type: 'money_aid' | 'power_deal' | 'water_deal' | 'emergency_fire', amount: number, price: number) => void;
  onRespondTradeOffer: (offerId: string, accept: boolean) => void;
  onSendChatMessage: (text: string) => void;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  roomId,
  myPlayer,
  players,
  tradeOffers,
  chatMessages,
  activeDeals,
  treasury,
  powerCapacity,
  waterCapacity,
  onJoinRoom,
  onLeaveRoom,
  onSendTradeOffer,
  onRespondTradeOffer,
  onSendChatMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'trade' | 'chat' | 'connection'>('trade');
  const [inputRoomId, setInputRoomId] = useState('');
  const [inputMayorName, setInputMayorName] = useState('Prefeito');
  const [inputRole, setInputRole] = useState<'mayor_north' | 'mayor_south'>('mayor_north');
  const [chatInput, setChatInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Trade form state
  const [tradeType, setTradeType] = useState<'money_aid' | 'power_deal' | 'water_deal' | 'emergency_fire'>('power_deal');
  const [tradeAmount, setTradeAmount] = useState<number>(50);
  const [tradePrice, setTradePrice] = useState<number>(150);

  if (!isOpen) return null;

  const handleCreateOrJoin = () => {
    sounds.playClick();
    const targetRoom = inputRoomId.trim().toUpperCase() || Math.random().toString(36).substring(2, 6).toUpperCase();
    onJoinRoom(targetRoom, inputMayorName.trim() || 'Prefeito', inputRole);
  };

  const getInviteUrl = () => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?room=${roomId || 'REGIAO1'}`;
  };

  const handleCopyLink = () => {
    sounds.playClick();
    const url = getInviteUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    sounds.playClick();
    const url = getInviteUrl();
    const text = encodeURIComponent(
      `🏛️ Entre como Prefeito(a) na minha região no SimCity! Vamos governar juntos e negociar energia, água e mercadorias: ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSendTrade = () => {
    sounds.playClick();
    onSendTradeOffer(tradeType, tradeAmount, tradePrice);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    sounds.playClick();
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const playersList = Object.values(players) as MayorPlayer[];
  const partnerMayor = playersList.find((p) => p.id !== myPlayer?.id);

  return (
    <div
      id="multiplayer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-blue-950/80 via-slate-900 to-emerald-950/80 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-inner">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                2 Prefeitos em Celulares Diferentes
                {isConnected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online ({roomId})
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Governem a mesma região, dividam distritos e façam comércio intermunicipal
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If NOT connected to a room: Connect / Create Room Screen */}
        {!isConnected ? (
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Como funciona o Modo 2 Prefeitos:
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>2 Celulares em tempo real:</strong> Cada jogador abre no seu próprio celular.
                </li>
                <li>
                  <strong>Distritos Compartilhados:</strong> Um comanda o <span className="text-blue-400 font-bold">Distrito Norte</span> e o outro o <span className="text-emerald-400 font-bold">Distrito Sul</span>.
                </li>
                <li>
                  <strong>Comércio e Ajudas:</strong> Venda de eletricidade excedente, água encanada, verba de socorro e envio de bombeiros em incêndios.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Seu Nome de Prefeito(a)
                </label>
                <input
                  type="text"
                  value={inputMayorName}
                  onChange={(e) => setInputMayorName(e.target.value)}
                  placeholder="Ex: Prefeito Carlos"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Código da Sala / Região
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                    placeholder="Ex: RIO1 ou deixe vazio para gerar"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm uppercase font-mono tracking-widest text-white focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={() => setInputRoomId(Math.random().toString(36).substring(2, 6).toUpperCase())}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Gerar Código
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Escolha seu Distrito
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputRole('mayor_north')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      inputRole === 'mayor_north'
                        ? 'bg-blue-950/60 border-blue-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <span className="font-bold text-xs block text-blue-300">Distrito Norte</span>
                      <span className="text-[10px] text-slate-400">Metade superior da região</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputRole('mayor_south')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      inputRole === 'mayor_south'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div>
                      <span className="font-bold text-xs block text-emerald-300">Distrito Sul</span>
                      <span className="text-[10px] text-slate-400">Metade inferior da região</span>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCreateOrJoin}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Entrar na Sala & Iniciar Conexão</span>
              </button>
            </div>
          </div>
        ) : (
          /* When CONNECTED: Tabs for Trade, Chat, and Share */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Share Banner */}
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-400 font-semibold">Sala:</span>
                <span className="font-mono font-bold text-amber-400 px-2 py-0.5 bg-slate-900 rounded border border-slate-700">
                  {roomId}
                </span>
                <span className="text-slate-400 hidden sm:inline">
                  {partnerMayor ? `Parceiro: ${partnerMayor.name}` : 'Aguardando 2º celular...'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                  title="Copiar link da sala"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                  title="Enviar no WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs">
              <button
                onClick={() => setActiveTab('trade')}
                className={`py-2.5 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'trade'
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Comércio & Ajudas</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2.5 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'chat'
                    ? 'border-blue-400 text-blue-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat dos Prefeitos</span>
              </button>
              <button
                onClick={() => setActiveTab('connection')}
                className={`py-2.5 font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'connection'
                    ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Prefeitos ({playersList.length}/2)</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. TRADE & AID */}
            {activeTab === 'trade' && (
              <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Active intermunicipal deals summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Energia Exportada</span>
                        <span className="font-bold text-white text-xs">{activeDeals.powerToSouth} MW</span>
                      </div>
                    </div>
                    {activeDeals.powerPrice > 0 && (
                      <span className="text-[11px] text-emerald-400 font-bold">+${activeDeals.powerPrice}/mês</span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Água Encanada</span>
                        <span className="font-bold text-white text-xs">{activeDeals.waterToSouth} m³</span>
                      </div>
                    </div>
                    {activeDeals.waterPrice > 0 && (
                      <span className="text-[11px] text-emerald-400 font-bold">+${activeDeals.waterPrice}/mês</span>
                    )}
                  </div>
                </div>

                {/* Create Trade Offer */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                    Propor Ajuda ou Negociação para a Cidade Vizinha
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('power_deal');
                        setTradeAmount(50);
                        setTradePrice(200);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        tradeType === 'power_deal'
                          ? 'bg-amber-950/70 border-amber-500 text-amber-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Zap className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span>Vender Energia</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('water_deal');
                        setTradeAmount(40);
                        setTradePrice(160);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        tradeType === 'water_deal'
                          ? 'bg-blue-950/70 border-blue-500 text-blue-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                      <span>Vender Água</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('money_aid');
                        setTradeAmount(2000);
                        setTradePrice(0);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        tradeType === 'money_aid'
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span>Enviar Socorro ($)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('emergency_fire');
                        setTradeAmount(1);
                        setTradePrice(0);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        tradeType === 'emergency_fire'
                          ? 'bg-red-950/70 border-red-500 text-red-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Flame className="w-4 h-4 mx-auto mb-1 text-red-400" />
                      <span>Bombeiros</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {tradeType === 'power_deal'
                          ? 'Megawatts (MW):'
                          : tradeType === 'water_deal'
                          ? 'Volume de Água:'
                          : tradeType === 'money_aid'
                          ? 'Valor da Doação ($):'
                          : 'Viaturas de Bombeiros:'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    {(tradeType === 'power_deal' || tradeType === 'water_deal') && (
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Preço Mensal Cobrado ($):</label>
                        <input
                          type="number"
                          min="0"
                          value={tradePrice}
                          onChange={(e) => setTradePrice(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendTrade}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Proposta de Negociação ao Prefeito Vizinho</span>
                  </button>
                </div>

                {/* Pending and recent offers list */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Histórico de Negociações & Ajudas
                  </h4>
                  {tradeOffers.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800/80">
                      Nenhuma negociação enviada ainda. Faça uma proposta acima!
                    </div>
                  ) : (
                    tradeOffers.map((offer) => {
                      const isFromMe = offer.fromMayor === myPlayer?.role;
                      return (
                        <div
                          key={offer.id}
                          className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block">
                              {offer.type === 'power_deal' && `⚡ Venda de ${offer.amount} MW de Energia por $${offer.price}/mês`}
                              {offer.type === 'water_deal' && `💧 Fornecimento de ${offer.amount} de Água por $${offer.price}/mês`}
                              {offer.type === 'money_aid' && `💰 Socorro Financeiro Emergencial de $${offer.amount}`}
                              {offer.type === 'emergency_fire' && `🚒 Reforço de Brigada de Bombeiros`}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {isFromMe ? 'Enviado por você' : 'Enviado pela cidade vizinha'} •{' '}
                              <span
                                className={
                                  offer.status === 'accepted'
                                    ? 'text-emerald-400 font-bold'
                                    : offer.status === 'rejected'
                                    ? 'text-red-400'
                                    : 'text-amber-400 font-semibold'
                                }
                              >
                                {offer.status === 'accepted'
                                  ? 'Aceito & em vigor'
                                  : offer.status === 'rejected'
                                  ? 'Recusado'
                                  : 'Aguardando resposta'}
                              </span>
                            </span>
                          </div>

                          {!isFromMe && offer.status === 'pending' && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => onRespondTradeOffer(offer.id, true)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                              >
                                Aceitar
                              </button>
                              <button
                                onClick={() => onRespondTradeOffer(offer.id, false)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                              >
                                Recusar
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. CHAT */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3 gap-2">
                <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      Nenhuma mensagem trocada ainda. Converse com o prefeito vizinho!
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-lg max-w-[85%] ${
                          msg.role === 'system'
                            ? 'bg-slate-800/50 text-slate-400 text-[10px] mx-auto text-center'
                            : msg.sender === myPlayer?.name
                            ? 'bg-blue-600/30 border border-blue-500/40 text-blue-100 ml-auto'
                            : 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 mr-auto'
                        }`}
                      >
                        {msg.role !== 'system' && (
                          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mb-0.5">
                            <span className="font-bold text-slate-200">{msg.sender}</span>
                            <span>{msg.time}</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat input */}
                <form onSubmit={handleSendChat} className="flex gap-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Escreva uma mensagem para o prefeito parceiro..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: 3. MAYORS & CONNECTION */}
            {activeTab === 'connection' && (
              <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Prefeitos Conectados na Região
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {playersList.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center gap-3"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 truncate">
                          <span className="font-bold text-white text-xs block truncate">
                            {p.name} {p.id === myPlayer?.id && '(Você)'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {p.role === 'mayor_north' ? '🔵 Distrito Norte' : '🟢 Distrito Sul'}
                          </span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-blue-400" />
                    Link direto para o outro celular entrar
                  </h4>
                  <input
                    type="text"
                    readOnly
                    value={getInviteUrl()}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-300 select-all"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 text-xs flex items-center justify-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Mandar no WhatsApp</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onLeaveRoom();
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/80 text-red-300 font-bold text-xs"
                >
                  Sair da Sala Multijogador
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
