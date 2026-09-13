/**
 * Simulador Municipal Realista - Gestão Pública & Desenvolvimento Regional
 * Jogo em Sistema de Textos com Despachos de 1 Minuto e Multijogador
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PrefeitoCityState,
  DispatchOutcome,
} from './types/textGame';
import {
  createInitialPrefeitoState,
  startMunicipalDispatch,
  updateDispatchesClock,
  advanceMonthInSimulation,
  updateEconomicCycleTick,
  setMinimumWagePolicy,
  setPublicCompanyStatus,
  setTrafficFinePolicy,
  toggleAutoFiscalCycle,
} from './simulation/textSimulationEngine';
import { useTextMultiplayer } from './hooks/useTextMultiplayer';
import { sounds } from './audio/soundManager';

import { MayorTopBar } from './components/textGame/MayorTopBar';
import { ActiveDispatchPanel } from './components/textGame/ActiveDispatchPanel';
import { ActionCatalogView } from './components/textGame/ActionCatalogView';
import { OfficialGazetteView } from './components/textGame/OfficialGazetteView';
import { FinanceDashboardView } from './components/textGame/FinanceDashboardView';
import { RegionalMultiplayerView } from './components/textGame/RegionalMultiplayerView';
import { PublicPoliciesView } from './components/textGame/PublicPoliciesView';
import { DispatchModal } from './components/textGame/DispatchModal';

const LOCAL_STORAGE_KEY = 'prefeito_game_state_v1';

export default function App() {
  // Load saved state or create default
  const [cityState, setCityState] = useState<PrefeitoCityState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
    return createInitialPrefeitoState();
  });

  const [activeView, setActiveView] = useState<'mesa' | 'secretarias' | 'politicas' | 'gazeta' | 'financas' | 'regional'>('mesa');
  const [activeModalOutcome, setActiveModalOutcome] = useState<DispatchOutcome | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Multiplayer Hook
  const multiplayer = useTextMultiplayer(cityState);

  // Save state to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cityState));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }, [cityState]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Main clock ticker for 1-minute dispatches & 1-minute economic cycle
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCityState((prevState) => {
        // 1. Update 1-minute active dispatches
        const { state: intermediateState, newCompletedOutcomes } = updateDispatchesClock(prevState, now);

        if (newCompletedOutcomes.length > 0) {
          const first = newCompletedOutcomes[0];
          if (first.success) {
            sounds.playSuccess();
          } else {
            sounds.playAlert();
          }
          setActiveModalOutcome(first);
        }

        // 2. Update 1-minute recurring municipal economic cycle (taxes in, salaries out)
        const {
          state: finalState,
          cycleCompleted,
          notification,
        } = updateEconomicCycleTick(intermediateState, now);

        if (cycleCompleted) {
          sounds.playCash();
          if (notification) {
            showToast(notification, finalState.netMonthly >= 0 ? 'success' : 'info');
          }
        }

        return finalState;
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const handleDispatchAction = useCallback(
    (actionId: string) => {
      const result = startMunicipalDispatch(cityState, actionId);
      if (!result.success) {
        sounds.playAlert();
        showToast(result.error || 'Não foi possível iniciar.', 'error');
      } else {
        sounds.playStamp();
        setCityState(result.newState);
        showToast('Processo protocolado! Em tramitação de 1 minuto.', 'success');
        setActiveView('mesa');
      }
    },
    [cityState]
  );

  const handleAdvanceMonth = useCallback(() => {
    setCityState((prev) => {
      const next = advanceMonthInSimulation(prev);
      sounds.playCash();
      showToast(`Mês de ${next.monthName} fechado! Balanço atualizado.`, 'success');
      return next;
    });
  }, []);

  const handleSetMinimumWage = useCallback((newWage: number) => {
    setCityState((prev) => {
      const result = setMinimumWagePolicy(prev, newWage);
      showToast(result.message, 'success');
      return result.state;
    });
  }, []);

  const handleSetPublicCompany = useCallback(
    (company: 'correios' | 'saneamento' | 'transporte', status: string) => {
      setCityState((prev) => {
        const result = setPublicCompanyStatus(prev, company, status);
        sounds.playStamp();
        showToast(result.message, 'success');
        return result.state;
      });
    },
    []
  );

  const handleSetTrafficFines = useCallback((severity: 'educativa' | 'padrao' | 'rigorosa') => {
    setCityState((prev) => {
      const result = setTrafficFinePolicy(prev, severity);
      sounds.playStamp();
      showToast(result.message, 'success');
      return result.state;
    });
  }, []);

  const handleToggleAutoTick = useCallback(() => {
    setCityState((prev) => {
      const updated = toggleAutoFiscalCycle(prev);
      sounds.playClick();
      showToast(
        updated.economicCycle.autoTick
          ? 'Ciclo fiscal automático de 1 minuto reativado.'
          : 'Ciclo fiscal automático pausado.',
        'info'
      );
      return updated;
    });
  }, []);

  const toggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const pendingCount = cityState.activeDispatches.filter((d) => !d.completed).length;
  const activeDispatchesIds = cityState.activeDispatches
    .filter((d) => !d.completed)
    .map((d) => d.actionId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Barra de Navegação Superior e Métricas do Município */}
      <MayorTopBar
        state={cityState}
        activeView={activeView}
        setActiveView={setActiveView}
        isMuted={isMuted}
        toggleMute={toggleMute}
        isMultiplayerConnected={multiplayer.isConnected}
        pendingDispatchesCount={pendingCount}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeView === 'mesa' && (
          <ActiveDispatchPanel
            dispatches={cityState.activeDispatches}
            recentOutcomes={cityState.recentOutcomes}
            onOpenActionCatalog={() => setActiveView('secretarias')}
            onViewOutcome={(outcome) => setActiveModalOutcome(outcome)}
          />
        )}

        {activeView === 'secretarias' && (
          <ActionCatalogView
            cityState={cityState}
            onDispatchAction={handleDispatchAction}
            activeDispatchesIds={activeDispatchesIds}
          />
        )}

        {activeView === 'politicas' && (
          <PublicPoliciesView
            cityState={cityState}
            onSetMinimumWage={handleSetMinimumWage}
            onSetPublicCompany={handleSetPublicCompany}
            onSetTrafficFines={handleSetTrafficFines}
          />
        )}

        {activeView === 'gazeta' && (
          <OfficialGazetteView
            articles={cityState.gazetteFeed}
            cityState={cityState}
            onAdvanceMonth={handleAdvanceMonth}
          />
        )}

        {activeView === 'financas' && (
          <FinanceDashboardView
            cityState={cityState}
            onAdvanceMonth={handleAdvanceMonth}
            onToggleAutoTick={handleToggleAutoTick}
            onOpenPolicies={() => setActiveView('politicas')}
          />
        )}

        {activeView === 'regional' && (
          <RegionalMultiplayerView
            cityState={cityState}
            roomId={multiplayer.roomId}
            isConnected={multiplayer.isConnected}
            myRole={multiplayer.myRole}
            otherMayors={multiplayer.otherMayors}
            treaties={multiplayer.treaties}
            chatMessages={multiplayer.chatMessages}
            onConnectRoom={multiplayer.connectToRoom}
            onProposeTreaty={multiplayer.proposeTreaty}
            onRespondTreaty={multiplayer.respondToTreaty}
            onSendMessage={multiplayer.sendChatMessage}
          />
        )}
      </main>

      {/* Toast Notification Flutuante */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 ${
              toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-600'
                : toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-600'
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}
          >
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Modal de Despacho Concluído */}
      <DispatchModal
        outcome={activeModalOutcome}
        onClose={() => setActiveModalOutcome(null)}
      />
    </div>
  );
}
