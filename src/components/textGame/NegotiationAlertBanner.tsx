import React from 'react';
import {
  Handshake,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  X,
  Radio,
} from 'lucide-react';
import { NegotiationNotification } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface NegotiationAlertBannerProps {
  notification: NegotiationNotification | null;
  onDismiss: () => void;
  onOpenRegionalView: () => void;
}

export const NegotiationAlertBanner: React.FC<NegotiationAlertBannerProps> = ({
  notification,
  onDismiss,
  onOpenRegionalView,
}) => {
  if (!notification) return null;

  const isTreatyProposed = notification.type === 'treaty_proposed';
  const isTreatyRatified = notification.type === 'treaty_ratified';
  const isTreatyRejected = notification.type === 'treaty_rejected';
  const isAid = notification.type === 'aid_received';

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-bounce-short">
      <div
        className={`p-4 rounded-2xl shadow-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md ${
          isTreatyProposed
            ? 'bg-amber-950/95 border-amber-400 text-amber-100 shadow-amber-900/40'
            : isTreatyRatified
            ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100 shadow-emerald-900/40'
            : isAid
            ? 'bg-sky-950/95 border-sky-400 text-sky-100 shadow-sky-900/40'
            : 'bg-rose-950/95 border-rose-400 text-rose-100 shadow-rose-900/40'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold shadow-md ${
              isTreatyProposed
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : isTreatyRatified
                ? 'bg-emerald-500 text-slate-950'
                : isAid
                ? 'bg-sky-500 text-slate-950'
                : 'bg-rose-500 text-white'
            }`}
          >
            {isTreatyProposed && <Handshake className="w-5 h-5" />}
            {isTreatyRatified && <CheckCircle2 className="w-5 h-5" />}
            {isAid && <DollarSign className="w-5 h-5" />}
            {isTreatyRejected && <AlertTriangle className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
                {isTreatyProposed && '🚨 Proposta de Negociação Regional'}
                {isTreatyRatified && '📜 Tratado Bilateral Aprovado!'}
                {isTreatyRejected && '❌ Tratado Arquivado'}
                {isAid && '🤝 Socorro Bilateral Recebido!'}
              </span>
              <span className="text-[11px] opacity-80 flex items-center gap-1 font-mono">
                <Radio className="w-3 h-3 animate-ping" />
                Em Tempo Real
              </span>
            </div>

            <h4 className="text-sm md:text-base font-black text-white leading-tight">
              {notification.title}
            </h4>

            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              <strong className="text-amber-300">{notification.senderMayor}</strong> ({notification.senderCity}):{' '}
              {notification.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenRegionalView();
              onDismiss();
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
          >
            Abrir Negociação
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onDismiss();
            }}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-black/20 transition-colors"
            title="Dispensar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
