import React from 'react';
import {
  Landmark,
  Scale,
  AlertOctagon,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  FileSpreadsheet,
  Building2,
  DollarSign,
  Briefcase,
  Clock,
  Play,
  Pause,
  ArrowRight,
  Sliders,
  Car,
  Mail,
  Droplets,
  Bus,
} from 'lucide-react';
import { PrefeitoCityState } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface FinanceDashboardViewProps {
  cityState: PrefeitoCityState;
  onAdvanceMonth?: () => void;
  onToggleAutoTick?: () => void;
  onOpenPolicies?: () => void;
  onUpdateDepartmentBudget?: (
    dept: 'educacao' | 'saude' | 'segurancaGuarda' | 'bombeirosDefesaCivil' | 'energiaIluminacao',
    amount: number,
    focus: string
  ) => void;
  onUpdateTaxRates?: (rates: {
    iptuPercent?: number;
    issPercent?: number;
    itbiPercent?: number;
    taxaIluminacaoCip?: number;
    resPobresPercent?: number;
    resMediosPercent?: number;
    resRicosPercent?: number;
    comPobresPercent?: number;
    comMediosPercent?: number;
    comRicosPercent?: number;
    indPobresPercent?: number;
    indMediosPercent?: number;
    indRicosPercent?: number;
    [key: string]: any;
  }) => void;
  onOpenLoansModal?: () => void;
}

