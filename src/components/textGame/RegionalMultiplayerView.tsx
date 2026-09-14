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
}) => {
  const [inputRoom, setInputRoom] = useState(roomId);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'cenario' | 'tratados' | 'chat'>('cenario');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [aidFeedback, setAidFeedback] = useState<string | null>(null);

  // Filter out self
  const allMayors = Object.values(otherMayors) as RegionalMayorProfile[];
  const isOther = (m: RegionalMayorProfile) => {
    if (myPlayerId && m.id) return m.id !== myPlayerId;
    return m.name !== cityState.mayorName || m.cityName !== cityState.cityName;
  };

  const realPartners = allMayors.filter((m) => m.isRealPlayer && isOther(m));
  const realPartner: RegionalMayorProfile | null = realPartners[0] || null;
  const fictitiousMayors = allMayors.filter((m) => !m.isRealPlayer);

  // Target mayor selection for treaties tab
  const [selectedTargetMayorId, setSelectedTargetMayorId] = useState<string>(
    realPartner ? realPartner.id : 'may_serra_alta'
  );

  React.useEffect(() => {
    if (realPartner && selectedTargetMayorId.startsWith('may_')) {
      setSelectedTargetMayorId(realPartner.id);
    }
  }, [realPartner, selectedTargetMayorId]);

  const handleCopyLink = () => {
    sounds.playClick();
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const inviteUrl = `${origin}${pathname}?sala=${encodeURIComponent(roomId)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteUrl);
    }
    onShareRoom?.();
    setCopyFeedback('Link copiado! Envie no WhatsApp ou celular da sua namorada para ela entrar direto!');
    setTimeout(() => setCopyFeedback(null), 5000);
  };

  const handleSendAidToPartner = (amount: number) => {
    if (!realPartner) return;
    if (cityState.treasury < amount) {
      setAidFeedback(`Tesouro insuficiente. Você possui R$ ${cityState.treasury.toLocaleString()}.`);
      setTimeout(() => setAidFeedback(null), 4000);
      return;
    }
    sounds.playCash();
    onSendDirectAid?.(amount, 'financeira', `Ajuda emergencial para a Prefeitura de ${realPartner.cityName}`);
    setAidFeedback(`R$ ${amount.toLocaleString()} transferidos com sucesso para o Tesouro de ${realPartner.name} (${realPartner.cityName})!`);
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
      {/* Header & Conexão de Sala */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            Consórcio Intermunicipal de Desenvolvimento Regional
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Multijogador: Integração Entre Prefeitos Vizinhos
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Conecte dois celulares ou computadores na mesma Sala (<strong className="text-sky-300">{roomId}</strong>) para
            negociar tratados de turistas, intercâmbio de empregos e cooperação financeira!
          </p>

          {/* Banner de Status de Jogador Real (Namorada/Amigo) */}
          {realPartner ? (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-xs font-bold shadow-md animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              🎉 Prefeita {realPartner.name} conectou a cidade {realPartner.cityName} nesta sala!
            </div>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Aguardando sua namorada entrar na sala <strong className="text-white underline">{roomId}</strong>. Envie o link abaixo!
            </div>
          )}
        </div>

        {/* Controles de Sala e Compartilhamento */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Botão de Copiar Link da Sala */}
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
            title="Copiar link para enviar para sua namorada entrar pelo celular"
          >
            <Share2 className="w-4 h-4" />
            Convidar Namorada / Copiar Link
          </button>

          {/* Input de Código de Região */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <input
              type="text"
              value={inputRoom}
              onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
              placeholder="SALA (EX: CASAL1)"
              className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-white uppercase tracking-wider focus:outline-none focus:border-sky-500 w-32"
            />
            <button
              onClick={() => {
                sounds.playClick();
                onConnectRoom(inputRoom);
              }}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              {isConnected ? 'Entrar' : 'Conectar'}
            </button>
          </div>
        </div>
      </div>

      {copyFeedback && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{copyFeedback}</span>
        </div>
      )}

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

            {/* Cidade da Namorada / Jogador Real */}
            {realPartner ? (
              <div className="bg-slate-900 border-2 border-emerald-500 rounded-xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.2)] relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      🟢 Jogador(a) Real Conectado(a)
                    </span>
                    <h3 className="text-xl font-black text-white">{realPartner.cityName}</h3>
                    <span className="text-xs text-slate-300">
                      {realPartner.name} ({realPartner.party || 'SEM PARTIDO'})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2.5 py-1 rounded font-black bg-emerald-950 text-emerald-300 border border-emerald-500 shadow-sm animate-pulse">
                      Ao Vivo na Sala {roomId}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      CAPAG {realPartner.fiscalRating || 'A'} | {realPartner.approvalRating || 65}% Aprov.
                    </span>
                  </div>
                </div>

                {/* Estatísticas da Namorada */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs mb-4">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">População</span>
                    <strong className="text-sm text-slate-100 font-bold">
                      {realPartner.population.toLocaleString()} hab.
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Empregos & Desemprego</span>
                    <strong className="text-sm text-amber-300 font-bold">
                      {realPartner.jobs.toLocaleString()} ({realPartner.unemploymentRate}%)
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Turistas por Mês</span>
                    <strong className="text-sm text-emerald-300 font-bold">
                      {realPartner.touristsPerMonth.toLocaleString()}
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Tesouro em Caixa</span>
                    <strong className="text-sm text-emerald-400 font-bold">
                      R$ {realPartner.treasury.toLocaleString()}
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Energia Excedente</span>
                    <strong className={`text-sm font-bold ${realPartner.energySurplusMw >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                      {realPartner.energySurplusMw >= 0 ? `+${realPartner.energySurplusMw}` : realPartner.energySurplusMw} MW
                    </strong>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase">Petróleo & Ouro</span>
                    <strong className="text-sm text-amber-400 font-bold">
                      {realPartner.oilProductionBpd} bpd | {realPartner.goldProductionKg} kg
                    </strong>
                  </div>
                </div>

                {/* Ações Diretas com a Namorada */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedTargetMayorId(realPartner.id);
                      setActiveTab('tratados');
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Tratado
                  </button>

                  <button
                    onClick={() => handleSendAidToPartner(50000)}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                    title="Transferir R$ 50.000 do seu tesouro para a cidade dela"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    Enviar R$ 50k
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenLoansModal?.();
                    }}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <Building className="w-3.5 h-3.5" />
                    Empréstimo
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab('chat');
                    }}
                    className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Abrir Chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-md">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mb-3">
                  <Users className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  Aguardando Segundo Prefeito(a) (Namorada / Amigo)
                </h4>
                <p className="text-xs text-slate-300 max-w-md mb-4 leading-relaxed">
                  O mundo regional já está rodando com você e as 3 cidades fictícias abaixo. Assim que sua namorada
                  abrir o jogo no celular dela na sala <strong className="text-sky-300">{roomId}</strong>, a prefeitura dela
                  aparecerá aqui automaticamente em tempo real!
                </p>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Share2 className="w-4 h-4" />
                  Copiar Link Direto para o Celular Dela
                </button>
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
              {realPartner && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTargetMayorId(realPartner.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 border transition-all ${
                    selectedTargetMayorId === realPartner.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                  ⭐ {realPartner.name} ({realPartner.cityName} - Jogador Real Online)
                </button>
              )}

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
                  ⚡ O jogador receberá um alerta na tela dele para ratificar em até 60s
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
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Propor Tratado de Turismo
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
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Propor Intercâmbio de Empregos
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
                  disabled={cityState.energySurplusMw < 10}
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
                    cityState.energySurplusMw >= 10
                      ? 'bg-sky-600 hover:bg-sky-500 text-white'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {cityState.energySurplusMw >= 10 ? 'Exportar 15 MW de Energia' : 'Sem Energia Suficiente (<10 MW)'}
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
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isActive ? 'Em Vigor' : isPending ? 'Aguardando Ratificação (60s)' : 'Arquivado'}
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
