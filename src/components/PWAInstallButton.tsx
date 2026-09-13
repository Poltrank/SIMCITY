import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, X } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    sounds.playClick();
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        id="btn-pwa-install"
        onClick={handleInstallClick}
        title="Instalar SimCity no celular Android"
        className={`flex items-center gap-1 font-semibold transition-all ${
          compact
            ? 'px-2 py-1 text-[11px] rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white shadow'
            : 'px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
        <span className="hidden xs:inline sm:inline">{isAndroid ? 'Instalar App' : 'Instalar'}</span>
      </button>

      {showGuide && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGuide(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Smartphone className="w-5 h-5" />
                <span>Instalar no Celular</span>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {isIOS ? (
                <>
                  <p className="font-medium text-white">Para instalar no iPhone / iPad:</p>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                    <li>
                      Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta) no Safari.
                    </li>
                    <li>
                      Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.
                    </li>
                    <li>Toque em <strong>Adicionar</strong> no topo direito.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-medium text-white">Para instalar no Android:</p>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                    <li>
                      Toque no menu de opções do navegador (três pontinhos <strong className="text-white">⋮</strong> no topo direito).
                    </li>
                    <li>
                      Selecione <strong className="text-emerald-400">"Instalar aplicativo"</strong> ou <strong className="text-emerald-400">"Adicionar à tela inicial"</strong>.
                    </li>
                    <li>
                      O jogo rodará em tela cheia como um app nativo, mesmo sem internet!
                    </li>
                  </ol>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition-colors shadow-lg"
            >
              Entendido, Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
