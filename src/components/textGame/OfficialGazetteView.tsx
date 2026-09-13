import React from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  AlertTriangle,
  Award,
  Scroll,
  ArrowRight,
  TrendingUp,
  Building,
} from 'lucide-react';
import { GazetteArticle, PrefeitoCityState } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface OfficialGazetteViewProps {
  articles: GazetteArticle[];
  cityState: PrefeitoCityState;
  onAdvanceMonth: () => void;
}

export const OfficialGazetteView: React.FC<OfficialGazetteViewProps> = ({
  articles,
  cityState,
  onAdvanceMonth,
}) => {
  return (
    <div className="space-y-6">
      {/* Header do Diário Oficial */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Scroll className="w-4 h-4" />
            Imprensa Oficial & Comunicação Social
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Diário Oficial do Município & Notícias Locais
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Acompanhe a repercussão pública de cada decreto, os editoriais da imprensa e os atos
            homologados pelo Gabinete do Prefeito.
          </p>
        </div>

        {/* Botão de Fechamento do Mês / Virada de Mandato */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Próximo Fechamento
            </span>
            <span className="text-sm font-bold text-slate-200">
              Balanço de {cityState.monthName}
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playCash();
              onAdvanceMonth();
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Avançar Mês</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lista de Publicações e Atos */}
      <div className="space-y-3">
        {articles.map((article) => {
          const isDecreto = article.type === 'decreto';
          const isCelebracao = article.type === 'celebracao';
          const isAlerta = article.type === 'alerta';

          return (
            <article
              key={article.id}
              className={`p-5 rounded-xl border transition-all ${
                isCelebracao
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-md'
                  : isAlerta
                  ? 'bg-slate-900/90 border-rose-500/40'
                  : isDecreto
                  ? 'bg-slate-900 border-sky-600/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isCelebracao
                        ? 'bg-amber-400 text-slate-950'
                        : isAlerta
                        ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                        : isDecreto
                        ? 'bg-sky-950 text-sky-300 border border-sky-600/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {article.source}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Edição Oficial • {article.dateStr}
                  </span>
                </div>
              </div>

              <h3 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-serif mb-3">
                {article.body}
              </p>

              {article.impactSummary && (
                <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800 text-xs text-amber-300 font-medium flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>{article.impactSummary}</span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
