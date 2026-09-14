/**
 * Simulador Municipal Realista - Gestão Pública & Desenvolvimento Regional
 * Jogo em Sistema de Textos com Despachos de 1 Minuto e Multijogador
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PrefeitoCityState,
  DispatchOutcome,
  IntermunicipalLoan,
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
  setDepartmentBudgetPolicy,
  setTaxRatesPolicy,
  grantIntermunicipalLoan,
  acceptIntermunicipalLoan,
  rejectIntermunicipalLoan,
  triggerManualEmergency,
  resolveEmergencyEvent,
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
import { EconomicRankingView } from './components/textGame/EconomicRankingView';
import { IntermunicipalLoansModal } from './components/textGame/IntermunicipalLoansModal';
import { EmergencyEventModal } from './components/textGame/EmergencyEventModal';
import { NegotiationAlertBanner } from './components/textGame/NegotiationAlertBanner';
import { MayorAuthModal } from './components/textGame/MayorAuthModal';
import { MayorNegotiationsView } from './components/textGame/MayorNegotiationsView';

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

  const [activeView, setActiveView] = useState<'mesa' | 'secretarias' | 'politicas' | 'gazeta' | 'financas' | 'regional' | 'ranking' | 'negociar'>('mesa');
  const [activeModalOutcome, setActiveModalOutcome] = useState<DispatchOutcome | null>(null);
  const [isLoansModalOpen, setIsLoansModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hasIdentified = localStorage.getItem('prefeito_identified_mayor_v1');
      return !hasIdentified;
    }
    return false;
  });
  const [isSavingOnline, setIsSavingOnline] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.isMuted);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleSelectMayorProfile = (newState: PrefeitoCityState, _profileId: string) => {
    setCityState(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('prefeito_identified_mayor_v1', 'true');
    }
    showToast(`Gabinete empossado: Prefeito ${newState.mayorName} (${newState.party})`, 'success');
  };

  // Multiplayer Hook with Loan events
  const multiplayer = useTextMultiplayer(cityState, {
    onLoanProposed: (loan) => {
      // If a loan is proposed to us, sync it into local state as pending
      setCityState((prev) => {
        const existing = prev.intermunicipalLoans || [];
        if (existing.some((l) => l.id === loan.id)) return prev;
        return {
          ...prev,
          intermunicipalLoans: [loan, ...existing],
        };
      });
      sounds.playAlert();
    },
    onLoanResponded: (loanId, accepted) => {
      setCityState((prev) => {
        const existing = prev.intermunicipalLoans || [];
        const updated = existing.map((l) => {
          if (l.id === loanId) {
            return {
              ...l,
              status: accepted ? ('active' as const) : ('rejected' as const),
            };
          }
          return l;
        });
        return {
          ...prev,
          intermunicipalLoans: updated,
        };
      });
      if (accepted) {
        sounds.playCash();
      } else {
        sounds.playAlert();
      }
    },
  });

  // Online auto-save function
  const saveStateOnline = useCallback(async (stateToSave: PrefeitoCityState) => {
    setIsSavingOnline(true);
    try {
      const cleanKey = stateToSave.cityName ? stateToSave.cityName.trim().toLowerCase() : 'default_city';
      await fetch('/api/game/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cleanKey, state: stateToSave }),
      });
    } catch (e) {
      console.error('Online auto-save error:', e);
    } finally {
      setIsSavingOnline(false);
    }
  }, []);

  // Save state to local storage on changes and debounce online save
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cityState));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }

    const timer = setTimeout(() => {
      saveStateOnline(cityState);
    }, 1500);

    return () => clearTimeout(timer);
  }, [cityState, saveStateOnline]);

  // Try to load any previously saved state from online server on first mount
  useEffect(() => {
    const fetchOnlineSavedState = async () => {
      try {
        const cleanKey = cityState.cityName ? encodeURIComponent(cityState.cityName.trim().toLowerCase()) : 'default_city';
        const res = await fetch(`/api/game/load/${cleanKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.state) {
            console.log('Online save state verified for city:', data.cityName || data.state?.cityName);
          }
        }
      } catch (e) {
        console.warn('Online save fetch checked (fallback to local state):', e);
      }
    };
    fetchOnlineSavedState();
  }, []);

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

      // If an emergency event was generated, open the emergency modal immediately!
      if (next.activeEmergencyEvent) {
        setIsEmergencyModalOpen(true);
        sounds.playAlert();
      }

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

  // Department Budget Adjustment
  const handleUpdateDepartmentBudget = useCallback(
    (
      dept: any,
      amount: number,
      focus: string
    ) => {
      setCityState((prev) => {
        const result = setDepartmentBudgetPolicy(prev, dept, amount, focus);
        sounds.playStamp();
        showToast(result.message || 'Orçamento da secretaria atualizado pelo Chefe do Executivo.', 'success');
        return result.state;
      });
    },
    []
  );

  // Tax Rates Adjustment
  const handleUpdateTaxRates = useCallback(
    (rates: {
      iptuPobresPercent?: number;
      iptuMediosPercent?: number;
      iptuRicosPercent?: number;
      iptuPercent: number;
      issPercent: number;
      itbiPercent: number;
      taxaIluminacaoCip: number;
    }) => {
      setCityState((prev) => {
        const result = setTaxRatesPolicy(prev, rates);
        sounds.playStamp();
        showToast(result.message || 'Código tributário municipal republicado no Diário Oficial!', 'success');
        return result.state;
      });
    },
    []
  );

  // Manual Trigger of Emergency Event
  const handleTriggerManualEmergency = useCallback(() => {
    setCityState((prev) => {
      const updated = triggerManualEmergency(prev);
      setIsEmergencyModalOpen(true);
      sounds.playAlert();
      showToast('🚨 OCORRÊNCIA EMERGENCIAL! O Gabinete de Crise foi acionado.', 'error');
      return updated;
    });
  }, []);

  // Resolve Emergency Event
  const handleResolveEmergency = useCallback((eventId: string, optionId: string) => {
    setCityState((prev) => {
      const { state: updated, feedback } = resolveEmergencyEvent(prev, eventId, optionId);
      setIsEmergencyModalOpen(false);
      showToast(feedback, 'success');
      return updated;
    });
  }, []);

  // Propose Intermunicipal Loan
  const handleProposeLoan = useCallback(
    (loanData: {
      borrowerMayor: string;
      borrowerCity: string;
      principal: number;
      interestRateMonthly: number;
      totalInstallments: number;
      purpose: string;
    }) => {
      setCityState((prev) => {
        const { state: updated, loan } = grantIntermunicipalLoan(prev, loanData);
        multiplayer.proposeLoan(loan);
        showToast(`Empréstimo de R$ ${loanData.principal.toLocaleString()} concedido à cidade parceira!`, 'success');
        return updated;
      });
    },
    [multiplayer]
  );

  // Accept Intermunicipal Loan
  const handleAcceptLoan = useCallback(
    (loan: IntermunicipalLoan) => {
      setCityState((prev) => {
        const { state: updated } = acceptIntermunicipalLoan(prev, loan);
        multiplayer.respondToLoan(loan.id, true);
        showToast(`Empréstimo de R$ ${loan.principal.toLocaleString()} aceito e creditado no Tesouro!`, 'success');
        return updated;
      });
    },
    [multiplayer]
  );

  // Reject Intermunicipal Loan
  const handleRejectLoan = useCallback(
    (loanId: string) => {
      setCityState((prev) => {
        const { state: updated } = rejectIntermunicipalLoan(prev, loanId);
        multiplayer.respondToLoan(loanId, false);
        showToast('Proposta de empréstimo recusada.', 'info');
        return updated;
      });
    },
    [multiplayer]
  );

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
      {/* Banner de Notificação de Negociação e Empréstimo em Tempo Real */}
      <NegotiationAlertBanner
        notification={multiplayer.activeNegotiation}
        onDismiss={multiplayer.clearNegotiationNotification}
        onOpenRegionalView={() => {
          if (multiplayer.activeNegotiation?.type === 'loan_proposed') {
            setIsLoansModalOpen(true);
          } else {
            setActiveView('regional');
          }
        }}
      />

      {/* Barra de Navegação Superior e Métricas do Município */}
      <MayorTopBar
        state={cityState}
        activeView={activeView}
        setActiveView={setActiveView}
        isMuted={isMuted}
        toggleMute={toggleMute}
        isMultiplayerConnected={multiplayer.isConnected}
        pendingDispatchesCount={pendingCount}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onTriggerRandomEmergency={handleTriggerManualEmergency}
        onOpenLoansModal={() => setIsLoansModalOpen(true)}
        isSavingOnline={isSavingOnline}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        roomId={multiplayer.roomId}
        partnerName={multiplayer.partnerMayor?.name}
        partnerCityName={multiplayer.partnerMayor?.cityName}
        isPartnerOnline={multiplayer.isPartnerOnline}
        onShareRoom={multiplayer.shareRoomLink}
      />

      {/* Banner de Prefeita Conectada (Namorada / 2º Jogador) */}
      {multiplayer.partnerMayor && (
        <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-b border-emerald-500/40 py-2 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <strong className="text-white font-bold">2ª Prefeitura Conectada na Região:</strong>
              <span>
                {multiplayer.partnerMayor.name} governando <strong>{multiplayer.partnerMayor.cityName}</strong> (Sala {multiplayer.roomId})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView('negociar')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-all shadow-sm"
              >
                Mesa de Negociação
              </button>
              <button
                onClick={() => setActiveView('regional')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold px-3 py-1 rounded-lg transition-all"
              >
                Consórcio Regional
              </button>
            </div>
          </div>
        </div>
      )}

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
            onUpdateDepartmentBudget={handleUpdateDepartmentBudget}
            onUpdateTaxRates={handleUpdateTaxRates}
            onOpenLoansModal={() => setIsLoansModalOpen(true)}
          />
        )}

        {activeView === 'regional' && (
          <RegionalMultiplayerView
            cityState={cityState}
            roomId={multiplayer.roomId}
            isConnected={multiplayer.isConnected}
            myRole={multiplayer.myRole}
            myPlayerId={multiplayer.myPlayerId}
            otherMayors={multiplayer.otherMayors}
            treaties={multiplayer.treaties}
            chatMessages={multiplayer.chatMessages}
            onConnectRoom={multiplayer.connectToRoom}
            onProposeTreaty={multiplayer.proposeTreaty}
            onRespondTreaty={multiplayer.respondToTreaty}
            onSendMessage={multiplayer.sendChatMessage}
            onShareRoom={multiplayer.shareRoomLink}
            onSendDirectAid={multiplayer.sendDirectAid}
            onOpenLoansModal={() => setIsLoansModalOpen(true)}
          />
        )}

        {activeView === 'ranking' && (
          <EconomicRankingView
            cityState={cityState}
            otherMayors={multiplayer.otherMayors}
            myPlayerId={multiplayer.myPlayerId}
            onOpenLoansWithCity={(cityName, mayorName) => {
              setIsLoansModalOpen(true);
            }}
            onOpenMultiplayer={() => setActiveView('regional')}
          />
        )}

        {activeView === 'negociar' && (
          <MayorNegotiationsView
            cityState={cityState}
            otherMayors={multiplayer.otherMayors}
            treaties={multiplayer.treaties}
            chatMessages={multiplayer.chatMessages}
            myRole={multiplayer.myRole}
            myPlayerId={multiplayer.myPlayerId}
            isConnected={multiplayer.isConnected}
            roomId={multiplayer.roomId}
            onProposeTreaty={multiplayer.proposeTreaty}
            onRespondTreaty={multiplayer.respondToTreaty}
            onSendMessage={multiplayer.sendChatMessage}
            onSendDirectAid={multiplayer.sendDirectAid}
            onOpenLoansModal={() => setIsLoansModalOpen(true)}
          />
        )}
      </main>

      {/* Modal de Empréstimos Intermunicipais */}
      {isLoansModalOpen && (
        <IntermunicipalLoansModal
          cityState={cityState}
          otherMayors={multiplayer.otherMayors}
          myPlayerId={multiplayer.myPlayerId}
          onProposeLoan={handleProposeLoan}
          onAcceptLoan={handleAcceptLoan}
          onRejectLoan={handleRejectLoan}
          onClose={() => setIsLoansModalOpen(false)}
        />
      )}

      {/* Modal de Ocorrência Crítica / Emergência Municipal */}
      {isEmergencyModalOpen && cityState.activeEmergencyEvent && (
        <EmergencyEventModal
          event={cityState.activeEmergencyEvent}
          treasury={cityState.treasury}
          onResolve={handleResolveEmergency}
          onClose={() => setIsEmergencyModalOpen(false)}
        />
      )}

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

      {/* Modal de Login e Identificação do Prefeito (Nome & Partido) */}
      <MayorAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentState={cityState}
        onSelectProfile={handleSelectMayorProfile}
        initialTab="login"
      />
    </div>
  );
}

