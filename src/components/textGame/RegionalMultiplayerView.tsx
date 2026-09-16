import React, { useState } from 'react';
import {
  Radio,
  Users,
  Briefcase,
  Palmtree,
  Zap,
  Flame,
  Pickaxe,
  DollarSign,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Handshake,
  MessageSquare,
  Shield,
  Building,
  TrendingUp,
  Share2,
  RefreshCw,
} from 'lucide-react';
import {
  PrefeitoCityState,
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
} from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface RegionalMultiplayerViewProps {
  cityState: PrefeitoCityState;
  roomId: string;
  isConnected: boolean;
  myRole: 'mayor_north' | 'mayor_south' | 'spectator';
  myPlayerId?: string;
  otherMayors: Record<string, RegionalMayorProfile>;
  treaties: RegionalTreaty[];
  chatMessages: RegionalChatMessage[];
  onConnectRoom: (code: string) => void;
  onProposeTreaty: (draft: {
    type: RegionalTreaty['type'];
    title: string;
    details: string;
    amount: number;
    monthlyCostOrPrice: number;
    targetMayorRole?: string;
    targetMayorName?: string;
    targetCityName?: string;
  }) => void;
  onRespondTreaty: (treatyId: string, accept: boolean) => void;
  onSendMessage: (text: string) => void;
  onShareRoom?: () => void;
  onSendDirectAid?: (amount: number, category: 'financeira' | 'energia' | 'agua', note?: string) => void;
  onOpenLoansModal?: () => void;
  onSendGreeting?: (targetMayorId?: string) => void;
  onForceRefresh?: () => void;
}

