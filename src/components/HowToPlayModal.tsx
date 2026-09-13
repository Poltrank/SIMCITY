import React from 'react';
import { X, BookOpen, Route, Home, Zap, Droplet, Smile, Compass } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Manual do Prefeito: Como Jogar</h2>
              <p className="text-xs text-slate-400">Guia prático para construir uma metrópole próspera</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Route className="w-4 h-4" />
                <span>1. Malha Viária (Estradas)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Toda construção precisa estar ao lado de uma estrada para os cidadãos e mercadorias circularem. Clique e arraste para traçar ruas.
              </p>
            </div>

            <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Home className="w-4 h-4" />
                <span>2. Zoneamento RCI</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Zoneie terrenos: <strong>Verde</strong> (Residencial), <strong>Azul</strong> (Comércio) e <strong>Amarelo</strong> (Indústria). Eles constroem e evoluem sozinhos!
              </p>
            </div>

            <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>3. Rede Elétrica & Água</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Sem luz ou água, prédios são abandonados! Construa Usinas (Eólicas, Carvão ou Solar) e Caixas d'Água para abastecer sua população.
              </p>
            </div>

            <div className="p-3 bg-slate-800/50 border border-slate-700/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-pink-400 font-bold">
                <Smile className="w-4 h-4" />
                <span>4. Serviços & Lazer</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Delegacias reduzem crimes, Bombeiros evitam incêndios, Hospitais curam doentes e Parques elevam o valor da terra para gerar arranha-céus!
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Controles da Câmera & Mouse</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li><strong>Arrastar para construir:</strong> selecione estradas ou zonas e arraste para desenhar quarteirões inteiros.</li>
              <li><strong>Mover a câmera:</strong> clique com o botão direito, ou use a ferramenta Navegar (ou arraste em espaço vazio).</li>
              <li><strong>Zoom:</strong> use a roda de rolagem do mouse ou os botões <strong>+ / −</strong> no canto inferior direito.</li>
              <li><strong>Consulta:</strong> clique no ícone do ponteiro (ou botão de consulta) e clique em qualquer prédio para ver detalhes.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-800/90 border-t border-slate-700 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md"
          >
            Vamos Construir!
          </button>
        </div>
      </div>
    </div>
  );
};
