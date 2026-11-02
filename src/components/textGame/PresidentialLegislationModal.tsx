import React, { useState } from 'react';
import {
  X,
  Scroll,
  FileCheck,
  Building,
  Scale,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Percent,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  Bot,
  Send,
  Clock,
  Play,
  RotateCcw,
  Flame,
  Zap,
  Info,
} from 'lucide-react';
import { PrefeitoCityState, PresidentialLegislationItem } from '../../types/textGame';
import { SENATORS_50, Senator, PlenaryVoteResult } from '../../data/senatorsData';
import { sounds } from '../../audio/soundManager';

interface PresidentialLegislationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PrefeitoCityState;
  onSignDecree: (decreeId: string) => void;
  onVoteLaw: (lawId: string) => void;
  onVotePec: (pecId: string) => void;
  onSubmitCustomLaw?: (law: PresidentialLegislationItem) => void;
  onConvenePlenaryVoting?: (lawId?: string) => void;
}

export const PresidentialLegislationModal: React.FC<PresidentialLegislationModalProps> = ({
  isOpen,
  onClose,
  state,
  onSignDecree,
  onVoteLaw,
  onVotePec,
  onSubmitCustomLaw,
  onConvenePlenaryVoting,
}) => {
  const [activeTab, setActiveTab] = useState<'plenario' | 'redigir_ia' | 'pauta' | 'em_vigor'>('plenario');
  const [selectedType, setSelectedType] = useState<'all' | 'decreto' | 'lei' | 'pec'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null);

  // IA Law Drafter State
  const [draftInput, setDraftInput] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // Selected Senator Modal / Popover
  const [inspectedSenator, setInspectedSenator] = useState<Senator | null>(null);

  if (!isOpen) return null;

  const agenda = state.legislativeAgenda || [];
  const signedDecrees = state.signedDecreeIds || [];
  const passedLaws = state.passedLawIds || [];
  const passedPecs = state.passedPecIds || [];

  const congressSupport = state.councilSupport || 50;
  const approvalRating = state.approvalRating || 50;
  const votingCountdown = state.congressVotingSecondsRemaining ?? 60;

  // Active or last voting record
  const lastResult = state.lastVotingResult;
  const currentPendingBill =
    agenda.find((l) => l.status === 'em_votacao') ||
    agenda.find((l) => l.status === 'na_fila_votacao') ||
    agenda.find((l) => (l.type === 'lei' || l.type === 'pec') && l.status === 'disponivel');

  const lawsAwaitingEnactment = agenda.filter((l) => l.status === 'aprovada_aguardando_vigor');
  const enactedLaws = agenda.filter(
    (l) => l.status === 'aprovada' || signedDecrees.includes(l.id) || passedLaws.includes(l.id) || passedPecs.includes(l.id)
  );

  // Handle AI Analysis submission
  const handleAnalyzeWithAi = async () => {
    if (!draftInput.trim()) {
      sounds.playError();
      setNotification({ text: 'Por favor, escreva o texto ou objetivo da sua lei antes de analisar.', success: false });
      return;
    }

    sounds.playClick();
    setIsAnalyzingAi(true);
    setNotification(null);

    try {
      const response = await fetch('/api/gemini/analyze-law', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftText: draftInput,
          presidentialTitle: draftTitle,
          currentTreasury: state.treasury,
          approvalRating: state.approvalRating,
          councilSupport: state.councilSupport,
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAnalysisResult(data.analysis);
        sounds.playFanfare();
        setNotification({
          text: `Análise da Inteligência Artificial concluída! Parecer técnico e impactos fiscais gerados.`,
          success: true,
        });
      } else {
        throw new Error(data.error || 'Falha ao processar com a IA.');
      }
    } catch (err: any) {
      console.warn('Erro ao conectar com Gemini API:', err);
      sounds.playError();
      setNotification({
        text: `Erro na análise: ${err.message || 'Tente novamente.'}`,
        success: false,
      });
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Protocol AI law into Congress or Executive
  const handleProtocolLaw = () => {
    if (!aiAnalysisResult) return;
    sounds.playCash();

    const newLawItem: PresidentialLegislationItem = {
      id: 'law_ai_' + Date.now(),
      type: aiAnalysisResult.type || 'lei',
      numberStr: aiAnalysisResult.numberStr || `PL nº ${Math.floor(Math.random() * 800) + 100}/2026`,
      title: aiAnalysisResult.title || draftTitle || 'Nova Lei Presidencial',
      theme: aiAnalysisResult.theme || 'economia',
      badge: aiAnalysisResult.badge || '🏛️ Lei Federal',
      description: aiAnalysisResult.description || draftInput,
      detailedJustification: aiAnalysisResult.detailedJustification || draftInput,
      author: 'Poder Executivo (Presidente)',
      requiredQuorum: aiAnalysisResult.requiredQuorum || (aiAnalysisResult.type === 'pec' ? 'tres_quintos' : 'maioria_simples'),
      politicalCapitalCost: aiAnalysisResult.politicalCapitalCost || 50000,
      minCongressSupport: aiAnalysisResult.minCongressSupport || (aiAnalysisResult.type === 'pec' ? 60 : 50),
      status: aiAnalysisResult.type === 'decreto' ? 'disponivel' : 'na_fila_votacao',
      isCustomAiLaw: true,
      aiDraftPrompt: draftInput,
      aiEmenta: aiAnalysisResult.officialEmenta,
      aiConstitutionalOpinion: aiAnalysisResult.constitutionalAnalysis,
      aiSenatorTendency: aiAnalysisResult.senatorTendency,
      impacts: {
        monthlyRevenueBonus: aiAnalysisResult.impacts?.monthlyRevenueBonus || 0,
        monthlyExpenseReduction: aiAnalysisResult.impacts?.monthlyExpenseReduction || 0,
        exportBonusPercent: aiAnalysisResult.impacts?.exportBonusPercent || 0,
        importCostDiscountPercent: aiAnalysisResult.impacts?.importCostDiscountPercent || 0,
        approvalChange: aiAnalysisResult.impacts?.approvalChange || 0,
        congressSupportChange: aiAnalysisResult.impacts?.congressSupportChange || 0,
        jobsCreated: aiAnalysisResult.impacts?.jobsCreated || 0,
        selicInterestCutBps: aiAnalysisResult.impacts?.selicInterestCutBps || 0,
        inssDeficitReduction: aiAnalysisResult.impacts?.inssDeficitReduction || 0,
        customNote: aiAnalysisResult.impacts?.customNote || 'Matéria criada e sancionada pelo Presidente da República.',
      },
    };

    if (onSubmitCustomLaw) {
      onSubmitCustomLaw(newLawItem);
    }

    setNotification({
      text: `Proposta "${newLawItem.title}" protocolada com sucesso no Congresso Nacional!`,
      success: true,
    });
    setDraftInput('');
    setDraftTitle('');
    setAiAnalysisResult(null);
    setActiveTab('plenario');
  };

  const handleTriggerPlenary = (lawId?: string) => {
    sounds.playClick();
    if (onConvenePlenaryVoting) {
      onConvenePlenaryVoting(lawId);
      setNotification({
        text: 'Campainha acionada! Sessão de votação extraordinária dos 50 senadores iniciada!',
        success: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  Palácio do Planalto & Congresso Nacional
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                  50 Senadores • Votações a cada 1 Minuto
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Invente qualquer lei que quiser com IA, submeta ao plenário de 50 senadores e aprove PECs e Projetos de Lei.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('plenario');
              sounds.playClick();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'plenario'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            Plenário do Senado (50 Senadores)
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-black animate-pulse">
              ⏱ {votingCountdown}s
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('redigir_ia');
              sounds.playClick();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'redigir_ia'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            Redigir Lei com IA (Gemini)
          </button>

          <button
            onClick={() => {
              setActiveTab('pauta');
              sounds.playClick();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'pauta'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scroll className="w-4 h-4" />
            Pauta de Leis & PECs
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {agenda.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('em_vigor');
              sounds.playClick();
            }}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'em_vigor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Leis em Vigor no Brasil ({enactedLaws.length})
          </button>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`p-3 text-xs sm:text-sm font-semibold flex items-center justify-between border-b ${
              notification.success
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
                : 'bg-rose-950/90 text-rose-300 border-rose-700/60'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{notification.text}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs underline hover:text-white">
              Fechar
            </button>
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: PLENÁRIO DO SENADO & 50 SENADORES */}
          {activeTab === 'plenario' && (
            <div className="space-y-6">
              {/* Relógio Oficial de Votação (60 Segundos) */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 p-4 sm:p-5 rounded-2xl border border-indigo-500/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/50 flex flex-col items-center justify-center text-indigo-300 shadow-inner">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span className="text-xs font-black font-mono mt-0.5">{votingCountdown}s</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">
                        Sessão Plenária Deliberativa
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 border border-indigo-500/60 text-indigo-300">
                        Votação a cada 1 minuto
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {currentPendingBill ? (
                        <>
                          Em pauta:{' '}
                          <strong className="text-amber-300">
                            {currentPendingBill.numberStr} - {currentPendingBill.title}
                          </strong>{' '}
                          ({currentPendingBill.type === 'pec' ? 'PEC: Quórum 3/5 = 30 votos' : 'PL: Maioria Simples = 26 votos'})
                        </>
                      ) : (
                        'Nenhum projeto em votação no momento. Redija uma nova lei na aba de IA ou escolha uma na pauta!'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleTriggerPlenary(currentPendingBill?.id)}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                    title="Iniciar votação imediata sem esperar o término do minuto"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Convocar Votação Imediata
                  </button>
                </div>
              </div>

              {/* Leis Aprovadas Aguardando Vigor (Vacatio Legis 1 minuto) */}
              {lawsAwaitingEnactment.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-xl space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>Leis Aprovadas pelo Senado — Entram em Vigor no Minuto Seguinte:</span>
                    </div>
                    <span className="text-xs text-amber-200/80">Regramento Constitucional</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lawsAwaitingEnactment.map((law) => (
                      <div
                        key={law.id}
                        className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-amber-300 text-xs">{law.numberStr}</span>
                            <span className="font-semibold text-white text-xs">{law.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{law.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded border border-amber-500/40 font-mono">
                            Vigora em {law.secondsUntilEffective ?? 60}s
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placar Eletrônico do Senado */}
              {lastResult && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Último Resultado no Plenário:</span>
                      <span className="text-amber-300">{lastResult.lawNumber}</span>
                    </div>
                    <span
                      className={`font-black px-2 py-0.5 rounded ${
                        lastResult.approved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {lastResult.approved ? 'APROVADO PELO CONGRESSO' : 'REJEITADO PELO PLENÁRIO'}
                    </span>
                  </div>

                  {/* Votos Bar */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
                    <div className="p-2 rounded bg-emerald-950/60 border border-emerald-600/50 text-emerald-300">
                      SIM: {lastResult.votesSim} votos
                    </div>
                    <div className="p-2 rounded bg-rose-950/60 border border-rose-600/50 text-rose-300">
                      NÃO: {lastResult.votesNao} votos
                    </div>
                    <div className="p-2 rounded bg-amber-950/60 border border-amber-600/50 text-amber-300">
                      ABSTENÇÃO: {lastResult.votesAbstencao}
                    </div>
                  </div>
                </div>
              )}

              {/* O Painel com os 50 Senadores */}
              <div className="bg-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-inner space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                      Plenário Oficial: 50 Senadores da República
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Voto Sim
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Voto Não
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Abstenção
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      Clique no senador para ver seu discurso
                    </span>
                  </div>
                </div>

                {/* Grid dos 50 Senadores */}
                <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
                  {SENATORS_50.map((senator) => {
                    const voteRecord = currentPendingBill?.senatorVotes?.[senator.id] || null;
                    const vote = voteRecord?.vote || null;

                    return (
                      <div
                        key={senator.id}
                        onClick={() => {
                          sounds.playClick();
                          setInspectedSenator(senator);
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-105 select-none relative overflow-hidden ${
                          vote === 'sim'
                            ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-200'
                            : vote === 'nao'
                            ? 'bg-rose-950/80 border-rose-500/70 text-rose-200'
                            : vote === 'abstencao'
                            ? 'bg-amber-950/80 border-amber-500/70 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                        title={`${senator.name} (${senator.party}-${senator.stateUF})`}
                      >
                        {/* Vote Badge indicator */}
                        {vote && (
                          <span
                            className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full shadow ${
                              vote === 'sim' ? 'bg-emerald-400' : vote === 'nao' ? 'bg-rose-400' : 'bg-amber-400'
                            }`}
                          />
                        )}

                        <div className={`w-8 h-8 rounded-full ${senator.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-md mb-1`}>
                          {senator.name.charAt(0)}
                        </div>

                        <span className="text-[10px] font-bold text-center line-clamp-1 w-full text-slate-200">
                          {senator.name.split(' ')[0]}
                        </span>

                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] font-black px-1 rounded bg-slate-950/80 text-amber-300 font-mono">
                            {senator.party}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">{senator.stateUF}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inspected Senator Speech Modal / Dialog */}
                {inspectedSenator && (
                  <div className="bg-slate-900 border border-amber-500/50 p-4 rounded-xl mt-4 animate-fade-in flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl ${inspectedSenator.avatarBg} text-white font-black text-lg flex items-center justify-center shadow-lg flex-shrink-0`}>
                        {inspectedSenator.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-white text-base">{inspectedSenator.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            {inspectedSenator.party} • {inspectedSenator.stateUF}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{inspectedSenator.region}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Perfil: <strong>{inspectedSenator.profile}</strong> • Alinhamento:{' '}
                          <strong
                            className={
                              inspectedSenator.alignment === 'base_governo'
                                ? 'text-emerald-400'
                                : inspectedSenator.alignment === 'centrao'
                                ? 'text-amber-300'
                                : 'text-rose-400'
                            }
                          >
                            {inspectedSenator.alignment === 'base_governo'
                              ? 'Base do Governo'
                              : inspectedSenator.alignment === 'centrao'
                              ? 'Centrão / Independente'
                              : 'Oposição'}
                          </strong>
                        </p>

                        {/* Senator Speech Bubble */}
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs italic text-amber-200">
                          {currentPendingBill?.senatorVotes?.[inspectedSenator.id]?.quote ||
                            `"Estamos atentos à pauta da Presidência da República no plenário do Senado Federal."`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setInspectedSenator(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Fechar Detalhes
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REDIGIR LEI COM IA (GEMINI) */}
          {activeTab === 'redigir_ia' && (
            <div className="space-y-6">
              {/* Presidential AI Office Banner */}
              <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-purple-500/40 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Gabinete de Redação Legislativa com Inteligência Artificial
                    </h3>
                    <p className="text-xs text-purple-200/80">
                      O Presidente inventa a lei que quiser. A IA analisa constitucionalidade (CCJ), impacto fiscal no Tesouro e previsão de votos dos 50 senadores.
                    </p>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Título ou Tema da Lei (Opcional):
                    </label>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      placeholder="Ex: Marco Legal da Inteligência Artificial ou Isenção Total de IR até R$ 8.000"
                      className="w-full bg-slate-950 border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      O que o Presidente quer decretar ou aprovar? (Escreva livremente qualquer ideia):
                    </label>
                    <textarea
                      value={draftInput}
                      onChange={(e) => setDraftInput(e.target.value)}
                      rows={4}
                      placeholder="Exemplo: Quero isentar todos os impostos federais para energia solar, taxar super-ricos em 15% para financiar um fundo soberano de pesquisa em IA e dar bolsa de R$ 3.000 para atletas e cientistas do Brasil."
                      className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-purple-400 resize-none shadow-inner"
                    />
                  </div>

                  {/* Sugestões Rápidas de Leis Presidenciais */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-400" /> Sugestões para o Presidente testar:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Isenção de Imposto de Renda até R$ 10.000 custeada por taxação de lucros de bancos',
                        'Marco Regulatório da Inteligência Artificial e Data Centers Soberanos Verdes',
                        'Fundo Soberano de Reindustrialização financiado com royalties do pré-sal',
                        'Piso Salarial Nacional de Médicos e Enfermeiros com repasse direto do Tesouro',
                        'Proibir exportação de fertilizantes e subsidiar safra de alimentos básicos',
                        'Privatização de ferrovias federais com obrigação de transporte gratuito de cargas agrícolas',
                      ].map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            sounds.playClick();
                            setDraftInput(prompt);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/80 hover:bg-slate-700 text-purple-200 border border-purple-500/20 transition-colors text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botão de Envio para a IA */}
                  <div className="pt-2">
                    <button
                      onClick={handleAnalyzeWithAi}
                      disabled={isAnalyzingAi || !draftInput.trim()}
                      className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                        isAnalyzingAi || !draftInput.trim()
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-98'
                      }`}
                    >
                      {isAnalyzingAi ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          Consultoria Jurídica Presidencial & IA Analisando Tudo...
                        </>
                      ) : (
                        <>
                          <Bot className="w-5 h-5" />
                          Analisar Tudo com Inteligência Artificial (Gemini)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Resultado da Análise da IA */}
              {aiAnalysisResult && (
                <div className="bg-slate-950 border border-emerald-500/40 p-5 rounded-2xl shadow-xl space-y-4 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-black bg-purple-500/20 border border-purple-500/40 text-purple-300 uppercase">
                        {aiAnalysisResult.type?.toUpperCase()} • {aiAnalysisResult.numberStr}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white">{aiAnalysisResult.title}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {aiAnalysisResult.badge}
                    </span>
                  </div>

                  {/* Parecer CCJ & Ementa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5" /> Ementa Oficial Legislativa
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-serif italic">
                        "{aiAnalysisResult.officialEmenta}"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5" /> Parecer de Constitucionalidade (CCJ)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {aiAnalysisResult.constitutionalAnalysis}
                      </p>
                    </div>
                  </div>

                  {/* Impactos Econômicos Calculados pela IA */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Impacto Fiscal & Macroeconômico Projetado:
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {aiAnalysisResult.impacts?.monthlyRevenueBonus !== undefined && (
                        <span
                          className={`px-3 py-1.5 rounded-lg font-bold border ${
                            aiAnalysisResult.impacts.monthlyRevenueBonus >= 0
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                              : 'bg-rose-950/80 text-rose-300 border-rose-600/50'
                          }`}
                        >
                          Arrecadação: {aiAnalysisResult.impacts.monthlyRevenueBonus >= 0 ? '+' : ''}R${' '}
                          {aiAnalysisResult.impacts.monthlyRevenueBonus.toLocaleString()}/mês
                        </span>
                      )}

                      {aiAnalysisResult.impacts?.monthlyExpenseReduction !== undefined && (
                        <span
                          className={`px-3 py-1.5 rounded-lg font-bold border ${
                            aiAnalysisResult.impacts.monthlyExpenseReduction >= 0
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                              : 'bg-rose-950/80 text-rose-300 border-rose-600/50'
                          }`}
                        >
                          Despesas:{' '}
                          {aiAnalysisResult.impacts.monthlyExpenseReduction >= 0
                            ? `-R$ ${aiAnalysisResult.impacts.monthlyExpenseReduction.toLocaleString()}/mês (Economia)`
                            : `+R$ ${Math.abs(aiAnalysisResult.impacts.monthlyExpenseReduction).toLocaleString()}/mês (Custo)`}
                        </span>
                      )}

                      {aiAnalysisResult.impacts?.approvalChange !== undefined && (
                        <span
                          className={`px-3 py-1.5 rounded-lg font-bold border ${
                            aiAnalysisResult.impacts.approvalChange >= 0
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                              : 'bg-rose-950/80 text-rose-300 border-rose-600/50'
                          }`}
                        >
                          Popularidade: {aiAnalysisResult.impacts.approvalChange >= 0 ? '+' : ''}
                          {aiAnalysisResult.impacts.approvalChange}%
                        </span>
                      )}

                      {aiAnalysisResult.impacts?.jobsCreated !== undefined && (
                        <span className="px-3 py-1.5 rounded-lg font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-600/50">
                          +{aiAnalysisResult.impacts.jobsCreated.toLocaleString()} Empregos
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Previsão de Votação nos 50 Senadores */}
                  {aiAnalysisResult.senatorTendency && (
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Tendência de Voto no Plenário dos 50 Senadores:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-semibold">
                        <div className="p-2 rounded bg-slate-950 border border-emerald-800 text-emerald-300">
                          Governistas: {aiAnalysisResult.senatorTendency.governistasSupportPercent || 85}% Sim
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-amber-800 text-amber-300">
                          Centrão: {aiAnalysisResult.senatorTendency.centraoSupportPercent || 60}% Sim
                        </div>
                        <div className="p-2 rounded bg-slate-950 border border-rose-800 text-rose-300">
                          Oposição: {aiAnalysisResult.senatorTendency.oposicaoSupportPercent || 25}% Sim
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botões Finais de Protocolo */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleProtocolLaw}
                      className="flex-1 py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
                    >
                      <Building className="w-5 h-5" />
                      Protocolar no Congresso Nacional (Para Votação em 1 Minuto)
                    </button>

                    <button
                      onClick={() => setAiAnalysisResult(null)}
                      className="px-4 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Descartar e Escrever Outra
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAUTA DE LEIS & PECS */}
          {activeTab === 'pauta' && (
            <div className="space-y-4">
              {/* Barra de Filtros */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['all', 'decreto', 'lei', 'pec'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        selectedType === type
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type === 'all' ? 'Todas' : type === 'decreto' ? 'Decretos' : type === 'lei' ? 'Leis' : 'PECs'}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar lei ou tema..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 w-48"
                />
              </div>

              {/* Lista de Leis na Pauta */}
              <div className="space-y-3">
                {agenda
                  .filter((item) => {
                    if (selectedType !== 'all' && item.type !== selectedType) return false;
                    if (searchTerm.trim()) {
                      const q = searchTerm.toLowerCase();
                      return item.title.toLowerCase().includes(q) || item.numberStr.toLowerCase().includes(q);
                    }
                    return true;
                  })
                  .map((item) => {
                    const isApproved =
                      item.status === 'aprovada' ||
                      signedDecrees.includes(item.id) ||
                      passedLaws.includes(item.id) ||
                      passedPecs.includes(item.id);
                    const isWaiting = item.status === 'aprovada_aguardando_vigor';
                    const isQueued = item.status === 'na_fila_votacao';

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-amber-400">{item.numberStr}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                              {item.badge}
                            </span>
                            {item.isCustomAiLaw && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/60 flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Criada pelo Presidente com IA
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-white text-sm sm:text-base">{item.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{item.detailedJustification}</p>
                        </div>

                        {/* Ação */}
                        <div className="flex-shrink-0">
                          {isApproved ? (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> Em Vigor
                            </span>
                          ) : isWaiting ? (
                            <span className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 font-mono">
                              <Clock className="w-4 h-4 animate-spin" /> Vigora em {item.secondsUntilEffective ?? 60}s
                            </span>
                          ) : isQueued ? (
                            <button
                              onClick={() => handleTriggerPlenary(item.id)}
                              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" /> Votar no Plenário Agora
                            </button>
                          ) : item.type === 'decreto' ? (
                            <button
                              onClick={() => {
                                onSignDecree(item.id);
                                sounds.playCash();
                                setNotification({ text: `Decreto assinado com a caneta presidencial!`, success: true });
                              }}
                              className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                              <Scroll className="w-3.5 h-3.5" /> Assinar Decreto
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTriggerPlenary(item.id)}
                              className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5"
                            >
                              <Scale className="w-3.5 h-3.5" /> Pautar no Senado
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: LEIS EM VIGOR NO BRASIL */}
          {activeTab === 'em_vigor' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Legislação Promulgada e em Pleno Vigor ({enactedLaws.length})
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Todas as Leis, Decretos e PECs aprovados com seus impactos acumulados sobre a República.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {enactedLaws.map((law) => (
                  <div
                    key={law.id}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">{law.numberStr}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                        EM VIGOR
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-sm">{law.title}</h5>
                    <p className="text-xs text-slate-400 line-clamp-2">{law.detailedJustification}</p>

                    <div className="pt-1 flex flex-wrap gap-1.5 text-[11px]">
                      {law.impacts.monthlyRevenueBonus ? (
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 font-semibold border border-slate-800">
                          +R$ {law.impacts.monthlyRevenueBonus.toLocaleString()}/mês
                        </span>
                      ) : null}
                      {law.impacts.jobsCreated ? (
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-indigo-300 font-semibold border border-slate-800">
                          +{law.impacts.jobsCreated.toLocaleString()} Empregos
                        </span>
                      ) : null}
                      {law.impacts.approvalChange ? (
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-semibold border border-slate-800">
                          +{law.impacts.approvalChange}% Popularidade
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Rodapé do Palácio do Planalto */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Congresso Nacional em Sessão Plenária Contínua • Leis entram em vigor 1 minuto após aprovação.
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
          >
            Fechar Gabinete
          </button>
        </div>

      </div>
    </div>
  );
};