export const RegionalMultiplayerView: React.FC<RegionalMultiplayerViewProps> = ({
  cityState,
  roomId,
  isConnected,
  myRole,
  myPlayerId,
  otherMayors,
  treaties,
  chatMessages,
  onConnectRoom,
  onProposeTreaty,
  onRespondTreaty,
  onSendMessage,
  onShareRoom,
  onSendDirectAid,
  onOpenLoansModal,
  onSendGreeting,
  onForceRefresh,
}) => {
  const [inputRoom, setInputRoom] = useState(roomId);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'cenario' | 'tratados' | 'chat'>('cenario');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [aidFeedback, setAidFeedback] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter out self and ghosts
  const allMayors = Object.values(otherMayors) as RegionalMayorProfile[];
  const isOther = (m: RegionalMayorProfile) => {
    if (!m) return false;
    if (myPlayerId && m.id === myPlayerId) return false;
    // Filter ghost test city
    if (m.cityName === 'Porto da Aliança') return false;
    // Filter duplicate copy of user's own mayor or city
    if (cityState.mayorName && m.name && m.name.toLowerCase().trim() === cityState.mayorName.toLowerCase().trim()) return false;
    if (cityState.cityName && m.cityName && m.cityName.toLowerCase().trim() === cityState.cityName.toLowerCase().trim()) return false;
    return true;
  };

  const realPartners = allMayors.filter((m) => m.isRealPlayer && isOther(m));
  const realPartner: RegionalMayorProfile | null = realPartners[0] || null;
  const fictitiousMayors = allMayors.filter((m) => !m.isRealPlayer && isOther(m));

  // Target mayor selection for treaties tab
  const [selectedTargetMayorId, setSelectedTargetMayorId] = useState<string>(
    realPartner ? realPartner.id : 'may_serra_alta'
  );

  React.useEffect(() => {
    if (realPartner && selectedTargetMayorId.startsWith('may_')) {
      setSelectedTargetMayorId(realPartner.id);
    }
  }, [realPartner, selectedTargetMayorId]);

  const handleSendAidToPartner = (targetPartner: RegionalMayorProfile, amount: number) => {
    if (!targetPartner) return;
    if (cityState.treasury < amount) {
      setAidFeedback(`Tesouro insuficiente. Você possui R$ ${cityState.treasury.toLocaleString()}.`);
      setTimeout(() => setAidFeedback(null), 4000);
      return;
    }
    sounds.playCash();
    onSendDirectAid?.(amount, 'financeira', `Ajuda emergencial para a Prefeitura de ${targetPartner.cityName}`);
    setAidFeedback(`R$ ${amount.toLocaleString()} transferidos com sucesso para o Tesouro de ${targetPartner.name} (${targetPartner.cityName})!`);
    setTimeout(() => setAidFeedback(null), 5000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput);
    setChatInput('');
  };

  const selectedTargetProfile = allMayors.find((m) => m.id === selectedTargetMayorId) || realPartner || fictitiousMayors[0];

  return (
    <div className="space-y-6">
      {/* Header do Servidor Único Nacional - Brasil Ao Vivo */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            Servidor Central Nacional • Brasil Ao Vivo
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Mundo Metropolitano: Brasil
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Servidor Único Nacional — Todos os prefeitos governam no mesmo território brasileiro. Acesso direto e automático para todos que entram no jogo!
          </p>

          {/* Banner de Status de Jogador Real (Namorada/Parceiro) */}
          {realPartners.length > 0 ? (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-xs font-bold shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping"></span>
              🎉 {realPartners.map((p) => `${p.name} (${p.cityName})`).join(', ')} conectado(a) ao vivo no Brasil!
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-950/70 border border-sky-500/60 text-sky-200 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              Conectado ao Servidor Central do Brasil. Assim que o outro celular abrir o jogo, a cidade parceira aparecerá aqui automaticamente!
            </div>
          )}
        </div>

        {/* Indicador de Status de Conexão Central */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Servidor: Brasil
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              Sincronização em Tempo Real Ativa
            </div>
          </div>
        </div>
      </div>

      {/* Banner de Ajuda Financeira Enviada */}
      {aidFeedback && (
        <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{aidFeedback}</span>
        </div>
      )}

      {/* Sub-navegação do Multiplayer */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('cenario');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'cenario'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Building className="w-4 h-4" />
          Cidades & Consórcio Regional
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('tratados');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'tratados'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Handshake className="w-4 h-4" />
          Tratados & Negociações ({treaties.length})
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('chat');
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'chat'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Linha Direta Diplomática ({chatMessages.length})
        </button>
      </div>

      {/* ABA 1: TODAS AS CIDADES NO CONSÓRCIO REGIONAL */}
      {activeTab === 'cenario' && (
        <div className="space-y-6">
          {/* 1. DUELO / PARCERIA DE JOGADORES REAIS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sua Cidade (Você) */}
            <div className="bg-slate-900 border-2 border-sky-500/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    👑 Sua Administração Municipal
                  </span>
                  <h3 className="text-xl font-black text-white">{cityState.cityName}</h3>
                  <span className="text-xs text-slate-300">
                    {cityState.mayorName} ({cityState.party})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded font-bold bg-sky-950 text-sky-300 border border-sky-600/40">
                    🟢 Você está Online
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                    CAPAG {cityState.fiscalRating} | {cityState.approvalRating}% Aprov.
                  </span>
                </div>
              </div>

              {/* Estatísticas Chave */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">População</span>
                  <strong className="text-sm text-slate-100 font-bold">
                    {cityState.population.toLocaleString()} hab.
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Empregos & Desemprego</span>
                  <strong className="text-sm text-amber-300 font-bold">
                    {cityState.jobs.toLocaleString()} ({cityState.unemploymentRate}%)
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Turistas por Mês</span>
                  <strong className="text-sm text-emerald-300 font-bold">
                    {cityState.touristsPerMonth.toLocaleString()}
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Tesouro em Caixa</span>
                  <strong className="text-sm text-emerald-400 font-bold">
                    R$ {cityState.treasury.toLocaleString()}
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Energia Excedente</span>
                  <strong className={`text-sm font-bold ${cityState.energySurplusMw >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                    {cityState.energySurplusMw >= 0 ? `+${cityState.energySurplusMw}` : cityState.energySurplusMw} MW
                  </strong>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Petróleo & Ouro</span>
                  <strong className="text-sm text-amber-400 font-bold">
                    {cityState.oilProductionBpd} bpd | {cityState.goldProductionKg} kg
                  </strong>
                </div>
              </div>
            </div>

            {/* Cidades de Jogadores Reais Conectados (Namorada / Parceiros) */}
            {realPartners.length > 0 ? (
              realPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-slate-900 border-2 border-emerald-500 rounded-xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        🟢 Jogador(a) Real Conectado(a)
                      </span>
                      <h3 className="text-xl font-black text-white">{partner.cityName}</h3>
                      <span className="text-xs text-slate-300">
                        {partner.name} ({partner.party || 'SEM PARTIDO'})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs px-2.5 py-1 rounded font-black bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-sm animate-pulse">
                        Ao Vivo na Sala {roomId}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                        CAPAG {partner.fiscalRating || 'A'} | {partner.approvalRating || 65}% Aprov.
                      </span>
                    </div>
                  </div>

                  {/* Estatísticas da Namorada / Parceiro */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-4">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">População</span>
                      <strong className="text-sm text-slate-100 font-bold">
                        {(partner.population || 0).toLocaleString()} hab.
                      </strong>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Empregos & Desemprego</span>
                      <strong className="text-sm text-amber-300 font-bold">
                        {(partner.jobs || 0).toLocaleString()} ({partner.unemploymentRate ?? 8.5}%)
                      </strong>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Turistas por Mês</span>
                      <strong className="text-sm text-emerald-300 font-bold">
                        {(partner.touristsPerMonth || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Tesouro em Caixa</span>
                      <strong className="text-sm text-emerald-400 font-bold">
                        R$ {(partner.treasury || 0).toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Energia Excedente</span>
                      <strong
                        className={`text-sm font-bold ${
                          (partner.energySurplusMw ?? 0) >= 0 ? 'text-sky-400' : 'text-rose-400'
                        }`}
                      >
                        {(partner.energySurplusMw ?? 0) >= 0
                          ? `+${partner.energySurplusMw ?? 0}`
                          : partner.energySurplusMw} MW
                      </strong>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase">Petróleo & Ouro</span>
                      <strong className="text-sm text-amber-400 font-bold">
                        {partner.oilProductionBpd ?? 0} bpd | {partner.goldProductionKg ?? 0} kg
                      </strong>
                    </div>
                  </div>

                  {/* Ações Diretas com a Namorada / Parceiro */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onSendGreeting?.(partner.id);
                        setAidFeedback(`Saudação enviada ao vivo para ${partner.name}!`);
                        setTimeout(() => setAidFeedback(null), 3000);
                      }}
                      className="px-2 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                      title="Enviar cumprimento em tempo real para a prefeita"
                    >
                      <span>👋</span>
                      <span>Cumprimentar</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setSelectedTargetMayorId(partner.id);
                        setActiveTab('tratados');
                      }}
                      className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Handshake className="w-3.5 h-3.5" />
                      Propor Tratado
                    </button>

                    <button
                      onClick={() => handleSendAidToPartner(partner, 50000)}
                      className="px-2 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                      title="Transferir R$ 50.000 do seu tesouro para a prefeitura dela"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Enviar R$ 50k
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onOpenLoansModal?.();
                      }}
                      className="px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Building className="w-3.5 h-3.5" />
                      Empréstimo
                    </button>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        setActiveTab('chat');
                      }}
                      className="px-2 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Abrir Chat
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-md">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mb-3">
                  <Radio className="w-6 h-6 animate-pulse text-sky-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Aguardando Segundo Prefeito(a) no Brasil
                </h4>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  O servidor nacional está ativo! Assim que a Laís (ou outro celular) abrir o jogo e fizer login com o cadastro dela, a prefeitura conectará automaticamente neste mesmo mundo em tempo real.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsRefreshing(true);
                      onForceRefresh?.();
                      setTimeout(() => setIsRefreshing(false), 1200);
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Buscando...' : 'Sincronizar Agora'}</span>
                  </button>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Servidor Nacional Brasil Online
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. CONSÓRCIO METROPOLITANO: AS 3 CIDADES FICTÍCIAS VIZINHAS */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Building className="w-4 h-4" />
                  Prefeituras Fictícias Autônomas da Região
                </div>
                <h3 className="text-base font-black text-white">
                  Consórcio de Cidades Vizinhas (Disponíveis para Todos os Jogadores)
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                3 Municípios Vizinhos Ativos no Mundo do Jogo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fictitiousMayors.map((fMayor) => {
                const isEnergySpecialist = fMayor.energySurplusMw > 50;
                const isTourismSpecialist = fMayor.touristsPerMonth > 35000;
                const isOilSpecialist = fMayor.oilProductionBpd > 0;

                return (
                  <div
                    key={fMayor.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          Cidade Fictícia Autônoma
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          {fMayor.approvalRating}% Aprov.
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white">{fMayor.cityName}</h4>
                      <p className="text-xs text-slate-400 mb-3">
                        {fMayor.name} ({fMayor.party})
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="flex justify-between">
                          <span className="text-slate-400">População:</span>
                          <strong className="text-white">{fMayor.population.toLocaleString()} hab.</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tesouro:</span>
                          <strong className="text-emerald-400">R$ {fMayor.treasury.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Turistas/mês:</span>
                          <strong className="text-emerald-300">{fMayor.touristsPerMonth.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Energia Excedente:</span>
                          <strong className={fMayor.energySurplusMw >= 0 ? 'text-sky-300' : 'text-rose-400'}>
                            {fMayor.energySurplusMw >= 0 ? `+${fMayor.energySurplusMw}` : fMayor.energySurplusMw} MW
                          </strong>
                        </div>
                        {fMayor.oilProductionBpd > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Petróleo:</span>
                            <strong className="text-amber-400">{fMayor.oilProductionBpd} bpd</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex gap-2">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setSelectedTargetMayorId(fMayor.id);
                          setActiveTab('tratados');
                        }}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <Handshake className="w-3.5 h-3.5 text-amber-400" />
                        Negociar Tratado
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: TRATADOS & NEGOCIAÇÕES BILATERAIS */}
      {activeTab === 'tratados' && (
        <div className="space-y-6">
          {/* Seletor do Prefeito com quem negociar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
              Escolha a Prefeitura com quem deseja negociar o Tratado:
            </span>
            <div className="flex flex-wrap gap-2">
              {realPartners.map((rp) => (
                <button
                  key={rp.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTargetMayorId(rp.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition-all ${
                    selectedTargetMayorId === rp.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  ⭐ {rp.name} ({rp.cityName} - Jogador Real Online)
                </button>
              ))}

              {fictitiousMayors.map((fm) => (
                <button
                  key={fm.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTargetMayorId(fm.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    selectedTargetMayorId === fm.id
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  {fm.cityName} ({fm.name})
                </button>
              ))}
            </div>
          </div>

          {/* Propostas de Tratado */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-amber-400" />
                Propor Tratado para {selectedTargetProfile?.name} ({selectedTargetProfile?.cityName})
              </h3>
              {selectedTargetProfile?.isRealPlayer && (
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  ⚡ A proposta fica disponível para o prefeito por 24 horas
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Tratado 1: Corredor de Turismo */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
                    <Palmtree className="w-4 h-4" />
                    Turismo Integrado
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Corredor Turístico Regional Compartilhado
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Abre linhas expressas de turismo mútuo com {selectedTargetProfile?.cityName}. Aumenta os turistas em
                    ambas as cidades em <strong className="text-emerald-300">+30%</strong> e gera receita hoteleira.
                  </p>
                </div>
                <button
                  disabled={treaties.some(
                    (t) =>
                      t.status === 'pending_ratification' &&
                      t.type === 'tourism_corridor' &&
                      (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                  )}
                  onClick={() => {
                    sounds.playStamp();
                    onProposeTreaty({
                      type: 'tourism_corridor',
                      title: `Corredor Turístico ${cityState.cityName} & ${selectedTargetProfile?.cityName}`,
                      details: `Incentivo a pacotes turísticos e linhas de ônibus expresso integrando as cidades.`,
                      amount: 30,
                      monthlyCostOrPrice: 40000,
                      targetMayorRole: selectedTargetProfile?.role || 'mayor_south',
                      targetMayorName: selectedTargetProfile?.name,
                      targetCityName: selectedTargetProfile?.cityName,
                    });
                  }}
                  className={`w-full py-2 font-bold text-xs rounded-lg transition-colors shadow-sm ${
                    treaties.some(
                      (t) =>
                        t.status === 'pending_ratification' &&
                        t.type === 'tourism_corridor' &&
                        (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                    )
                      ? 'bg-slate-800 text-amber-300/80 cursor-not-allowed border border-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {treaties.some(
                    (t) =>
                      t.status === 'pending_ratification' &&
                      t.type === 'tourism_corridor' &&
                      (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                  )
                    ? 'Proposta Enviada (Aguardando 24h)'
                    : 'Propor Tratado de Turismo'}
                </button>
              </div>

              {/* Tratado 2: Intercâmbio de Mão-de-Obra */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
                    <Briefcase className="w-4 h-4" />
                    Mercado de Trabalho
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Pacto Regional de Empregos & Trabalhadores
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Integra o transporte de operários. Permite absorção mútua de vagas industriais,
                    reduzindo a taxa de desemprego das duas cidades.
                  </p>
                </div>
                <button
                  disabled={treaties.some(
                    (t) =>
                      t.status === 'pending_ratification' &&
                      t.type === 'worker_migration' &&
                      (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                  )}
                  onClick={() => {
                    sounds.playStamp();
                    onProposeTreaty({
                      type: 'worker_migration',
                      title: `Pacto de Mão-de-Obra ${cityState.cityName} & ${selectedTargetProfile?.cityName}`,
                      details: `Linhas integradas de transporte operário para os distritos industriais.`,
                      amount: 1500,
                      monthlyCostOrPrice: 25000,
                      targetMayorRole: selectedTargetProfile?.role || 'mayor_south',
                      targetMayorName: selectedTargetProfile?.name,
                      targetCityName: selectedTargetProfile?.cityName,
                    });
                  }}
                  className={`w-full py-2 font-bold text-xs rounded-lg transition-colors shadow-sm ${
                    treaties.some(
                      (t) =>
                        t.status === 'pending_ratification' &&
                        t.type === 'worker_migration' &&
                        (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                    )
                      ? 'bg-slate-800 text-amber-300/80 cursor-not-allowed border border-slate-700'
                      : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  {treaties.some(
                    (t) =>
                      t.status === 'pending_ratification' &&
                      t.type === 'worker_migration' &&
                      (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                  )
                    ? 'Proposta Enviada (Aguardando 24h)'
                    : 'Propor Intercâmbio de Empregos'}
                </button>
              </div>

              {/* Tratado 3: Fornecimento de Energia MW */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase mb-1">
                    <Zap className="w-4 h-4" />
                    Rede Elétrica Metropolitana
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Contrato de Fornecimento de Energia (15 MW)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Transfere 15 Megawatts (MW) excedentes da sua matriz para {selectedTargetProfile?.cityName} a um valor mensal
                    de <strong className="text-sky-300">R$ 120.000/mês</strong>.
                  </p>
                </div>
                <button
                  disabled={
                    cityState.energySurplusMw < 10 ||
                    treaties.some(
                      (t) =>
                        t.status === 'pending_ratification' &&
                        t.type === 'power_contract' &&
                        (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                    )
                  }
                  onClick={() => {
                    sounds.playStamp();
                    onProposeTreaty({
                      type: 'power_contract',
                      title: `Contrato de Energia (15 MW) para ${selectedTargetProfile?.cityName}`,
                      details: `Transferência de 15 MW de energia limpa excedente para a rede vizinha.`,
                      amount: 15,
                      monthlyCostOrPrice: 120000,
                      targetMayorRole: selectedTargetProfile?.role || 'mayor_south',
                      targetMayorName: selectedTargetProfile?.name,
                      targetCityName: selectedTargetProfile?.cityName,
                    });
                  }}
                  className={`w-full py-2 font-bold text-xs rounded-lg transition-colors shadow-sm ${
                    treaties.some(
                      (t) =>
                        t.status === 'pending_ratification' &&
                        t.type === 'power_contract' &&
                        (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                    )
                      ? 'bg-slate-800 text-amber-300/80 cursor-not-allowed border border-slate-700'
                      : cityState.energySurplusMw >= 10
                      ? 'bg-sky-600 hover:bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {treaties.some(
                    (t) =>
                      t.status === 'pending_ratification' &&
                      t.type === 'power_contract' &&
                      (t.targetCityName === selectedTargetProfile?.cityName || t.targetMayorName === selectedTargetProfile?.name)
                  )
                    ? 'Proposta Enviada (Aguardando 24h)'
                    : cityState.energySurplusMw >= 10
                    ? 'Exportar 15 MW de Energia'
                    : 'Sem Energia Suficiente (<10 MW)'}
                </button>
              </div>
            </div>
          </div>

          {/* Tratados Ativos & Pendentes */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Tratados Registrados no Cartório Regional ({treaties.length})
            </h3>

            {treaties.length === 0 ? (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                Nenhum tratado bilateral em vigor ou tramitando. Proponha um dos acordos acima!
              </div>
            ) : (
              <div className="space-y-3">
                {treaties.map((tr) => {
                  const isPending = tr.status === 'pending_ratification';
                  const isActive = tr.status === 'active';
                  const isTarget = tr.targetMayorRole === myRole;

                  return (
                    <div
                      key={tr.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : isPending
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              isActive
                                ? 'bg-emerald-400 text-slate-950'
                                : isPending
                                ? 'bg-amber-400 text-slate-950 animate-pulse'
                                : tr.status === 'expired'
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isActive
                              ? 'Em Vigor'
                              : isPending
                              ? 'Aguardando Deliberação (24h)'
                              : tr.status === 'expired'
                              ? 'Expirado (24h)'
                              : 'Arquivado'}
                          </span>
                          <span className="text-xs text-slate-400">Proposto por: {tr.fromMayorName}</span>
                        </div>
                        <h4 className="font-bold text-white text-base">{tr.title}</h4>
                        <p className="text-xs text-slate-300 mt-0.5">{tr.details}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        {isPending && isTarget && (
                          <>
                            <button
                              onClick={() => onRespondTreaty(tr.id, true)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Ratificar Tratado
                            </button>
                            <button
                              onClick={() => onRespondTreaty(tr.id, false)}
                              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeitar
                            </button>
                          </>
                        )}
                        {isActive && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Acordo Ativo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: LINHA DIRETA DIPLOMÁTICA / CHAT */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[500px] overflow-hidden">
          {/* Header do Chat */}
          <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-xs text-slate-200">
                Canal Oficial Criptografado entre Gabinetes
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Região: {roomId}</span>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Nenhuma mensagem diplomática enviada ainda. Digite abaixo para falar com o prefeito vizinho!
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl max-w-lg text-xs leading-relaxed ${
                    msg.role === 'system'
                      ? 'bg-slate-950 border border-slate-800 text-amber-300 mx-auto text-center font-mono'
                      : msg.role === myRole
                      ? 'bg-sky-950/80 border border-sky-600/40 text-sky-100 ml-auto'
                      : 'bg-slate-800 border border-slate-700 text-slate-100 mr-auto'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 mb-1">
                    <strong className={msg.role === myRole ? 'text-sky-300' : 'text-emerald-300'}>
                      {msg.sender}
                    </strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-xs">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Form de Envio */}
          <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escreva uma mensagem ou proposta para o prefeito vizinho..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
