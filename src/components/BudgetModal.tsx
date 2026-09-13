import React from 'react';
import { CityBudget } from '../types';
import { sounds } from '../audio/soundManager';
import { X, DollarSign, TrendingUp, TrendingDown, Landmark, Sliders } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: CityBudget;
  onUpdateBudget: (newBudget: CityBudget) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budget,
  onUpdateBudget,
}) => {
  if (!isOpen) return null;

  const net = budget.lastMonthIncome.total - budget.lastMonthExpenses.total;

  const updateTax = (field: 'taxRateResidential' | 'taxRateCommercial' | 'taxRateIndustrial', val: number) => {
    onUpdateBudget({
      ...budget,
      [field]: val,
    });
  };

  const updateDept = (
    field:
      | 'roadBudgetPercent'
      | 'policeBudgetPercent'
      | 'fireBudgetPercent'
      | 'healthBudgetPercent'
      | 'educationBudgetPercent',
    val: number
  ) => {
    onUpdateBudget({
      ...budget,
      [field]: val,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Tesouro Municipal & Orçamento</h2>
              <p className="text-xs text-slate-400">Ajuste as taxas de impostos e o financiamento dos serviços públicos</p>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-200">
          {/* Top Treasury Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Saldo em Caixa</span>
              <span className={`text-xl font-black ${budget.treasury >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${budget.treasury.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Receitas do Mês
              </span>
              <span className="text-xl font-black text-emerald-400">
                +${budget.lastMonthIncome.total.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-red-400" /> Despesas do Mês
              </span>
              <span className="text-xl font-black text-red-400">
                -${budget.lastMonthExpenses.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tax Rates Sliders */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Sliders className="w-4 h-4" />
              <span>Alíquotas de Impostos Municipais</span>
            </div>

            <div className="space-y-3">
              {/* Residential Tax */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400 font-semibold">Imposto Residencial (Habitação)</span>
                  <span className="font-bold text-white">{budget.taxRateResidential}% (+$ {budget.lastMonthIncome.residentialTax}/mês)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={budget.taxRateResidential}
                  onChange={(e) => updateTax('taxRateResidential', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Commercial Tax */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400 font-semibold">Imposto Comercial (Comércio & Escritórios)</span>
                  <span className="font-bold text-white">{budget.taxRateCommercial}% (+$ {budget.lastMonthIncome.commercialTax}/mês)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={budget.taxRateCommercial}
                  onChange={(e) => updateTax('taxRateCommercial', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Industrial Tax */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-amber-400 font-semibold">Imposto Industrial (Fábricas & Logística)</span>
                  <span className="font-bold text-white">{budget.taxRateIndustrial}% (+$ {budget.lastMonthIncome.industrialTax}/mês)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={budget.taxRateIndustrial}
                  onChange={(e) => updateTax('taxRateIndustrial', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * Nota: Impostos acima de 10% desaceleram a imigração e desagradam os cidadãos. Impostos entre 7% e 9% são ideais para crescimento equilibrado.
            </p>
          </div>

          {/* Department Budget Funding */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <DollarSign className="w-4 h-4" />
              <span>Financiamento dos Departamentos Municipais</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roads */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Vias & Pavimentação</span>
                  <span className="font-bold">{budget.roadBudgetPercent}% (${budget.lastMonthExpenses.roads}/mês)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={budget.roadBudgetPercent}
                  onChange={(e) => updateDept('roadBudgetPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>

              {/* Police */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-400">Segurança Policial</span>
                  <span className="font-bold">{budget.policeBudgetPercent}% (${budget.lastMonthExpenses.police}/mês)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={budget.policeBudgetPercent}
                  onChange={(e) => updateDept('policeBudgetPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Fire */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-400">Corpo de Bombeiros</span>
                  <span className="font-bold">{budget.fireBudgetPercent}% (${budget.lastMonthExpenses.fire}/mês)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={budget.fireBudgetPercent}
                  onChange={(e) => updateDept('fireBudgetPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>

              {/* Health */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pink-400">Saúde & Hospitais</span>
                  <span className="font-bold">{budget.healthBudgetPercent}% (${budget.lastMonthExpenses.health}/mês)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={budget.healthBudgetPercent}
                  onChange={(e) => updateDept('healthBudgetPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Education */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-400">Educação & Escolas</span>
                  <span className="font-bold">{budget.educationBudgetPercent}% (${budget.lastMonthExpenses.education}/mês)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={budget.educationBudgetPercent}
                  onChange={(e) => updateDept('educationBudgetPercent', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * Reduzir o financiamento economiza dinheiro, mas diminui o raio de atuação e eficácia dos departamentos.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Fluxo Mensal Estimado:</span>
            <span className={`font-bold ${net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {net >= 0 ? `+$${net.toLocaleString()}` : `-$${Math.abs(net).toLocaleString()}`}/mês
            </span>
          </div>
          <button
            onClick={() => {
              sounds.playCash();
              onClose();
            }}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
          >
            Aplicar Orçamento
          </button>
        </div>
      </div>
    </div>
  );
};
