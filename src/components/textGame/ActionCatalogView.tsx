import React, { useState } from 'react';
import {
  Pickaxe,
  Landmark,
  Palmtree,
  Factory,
  ShieldAlert,
  Scroll,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { MunicipalActionDef, ActionCategory, PrefeitoCityState } from '../../types/textGame';
import { MUNICIPAL_ACTIONS } from '../../data/municipalActions';
import { sounds } from '../../audio/soundManager';

interface ActionCatalogViewProps {
  cityState: PrefeitoCityState;
  onDispatchAction: (actionId: string) => void;
  activeDispatchesIds: string[];
}

export const ActionCatalogView: React.FC<ActionCatalogViewProps> = ({
  cityState,
  onDispatchAction,
  activeDispatchesIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todas as Secretarias', icon: Landmark },
    { id: 'desenvolvimento_economico', label: 'Megaprojetos & Obras Caras', icon: Building2 },
    { id: 'recursos_naturais', label: 'Recursos Naturais & Energia', icon: Pickaxe },
    { id: 'bndes_financas', label: 'BNDES & Finanças Públicas', icon: Landmark },
    { id: 'turismo_cultura', label: 'Turismo, Eventos & Cultura', icon: Palmtree },
    { id: 'industria_empregos', label: 'Indústria & Empregos', icon: Factory },
    { id: 'servicos_publicos', label: 'Saúde, Educação & Segurança', icon: ShieldAlert },
    { id: 'habitacao_mobilidade', label: 'Habitação & Metrô', icon: Building2 },
    { id: 'politica_camara', label: 'Câmara & Leis Municipais', icon: Scroll },
  ];

  const filteredActions = MUNICIPAL_ACTIONS.filter((action) => {
    if (selectedCategory !== 'all' && action.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        action.title.toLowerCase().includes(q) ||
        action.shortDesc.toLowerCase().includes(q) ||
        action.badge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const checkEligibility = (action: MunicipalActionDef): { eligible: boolean; reason?: string } => {
    if (activeDispatchesIds.includes(action.id)) {
      return { eligible: false, reason: 'Já está tramitando na Mesa de Despachos (60s em andamento).' };
    }

    if (cityState.treasury < action.cost) {
      return {
        eligible: false,
        reason: `Tesouro insuficiente (Custa R$ ${action.cost.toLocaleString()}, você tem R$ ${cityState.treasury.toLocaleString()}).`,
      };
    }

    if (action.requirements.requiresOil && cityState.oilProductionBpd <= 0) {
      return {
        eligible: false,
        reason: 'Exige petróleo descoberto no município! Prospécte poços primeiro.',
      };
    }

    if (action.requirements.requiredFiscalRating) {
      if (!action.requirements.requiredFiscalRating.includes(cityState.fiscalRating)) {
        return {
          eligible: false,
          reason: `Exige Nota Fiscal CAPAG ${action.requirements.requiredFiscalRating.join(
            ' ou '
          )}. A cidade tem Nota ${cityState.fiscalRating}.`,
        };
      }
    }

    if (action.requirements.minCouncilSupport && cityState.councilSupport < action.requirements.minCouncilSupport) {
      return {
        eligible: false,
        reason: `Exige apoio de pelo menos ${action.requirements.minCouncilSupport}% dos vereadores (Você tem ${cityState.councilSupport}%).`,
      };
    }

    return { eligible: true };
  };

  return (
    <div className="space-y-6">
      {/* Header do Catálogo */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block">
              Gabinete & Secretarias Municipais
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Catálogo de Projetos, Contratos & Propostas
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Escolha as diretrizes de desenvolvimento da cidade. Cada assinatura despacha o processo para
              licitação e auditoria por <strong className="text-amber-300 font-bold">30 segundos cronometrados</strong>.
            </p>
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar ação, BNDES, ouro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Categorias / Abas das Secretarias */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-800/80 mt-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Ações Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActions.map((action) => {
          const { eligible, reason } = checkEligibility(action);
          const isCompleted = cityState.completedActionIds.includes(action.id);
          const isRunning = activeDispatchesIds.includes(action.id);

          return (
            <div
              key={action.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isRunning
                  ? 'bg-slate-900/90 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                  : eligible
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md hover:shadow-xl'
                  : 'bg-slate-900/50 border-slate-800/50 opacity-80'
              }`}
            >
              <div>
                {/* Badge e Categoria */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {action.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {action.categoryLabel}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      action.riskFactor === 'Baixo'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/40'
                        : action.riskFactor === 'Médio'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-700/40'
                        : action.riskFactor === 'Alto'
                        ? 'bg-orange-950/60 text-orange-400 border-orange-700/40'
                        : 'bg-rose-950/60 text-rose-400 border-rose-700/40'
                    }`}
                  >
                    Risco: {action.riskFactor}
                  </span>
                </div>

                {/* Título & Descrição */}
                <h3 className="text-base font-bold text-white mb-1.5 tracking-tight leading-snug">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {action.shortDesc}
                </p>

                {/* Expectativa / Retorno */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs mb-3 text-slate-300">
                  <strong className="text-amber-300 font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                    Expectativa Técnica de Retorno:
                  </strong>
                  {action.expectedOutcome}
                </div>

                {/* Fases do 1 Minuto */}
                <div className="text-[11px] text-slate-400 space-y-1 mb-4 border-t border-slate-800/80 pt-2.5">
                  <span className="font-semibold text-slate-300 block text-[10px] uppercase">
                    Etapas de Tramitação (1 Minuto / 60s):
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div className="bg-slate-800/50 px-2 py-1 rounded">
                      <span className="text-amber-400 font-bold">0-15s:</span> {action.bureaucracyPhases[0].label}
                    </div>
                    <div className="bg-slate-800/50 px-2 py-1 rounded">
                      <span className="text-amber-400 font-bold">15-30s:</span> {action.bureaucracyPhases[1].label}
                    </div>
                    <div className="bg-slate-800/50 px-2 py-1 rounded">
                      <span className="text-amber-400 font-bold">30-45s:</span> {action.bureaucracyPhases[2].label}
                    </div>
                    <div className="bg-slate-800/50 px-2 py-1 rounded">
                      <span className="text-amber-400 font-bold">45-60s:</span> {action.bureaucracyPhases[3].label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Ação & Custo */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Custo do Projeto / Contrapartida
                  </span>
                  <span className="text-base font-black text-amber-300 tabular-nums">
                    R$ {action.cost.toLocaleString()}
                  </span>
                </div>

                {isRunning ? (
                  <div className="px-4 py-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-600/50 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <Clock className="w-4 h-4" />
                    Tramitando (60s)...
                  </div>
                ) : eligible ? (
                  <button
                    onClick={() => {
                      sounds.playStamp();
                      onDispatchAction(action.id);
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 whitespace-nowrap"
                  >
                    <span>Assinar e Protocolar (30s)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-right">
                    <button
                      disabled
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-500 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed border border-slate-700/50"
                      title={reason}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Bloqueado
                    </button>
                    <span className="text-[10px] text-rose-400 block mt-1 max-w-[200px] text-right truncate">
                      {reason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
