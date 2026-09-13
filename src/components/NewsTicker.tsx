import React, { useState, useEffect } from 'react';
import { Newspaper, Bell } from 'lucide-react';

interface NewsTickerProps {
  newsList: string[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ newsList }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (newsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % newsList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [newsList.length]);

  const currentNews = newsList[currentIdx] || 'Bem-vindo ao Construtor de Cidades! Planeje zonas, estradas e serviços.';

  return (
    <div
      id="simcity-news-ticker"
      className="w-full bg-slate-950/95 border-t border-slate-800 text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs select-none z-20 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 overflow-hidden w-full">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider shrink-0 text-[10px]">
          <Newspaper className="w-3 h-3" />
          <span>Notícias da Metrópole</span>
        </div>

        <div className="overflow-hidden whitespace-nowrap text-ellipsis flex-1">
          <span
            key={currentIdx}
            className="inline-block animate-in fade-in slide-in-from-bottom-1 duration-300 font-medium text-slate-200"
          >
            {currentNews}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 shrink-0 ml-4">
        <span>SimCity Web Engine</span>
        <span>•</span>
        <span>v1.0</span>
      </div>
    </div>
  );
};
