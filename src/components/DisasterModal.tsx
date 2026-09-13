import React from 'react';
import { Disaster } from '../types';
import { sounds } from '../audio/soundManager';
import { X, Flame, CloudLightning, Wind, Sparkles, Siren, AlertOctagon } from 'lucide-react';

interface DisasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDisasters: Disaster[];
  onTriggerDisaster: (type: Disaster['type']) => void;
  onExtinguishFires: () => void;
}

export const DisasterModal: React.FC<DisasterModalProps> = ({
  isOpen,
  onClose,
  activeDisasters,
  onTriggerDisaster,
  onExtinguishFires,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-red-950/70 border-b border-red-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30 text-red-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Central de Defesa Civil & Desastres</h2>
              <p className="text-xs text-red-300">Simule eventos extremos para testar a resiliência de sua cidade</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Active Disasters Banner */}
          {activeDisasters.length > 0 ? (
            <div className="bg-red-900/30 border border-red-600/70 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Siren className="w-5 h-5 animate-pulse" />
                <span>Desastres Ativos no Momento ({activeDisasters.length})</span>
              </div>
              <div className="space-y-1">
                {activeDisasters.map((d) => (
                  <div key={d.id} className="text-xs text-slate-200 flex justify-between">
                    <span>• {d.name} em ({d.x}, {d.y})</span>
                    <span className="text-red-400 font-mono">Duração restante: {d.durationTicks - d.elapsedTicks}s</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  sounds.playSiren();
                  onExtinguishFires();
                }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Siren className="w-4 h-4" /> Despachar Esquadrão de Emergência (Apagar Fogo)
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-3.5 text-emerald-300 text-xs flex items-center gap-2">
              <span className="text-base">✅</span>
              <span>Nenhum desastre ativo no momento. A cidade está segura.</span>
            </div>
          )}

          {/* Trigger Disasters Grid */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Desencadear Desastre Manual
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fire */}
              <button
                onClick={() => {
                  sounds.playDisaster();
                  onTriggerDisaster('fire');
                  onClose();
                }}
                className="p-3.5 bg-slate-800/80 hover:bg-red-950/50 border border-slate-700 hover:border-red-600/80 rounded-xl text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                    <Flame className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Incêndio Urbano</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Fogo consome construções e se alastra pelo vento se não houver bombeiros.
                  </p>
                </div>
                <span className="text-[10px] text-red-400 font-semibold mt-3 block">Iniciar Incêndio →</span>
              </button>

              {/* Meteor */}
              <button
                onClick={() => {
                  sounds.playDisaster();
                  onTriggerDisaster('meteor');
                  onClose();
                }}
                className="p-3.5 bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700 hover:border-amber-600/80 rounded-xl text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Queda de Meteoro</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Impacto cósmico supersônico que reduz bairros inteiros a cinzas e crateras.
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-semibold mt-3 block">Lançar Meteoro →</span>
              </button>

              {/* Tornado */}
              <button
                onClick={() => {
                  sounds.playDisaster();
                  onTriggerDisaster('tornado');
                  onClose();
                }}
                className="p-3.5 bg-slate-800/80 hover:bg-blue-950/50 border border-slate-700 hover:border-blue-600/80 rounded-xl text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                    <Wind className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Tornado F5</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Redemoinho gigante que viaja pelo mapa arremessando telhados e árvores.
                  </p>
                </div>
                <span className="text-[10px] text-blue-400 font-semibold mt-3 block">Gerar Tornado →</span>
              </button>

              {/* Blackout */}
              <button
                onClick={() => {
                  sounds.playDisaster();
                  onTriggerDisaster('blackout');
                  onClose();
                }}
                className="p-3.5 bg-slate-800/80 hover:bg-purple-950/50 border border-slate-700 hover:border-purple-600/80 rounded-xl text-left transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                    <CloudLightning className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Apagão Elétrico</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sobrecarga repentina que desativa usinas e mergulha a cidade na escuridão.
                  </p>
                </div>
                <span className="text-[10px] text-purple-400 font-semibold mt-3 block">Provocar Apagão →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-800/90 border-t border-slate-700 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
