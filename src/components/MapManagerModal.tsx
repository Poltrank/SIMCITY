import React, { useState } from 'react';
import { Tile, CityStats, CityBudget, CityDate } from '../types';
import { sounds } from '../audio/soundManager';
import {
  X,
  FolderDown,
  Upload,
  Download,
  PlusCircle,
  Building,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface MapManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewCity: (difficulty: 'easy' | 'normal' | 'hard') => void;
  onLoadStarterCity: () => void;
  onSaveGame: () => void;
  onLoadGame: () => boolean;
  hasSavedGame: boolean;
  onExportCity: () => void;
  onImportCity: (jsonString: string) => boolean;
}

export const MapManagerModal: React.FC<MapManagerModalProps> = ({
  isOpen,
  onClose,
  onNewCity,
  onLoadStarterCity,
  onSaveGame,
  onLoadGame,
  hasSavedGame,
  onExportCity,
  onImportCity,
}) => {
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playCash();
    onSaveGame();
    setSaveSuccessMsg('Cidade salva com sucesso no navegador!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLoad = () => {
    const ok = onLoadGame();
    if (ok) {
      sounds.playClick();
      setSaveSuccessMsg('Cidade carregada com sucesso!');
      setTimeout(() => {
        setSaveSuccessMsg(null);
        onClose();
      }, 1000);
    }
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = onImportCity(importText.trim());
    if (ok) {
      sounds.playClick();
      setSaveSuccessMsg('Cidade importada e carregada com sucesso!');
      setTimeout(() => {
        setSaveSuccessMsg(null);
        onClose();
      }, 1000);
    } else {
      sounds.playError();
      alert('Arquivo JSON de cidade inválido ou corrompido.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Gerenciador de Cidades & Gravação</h2>
              <p className="text-xs text-slate-400">Inicie uma nova metrópole, carregue cenários ou exporte seu progresso</p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Quick Actions (Save & Load) */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Salvar & Carregar no Navegador
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                className="p-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/70 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <Download className="w-4 h-4" />
                  <span>Salvar Cidade Atual</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Armazena com segurança seu mapa, tesouro e zonas no LocalStorage do navegador.
                </p>
              </button>

              <button
                onClick={handleLoad}
                disabled={!hasSavedGame}
                className={`p-3.5 border rounded-xl text-left transition-all ${
                  hasSavedGame
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 hover:border-blue-500/70 text-blue-400'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Upload className="w-4 h-4" />
                  <span>Carregar Cidade Salva</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {hasSavedGame ? 'Recupera a última gravação persistida.' : 'Nenhuma gravação encontrada no navegador.'}
                </p>
              </button>
            </div>
          </div>

          {/* Starter City & New Maps */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Novas Cidades e Cenários
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Starter City */}
              <button
                onClick={() => {
                  sounds.playCash();
                  onLoadStarterCity();
                  onClose();
                }}
                className="p-3.5 bg-gradient-to-br from-slate-800 to-slate-850 hover:to-slate-800 border border-slate-700 hover:border-amber-500/80 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <Building className="w-4 h-4" />
                  <span>Cenário: Metrópole em Crescimento</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Uma cidade semi-pronta com bairros, estradas conectadas, turbinas eólicas e serviços ativos para você expandir!
                </p>
              </button>

              {/* New Blank City */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <PlusCircle className="w-4 h-4" />
                  <span>Nova Cidade do Zero</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Gera um relevo natural virgem com rio serpenteante, praias e florestas.
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {(['easy', 'normal', 'hard'] as const).map((dif) => (
                    <button
                      key={dif}
                      onClick={() => setDifficulty(dif)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        difficulty === dif
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {dif === 'easy' ? 'Fácil ($35k)' : dif === 'normal' ? 'Normal ($20k)' : 'Difícil ($10k)'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    sounds.playBuild();
                    onNewCity(difficulty);
                    onClose();
                  }}
                  className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Gerar Novo Mapa
                </button>
              </div>
            </div>
          </div>

          {/* Export / Import JSON */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Compartilhar e Backup (JSON)</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onExportCity();
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Baixar Arquivo .json
                </button>
                <button
                  onClick={() => setShowImportBox(!showImportBox)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 ml-3"
                >
                  <Upload className="w-3.5 h-3.5" /> Colar JSON
                </button>
              </div>
            </div>

            {showImportBox && (
              <div className="space-y-2 pt-2">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Cole aqui o conteúdo JSON de uma cidade exportada..."
                  className="w-full h-20 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={handleImport}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Confirmar Importação
                </button>
              </div>
            )}
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
