import React, { useState } from 'react';
import {
  Handshake,
  Zap,
  Droplets,
  HeartPulse,
  Bus,
  Shield,
  Palmtree,
  Factory,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Send,
  Building,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Landmark,
  MessageSquare,
  Share2,
} from 'lucide-react';
import {
  PrefeitoCityState,
  RegionalMayorProfile,
  RegionalTreaty,
  RegionalChatMessage,
} from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface MayorNegotiationsViewProps {
  cityState: PrefeitoCityState;
  otherMayors: Record<string, RegionalMayorProfile>;
  treaties: RegionalTreaty[];
  chatMessages: RegionalChatMessage[];
  myRole: string;
  isConnected: boolean;
  roomId: string;
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
  onSendDirectAid?: (amount: number, category: 'financeira' | 'energia' | 'agua', note?: string) => void;
  onOpenLoansModal?: () => void;
}

export const MayorNegotiationsView: React.FC<MayorNegotiationsViewProps> = ({
  cityState,
  otherMayors,
  treaties,
  chatMessages,
  myRole,
  isConnected,
  roomId,
  onProposeTreaty,
  onRespondTreaty,
  onSendMessage,
  onSendDirectAid,
  onOpenLoansModal,
}) => {
  const rawList = (Object.values(otherMayors) as RegionalMayorProfile[]).filter(
    (m: RegionalMayorProfile) => m.name !== cityState.mayorName && m.cityName !== cityState.cityName
  );
  // Sort so real players (e.g. girlfriend / partner) appear first!
  const mayorsList: RegionalMayorProfile[] = [...rawList].sort((a: RegionalMayorProfile, b: RegionalMayorProfile) => {
    if (a.isRealPlayer && !b.isRealPlayer) return -1;
    if (!a.isRealPlayer && b.isRealPlayer) return 1;
    return 0;
  });

  const [selectedMayorId, setSelectedMayorId] = useState<string>(
    mayorsList[0]?.id || 'may_serra_alta'
  );
  const [chatInput, setChatInput] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<
    'todos' | 'energia' | 'saneamento' | 'saude' | 'transporte' | 'seguranca' | 'turismo' | 'industria' | 'financeiro'
  >('todos');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auto-switch to real player when they join
  React.useEffect(() => {
    const realPartner = mayorsList.find((m: RegionalMayorProfile) => m.isRealPlayer);
    if (realPartner && (!otherMayors[selectedMayorId] || !otherMayors[selectedMayorId].isRealPlayer)) {
      setSelectedMayorId(realPartner.id);
    }
  }, [mayorsList, otherMayors, selectedMayorId]);

  const selectedMayor: RegionalMayorProfile | undefined =
    otherMayors[selectedMayorId] || mayorsList[0];

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCopyInvite = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const inviteUrl = `${origin}${pathname}?sala=${encodeURIComponent(roomId || 'BRASIL1')}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteUrl);
    }
    triggerToast('Link copiado! Envie no celular da sua namorada para ela entrar direto nesta sala!');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedMayor) return;
    onSendMessage(`[Para Prefeito ${selectedMayor.name}]: ${chatInput.trim()}`);
    setChatInput('');
    sounds.playTick();
  };

  // Treaties with this specific mayor or general
  const mayorTreaties = treaties.filter(
    (t) =>
      !t.targetMayorName ||
      t.targetMayorName.includes(selectedMayor?.name || '') ||
      t.fromMayorName.includes(selectedMayor?.name || '') ||
      t.targetCityName?.includes(selectedMayor?.cityName || '')
  );

  const pendingTreaties = treaties.filter((t) => t.status === 'pending_ratification');
  const activeTreaties = treaties.filter((t) => t.status === 'active');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-100" />
          <span className="text-xs md:text-sm font-bold">{successToast}</span>
        </div>
      )}

      {/* CABEÇALHO DO MÓDULO DE NEGOCIAÇÃO */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Handshake className="w-4 h-4" />
            Consórcio & Diplomacia Intermunicipal
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Mesa de Negociações com Prefeitos Vizinhos
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Selecione qualquer prefeito vizinho na Região Metropolitana para propor acordos de energia,
            saúde conjunta, transporte integrado, saneamento ou ajuda humanitária.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start md:self-center">
          <button
            onClick={handleCopyInvite}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
            title="Copiar link da sala para jogar junto com sua namorada ou amigo"
          >
            <Share2 className="w-4 h-4" />
            Convidar Namorada (Copiar Link)
          </button>

          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Região Compartilhada</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <strong className="text-emerald-400 font-black tracking-wider">{roomId || 'BRASIL1'}</strong>
              <span className="text-[10px] text-slate-400">({mayorsList.length + 1} Prefeituras no Vale)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SELETOR DE PREFEITO VIZINHO COM QUEM NEGOCIAR */}
      <div className="bg-slate-900 p-4 md:p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-sky-400" />
            1. Escolha com qual Prefeito Vizinho deseja Negociar:
          </label>
          <span className="text-[11px] text-slate-400">
            Clique no cartão para abrir as opções diplomáticas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mayorsList.map((m) => {
            const isSelected = selectedMayor?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedMayorId(m.id);
                }}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-850 border-amber-500/80 shadow-lg ring-1 ring-amber-500/50'
                    : m.isRealPlayer
                    ? 'bg-emerald-950/30 border-emerald-500/60 hover:border-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {m.isRealPlayer && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                      Namorada / Jogador Real
                    </span>
                  )}
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      Em Negociação
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-sm text-slate-950"
                    style={{ backgroundColor: m.color || '#3b82f6' }}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">{m.name}</h4>
                    <p className="text-xs font-semibold text-slate-400">
                      {m.cityName} <span className="text-slate-600">•</span>{' '}
                      <span className="text-amber-400/90 text-[11px]">{m.party || 'PARTIDO'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mt-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">População</span>
                    <strong className="text-slate-200">{m.population.toLocaleString()} hab.</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Tesouro em Caixa</span>
                    <strong className="text-emerald-400 font-bold">R$ {m.treasury.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Energia</span>
                    <strong className={m.energySurplusMw >= 0 ? 'text-sky-300' : 'text-rose-300'}>
                      {m.energySurplusMw >= 0 ? `+${m.energySurplusMw} MW` : `${m.energySurplusMw} MW`}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Aprovação</span>
                    <strong className="text-emerald-400">{m.approvalRating}%</strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PAINEL BILATERAL: VOCÊ VS PREFEITO SELECIONADO */}
      {selectedMayor && (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Mesa Bilateral de Gestão Pública
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                {cityState.cityName} & {selectedMayor.cityName}
              </h3>
              <p className="text-xs text-slate-400">
                Prefeito <strong>{cityState.mayorName}</strong> ({cityState.party}) ⇄ Prefeito{' '}
                <strong>{selectedMayor.name}</strong> ({selectedMayor.party})
              </p>
            </div>

            {/* Ações Rápidas Diretas */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  sounds.playCash();
                  onSendDirectAid?.(
                    50000,
                    'financeira',
                    `Auxílio de solidariedade enviado pelo Prefeito ${cityState.mayorName}`
                  );
                  triggerToast(`R$ 50.000 enviados ao Tesouro de ${selectedMayor.cityName}!`);
                }}
                className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Repasse Emergencial (R$ 50k)
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLoansModal?.();
                }}
                className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Landmark className="w-3.5 h-3.5" />
                Mútuo / Empréstimo
              </button>
            </div>
          </div>

          {/* Comparativo de Recursos Estratégicos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-sky-400" /> Balanço de Energia
              </span>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-300">{cityState.cityName}:</span>
                <strong className="text-sky-300">+{cityState.energySurplusMw} MW</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{selectedMayor.cityName}:</span>
                <strong className={selectedMayor.energySurplusMw >= 0 ? 'text-sky-400' : 'text-rose-400'}>
                  {selectedMayor.energySurplusMw >= 0 ? `+${selectedMayor.energySurplusMw}` : selectedMayor.energySurplusMw} MW
                </strong>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <Palmtree className="w-3.5 h-3.5 text-emerald-400" /> Fluxo de Turistas
              </span>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-300">{cityState.cityName}:</span>
                <strong className="text-emerald-300">{cityState.touristsPerMonth.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{selectedMayor.cityName}:</span>
                <strong className="text-emerald-400">{selectedMayor.touristsPerMonth.toLocaleString()}</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Caixa no Tesouro
              </span>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-300">{cityState.cityName}:</span>
                <strong className="text-amber-300">R$ {cityState.treasury.toLocaleString()}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{selectedMayor.cityName}:</span>
                <strong className="text-amber-400">R$ {selectedMayor.treasury.toLocaleString()}</strong>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> População & Votos
              </span>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-slate-300">{cityState.cityName}:</span>
                <strong className="text-indigo-300">{cityState.population.toLocaleString()} hab.</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{selectedMayor.cityName}:</span>
                <strong className="text-indigo-400">{selectedMayor.population.toLocaleString()} hab.</strong>
              </div>
            </div>
          </div>

          {/* FILTROS POR TEMA DE NEGOCIAÇÃO */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-black text-slate-400 mr-2 whitespace-nowrap">
              Temas de Negociação:
            </span>
            {[
              { id: 'todos', label: 'Todos os Tratados' },
              { id: 'energia', label: '⚡ Energia Elétrica' },
              { id: 'saneamento', label: '🚰 Saneamento & Água' },
              { id: 'saude', label: '🏥 Saúde & SUS' },
              { id: 'transporte', label: '🚌 Transporte' },
              { id: 'seguranca', label: '🛡️ Segurança Integrada' },
              { id: 'turismo', label: '🌴 Turismo Regional' },
              { id: 'industria', label: '🏭 Polo Industrial' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveCategory(cat.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* CATÁLOGO DE OPÇÕES DE TRATADOS COM 1 CLIQUE PARA PROPOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {/* 1. ENERGIA ELÉTRICA */}
            {(activeCategory === 'todos' || activeCategory === 'energia') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800/40">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Contrato de Fornecimento de Energia</h4>
                      <span className="text-[10px] text-sky-400 font-semibold">
                        Garantia de 50 MW para evitar apagões industriais
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">R$ 28.000/mês</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conexão das subestações de alta tensão entre {cityState.cityName} e {selectedMayor.cityName}.
                  Garante estabilidade energética, reduz quedas de luz e atrai empresas de TI.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">Ratificação: 60s pela Câmara</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'power_contract',
                        title: `Pacto Energético Intermunicipal: ${cityState.cityName} e ${selectedMayor.cityName}`,
                        details: `Abastecimento mútuo de 50 MW de energia elétrica em alta tensão, gerando estabilidade à malha produtiva.`,
                        amount: 50,
                        monthlyCostOrPrice: 28000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Tratado Energético enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Tratado de Energia
                  </button>
                </div>
              </div>
            )}

            {/* 2. SANEAMENTO BÁSICO & ATERRO */}
            {(activeCategory === 'todos' || activeCategory === 'saneamento') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/40">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Consórcio de Saneamento & Aterro</h4>
                      <span className="text-[10px] text-teal-400 font-semibold">
                        Economia de escala no descarte de lixo e esgoto
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">-R$ 15.000 custo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Operação conjunta de um aterro sanitário moderno e usina de reciclagem compartilhada.
                  Reduz as despesas de coleta para ambas as prefeituras e limpa rios de fronteira.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">+12% Índice Sanitário</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'sanitation_consortium',
                        title: `Consórcio Sanitário Metropolitano: ${cityState.cityName} & ${selectedMayor.cityName}`,
                        details: `Aterro sanitário biometanizado e despoluição conjunta de bacias hídricas intermunicipais.`,
                        amount: 100,
                        monthlyCostOrPrice: 15000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Consórcio Sanitário enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Consórcio de Saneamento
                  </button>
                </div>
              </div>
            )}

            {/* 3. SAÚDE & SUS REGIONAL */}
            {(activeCategory === 'todos' || activeCategory === 'saude') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800/40">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Consórcio de Saúde & Leitos de UTI</h4>
                      <span className="text-[10px] text-rose-400 font-semibold">
                        Regulação conjunta de vagas hospitalares e exames
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">R$ 22.000/mês</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Criação de fila unificada para cirurgias eletivas e atendimento emergencial. Médicos
                  especialistas e ambulâncias com UTI móvel cobrem as duas cidades sem burocracia.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">+18% Aprovação na Saúde</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'health_consortium',
                        title: `Pacto de Saúde & UTI Metropolitano: ${cityState.cityName} e ${selectedMayor.cityName}`,
                        details: `Regulação integrada de especialidades médicas, cirurgias e leitos de UTI para moradores de ambas as cidades.`,
                        amount: 30,
                        monthlyCostOrPrice: 22000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Consórcio de Saúde enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Consórcio de Saúde
                  </button>
                </div>
              </div>
            )}

            {/* 4. TRANSPORTE & BILHETE ÚNICO */}
            {(activeCategory === 'todos' || activeCategory === 'transporte') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Integração de Transporte & Bilhete Único</h4>
                      <span className="text-[10px] text-indigo-400 font-semibold">
                        Linhas de ônibus circulares sem cobrança dupla
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300">R$ 18.000/mês</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conexão expressa entre os terminais rodoviários centrais. O trabalhador cruza a divisa
                  com uma única passagem, aquecendo o comércio e encurtando o trajeto até fábricas.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">+2.500 Empregos Conectados</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'transit_integration',
                        title: `Bilhete Único e Corredor de Ônibus: ${cityState.cityName} ⇄ ${selectedMayor.cityName}`,
                        details: `Integração tarifária e linhas expressas entre as duas cidades, fomentando a mobilidade dos cidadãos.`,
                        amount: 15,
                        monthlyCostOrPrice: 18000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Transporte Integrado enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Integração de Transporte
                  </button>
                </div>
              </div>
            )}

            {/* 5. SEGURANÇA & PATRULHA INTEGRADA */}
            {(activeCategory === 'todos' || activeCategory === 'seguranca') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/40">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Muralha Digital & Patrulha das Divisas</h4>
                      <span className="text-[10px] text-blue-400 font-semibold">
                        Câmeras OCR de radar e rondas conjuntas da Guarda
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-300">R$ 16.000/mês</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistema de rádio integrado e cooperação nas estradas vicinais. Inibe quadrilhas de roubo
                  de carga e fortalece a defesa civil contra enchentes e temporais.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">+10% Segurança nas Fronteiras</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'security_pact',
                        title: `Pacto de Segurança das Divisas: ${cityState.cityName} & ${selectedMayor.cityName}`,
                        details: `Videomonitoramento conjunto e patrulhamento preventivo da Guarda Municipal nas rodovias de divisa.`,
                        amount: 10,
                        monthlyCostOrPrice: 16000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Segurança Integrada enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Pacto de Segurança
                  </button>
                </div>
              </div>
            )}

            {/* 6. TURISMO & CORREDOR REGIONAL */}
            {(activeCategory === 'todos' || activeCategory === 'turismo') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      <Palmtree className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Corredor Turístico & Gastronômico</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Divulgação unificada e feiras culturais conjuntas
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-300">+35% Turistas</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Roteiro turístico unificado para quem visita a região: hotéis, parques naturais e festivais
                  de rua atraem visitantes de todo o país, aumentando o ISS e o consumo local.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">Arrecadação de ISS em alta</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'tourism_corridor',
                        title: `Corredor Turístico Metropolitano: ${cityState.cityName} & ${selectedMayor.cityName}`,
                        details: `Atração de feiras, festivais e incentivo ao fluxo contínuo de visitantes entre os dois polos.`,
                        amount: 35,
                        monthlyCostOrPrice: 12000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Corredor Turístico enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Corredor de Turismo
                  </button>
                </div>
              </div>
            )}

            {/* 7. POLO INDUSTRIAL BINACIONAL */}
            {(activeCategory === 'todos' || activeCategory === 'industria') && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/40">
                      <Factory className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Polo Industrial & Isenção Cruzada</h4>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Atração conjunta de montadoras e indústrias
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">+4.500 Vagas</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Zona econômica compartilhada ao longo da rodovia interestadual com IPTU e ISS equalizados,
                  evitando guerra fiscal predatória e atraindo grandes centros de distribuição.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400">Desenvolvimento Regional</span>
                  <button
                    onClick={() => {
                      onProposeTreaty({
                        type: 'tax_incentive_hub',
                        title: `Polo Industrial Integrado: ${cityState.cityName} e ${selectedMayor.cityName}`,
                        details: `Incentivos mútuos para formação de cluster fabril e geração massiva de postos de trabalho qualificado.`,
                        amount: 4500,
                        monthlyCostOrPrice: 25000,
                        targetMayorRole: selectedMayor.role,
                        targetMayorName: selectedMayor.name,
                        targetCityName: selectedMayor.cityName,
                      });
                      triggerToast(`Proposta de Polo Industrial enviada a ${selectedMayor.name}!`);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Propor Polo Industrial
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAINEL DE TRATADOS ATIVOS E EM RATIFICAÇÃO (60S) */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Livro de Registro de Tratados Regionais ({treaties.length})
            </h3>
            <p className="text-xs text-slate-400">
              Tratados propostos passam por deliberação de 60 segundos antes da promulgação definitiva.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {pendingTreaties.length} em ratificação
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {activeTreaties.length} em vigor
            </span>
          </div>
        </div>

        {treaties.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
            <Handshake className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">Nenhum tratado bilateral proposto ainda.</p>
            <p className="text-xs text-slate-500 mt-1">
              Escolha uma das opções acima e clique em "Propor Tratado" para iniciar as negociações.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {treaties.map((treaty) => {
              const isPending = treaty.status === 'pending_ratification';
              const isActive = treaty.status === 'active';
              return (
                <div
                  key={treaty.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isPending
                      ? 'bg-amber-950/20 border-amber-600/40 shadow-sm'
                      : isActive
                      ? 'bg-emerald-950/20 border-emerald-600/40 shadow-sm'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          isPending
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : isActive
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {isPending
                          ? `Aguardando Ratificação (${treaty.ratificationSecondsRemaining}s)`
                          : isActive
                          ? 'Tratado em Vigor'
                          : 'Rejeitado / Vetado'}
                      </span>
                      <h4 className="font-bold text-sm text-white">{treaty.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300">{treaty.details}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Proponente: <strong className="text-slate-200">{treaty.fromMayorName}</strong></span>
                      {treaty.monthlyCostOrPrice > 0 && (
                        <span>Impacto: <strong className="text-amber-300">R$ {treaty.monthlyCostOrPrice.toLocaleString()}/mês</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    {isPending && (
                      <>
                        <button
                          onClick={() => {
                            sounds.playStamp();
                            onRespondTreaty(treaty.id, true);
                            triggerToast(`Tratado "${treaty.title}" sancionado com sucesso!`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm"
                        >
                          Sancionar Agora
                        </button>
                        <button
                          onClick={() => {
                            sounds.playAlert();
                            onRespondTreaty(treaty.id, false);
                            triggerToast(`Tratado vetado pelo Gabinete.`);
                          }}
                          className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm"
                        >
                          Vetar
                        </button>
                      </>
                    )}
                    {isActive && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Promulgado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LINHA DIRETA DIPLOMÁTICA / CHAT COM O PREFEITO */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            Linha Direta Diplomática (Mensagens Oficiais entre Prefeitos)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            Canal Criptografado do Consórcio
          </span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto space-y-2 text-xs">
          {chatMessages.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhuma mensagem diplomática enviada ainda.</p>
          ) : (
            chatMessages.slice(-15).map((msg) => (
              <div key={msg.id} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-0.5">
                  <strong className="text-amber-400 text-[11px]">{msg.sender}</strong>
                  <span className="text-[9px] text-slate-500">{msg.time}</span>
                </div>
                <p className="text-slate-200 text-xs">{msg.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={`Enviar telegrama oficial para o Prefeito ${selectedMayor?.name || 'vizinho'}...`}
            className="flex-1 bg-slate-950 border border-slate-700 text-xs text-white px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};
