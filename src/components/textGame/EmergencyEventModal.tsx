import React from 'react';
import {
  AlertCircle,
  Flame,
  Zap,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle2,
  Clock,
  Coins,
  TrendingUp,
  TrendingDown,
  X,
  Sparkles,
} from 'lucide-react';
import { MunicipalEmergencyEvent } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface EmergencyEventModalProps {
  event: MunicipalEmergencyEvent | null;
  treasury: number;
  onResolve: (eventId: string, optionId: string) => void;
  onClose: () => void;
}

export const EmergencyEventModal: React.FC<EmergencyEventModalProps> = ({
  event,
  treasury,
  onResolve,
  onClose,
}) => {
  if (!event) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'energia':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'bombeiros':
        return <Flame className="w-6 h-6 text-orange-400" />;
      case 'saude':
        return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'educacao':
        return <GraduationCap className="w-6 h-6 text-sky-400" />;
      case 'seguranca':
        return <Shield className="w-6 h-6 text-indigo-400" />;
      case 'economia':
        return <Briefcase className="w-6 h-6 text-emerald-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-amber-400" />;
    }
  };

  const getUrgencyBadge = (lvl: string) => {
    switch (lvl) {
      case 'critico':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-600/80 text-white animate-pulse flex items-center gap-1 border border-rose-400">
            <Flame className="w-3.5 h-3.5" />
            NÍVEL CRÍTICO
          </span>
        );
      case 'grave':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-600/80 text-white flex items-center gap-1 border border-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            NÍVEL GRAVE
          </span>
        );
      case 'oportunidade':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-600/80 text-white flex items-center gap-1 border border-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            OPORTUNIDADE ECONÔMICA
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-black bg-sky-600/80 text-white flex items-center gap-1 border border-sky-400">
            <Clock className="w-3.5 h-3.5" />
            ALERTA MUNICIPAL
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner">
              {getCategoryIcon(event.category)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {getUrgencyBadge(event.urgencyLevel)}
                <span className="text-xs text-slate-400 font-mono">
                  {event.department}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white leading-tight">
                {event.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Minimizar (a ocorrência continuará ativa no Gabinete)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-6">
          <p className="text-sm md:text-base text-slate-200 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Treasury reference */}
        <div className="flex items-center justify-between text-xs px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-5">
          <span className="text-slate-400">Saldo Disponível no Tesouro Municipal:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            R$ {treasury.toLocaleString()}
          </span>
        </div>

        {/* Action Options */}
        <div className="space-y-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Deliberação do Chefe do Executivo:
          </h3>

          {event.options.map((opt) => {
            const hasFunds = treasury >= (opt.cost || 0);

            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border transition-all ${
                  hasFunds
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-amber-500/60 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="font-bold text-sm md:text-base text-white">
                    {opt.label}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {opt.cost !== undefined && opt.cost > 0 && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        -R$ {opt.cost.toLocaleString()}
                      </span>
                    )}

                    {opt.revenueGain !== undefined && opt.revenueGain > 0 && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +R$ {opt.revenueGain.toLocaleString()}
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                        opt.approvalImpact >= 0
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {opt.approvalImpact >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {opt.approvalImpact >= 0 ? '+' : ''}
                      {opt.approvalImpact}% Popularidade
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/40">
                  <span className="text-xs text-slate-400">
                    {opt.indicatorKey && opt.indicatorDelta
                      ? `Impacto direto no índice setorial: ${opt.indicatorDelta > 0 ? '+' : ''}${opt.indicatorDelta} pts`
                      : 'Sem impacto estrutural adverso'}
                  </span>

                  <button
                    disabled={!hasFunds}
                    onClick={() => {
                      sounds.playStamp();
                      onResolve(event.id, opt.id);
                    }}
                    className={`px-4 py-2 text-xs font-black rounded-lg transition-all shadow-md flex items-center gap-1.5 ${
                      hasFunds
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-[1.02]'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {hasFunds ? 'Executar Despacho' : 'Sem Saldo no Tesouro'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Decidir mais tarde (o evento ficará aguardando no painel)
          </button>
        </div>
      </div>
    </div>
  );
};
