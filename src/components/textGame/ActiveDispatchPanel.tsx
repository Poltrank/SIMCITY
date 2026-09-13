import React from 'react';
import {
  Clock,
  CheckCircle2,
  Building,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  FileSearch,
} from 'lucide-react';
import { ActiveDispatch, DispatchOutcome } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface ActiveDispatchPanelProps {
  dispatches: ActiveDispatch[];
  recentOutcomes: DispatchOutcome[];
  onOpenActionCatalog: () => void;
  onViewOutcome: (outcome: DispatchOutcome) => void;
}

export const ActiveDispatchPanel: React.FC<ActiveDispatchPanelProps> = ({
  dispatches,
  recentOutcomes,
  onOpenActionCatalog,
  onViewOutcome,
}) => {
  const activeList = dispatches.filter((d) => !d.completed);
  const completedList = dispatches.filter((d) => d.completed).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Banner da Mesa de Despachos */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              Gabinete do Prefeito • Mesa Diretora de Processos
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              Despachos em Tramitação Oficial
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Na administração pública real, todo contrato, pedido de verba ao BNDES ou prospecção mineral
              passa por auditoria, câmara e licitação. Cada ação leva{' '}
              <strong className="text-amber-300 font-bold">1 minuto (60 segundos)</strong> para ser protocolada e
              homologada pelo corpo técnico.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenActionCatalog();
            }}
            className="self-start md:self-center px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 whitespace-nowrap"
          >
            <FolderOpen className="w-4 h-4" />
            Nova Ação / Proposta
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lista de Processos em Andamento (Contador de 1 minuto) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            Processos em Tramitação Ativa ({activeList.length})
          </h3>
          <span className="text-xs text-slate-400">Tempo oficial: 60s por processo</span>
        </div>

        {activeList.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileSearch className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-200">Mesa de Despachos Livre</h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-4">
              Nenhum processo tramitando no momento. Abra o catálogo de Secretarias para prospectar ouro, perfurar
              petróleo, solicitar R$ 15M ao BNDES ou criar o Carnaval da cidade.
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenActionCatalog();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-lg border border-slate-700 inline-flex items-center gap-2 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Abrir Secretarias & Contratos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeList.map((dispatch) => {
              const pct = Math.round(dispatch.progress * 100);
              return (
                <div
                  key={dispatch.id}
                  className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-4 shadow-lg relative overflow-hidden"
                >
                  {/* Subtle progress glow in background */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-amber-500/5 transition-all duration-300 pointer-events-none"
                    style={{ width: `${pct}%` }}
                  />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/40">
                          {dispatch.badge}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {dispatch.currentDepartment}
                        </span>
                      </div>
                      <h4 className="text-base md:text-lg font-bold text-white tracking-tight">
                        {dispatch.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] uppercase font-bold text-slate-400 block">
                          Contador Oficial
                        </span>
                        <div className="text-xl md:text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5 justify-end">
                          <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                          {dispatch.secondsRemaining}s
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso com Live Ticks */}
                  <div className="space-y-1.5 relative z-10">
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                      <div
                        className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_#f59e0b]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5 truncate max-w-[80%]">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <strong className="text-amber-200">Fase Atual:</strong> {dispatch.currentPhaseText}
                      </span>
                      <span className="font-bold text-slate-400 font-mono">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico Recente de Despachos Concluídos */}
      {recentOutcomes.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Últimas Deliberações & Decretos Publicados ({recentOutcomes.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentOutcomes.map((outcome) => (
              <div
                key={outcome.id}
                onClick={() => {
                  sounds.playStamp();
                  onViewOutcome(outcome);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg ${
                  outcome.success
                    ? outcome.isExceptional
                      ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50'
                      : 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60'
                    : 'bg-slate-900/90 border-rose-500/30 hover:border-rose-500/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {outcome.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        outcome.success
                          ? outcome.isExceptional
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-600/40'
                      }`}
                    >
                      {outcome.isExceptional ? '🌟 Histórico' : outcome.success ? 'Aprovado' : 'Vetado/Pendência'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {new Date(outcome.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-bold text-sm md:text-base text-white line-clamp-2 mb-1.5">
                  {outcome.headline}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {outcome.officialGazetteExcerpt}
                </p>

                <div className="text-xs text-amber-300 font-semibold flex items-center justify-between border-t border-slate-800 pt-2">
                  <span>Clique para ler despacho completo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