export const FinanceDashboardView: React.FC<FinanceDashboardViewProps> = ({
  cityState,
  onAdvanceMonth,
  onToggleAutoTick,
  onOpenPolicies,
  onUpdateDepartmentBudget,
  onUpdateTaxRates,
  onOpenLoansModal,
}) => {
  const isPayrollWarning = cityState.payrollRatio > 51.3;
  const isPayrollBreached = cityState.payrollRatio > 54.0;
  const isDebtBreached = cityState.debtRatio > 120.0;

  const cycle = cityState.economicCycle || {
    cycleDurationSeconds: 120,
    secondsRemaining: 120,
    autoTick: true,
    lastCycleNet: cityState.netMonthly,
    totalCyclesCompleted: 0,
  };

  const cycleDuration = cycle.cycleDurationSeconds || 120;
  const cycleProgress = Math.max(
    0,
    Math.min(100, ((cycleDuration - cycle.secondsRemaining) / cycleDuration) * 100)
  );

  const deptBudgets = cityState.departmentBudgets || {
    educacao: { budgetMonthly: 60000, focus: 'merenda', effectiveness: 72 },
    saude: { budgetMonthly: 75000, focus: 'upas_24h', effectiveness: 68 },
    segurancaGuarda: { budgetMonthly: 40000, focus: 'patrulhamento_bairros', effectiveness: 65 },
    bombeirosDefesaCivil: { budgetMonthly: 30000, focus: 'prevencao_enchentes', effectiveness: 62 },
    energiaIluminacao: { budgetMonthly: 35000, focus: 'led_100', effectiveness: 70 },
  };

  const taxRates = cityState.taxRates || {
    iptuPercent: 1.2,
    issPercent: 3.5,
    itbiPercent: 2.0,
    taxaIluminacaoCip: 18.0,
    resPobresPercent: 6.0,
    resMediosPercent: 8.5,
    resRicosPercent: 11.0,
  };

  const loans = cityState.intermunicipalLoans || [];
  const loansGivenActive = loans.filter((l) => l.lenderCity === cityState.cityName && l.status === 'active');
  const loansTakenActive = loans.filter((l) => l.borrowerCity === cityState.cityName && l.status === 'active');

  const rev = cityState.revenueBreakdown || {
    iptu: Math.round(cityState.monthlyRevenue * 0.28),
    resPobres: Math.round(cityState.monthlyRevenue * 0.06),
    resMedios: Math.round(cityState.monthlyRevenue * 0.14),
    resRicos: Math.round(cityState.monthlyRevenue * 0.08),
    iss: Math.round(cityState.monthlyRevenue * 0.32),
    fpmIcms: Math.round(cityState.monthlyRevenue * 0.25),
    multasTransito: 55000,
    royaltiesPetroleo: cityState.oilRoyaltiesMonthly,
    cfemOuro: cityState.goldTaxesMonthly,
    lucroEstatais: 0,
    total: cityState.monthlyRevenue,
  };

  const exp = cityState.expenseBreakdown || {
    payroll: cityState.payrollExpense,
    previdenciaServidores: Math.round(cityState.payrollExpense * 0.14),
    saudeSus: Math.round(cityState.monthlyExpenses * 0.16),
    medicamentosInsumosSaude: 28000,
    educacaoMerenda: Math.round(cityState.monthlyExpenses * 0.13),
    transporteEscolarMerenda: 24000,
    assistenciaSocialVulneraveis: 22000,
    segurancaGuarda: 40000,
    limpezaResiduosAterro: 32000,
    combustivelManutencaoFrota: 26000,
    energiaPrediosPublicos: 22000,
    sistemasDigitaisTi: 15000,
    manutencaoUrbana: Math.round(cityState.monthlyExpenses * 0.08),
    manutencaoMegaObras: 0,
    subsidioEstatais: 35000,
    amortizacaoDivida: Math.round(cityState.monthlyExpenses * 0.05),
    total: cityState.monthlyExpenses,
  };

  return (
    <div className="space-y-6">
      {/* Header Fiscal */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            Secretaria da Fazenda & Planejamento Orçamentário
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Ciclo Financeiro, Arrecadação & Lei de Responsabilidade Fiscal
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
            Como na vida real, a Prefeitura apura suas receitas de impostos do povo e governos a cada
            minuto e paga os salários, serviços e estatais dentro dos limites da LRF.
          </p>
        </div>

        {/* Rating CAPAG em Destaque */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Rating STN (CAPAG)
            </span>
            <span className="text-xs text-slate-300">
              {cityState.fiscalRating === 'A'
                ? 'Excelente (Crédito Total)'
                : cityState.fiscalRating === 'B'
                ? 'Bom (Aprovável no BNDES)'
                : cityState.fiscalRating === 'C'
                ? 'Alerta (BNDES Bloqueado)'
                : 'Crítico (Inadimplente)'}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl border ${
              cityState.fiscalRating === 'A'
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                : cityState.fiscalRating === 'B'
                ? 'bg-blue-950 text-blue-400 border-blue-500'
                : cityState.fiscalRating === 'C'
                ? 'bg-amber-950 text-amber-400 border-amber-500'
                : 'bg-rose-950 text-rose-400 border-rose-500'
            }`}
          >
            {cityState.fiscalRating}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* CARD DO CICLO FINANCEIRO EM TEMPO REAL (1 MINUTO) */}
      {/* ==================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-5 rounded-xl border border-amber-500/30 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
              </span>
              <h3 className="font-bold text-sm md:text-base text-white">
                Ciclo de Arrecadação & Liquidação Contábil (2 Minutos)
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Data: {String(cityState.day || 15).padStart(2, '0')}/{String(cityState.month || 9).padStart(2, '0')}/{cityState.year || 2026}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              A cada 120 segundos (2 minutos reais), o sistema executa o recolhimento dos tributos municipais
              (IPTU, ISS, Multas de trânsito) e repasses governamentais (FPM, ICMS, Royalties), e realiza o
              pagamento da folha salarial dos servidores e custeio das estatais. Os dias no mandato avançam a cada 24 horas (início em 15/09/2026).
            </p>
          </div>

          {/* Temporizador Regressivo */}
          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-center min-w-[80px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Próximo Balanço</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {Math.floor(cycle.secondsRemaining / 60)}:{String(cycle.secondsRemaining % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              {onToggleAutoTick && (
                <button
                  type="button"
                  onClick={onToggleAutoTick}
                  className={`p-2 rounded-lg text-xs font-bold transition-all ${
                    cycle.autoTick
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                  title={cycle.autoTick ? 'Pausar Ciclo Automático' : 'Retomar Ciclo Automático'}
                >
                  {cycle.autoTick ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              )}

              {onAdvanceMonth && (
                <button
                  type="button"
                  onClick={onAdvanceMonth}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black shadow flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Executar Fechamento Fiscal Imediato (Credita receitas e debita despesas)"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Fechar Agora
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Progresso do Ciclo */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>Arrecadação e Pagamentos em andamento:</span>
              <span className="text-slate-200 font-mono font-bold">
                {cycleDuration - cycle.secondsRemaining}/{cycleDuration}s
              </span>
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              Saldo Projetado ao Tesouro: {cityState.netMonthly >= 0 ? '+' : ''}R${' '}
              {cityState.netMonthly.toLocaleString()} / 2min
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${cycleProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Ratios Oficiais da LRF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Folha de Pagamento */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-sky-400" />
              Gastos com Pessoal / Folha (Limite 54%)
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                isPayrollBreached
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : isPayrollWarning
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-600'
              }`}
            >
              {cityState.payrollRatio}% da RCL
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isPayrollBreached
                  ? 'bg-rose-500'
                  : isPayrollWarning
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (cityState.payrollRatio / 54) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span>
              Folha Mensal: R$ {cityState.payrollExpense.toLocaleString()} (Piso: R${' '}
              {cityState.minimumWage?.toLocaleString() || '1.412'})
            </span>
            <span>Limite Máximo: 54.0%</span>
          </div>

          {onOpenPolicies && (
            <button
              type="button"
              onClick={onOpenPolicies}
              className="mt-3 w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              Ajustar Piso Salarial / Políticas Públicas
            </button>
          )}
        </div>

        {/* Dívida Consolidada */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              Endividamento Consolidado (Limite 120%)
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                isDebtBreached
                  ? 'bg-rose-950 text-rose-300 border-rose-600'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-600'
              }`}
            >
              {cityState.debtRatio}% da RCL Anual
            </span>
          </div>

          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 mb-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isDebtBreached ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (cityState.debtRatio / 120) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400">
            <span>Dívida Atual: R$ {cityState.debt.toLocaleString()}</span>
            <span>Limite Res. Senado: 120.0%</span>
          </div>
        </div>
      </div>

      {/* Demonstrativo Contábil Detalhado por Rubrica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RECEITAS MUNICIPAIS */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Receitas do Povo & Governos (a cada 1 min)
            </h3>
            <span className="font-black text-emerald-400 tabular-nums text-base">
              +R$ {cityState.monthlyRevenue.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* IPTU por Classes Sociais */}
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
              <div className="flex justify-between items-center text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  IPTU Total Arrecadado
                </span>
                <span className="text-emerald-400 font-bold">R$ {rev.iptu.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] border-t border-slate-800/60">
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <div className="text-sky-400 font-bold flex items-center justify-between">
                    <span>Cl. Baixa</span>
                    <span className="text-[10px] text-slate-400 font-mono">{taxRates.resPobresPercent ?? 6}%</span>
                  </div>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    R$ {(rev.resPobres ?? Math.round(rev.iptu * 0.22)).toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <div className="text-emerald-400 font-bold flex items-center justify-between">
                    <span>Cl. Média</span>
                    <span className="text-[10px] text-slate-400 font-mono">{taxRates.resMediosPercent ?? 8.5}%</span>
                  </div>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    R$ {(rev.resMedios ?? Math.round(rev.iptu * 0.48)).toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  <div className="text-amber-400 font-bold flex items-center justify-between">
                    <span>Cl. Alta / Ricos</span>
                    <span className="text-[10px] text-slate-400 font-mono">{taxRates.resRicosPercent ?? 11}%</span>
                  </div>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    R$ {(rev.resRicos ?? Math.round(rev.iptu * 0.30)).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">
                ISS (Serviços, Comércio & Turismo - {taxRates.issPercent ?? 3.5}%)
              </span>
              <span className="font-semibold text-slate-200">
                R$ {rev.iss.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Cota-Parte FPM (União) & ICMS (Estado)</span>
              <span className="font-semibold text-slate-200">
                R$ {rev.fpmIcms.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                Multas de Trânsito & Fiscalização (
                {cityState.trafficFineSeverity === 'rigorosa'
                  ? 'Rigorosa'
                  : cityState.trafficFineSeverity === 'educativa'
                  ? 'Educativa'
                  : 'Padrão'}
                )
              </span>
              <span className="font-semibold text-amber-300">
                R$ {rev.multasTransito.toLocaleString()}
              </span>
            </div>
            {cityState.oilRoyaltiesMonthly > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-amber-300">
                <span className="font-medium">🛢️ Royalties de Petróleo (ANP)</span>
                <span className="font-bold">+R$ {cityState.oilRoyaltiesMonthly.toLocaleString()}</span>
              </div>
            )}
            {cityState.goldTaxesMonthly > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-yellow-300">
                <span className="font-medium">⛏️ CFEM Mineração (Ouro & Minérios)</span>
                <span className="font-bold">+R$ {cityState.goldTaxesMonthly.toLocaleString()}</span>
              </div>
            )}
            {rev.lucroEstatais > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-teal-300">
                <span className="font-medium">🏛️ Lucros & Dividendos de Estatais</span>
                <span className="font-bold">+R$ {rev.lucroEstatais.toLocaleString()}</span>
              </div>
            )}
            {/* Receitas Soberanas da Presidência */}
            {((cityState.tradeBalance?.netTradeBalanceBrl || 0) > 0) && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-emerald-300">
                <span className="font-medium">🚢 Superávit da Balança Comercial (Divisas Exportação)</span>
                <span className="font-bold">+R$ {Math.round((cityState.tradeBalance?.netTradeBalanceBrl || 0) * 0.15).toLocaleString()}</span>
              </div>
            )}
            {((cityState.tradeBalance?.totalImportUsd || 0) > 0) && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-indigo-300">
                <span className="font-medium">🏷️ Imposto de Importação Federal (Tarifa CAMEX)</span>
                <span className="font-bold">
                  +R${' '}
                  {Math.round(
                    (cityState.tradeBalance?.totalImportUsd || 0) *
                      ((cityState.tradeBalance?.importTariffAveragePercent || 12) / 100) *
                      (cityState.tradeBalance?.dollarExchangeRate || 5.42)
                  ).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DESPESAS MUNICIPAIS & FEDERAIS */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              Despesas Públicas & Custeio da República
            </h3>
            <span className="font-black text-rose-400 tabular-nums text-base">
              -R$ {cityState.monthlyExpenses.toLocaleString()}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">
                Folha Salarial dos Servidores (Piso: R$ {cityState.minimumWage?.toLocaleString() || '1.412'})
              </span>
              <span className="font-semibold text-rose-300">
                R$ {exp.payroll.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Previdência Municipal dos Servidores (RPPS)</span>
              <span className="font-semibold text-rose-300/90">
                R$ {(exp.previdenciaServidores ?? Math.round(exp.payroll * 0.14)).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Custeio Saúde SUS (Hospitais, UPAs & Equipes Médicas)</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.saudeSus.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Medicamentos de Alto Custo, Insumos & Farmácia Básica</span>
              <span className="font-semibold text-slate-200">
                R$ {(exp.medicamentosInsumosSaude ?? 28000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Educação (Manutenção de Escolas & Creches)</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.educacaoMerenda.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Transporte Escolar Gratuito & Merenda Nutritiva</span>
              <span className="font-semibold text-slate-200">
                R$ {(exp.transporteEscolarMerenda ?? 24000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Assistência Social, CRAS, Abrigos & Famílias Vulneráveis</span>
              <span className="font-semibold text-slate-200">
                R$ {(exp.assistenciaSocialVulneraveis ?? 22000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Segurança Urbana & Guarda Municipal</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.segurancaGuarda.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Limpeza Urbana, Coleta de Lixo & Aterro Sanitário</span>
              <span className="font-semibold text-slate-200">
                R$ {(exp.limpezaResiduosAterro ?? 32000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Combustível, Óleo & Manutenção da Frota Municipal</span>
              <span className="font-semibold text-slate-200">
                R$ {(exp.combustivelManutencaoFrota ?? 26000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Manutenção Urbana, Asfalto, Galerias & Iluminação</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.manutencaoUrbana.toLocaleString()}
              </span>
            </div>
            {(exp.manutencaoMegaObras ?? 0) > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-amber-300">
                <span className="font-medium">
                  🏗️ Custeio Operacional de Megaprojetos (Metrô, Aeroporto, Anel Viário, Hospital)
                </span>
                <span className="font-bold">-R$ {exp.manutencaoMegaObras.toLocaleString()}</span>
              </div>
            )}
            {exp.subsidioEstatais > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800/50 text-amber-300">
                <span className="font-medium">
                  🚌 Subsídio a Estatais (Tarifa Zero / Correios Social)
                </span>
                <span className="font-bold">-R$ {exp.subsidioEstatais.toLocaleString()}</span>
              </div>
            )}
            {exp.amortizacaoDivida > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Amortização de Dívidas & Precatórios</span>
                <span className="font-semibold text-slate-200">
                  R$ {exp.amortizacaoDivida.toLocaleString()}
                </span>
              </div>
            )}
            {/* Custeio Soberano Federal da República */}
            <div className="flex justify-between py-1 border-b border-slate-800/50 text-rose-300">
              <span className="text-slate-400">🏛️ Juros Selic da Dívida Soberana ({cityState.interestRateSelic || 10.5}%)</span>
              <span className="font-semibold text-rose-300">
                -R$ {Math.round(((cityState.sovereignDebt || 18500000) * ((cityState.interestRateSelic || 10.5) / 100)) / 12).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50 text-rose-300">
              <span className="text-slate-400">🛡️ Déficit Previdenciário Nacional (INSS)</span>
              <span className="font-semibold text-rose-300">
                -R$ {(cityState.sovereignExpenses?.inssSocialSecurityDeficit ?? 42000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50 text-rose-300">
              <span className="text-slate-400">🎖️ Forças Armadas & Defesa Nacional</span>
              <span className="font-semibold text-rose-300">
                -R$ {(cityState.sovereignExpenses?.armedForcesDefense ?? 35000).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50 text-rose-300">
              <span className="text-slate-400">🏢 Esplanada dos Ministérios & Diplomacia</span>
              <span className="font-semibold text-rose-300">
                -R$ {(cityState.sovereignExpenses?.ministriesEsplanada ?? 28000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PAINEL DE CONTROLE DE ORÇAMENTO DAS SECRETARIAS */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Controle de Orçamento das Secretarias (Como na Vida Real)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              O Prefeito decide quanto enviar para cada pasta e a prioridade estratégica de atuação.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-300">
            Custeio Direto Total:{' '}
            <span className="font-bold text-rose-400">
              R${' '}
              {(
                deptBudgets.educacao.budgetMonthly +
                deptBudgets.saude.budgetMonthly +
                deptBudgets.segurancaGuarda.budgetMonthly +
                deptBudgets.bombeirosDefesaCivil.budgetMonthly +
                deptBudgets.energiaIluminacao.budgetMonthly
              ).toLocaleString()}
              /mês
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* EDUCAÇÃO */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                📚 Educação & Merenda
              </div>
              <span className="text-xs font-mono font-bold text-white">
                R$ {deptBudgets.educacao.budgetMonthly.toLocaleString()}/mês
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Prioridade de Gestão:
              </label>
              <select
                value={deptBudgets.educacao.focus}
                onChange={(e) =>
                  onUpdateDepartmentBudget?.('educacao', deptBudgets.educacao.budgetMonthly, e.target.value)
                }
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white"
              >
                <option value="merenda">Merenda Escolar de Qualidade</option>
                <option value="professores">Capacitação & Piso dos Professores</option>
                <option value="tecnologia">Tablets & Informática nas Escolas</option>
              </select>
            </div>

            <div className="flex gap-1.5 pt-1">
              {[40000, 60000, 85000, 110000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sounds.playClick();
                    onUpdateDepartmentBudget?.('educacao', val, deptBudgets.educacao.focus);
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded ${
                    deptBudgets.educacao.budgetMonthly === val
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  R$ {val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* SAÚDE */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-rose-400 flex items-center gap-1.5">
                🏥 Saúde & SUS Municipal
              </div>
              <span className="text-xs font-mono font-bold text-white">
                R$ {deptBudgets.saude.budgetMonthly.toLocaleString()}/mês
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Prioridade de Atendimento:
              </label>
              <select
                value={deptBudgets.saude.focus}
                onChange={(e) =>
                  onUpdateDepartmentBudget?.('saude', deptBudgets.saude.budgetMonthly, e.target.value)
                }
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white"
              >
                <option value="upas_24h">UPAs 24h & Médicos Plantonistas</option>
                <option value="medicamentos">Remédios Gratuitos nas Farmácias</option>
                <option value="postos_bairro">Postos de Saúde nos Bairros</option>
              </select>
            </div>

            <div className="flex gap-1.5 pt-1">
              {[50000, 75000, 100000, 130000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sounds.playClick();
                    onUpdateDepartmentBudget?.('saude', val, deptBudgets.saude.focus);
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded ${
                    deptBudgets.saude.budgetMonthly === val
                      ? 'bg-rose-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  R$ {val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* SEGURANÇA E POLÍCIA/GUARDA */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-indigo-400 flex items-center gap-1.5">
                🛡️ Polícia & Guarda Municipal
              </div>
              <span className="text-xs font-mono font-bold text-white">
                R$ {deptBudgets.segurancaGuarda.budgetMonthly.toLocaleString()}/mês
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Estratégia Policial:
              </label>
              <select
                value={deptBudgets.segurancaGuarda.focus}
                onChange={(e) =>
                  onUpdateDepartmentBudget?.(
                    'segurancaGuarda',
                    deptBudgets.segurancaGuarda.budgetMonthly,
                    e.target.value
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white"
              >
                <option value="patrulhamento_bairros">Rondas Motorizadas nos Bairros</option>
                <option value="cameras_inteligentes">Cercamento Digital & Câmeras IA</option>
                <option value="armamento_treinamento">Armamento & Treinamento Tático</option>
              </select>
            </div>

            <div className="flex gap-1.5 pt-1">
              {[25000, 40000, 60000, 85000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sounds.playClick();
                    onUpdateDepartmentBudget?.('segurancaGuarda', val, deptBudgets.segurancaGuarda.focus);
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded ${
                    deptBudgets.segurancaGuarda.budgetMonthly === val
                      ? 'bg-indigo-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  R$ {val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* BOMBEIROS E DEFESA CIVIL */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-orange-400 flex items-center gap-1.5">
                🚒 Bombeiros & Defesa Civil
              </div>
              <span className="text-xs font-mono font-bold text-white">
                R$ {deptBudgets.bombeirosDefesaCivil.budgetMonthly.toLocaleString()}/mês
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Foco Operacional:
              </label>
              <select
                value={deptBudgets.bombeirosDefesaCivil.focus}
                onChange={(e) =>
                  onUpdateDepartmentBudget?.(
                    'bombeirosDefesaCivil',
                    deptBudgets.bombeirosDefesaCivil.budgetMonthly,
                    e.target.value
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white"
              >
                <option value="prevencao_enchentes">Prevenção a Enchentes & Encostas</option>
                <option value="resgate_rapido">Ambulâncias & Resgate Rápido</option>
                <option value="novas_viaturas">Caminhões Autobomba Modernos</option>
              </select>
            </div>

            <div className="flex gap-1.5 pt-1">
              {[20000, 30000, 45000, 65000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sounds.playClick();
                    onUpdateDepartmentBudget?.(
                      'bombeirosDefesaCivil',
                      val,
                      deptBudgets.bombeirosDefesaCivil.focus
                    );
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded ${
                    deptBudgets.bombeirosDefesaCivil.budgetMonthly === val
                      ? 'bg-orange-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  R$ {val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* ENERGIA E ILUMINAÇÃO PÚBLICA */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                ⚡ Energia & Iluminação Pública
              </div>
              <span className="text-xs font-mono font-bold text-white">
                R$ {deptBudgets.energiaIluminacao.budgetMonthly.toLocaleString()}/mês
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Projeto Energético:
              </label>
              <select
                value={deptBudgets.energiaIluminacao.focus}
                onChange={(e) =>
                  onUpdateDepartmentBudget?.(
                    'energiaIluminacao',
                    deptBudgets.energiaIluminacao.budgetMonthly,
                    e.target.value
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg p-2 text-white"
              >
                <option value="led_100">100% LED em Avenidas & Praças</option>
                <option value="expansao_periferia">Expansão da Rede para Periferia</option>
                <option value="eficiencia">Energia Solar em Prédios Públicos</option>
              </select>
            </div>

            <div className="flex gap-1.5 pt-1">
              {[20000, 35000, 50000, 75000].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    sounds.playClick();
                    onUpdateDepartmentBudget?.(
                      'energiaIluminacao',
                      val,
                      deptBudgets.energiaIluminacao.focus
                    );
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded ${
                    deptBudgets.energiaIluminacao.budgetMonthly === val
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  R$ {val / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* TRIBUTOS E IMPOSTOS MUNICIPAIS POR CLASSES SOCIAIS */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40 space-y-3.5 shadow-sm col-span-1 md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800 pb-2">
              <div>
                <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  🏛️ Gestão Tributária por Classes Sociais & Atividades (SimCity)
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  A Prefeitura define as alíquotas de imposto diretamente sobre as classes baixa, média e alta. O equilíbrio fiscal é vital: impostos muito altos reduzem a aprovação e atraem evasão, enquanto impostos baixos atraem novos moradores e empresas.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shrink-0">
                Poder Executivo Municipal
              </span>
            </div>

            {/* SELETORES POR CLASSE SOCIAL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* CLASSE BAIXA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-sky-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                    👥 Classe Baixa / Popular
                  </span>
                  <span className="text-[11px] font-mono font-bold text-sky-200 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700">
                    {taxRates.resPobresPercent ?? 6.0}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Famílias de baixa renda e vilas populares. Alíquotas brandas elevam a aprovação popular e o consumo local.
                </p>
                <div className="flex items-center gap-1 pt-1">
                  {[4.0, 6.0, 8.0, 10.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        sounds.playClick();
                        onUpdateTaxRates?.({ ...taxRates, resPobresPercent: rate });
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                        (taxRates.resPobresPercent ?? 6.0) === rate
                          ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* CLASSE MÉDIA */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    👔 Classe Média Trabalhadora
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                    {taxRates.resMediosPercent ?? 8.5}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Trabalhadores urbanos, servidores e profissionais liberais. É a espinha dorsal da arrecadação municipal.
                </p>
                <div className="flex items-center gap-1 pt-1">
                  {[6.0, 8.5, 11.0, 13.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        sounds.playClick();
                        onUpdateTaxRates?.({ ...taxRates, resMediosPercent: rate });
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                        (taxRates.resMediosPercent ?? 8.5) === rate
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* CLASSE ALTA / RICOS */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    💎 Classe Alta & Ricos
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700">
                    {taxRates.resRicosPercent ?? 11.0}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Mansões, coberturas e condomínios de luxo. Alta contribuição por imóvel; moderação atrai grandes investidores.
                </p>
                <div className="flex items-center gap-1 pt-1">
                  {[8.0, 11.0, 14.0, 18.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        sounds.playClick();
                        onUpdateTaxRates?.({ ...taxRates, resRicosPercent: rate });
                      }}
                      className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                        (taxRates.resRicosPercent ?? 11.0) === rate
                          ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* IMPOSTOS COMPLEMENTARES: ISS E TAXA CIP */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">ISS Empresas & Serviços:</span>
                <div className="flex items-center gap-1">
                  {[2.5, 3.5, 5.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        sounds.playClick();
                        onUpdateTaxRates?.({ ...taxRates, issPercent: rate });
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        (taxRates.issPercent ?? 3.5) === rate
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Taxa CIP Iluminação:</span>
                <div className="flex items-center gap-1">
                  {[12, 18, 25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        sounds.playClick();
                        onUpdateTaxRates?.({ ...taxRates, taxaIluminacaoCip: rate });
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        (taxRates.taxaIluminacaoCip ?? 18) === rate
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      R$ {rate}/mês
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EMPRÉSTIMOS INTERMUNICIPAIS & COOPERAÇÃO REGIONAL */}
      <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 p-5 rounded-xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700">
              Cooperação Financeira Regional
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {loans.length} contratos ({loansGivenActive.length} a receber, {loansTakenActive.length} a pagar)
            </span>
          </div>
          <h3 className="text-base md:text-lg font-black text-white">
            Empréstimos entre Prefeituras & Mútuo Municipal
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mt-0.5">
            Cidades com caixa forte podem emprestar recursos a municípios vizinhos obtendo receitas de
            juros mensais, ou tomar crédito emergencial para cobrir investimentos essenciais.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playStamp();
            onOpenLoansModal?.();
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap self-start md:self-center"
        >
          <Landmark className="w-4 h-4" />
          Gerenciar Empréstimos Intermunicipais
        </button>
      </div>
    </div>
  );
};
