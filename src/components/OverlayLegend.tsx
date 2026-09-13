import React from 'react';
import { ViewOverlay } from '../types';
import { X, Layers } from 'lucide-react';

interface OverlayLegendProps {
  viewOverlay: ViewOverlay;
  onClose: () => void;
}

export const OverlayLegend: React.FC<OverlayLegendProps> = ({
  viewOverlay,
  onClose,
}) => {
  if (viewOverlay === 'none') return null;

  const configs: Record<
    Exclude<ViewOverlay, 'none'>,
    { title: string; items: { color: string; label: string }[]; hint: string }
  > = {
    power: {
      title: '⚡ Rede de Energia Elétrica',
      items: [
        { color: 'bg-sky-400', label: 'Alimentado por Usinas (Conectado)' },
        { color: 'bg-red-500', label: 'Sem Eletricidade (Desconectado / Apagão)' },
      ],
      hint: 'Conecte áreas distantes usando Linhas de Alta Tensão ou Estradas.',
    },
    water: {
      title: '💧 Rede de Abastecimento de Água',
      items: [
        { color: 'bg-blue-500', label: 'Com Água Encanada (Coberto)' },
        { color: 'bg-red-500', label: 'Seco / Sem Abastecimento' },
      ],
      hint: 'Construa Caixas d\'Água ou Estações Fluviais perto do rio para aumentar o fluxo.',
    },
    pollution: {
      title: '🏭 Mapa de Poluição Ambiental',
      items: [
        { color: 'bg-purple-900', label: 'Ar Limpo / Zero Poluição' },
        { color: 'bg-purple-600', label: 'Poluição Moderada' },
        { color: 'bg-purple-400', label: 'Alta Toxicidade (Fábricas / Carvão)' },
      ],
      hint: 'Plante árvores e crie parques entre indústrias e áreas residenciais.',
    },
    landValue: {
      title: '💰 Valor dos Terrenos',
      items: [
        { color: 'bg-emerald-500', label: 'Alto Valor (Gera Arranha-céus de Luxo)' },
        { color: 'bg-amber-400', label: 'Valor Médio' },
        { color: 'bg-red-500', label: 'Baixo Valor (Risco de Abandono)' },
      ],
      hint: 'Praças, chafarizes, segurança e orla valorizam os quarteirões vizinhos.',
    },
    police: {
      title: '👮 Cobertura Policial',
      items: [
        { color: 'bg-blue-600', label: 'Patrulha Ativa (Baixo Crime)' },
        { color: 'bg-slate-800', label: 'Sem Cobertura Policial' },
      ],
      hint: 'Delegacias reduzem crimes e incentivam novos comércios.',
    },
    fire: {
      title: '🚒 Proteção Contra Incêndios',
      items: [
        { color: 'bg-red-500', label: 'Área com Risco de Incêndio' },
        { color: 'bg-emerald-600', label: 'Protegido por Bombeiros' },
      ],
      hint: 'Garanta que cada bairro tenha ao menos uma Estação de Bombeiros.',
    },
    traffic: {
      title: '🚗 Densidade de Tráfego',
      items: [
        { color: 'bg-emerald-500', label: 'Fluxo Livre' },
        { color: 'bg-red-500', label: 'Congestionamento Intenso' },
      ],
      hint: 'Crie rotas alternativas e anéis viários para evitar gargalos.',
    },
    zones: {
      title: '🗺️ Mapa de Zoneamento',
      items: [
        { color: 'bg-emerald-500', label: 'Residencial (R)' },
        { color: 'bg-blue-500', label: 'Comercial (C)' },
        { color: 'bg-amber-400', label: 'Industrial (I)' },
      ],
      hint: 'Equilibre as três zonas observando o medidor RCI no topo.',
    },
  };

  const config = configs[viewOverlay];
  if (!config) return null;

  return (
    <div
      id="overlay-legend-panel"
      className="absolute bottom-14 left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs text-slate-200 max-w-xs select-none animate-in fade-in duration-150"
    >
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>{config.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1.5 mb-2">
        {config.items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${it.color} shrink-0 border border-white/20`} />
            <span className="text-[11px] text-slate-300">{it.label}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-amber-300/90 italic bg-slate-950/40 p-1.5 rounded border border-slate-800">
        💡 {config.hint}
      </p>
    </div>
  );
};
