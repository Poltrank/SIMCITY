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
} from 'lucide-react';
import { PrefeitoCityState, PresidentialLegislationItem } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface PresidentialLegislationModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PrefeitoCityState;
  onSignDecree: (decreeId: string) => void;
  onVoteLaw: (lawId: string) => void;
  onVotePec: (pecId: string) => void;
}

export const PresidentialLegislationModal: React.FC<PresidentialLegislationModalProps> = ({
  isOpen,
  onClose,
  state,
  onSignDecree,
  onVoteLaw,
  onVotePec,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'decreto' | 'lei' | 'pec'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const agenda = state.legislativeAgenda || [];
  const signedDecrees = state.signedDecreeIds || [];
  const passedLaws = state.passedLawIds || [];
  const passedPecs = state.passedPecIds || [];

  const congressSupport = state.councilSupport || 50;
  const approvalRating = state.approvalRating || 50;

  const filteredItems = agenda.filter((item) => {
    const isApproved = item.status === 'aprovada' ||
      signedDecrees.includes(item.id) ||
      passedLaws.includes(item.id) ||
      passedPecs.includes(item.id);

    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (selectedStatus === 'pending' && isApproved) return false;
    if (selectedStatus === 'approved' && !isApproved) return false;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchNum = item.numberStr.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.detailedJustification.toLowerCase().includes(q);
      if (!matchTitle && !matchNum && !matchCat && !matchDesc) return false;
    }

    return true;
  });

  const totalApproved = agenda.filter(
    (i) => i.status === 'aprovada' || signedDecrees.includes(i.id) || passedLaws.includes(i.id) || passedPecs.includes(i.id)
  ).length;

  const handleAction = (item: PresidentialLegislationItem) => {
    sounds.playClick();
    if (item.type === 'decreto') {
      onSignDecree(item.id);
      setNotification({ text: `Decreto ${item.numberStr} assinado com a caneta presidencial!`, success: true });
    } else if (item.type === 'lei') {
      if (congressSupport < (item.minCongressSupport || 50)) {
        sounds.playError();
        setNotification({
          text: `Base insuficiente no Congresso! Necessário ${item.minCongressSupport}%, sua base é ${congressSupport}%.`,
          success: false,
        });
        return;
      }
      onVoteLaw(item.id);
      setNotification({ text: `Projeto de Lei ${item.numberStr} aprovado e sancionado!`, success: true });
    } else if (item.type === 'pec') {
      if (congressSupport < (item.minCongressSupport || 60)) {
        sounds.playError();
        setNotification({
          text: `Quórum Constitucional de 3/5 Insuficiente! Exigido ${item.minCongressSupport}%, base atual é ${congressSupport}%.`,
          success: false,
        });
        return;
      }
      onVotePec(item.id);
      setNotification({ text: `Histórico! PEC ${item.numberStr} promulgada na Constituição!`, success: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Palácio & Congresso */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Palácio do Planalto & Congresso Nacional
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                  Poder Executivo & Legislativo
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Assine Decretos com sua caneta presidencial, articule Projetos de Lei e promulgue PECs Constitucionais para acelerar a nação.
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

        {/* Notificação Toast */}
        {notification && (
          <div
            className={`px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
              notification.success
                ? 'bg-emerald-950 text-emerald-300 border-b border-emerald-800'
                : 'bg-rose-950 text-rose-300 border-b border-rose-800'
            }`}
          >
            <span>{notification.text}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs underline hover:text-white ml-3"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Dashboard de Articulação Política */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Base no Congresso</span>
              <Scale className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-lg font-black text-sky-300">{congressSupport}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  congressSupport >= 60
                    ? 'bg-emerald-500'
                    : congressSupport >= 50
                    ? 'bg-sky-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${congressSupport}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {congressSupport >= 60 ? 'Quórum de PEC Garantido (3/5)' : congressSupport >= 50 ? 'Maioria Simples (Leis)' : 'Minoria Parlamentar'}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Aprovação Popular</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400">{approvalRating}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${approvalRating}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Gabinete de Opinião Pública</div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Leis Promulgadas</span>
              <FileCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-400">
              {totalApproved} / {agenda.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {signedDecrees.length} Decretos • {passedLaws.length} Leis • {passedPecs.length} PECs
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Tesouro Nacional</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-300">
              R$ {state.treasury.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Recursos para Articulação</div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedType === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos ({agenda.length})
            </button>
            <button
              onClick={() => setSelectedType('decreto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'decreto'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
              }`}
            >
              <Scroll className="w-3.5 h-3.5" />
              Decretos Presidenciais
            </button>
            <button
              onClick={() => setSelectedType('lei')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'lei'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Projetos de Lei (PL)
            </button>
            <button
              onClick={() => setSelectedType('pec')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedType === 'pec'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              PECs Constitucionais
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar medida, número ou pauta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500 w-48 sm:w-60"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todas</option>
              <option value="pending">Em Tramitação</option>
              <option value="approved">Promulgadas</option>
            </select>
          </div>
        </div>

        {/* Lista de Medidas */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Nenhuma medida legislativa encontrada com os filtros selecionados.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isApproved =
                item.status === 'aprovada' ||
                signedDecrees.includes(item.id) ||
                passedLaws.includes(item.id) ||
                passedPecs.includes(item.id);

              const reqQuorum = item.minCongressSupport || (item.type === 'pec' ? 60 : item.type === 'lei' ? 50 : 0);
              const hasQuorum = item.type === 'decreto' || congressSupport >= reqQuorum;
              const canAfford = state.treasury >= (item.politicalCapitalCost || 0);

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    isApproved
                      ? 'bg-slate-950/60 border-emerald-500/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                            item.type === 'decreto'
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-600/40'
                              : item.type === 'lei'
                              ? 'bg-sky-950/80 text-sky-300 border border-sky-600/40'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                          }`}
                        >
                          {item.type === 'decreto'
                            ? '📜 Decreto Presidencial'
                            : item.type === 'lei'
                            ? '⚖️ Projeto de Lei (PL)'
                            : '🏛️ Emenda Constitucional (PEC)'}
                        </span>

                        <span className="font-mono text-xs font-bold text-amber-400">
                          {item.numberStr}
                        </span>

                        <span className="text-xs text-slate-400">
                          • {item.category.toUpperCase()} • Autoria: {item.author}
                        </span>

                        {isApproved ? (
                          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Promulgada & Em Vigor
                          </span>
                        ) : (
                          <span className="ml-auto text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                            {item.type === 'decreto' ? 'Ato Próprio do Executivo' : `Quórum Mínimo: ${reqQuorum}%`}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                        {item.detailedJustification}
                      </p>

                      {/* Lista de Impactos Econômicos */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {item.impacts.monthlyRevenueBonus ? (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            +R$ {item.impacts.monthlyRevenueBonus.toLocaleString()}/mês no Tesouro
                          </span>
                        ) : null}

                        {item.impacts.monthlyExpenseReduction ? (
                          <span className="px-2.5 py-1 rounded-md bg-sky-950/60 border border-sky-700/50 text-sky-300 font-semibold flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5 text-sky-400" />
                            -R$ {item.impacts.monthlyExpenseReduction.toLocaleString()}/mês em gastos
                          </span>
                        ) : null}

                        {item.impacts.exportBonusPercent ? (
                          <span className="px-2.5 py-1 rounded-md bg-amber-950/60 border border-amber-700/50 text-amber-300 font-semibold flex items-center gap-1">
                            <Percent className="w-3.5 h-3.5 text-amber-400" />
                            +{item.impacts.exportBonusPercent}% em Exportações Soberanas
                          </span>
                        ) : null}

                        {item.impacts.importCostDiscountPercent ? (
                          <span className="px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 font-semibold flex items-center gap-1">
                            <Percent className="w-3.5 h-3.5 text-indigo-400" />
                            -{item.impacts.importCostDiscountPercent}% no custo de insumos importados
                          </span>
                        ) : null}

                        {item.impacts.selicInterestCutBps ? (
                          <span className="px-2.5 py-1 rounded-md bg-teal-950/60 border border-teal-700/50 text-teal-300 font-semibold flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
                            -{(item.impacts.selicInterestCutBps / 100).toFixed(2)}% na Selic (Juros da Dívida)
                          </span>
                        ) : null}

                        {item.impacts.inssDeficitReduction ? (
                          <span className="px-2.5 py-1 rounded-md bg-rose-950/60 border border-rose-700/50 text-rose-300 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                            -R$ {item.impacts.inssDeficitReduction.toLocaleString()}/mês no déficit do INSS
                          </span>
                        ) : null}

                        {item.impacts.jobsCreated ? (
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                            +{item.impacts.jobsCreated.toLocaleString()} postos de trabalho
                          </span>
                        ) : null}

                        {item.impacts.approvalChange ? (
                          <span
                            className={`px-2.5 py-1 rounded-md font-medium ${
                              item.impacts.approvalChange > 0
                                ? 'bg-emerald-950/40 text-emerald-300'
                                : 'bg-rose-950/40 text-rose-300'
                            }`}
                          >
                            {item.impacts.approvalChange > 0 ? '+' : ''}
                            {item.impacts.approvalChange}% na aprovação popular
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Coluna de Ação & Votação */}
                    <div className="sm:w-64 flex flex-col justify-between items-stretch gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                      <div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Custo de Articulação:</span>
                          <span className="font-bold text-amber-300">
                            {item.politicalCapitalCost ? `R$ ${item.politicalCapitalCost.toLocaleString()}` : 'Gratuito'}
                          </span>
                        </div>

                        {item.type !== 'decreto' && (
                          <div className="mt-2 text-[11px]">
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span>Apoio do Parlamento:</span>
                              <span className={hasQuorum ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                {congressSupport}% / {reqQuorum}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  hasQuorum ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, (congressSupport / reqQuorum) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {isApproved ? (
                        <div className="py-2.5 px-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Promulgada no DOU
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAction(item)}
                          disabled={!canAfford || !hasQuorum}
                          className={`w-full py-2.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md ${
                            item.type === 'decreto'
                              ? 'bg-purple-600 hover:bg-purple-500 text-white'
                              : item.type === 'lei'
                              ? hasQuorum
                                ? 'bg-sky-600 hover:bg-sky-500 text-white'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : hasQuorum
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {item.type === 'decreto' ? (
                            <>
                              <Scroll className="w-3.5 h-3.5" /> Assinar Decreto Presidencial
                            </>
                          ) : item.type === 'lei' ? (
                            <>
                              <Scale className="w-3.5 h-3.5" /> Votar no Congresso
                            </>
                          ) : (
                            <>
                              <Building className="w-3.5 h-3.5" /> Promulgar PEC (3/5)
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Diário Oficial da União (DOU) atualizado automaticamente a cada promulgação.
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
          >
            Fechar Gabinete Legislativo
          </button>
        </div>
      </div>
    </div>
  );
};
