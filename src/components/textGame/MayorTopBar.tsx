import React from 'react';
import {
  Landmark,
  Calendar,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Zap,
  Flame,
  Pickaxe,
  Palmtree,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  BarChart3,
  Layers,
  Building2,
  Sliders,
  Clock,
} from 'lucide-react';
import { PrefeitoCityState } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface MayorTopBarProps {
  state: PrefeitoCityState;
  activeView: 'mesa' | 'secretarias' | 'politicas' | 'gazeta' | 'financas' | 'regional';
  setActiveView: (view: 'mesa' | 'secretarias' | 'politicas' | 'gazeta' | 'financas' | 'regional') => void;
  isMuted: boolean;
  toggleMute: () => void;
  isMultiplayerConnected: boolean;
  pendingDispatchesCount: number;
}

export const MayorTopBar: React.FC<MayorTopBarProps> = ({
  state,
  activeView,
  setActiveView,
  isMuted,
  toggleMute,
  isMultiplayerConnected,
  pendingDispatchesCount,
}) => {
  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'A':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
      case 'B':
        return 'bg-blue-950/80 text-blue-400 border-blue-500/50';
      case 'C':
        return 'bg-amber-950/80 text-amber-400 border-amber-500/50';
      default:
        return 'bg-rose-950/80 text-rose-400 border-rose-500/50';
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      {/* Prime Row: Identidade do Município & Finanças Rápidas */}
      <div className="px-4 py-2.5 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brasão & Cidade */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md border border-amber-500/40 text-white flex-shrink-0">
            <Building2 className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
                {state.cityName}
              </h1>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getRatingBadge(
                  state.fiscalRating
                )}`}
                title="Capacidade de Pagamento (CAPAG) da Secretaria do Tesouro Nacional"
              >
                CAPAG {state.fiscalRating}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="text-amber-300 font-medium">{state.mayorName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 truncate max-w-[180px] md:max-w-none">{state.party}</span>
            </p>
          </div>
        </div>

        {/* Data & Mandato */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Calendar className="w-4 h-4 text-sky-400" />
          <div>
            <span className="font-semibold text-slate-200">
              {state.monthName} / {state.year}
            </span>
            <span className="text-[11px] text-slate-400 block">Mês {state.termMonth} de 48 do Mandato</span>
          </div>
        </div>

        {/* Tesouro Municipal & Superávit */}
        <div className="flex items-center gap-4 bg-slate-950/70 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Tesouro em Caixa
            </span>
            <span className="text-base md:text-lg font-black text-emerald-400 tabular-nums">
              R$ {state.treasury.toLocaleString()}
            </span>
          </div>
          <div className="hidden sm:block border-l border-slate-800 pl-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Balanço Mensal
            </span>
            <span
              className={`text-xs md:text-sm font-bold tabular-nums ${
                state.netMonthly >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {state.netMonthly >= 0 ? '+' : ''}R$ {state.netMonthly.toLocaleString()}/min
            </span>
          </div>

          {/* Badge do Ciclo de 1 Minuto */}
          {state.economicCycle && (
            <div
              className="border-l border-slate-800 pl-3 flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setActiveView('financas');
                sounds.playClick();
              }}
              title="Ciclo de arrecadação do povo e pagamentos da folha (ocorre a cada 1 minuto)"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Ciclo Fiscal</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {state.economicCycle.secondsRemaining}s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Áudio & Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleMute();
              sounds.playClick();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </div>

      {/* Second Row: Recursos Estratégicos & Índices da População */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          {/* População e Emprego */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-200" title="População Total">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <strong className="font-semibold tabular-nums">{state.population.toLocaleString()}</strong> hab.
            </span>
            <span className="flex items-center gap-1" title="Taxa de Desemprego">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              Desemprego: <strong className="text-slate-100 font-semibold">{state.unemploymentRate}%</strong>
            </span>
            <span className="flex items-center gap-1" title="Aprovação nas Pesquisas">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Aprovação: <strong className="text-emerald-400 font-semibold">{state.approvalRating}%</strong>
            </span>
            <span className="hidden md:flex items-center gap-1" title="Apoio na Câmara de Vereadores">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Câmara:{' '}
              <strong className={state.councilSupport >= 50 ? 'text-indigo-300' : 'text-rose-400'}>
                {state.councilSupport}%
              </strong>
            </span>
          </div>

          {/* Recursos Estratégicos Naturais */}
          <div className="flex items-center gap-3">
            {/* Petróleo */}
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] ${
                state.oilProductionBpd > 0
                  ? 'bg-amber-950/70 border-amber-600/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Produção de Petróleo e Royalties"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {state.oilProductionBpd > 0 ? (
                <>
                  <strong className="font-bold">{state.oilProductionBpd.toLocaleString()}</strong> bpd (+R${' '}
                  {state.oilRoyaltiesMonthly.toLocaleString()}/m)
                </>
              ) : (
                'Sem Petróleo'
              )}
            </span>

            {/* Ouro */}
            <span
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] ${
                state.goldProductionKg > 0
                  ? 'bg-yellow-950/70 border-yellow-500/50 text-yellow-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Produção Mineral de Ouro e Terras Raras"
            >
              <Pickaxe className="w-3.5 h-3.5 text-yellow-400" />
              {state.goldProductionKg > 0 ? (
                <>
                  <strong className="font-bold">{state.goldProductionKg}</strong> kg/mês
                </>
              ) : (
                'Sem Mineração'
              )}
            </span>

            {/* Energia */}
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded border bg-sky-950/70 border-sky-600/40 text-sky-300 text-[11px]"
              title="Geração e Excedente de Energia Elétrica"
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              {state.energyProductionMw} MW (Sobrando: <strong>+{state.energySurplusMw} MW</strong>)
            </span>

            {/* Turistas */}
            <span
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded border bg-emerald-950/60 border-emerald-600/40 text-emerald-300 text-[11px]"
              title="Turistas atraídos por mês"
            >
              <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
              {state.touristsPerMonth.toLocaleString()} turistas/mês
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Módulos do Simulador */}
      <nav className="bg-slate-900 px-4 flex items-center gap-1 overflow-x-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-1 py-1">
          <button
            onClick={() => {
              setActiveView('mesa');
              sounds.playClick();
            }}
            className={`px-3 py-2 rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'mesa'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Mesa de Despachos
            {pendingDispatchesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-rose-600 text-white animate-pulse">
                {pendingDispatchesCount} em andamento (1 min)
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveView('secretarias');
              sounds.playClick();
            }}
            className={`px-3 py-2 rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'secretarias'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Secretarias & Contratos
          </button>

          <button
            onClick={() => {
              setActiveView('politicas');
              sounds.playClick();
            }}
            className={`px-3 py-2 rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'politicas'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Políticas & Estatais
          </button>

          <button
            onClick={() => {
              setActiveView('gazeta');
              sounds.playClick();
            }}
            className={`px-3 py-2 rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'gazeta'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Diário Oficial & Notícias
          </button>

          <button
            onClick={() => {
              setActiveView('financas');
              sounds.playClick();
            }}
            className={`px-3 py-2 rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'financas'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Lei de Responsabilidade (LRF)
          </button>

          <button
            onClick={() => {
              setActiveView('regional');
              sounds.playClick();
            }}
            className={`px-3 py-2 rounded-md text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ml-auto ${
              activeView === 'regional'
                ? 'bg-sky-500 text-slate-950 shadow-md font-bold'
                : 'text-sky-400 bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/60'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
            Multijogador Regional
            {isMultiplayerConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
