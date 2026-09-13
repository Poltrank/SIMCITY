import React from 'react';
import {
  X,
  Building,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  Briefcase,
  Flame,
  Pickaxe,
  Zap,
} from 'lucide-react';
import { DispatchOutcome } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface DispatchModalProps {
  outcome: DispatchOutcome | null;
  onClose: () => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ outcome, onClose }) => {
  if (!outcome) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Oficial do Documento */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-sm font-black">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                Palácio Municipal • Gabinete do Prefeito
              </span>
              <h3 className="text-sm md:text-base font-bold text-white leading-tight">
                Processo Administrativo Nº {outcome.id.toUpperCase()}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Documento Burocrático */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* Status Stamp */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-slate-400 block">Assunto da Deliberação:</span>
              <strong className="text-base text-white font-bold">{outcome.actionTitle}</strong>
            </div>

            <div
              className={`px-3 py-1 rounded-lg border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                outcome.success
                  ? outcome.isExceptional
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : 'bg-rose-950 text-rose-300 border-rose-500/50'
              }`}
            >
              {outcome.success ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              {outcome.isExceptional
                ? '🌟 CONQUISTA HISTÓRICA'
                : outcome.success
                ? 'HOMOLOGADO E SANCIONADO'
                : 'INDEFERIDO / REPROVADO'}
            </div>
          </div>

          {/* Manchete */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider mb-1">
              Publicação Oficial no Diário Oficial do Município
            </span>
            <h4 className="text-lg font-bold text-white mb-2 leading-snug">
              {outcome.headline}
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-serif">
              "{outcome.officialGazetteExcerpt}"
            </p>
          </div>

          {/* Relatório Técnico da Auditoria */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              Parecer Técnico dos Órgãos Competentes:
            </h5>
            <ul className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs md:text-sm">
              {outcome.detailedReport.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed text-slate-200">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Impactos no Município */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Impactos Orçamentários e Sociais Concretos:
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {outcome.impacts.treasuryChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Tesouro em Caixa</span>
                  <strong
                    className={`text-sm font-bold ${
                      outcome.impacts.treasuryChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {outcome.impacts.treasuryChange >= 0 ? '+' : ''}R${' '}
                    {outcome.impacts.treasuryChange.toLocaleString()}
                  </strong>
                </div>
              )}

              {outcome.impacts.monthlyRevenueChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Receita Mensal</span>
                  <strong
                    className={`text-sm font-bold ${
                      outcome.impacts.monthlyRevenueChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {outcome.impacts.monthlyRevenueChange >= 0 ? '+' : ''}R${' '}
                    {outcome.impacts.monthlyRevenueChange.toLocaleString()}/mês
                  </strong>
                </div>
              )}

              {outcome.impacts.jobsChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-amber-400" />
                    Novos Empregos
                  </span>
                  <strong className="text-sm font-bold text-amber-300">
                    +{outcome.impacts.jobsChange.toLocaleString()} vagas
                  </strong>
                </div>
              )}

              {outcome.impacts.oilBpdChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    Petróleo
                  </span>
                  <strong className="text-sm font-bold text-amber-400">
                    +{outcome.impacts.oilBpdChange.toLocaleString()} bpd
                  </strong>
                </div>
              )}

              {outcome.impacts.goldKgChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1">
                    <Pickaxe className="w-3 h-3 text-yellow-400" />
                    Ouro / Minério
                  </span>
                  <strong className="text-sm font-bold text-yellow-400">
                    +{outcome.impacts.goldKgChange.toLocaleString()} kg/mês
                  </strong>
                </div>
              )}

              {outcome.impacts.energyMwChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-sky-400" />
                    Energia Elétrica
                  </span>
                  <strong className="text-sm font-bold text-sky-400">
                    +{outcome.impacts.energyMwChange} MW
                  </strong>
                </div>
              )}

              {outcome.impacts.approvalChange !== undefined && (
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Aprovação Popular</span>
                  <strong
                    className={`text-sm font-bold ${
                      outcome.impacts.approvalChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {outcome.impacts.approvalChange >= 0 ? '+' : ''}
                    {outcome.impacts.approvalChange}%
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={() => {
              sounds.playStamp();
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg shadow-md transition-all active:scale-95"
          >
            Ciência e Arquivamento Oficial
          </button>
        </div>
      </div>
    </div>
  );
};
