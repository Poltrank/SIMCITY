import React from 'react';
import { AdvisorFeedback } from '../types';
import { sounds } from '../audio/soundManager';
import { X, CheckCircle2, AlertTriangle, AlertOctagon, Lightbulb } from 'lucide-react';

interface AdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisors: AdvisorFeedback[];
}

export const AdvisorModal: React.FC<AdvisorModalProps> = ({
  isOpen,
  onClose,
  advisors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏛️</span>
            <div>
              <h2 className="text-lg font-extrabold text-white">Gabinete de Conselheiros Municipais</h2>
              <p className="text-xs text-slate-400">Relatórios de situação e pareceres técnicos de sua equipe de governo</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advisors List */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {advisors.map((adv) => {
            const isGood = adv.status === 'good';
            const isWarn = adv.status === 'warning';
            const isCrit = adv.status === 'critical';

            const cardBorder = isCrit
              ? 'border-red-600/70 bg-red-950/20'
              : isWarn
              ? 'border-amber-500/60 bg-amber-950/20'
              : 'border-slate-700/80 bg-slate-800/50';

            return (
              <div key={adv.advisor} className={`border rounded-xl p-4 transition-all ${cardBorder}`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                    {adv.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-bold text-white text-base leading-tight">{adv.name}</h3>
                        <span className="text-xs text-slate-400 capitalize">
                          {adv.advisor === 'finance'
                            ? 'Conselheiro de Finanças & Economia'
                            : adv.advisor === 'utilities'
                            ? 'Engenharia de Energia & Saneamento'
                            : adv.advisor === 'safety'
                            ? 'Segurança & Defesa Civil'
                            : 'Saúde Pública & Meio Ambiente'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isGood && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Estável
                          </span>
                        )}
                        {isWarn && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800">
                            <AlertTriangle className="w-3 h-3" /> Atenção
                          </span>
                        )}
                        {isCrit && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800">
                            <AlertOctagon className="w-3 h-3" /> Crítico
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-200 text-xs mb-2.5 mt-1 leading-relaxed">{adv.message}</p>

                    <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-300">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-400 mr-1">Recomendação:</span>
                        <span>{adv.recommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-800/90 border-t border-slate-700 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
          >
            Entendido, Prefeito
          </button>
        </div>
      </div>
    </div>
  );
};
