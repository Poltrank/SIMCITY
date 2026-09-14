import React, { useState } from 'react';
import {
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  Calendar,
  Percent,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Send,
  Building2,
  FileText,
} from 'lucide-react';
import { PrefeitoCityState, IntermunicipalLoan, RegionalMayorProfile } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface IntermunicipalLoansModalProps {
  cityState: PrefeitoCityState;
  otherMayors: Record<string, RegionalMayorProfile>;
  onProposeLoan: (loanData: {
    borrowerMayor: string;
    borrowerCity: string;
    principal: number;
    interestRateMonthly: number;
    totalInstallments: number;
    purpose: string;
  }) => void;
  onAcceptLoan: (loan: IntermunicipalLoan) => void;
  onRejectLoan: (loanId: string) => void;
  onClose: () => void;
  myPlayerId?: string;
}

export const IntermunicipalLoansModal: React.FC<IntermunicipalLoansModalProps> = ({
  cityState,
  otherMayors,
  myPlayerId,
  onProposeLoan,
  onAcceptLoan,
  onRejectLoan,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'propose'>('active');

  // Form state
  const otherMayorsList = (Object.values(otherMayors) as RegionalMayorProfile[])
    .filter((m) => {
      if (myPlayerId && m.id) return m.id !== myPlayerId;
      return m.name !== cityState.mayorName || m.cityName !== cityState.cityName;
    })
    .sort((a, b) => {
      if (a.isRealPlayer && !b.isRealPlayer) return -1;
      if (!a.isRealPlayer && b.isRealPlayer) return 1;
      return 0;
    });

  const [selectedTargetMayor, setSelectedTargetMayor] = useState<string>(
    otherMayorsList[0]?.name || 'Prefeito do Município Sul'
  );
  const [selectedTargetCity, setSelectedTargetCity] = useState<string>(
    otherMayorsList[0]?.cityName || 'Cidade Sul'
  );
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(1.5);
  const [installments, setInstallments] = useState<number>(12);
  const [purpose, setPurpose] = useState<string>('Socorro Emergencial & Custeio Hospitalar');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Math calculation
  const totalInterest = (principal * (interestRate / 100)) * installments;
  const totalRepayment = Math.round(principal + totalInterest);
  const monthlyInstallment = Math.round(totalRepayment / installments);

  const loans = cityState.intermunicipalLoans || [];
  const loansGiven = loans.filter((l) => l.lenderCity === cityState.cityName);
  const loansTaken = loans.filter((l) => l.borrowerCity === cityState.cityName);

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (principal > cityState.treasury) {
      sounds.playAlert();
      alert('O Tesouro Municipal não dispõe de saldo suficiente para este empréstimo.');
      return;
    }

    onProposeLoan({
      borrowerMayor: selectedTargetMayor,
      borrowerCity: selectedTargetCity,
      principal,
      interestRateMonthly: interestRate,
      totalInstallments: installments,
      purpose,
    });

    sounds.playStamp();
    setSuccessMsg(`Proposta de empréstimo de R$ ${principal.toLocaleString()} enviada com sucesso!`);
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('active');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-indigo-500/70 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center flex-shrink-0 text-indigo-400 shadow-inner">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Consórcio de Crédito Intermunicipal
                </span>
              </div>
              <h2 className="text-xl font-black text-white">
                Empréstimos entre Prefeituras
              </h2>
              <p className="text-xs text-slate-400">
                Financie cidades vizinhas com juros favoráveis ou contrate crédito emergencial para cobrir o caixa.
              </p>
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

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-800 mb-5 pb-1">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('active');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Contratos Ativos & Linhas ({loans.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('propose');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'propose'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Conceder Empréstimo a Outra Cidade
          </button>
        </div>

        {/* Tab 1: Contratos Ativos */}
        {activeTab === 'active' && (
          <div className="space-y-5">
            {/* Status Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-xs text-slate-400 mb-1">Tesouro Disponível</div>
                <div className="text-lg font-mono font-black text-emerald-400">
                  R$ {cityState.treasury.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-xs text-slate-400 mb-1">Receitas de Empréstimos (Receber)</div>
                <div className="text-lg font-mono font-black text-sky-400">
                  R${' '}
                  {loansGiven
                    .filter((l) => l.status === 'active')
                    .reduce((acc, l) => acc + l.installmentValue, 0)
                    .toLocaleString()}
                  /mês
                </div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-xs text-slate-400 mb-1">Amortizações Devidas (Pagar)</div>
                <div className="text-lg font-mono font-black text-rose-400">
                  R${' '}
                  {loansTaken
                    .filter((l) => l.status === 'active')
                    .reduce((acc, l) => acc + l.installmentValue, 0)
                    .toLocaleString()}
                  /mês
                </div>
              </div>
            </div>

            {/* List of Loans */}
            {loans.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                <Landmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">
                  Nenhum contrato de mútuo financeiro intermunicipal em andamento.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Ofereça recursos excedentes para cidades parceiras para auferir rendimentos de juros nos ciclos econômicos!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.map((loan) => {
                  const isLender = loan.lenderCity === cityState.cityName;

                  return (
                    <div
                      key={loan.id}
                      className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isLender
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {isLender ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isLender
                                  ? 'bg-emerald-900/60 text-emerald-300'
                                  : 'bg-rose-900/60 text-rose-300'
                              }`}
                            >
                              {isLender ? 'CRÉDITO CONCEDIDO' : 'DÍVIDA CONTRATADA'}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                loan.status === 'active'
                                  ? 'bg-sky-900/60 text-sky-300'
                                  : loan.status === 'completed'
                                  ? 'bg-slate-700 text-slate-300'
                                  : 'bg-amber-900/60 text-amber-300'
                              }`}
                            >
                              {loan.status === 'active'
                                ? 'ATIVO'
                                : loan.status === 'completed'
                                ? 'QUITADO'
                                : 'PENDENTE'}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-sm mt-1">
                            {isLender
                              ? `Empréstimo para ${loan.borrowerCity} (${loan.borrowerMayor})`
                              : `Empréstimo tomado de ${loan.lenderCity} (${loan.lenderMayor})`}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Finalidade: <strong className="text-slate-300">{loan.purpose}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <div className="text-slate-500 text-[10px]">PARCELA</div>
                          <div
                            className={`font-bold ${
                              isLender ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isLender ? '+' : '-'}R$ {loan.installmentValue.toLocaleString()}/mês
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[10px]">RESTANTE</div>
                          <div className="font-bold text-slate-300">
                            {loan.remainingInstallments} de {loan.totalInstallments} meses
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[10px]">PRINCIPAL</div>
                          <div className="font-bold text-white">
                            R$ {loan.principal.toLocaleString()}
                          </div>
                        </div>

                        {/* Action buttons if loan is pending */}
                        {loan.status === 'pending' && loan.borrowerCity === cityState.cityName && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onAcceptLoan(loan)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                              title="Aceitar empréstimo e receber recursos"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRejectLoan(loan.id)}
                              className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                              title="Recusar proposta"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Propor Empréstimo */}
        {activeTab === 'propose' && (
          <form onSubmit={handleSendProposal} className="space-y-4">
            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Prefeito / Município Tomador:
                </label>
                {otherMayorsList.length > 0 ? (
                  <select
                    value={selectedTargetMayor}
                    onChange={(e) => {
                      const selected = otherMayorsList.find((m) => m.name === e.target.value);
                      if (selected) {
                        setSelectedTargetMayor(selected.name);
                        setSelectedTargetCity(selected.cityName);
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {otherMayorsList.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} — {m.cityName} (Tesouro: R$ {m.treasury.toLocaleString()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedTargetCity}
                    onChange={(e) => setSelectedTargetCity(e.target.value)}
                    placeholder="Nome do Município Parceiro"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Finalidade do Financiamento:
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Socorro Emergencial & Custeio Hospitalar">
                    Socorro Emergencial & Custeio Hospitalar
                  </option>
                  <option value="Obras de Infraestrutura & Asfalto">
                    Obras de Infraestrutura & Asfalto
                  </option>
                  <option value="Implantação de Polo Industrial">
                    Implantação de Polo Industrial
                  </option>
                  <option value="Equilíbrio da Folha Salarial">
                    Equilíbrio da Folha Salarial
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Valor Principal (R$):
                </label>
                <input
                  type="number"
                  step="10000"
                  min="20000"
                  max={cityState.treasury}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Máximo: R$ {cityState.treasury.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Taxa de Juros Mensal (%):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="5.0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Sugerido: 1.0% a 2.5% a.m.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Prazo de Amortização:
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={6}>6 Meses (Curto Prazo)</option>
                  <option value={12}>12 Meses (1 Ano)</option>
                  <option value={24}>24 Meses (2 Anos)</option>
                  <option value={36}>36 Meses (Mandato Todo)</option>
                </select>
              </div>
            </div>

            {/* Simulation Preview */}
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/80 rounded-xl space-y-2">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5" />
                Demonstrativo Financeiro do Mútuo
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 font-mono">
                <div>
                  <div className="text-slate-400 text-[10px]">SAQUE IMEDIATO</div>
                  <div className="text-rose-400 font-bold">
                    -R$ {principal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">PARCELA MENSAL RECEBIDA</div>
                  <div className="text-emerald-400 font-bold">
                    +R$ {monthlyInstallment.toLocaleString()}/mês
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">JUROS AUFERIDOS</div>
                  <div className="text-sky-300 font-bold">
                    +R$ {Math.round(totalInterest).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">RETORNO TOTAL</div>
                  <div className="text-white font-bold">
                    R$ {totalRepayment.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={principal > cityState.treasury || principal <= 0}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Transmitir Proposta de Empréstimo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
