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
}

export const FinanceDashboardView: React.FC<FinanceDashboardViewProps> = ({
  cityState,
  onAdvanceMonth,
  onToggleAutoTick,
  onOpenPolicies,
}) => {
  const isPayrollWarning = cityState.payrollRatio > 51.3;
  const isPayrollBreached = cityState.payrollRatio > 54.0;
  const isDebtBreached = cityState.debtRatio > 120.0;

  const cycle = cityState.economicCycle || {
    cycleDurationSeconds: 60,
    secondsRemaining: 60,
    autoTick: true,
    lastCycleNet: cityState.netMonthly,
    totalCyclesCompleted: 0,
  };

  const cycleProgress = Math.max(
    0,
    Math.min(100, ((60 - cycle.secondsRemaining) / 60) * 100)
  );

  const rev = cityState.revenueBreakdown || {
    iptu: Math.round(cityState.monthlyRevenue * 0.28),
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
    saudeSus: Math.round(cityState.monthlyExpenses * 0.2),
    educacaoMerenda: Math.round(cityState.monthlyExpenses * 0.18),
    segurancaGuarda: 40000,
    manutencaoUrbana: Math.round(cityState.monthlyExpenses * 0.1),
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
                Ciclo de Arrecadação & Liquidação Contábil (1 Minuto)
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Exercício: {cityState.monthName}/{cityState.year}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              A cada 60 segundos (1 minuto real), o sistema executa o recolhimento dos tributos do povo
              (IPTU, ISS, Multas de trânsito) e repasses do governo (FPM, ICMS, Royalties), e realiza o
              pagamento da folha salarial dos servidores e custeio das empresas públicas.
            </p>
          </div>

          {/* Temporizador Regressivo */}
          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-center min-w-[70px]">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Próximo Balanço</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {String(cycle.secondsRemaining).padStart(2, '0')}s
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
                {60 - cycle.secondsRemaining}/60 segundos
              </span>
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              Saldo Projetado ao Tesouro: {cityState.netMonthly >= 0 ? '+' : ''}R${' '}
              {cityState.netMonthly.toLocaleString()}/min
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
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">IPTU & Contribuição Predial</span>
              <span className="font-semibold text-slate-200">
                R$ {rev.iptu.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">
                ISS (Serviços, Comércio & Turismo)
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
          </div>
        </div>

        {/* DESPESAS MUNICIPAIS */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              Despesas & Custeio Público (a cada 1 min)
            </h3>
            <span className="font-black text-rose-400 tabular-nums text-base">
              -R$ {cityState.monthlyExpenses.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">
                Folha Salarial (Piso: R$ {cityState.minimumWage?.toLocaleString() || '1.412'})
              </span>
              <span className="font-semibold text-rose-300">
                R$ {exp.payroll.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Custeio SUS (Postos de Saúde & Remédios)</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.saudeSus.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Educação (Merenda & Escolas)</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.educacaoMerenda.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Segurança Urbana & Guarda Municipal</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.segurancaGuarda.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Manutenção Urbana, Asfalto & Iluminação</span>
              <span className="font-semibold text-slate-200">
                R$ {exp.manutencaoUrbana.toLocaleString()}
              </span>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
