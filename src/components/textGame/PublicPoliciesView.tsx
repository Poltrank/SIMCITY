import React, { useState, useEffect } from 'react';
import {
  Building2,
  DollarSign,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Mail,
  Droplets,
  Bus,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Sliders,
  Scale,
  Car,
  FileCheck,
} from 'lucide-react';
import { PrefeitoCityState } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';

interface PublicPoliciesViewProps {
  cityState: PrefeitoCityState;
  onSetMinimumWage: (wage: number) => void;
  onSetPublicCompany: (company: 'correios' | 'saneamento' | 'transporte', status: string) => void;
  onSetTrafficFines: (severity: 'educativa' | 'padrao' | 'rigorosa') => void;
}

export const PublicPoliciesView: React.FC<PublicPoliciesViewProps> = ({
  cityState,
  onSetMinimumWage,
  onSetPublicCompany,
  onSetTrafficFines,
}) => {
  const currentWage = cityState.minimumWage || 1412;
  const [selectedWage, setSelectedWage] = useState<number>(currentWage);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'salario' | 'estatais' | 'multas'>('salario');

  // Sync selectedWage if cityState changes from outside
  useEffect(() => {
    setSelectedWage(currentWage);
  }, [currentWage]);

  // Auto-apply & auto-save wage with 350ms debounce when user adjusts slider
  useEffect(() => {
    if (selectedWage === currentWage) return;
    const timer = setTimeout(() => {
      handleApplyWage(selectedWage);
    }, 350);
    return () => clearTimeout(timer);
  }, [selectedWage, currentWage]);

  // Cálculo simulado para o preview do salário mínimo
  const simulatedRatio = selectedWage / 1412;
  const simulatedPayroll = Math.round(260000 * simulatedRatio);
  const simulatedCommerceBoost = Math.max(0, Math.round((selectedWage - 1412) * 50));
  const simulatedTotalRev = cityState.monthlyRevenue + simulatedCommerceBoost;
  const simulatedLrfRatio = Number(((simulatedPayroll / Math.max(1, simulatedTotalRev)) * 100).toFixed(1));
  const simulatedPayrollDiff = simulatedPayroll - (cityState.expenseBreakdown?.payroll || 260000);

  const wagePresets = [
    { label: 'Padrão Nacional', wage: 1412, note: 'Piso federal vigente' },
    { label: 'Reajuste +10%', wage: 1550, note: 'Ganho real moderado' },
    { label: 'Piso Valorizado (+24%)', wage: 1750, note: 'Estímulo ao comércio' },
    { label: 'Piso Cidadania (+41%)', wage: 2000, note: 'Forte valorização' },
    { label: 'Piso Superior (+59%)', wage: 2250, note: 'Excelência municipal' },
    { label: 'Piso Máximo (+77%)', wage: 2500, note: 'Teto da categoria' },
  ];

  const handleApplyWage = (targetWage?: number) => {
    const wageToApply = targetWage !== undefined ? targetWage : selectedWage;
    sounds.playStamp();
    onSetMinimumWage(wageToApply);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Painel de Políticas */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            Gabinete de Governança & Políticas Públicas
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            Piso Salarial, Correios & Controle das Empresas Públicas
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Como prefeito soberano, você define o salário mínimo municipal, decide se os Correios e o Transporte
            operam com interesse social ou geram lucros para o caixa, e calibra a fiscalização de trânsito.
          </p>
        </div>

        {/* Sub-navegação interna */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => {
              setActiveTab('salario');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'salario'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Salário Mínimo
          </button>
          <button
            onClick={() => {
              setActiveTab('estatais');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'estatais'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Correios & Estatais
          </button>
          <button
            onClick={() => {
              setActiveTab('multas');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'multas'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            Multas de Trânsito
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* ABA 1: SALÁRIO MÍNIMO / PISO MUNICIPAL */}
      {/* ==================================================== */}
      {activeTab === 'salario' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna de Configuração */}
          <div className="lg:col-span-7 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Piso Salarial do Município (Salário Mínimo)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Regulamenta o piso dos servidores, categorias municipais e baliza os salários locais.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Piso Vigente</span>
                <span className="text-lg font-black text-emerald-400">
                  R$ {currentWage.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Presets de valor rápido */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">
                  Escolha o patamar (clique para salvar imediatamente):
                </label>
                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com sucesso!
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {wagePresets.map((preset) => (
                  <button
                    key={preset.wage}
                    type="button"
                    onClick={() => {
                      setSelectedWage(preset.wage);
                      handleApplyWage(preset.wage);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      currentWage === preset.wage
                        ? 'bg-emerald-950/50 border-2 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500'
                        : selectedWage === preset.wage
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">{preset.label}</span>
                        {currentWage === preset.wage && (
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1 py-0.5 rounded">
                            ATIVO
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-black text-amber-400 mt-1">
                        R$ {preset.wage.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{preset.note}</div>
                    </div>

                    <div
                      className={`mt-2 w-full py-1 text-[10px] font-bold rounded text-center transition-colors ${
                        currentWage === preset.wage
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300'
                      }`}
                    >
                      {currentWage === preset.wage ? '✓ ATIVO & SALVO' : 'Escolher & Salvar'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de ajuste fino com botões rápidos */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Ajuste Fino do Valor:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-black text-base">
                    R$ {selectedWage.toLocaleString()}
                  </span>
                  {currentWage === selectedWage && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      ✓ Salvo
                    </span>
                  )}
                </div>
              </div>

              {/* Controles de botões de passo rápido para facilitar no celular */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1300, selectedWage - 100);
                    setSelectedWage(next);
                    handleApplyWage(next);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-bold"
                >
                  - R$ 100
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1300, selectedWage - 50);
                    setSelectedWage(next);
                    handleApplyWage(next);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-bold"
                >
                  - R$ 50
                </button>

                <div className="flex-1 px-1">
                  <input
                    type="range"
                    min={1300}
                    max={2500}
                    step={25}
                    value={selectedWage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSelectedWage(val);
                    }}
                    onTouchEnd={() => handleApplyWage(selectedWage)}
                    onMouseUp={() => handleApplyWage(selectedWage)}
                    onPointerUp={() => handleApplyWage(selectedWage)}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(2500, selectedWage + 50);
                    setSelectedWage(next);
                    handleApplyWage(next);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-bold"
                >
                  + R$ 50
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(2500, selectedWage + 100);
                    setSelectedWage(next);
                    handleApplyWage(next);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 font-bold"
                >
                  + R$ 100
                </button>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>R$ 1.300 (Austeridade)</span>
                <span>R$ 1.412 (Federal)</span>
                <span>R$ 1.800</span>
                <span>R$ 2.500 (Máximo)</span>
              </div>
            </div>

            {/* Botão de Decretar / Salvar com alto destaque */}
            <div className="pt-2 bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-300 w-full sm:w-auto">
                {savedSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Piso Salarial de R$ {currentWage.toLocaleString()} salvo e sancionado no Diário Oficial!
                  </span>
                ) : selectedWage !== currentWage ? (
                  <span className="text-amber-300 font-medium">
                    Salvando automaticamente: R$ {selectedWage.toLocaleString()} (Variação: {selectedWage > currentWage ? '+' : ''}R$ {(selectedWage - currentWage).toLocaleString()})
                  </span>
                ) : (
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Piso Salarial Municipal em vigor:{' '}
                    <strong className="text-emerald-400 font-bold">R$ {currentWage.toLocaleString()}</strong> (Salvo no Diário Oficial)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleApplyWage()}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  savedSuccess || selectedWage === currentWage
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/30 ring-2 ring-amber-400'
                }`}
              >
                {savedSuccess || selectedWage === currentWage ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ✓ SALVO E PROMULGADO
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    💾 CONFIRMAR PISO: R$ {selectedWage.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Coluna de Impacto Simulado em Tempo Real */}
          <div className="lg:col-span-5 bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Scale className="w-4 h-4 text-sky-400" />
              Impacto no Orçamento & LRF (Simulação)
            </h4>

            {/* Folha Salarial & LRF */}
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Despesa Mensal da Folha:</span>
                  <span className="font-bold text-slate-200">
                    R$ {simulatedPayroll.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Variação no Custeio:</span>
                  <span
                    className={`font-semibold ${
                      simulatedPayrollDiff > 0
                        ? 'text-rose-400'
                        : simulatedPayrollDiff < 0
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {simulatedPayrollDiff > 0 ? '+' : ''}
                    R$ {simulatedPayrollDiff.toLocaleString()}/mês
                  </span>
                </div>
              </div>

              {/* Indicador de LRF */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-medium">
                    Projeção Folha / RCL (Limite LRF 54%):
                  </span>
                  <span
                    className={`font-black px-2 py-0.5 rounded text-xs border ${
                      simulatedLrfRatio > 54
                        ? 'bg-rose-950 text-rose-300 border-rose-600'
                        : simulatedLrfRatio > 51.3
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    }`}
                  >
                    {simulatedLrfRatio}%
                  </span>
                </div>
                {simulatedLrfRatio > 54 && (
                  <p className="text-[10px] text-rose-400 mt-1">
                    ⚠️ Atenção: ultrapassa o limite prudencial da LRF! Pode rebaixar o rating CAPAG
                    e impedir contratos com o BNDES.
                  </p>
                )}
              </div>

              {/* Efeito no Comércio e ISS */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 font-medium">Injeção no Comércio & ISS:</span>
                  <span className="font-bold text-emerald-400">
                    +R$ {simulatedCommerceBoost.toLocaleString()}/mês
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Famílias com maior salário gastam nos mercados, padarias e farmácias locais,
                  aquecendo o imposto ISS municipal.
                </p>
              </div>

              {/* Reação Política */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="font-bold text-slate-300 block">Reação Política Prevista:</span>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Aprovação dos Trabalhadores:</span>
                  <span className="font-bold text-emerald-400">
                    {selectedWage > currentWage ? '▲ Alta satisfação popular' : selectedWage < currentWage ? '▼ Greves e protestos' : '— Estável'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Câmara de Vereadores:</span>
                  <span className="font-bold text-slate-300">
                    {selectedWage > 1800 ? 'Cobrança por corte de comissionados' : 'Base aliada apoia'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ABA 2: CORREIOS & EMPRESAS PÚBLICAS */}
      {/* ==================================================== */}
      {activeTab === 'estatais' && (
        <div className="space-y-6">
          {/* 1. CORREIOS & LOGÍSTICA MUNICIPAL */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Correios & Logística de Porto (Empresa Pública Municipal)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Atualmente operando como:{' '}
                  <span className="text-amber-300 font-bold uppercase">
                    {cityState.publicCompanies.correios.status}
                  </span>{' '}
                  • Resultado mensal:{' '}
                  <span
                    className={
                      cityState.publicCompanies.correios.monthlyResult >= 0
                        ? 'text-emerald-400 font-bold'
                        : 'text-rose-400 font-bold'
                    }
                  >
                    {cityState.publicCompanies.correios.monthlyResult >= 0 ? '+' : ''}
                    R$ {cityState.publicCompanies.correios.monthlyResult.toLocaleString()}/mês
                  </span>
                </p>
              </div>

              <div className="text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto text-slate-300">
                Cobertura Territorial:{' '}
                <span className="font-bold text-amber-400">
                  {cityState.publicCompanies.correios.coveragePercent}% da cidade
                </span>
              </div>
            </div>

            {/* Opção Atual Salva */}
            <div className="mb-4 px-4 py-2.5 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  Opção Vigente Salva:{' '}
                  <strong className="text-emerald-400 font-bold uppercase">
                    {cityState.publicCompanies.correios.status === 'social'
                      ? 'Empresa Pública de Interesse Social'
                      : cityState.publicCompanies.correios.status === 'lucrativa'
                      ? 'Empresa Pública Lucrativa & Logística'
                      : 'Concessão / Terceirização Privada'}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                ✓ Salvo no Diário Oficial
              </span>
            </div>

            {/* Opções de Modelo de Gestão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Modelo Social */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.correios.status === 'social'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Empresa Pública de Interesse Social</span>
                  {cityState.publicCompanies.correios.status === 'social' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Entrega universal garantida. Distribui correspondências, faturas e medicamentos do SUS
                  em 95% dos morros, periferias e zona rural sem custo para os moradores.
                </p>
                <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                  <div className="flex justify-between text-rose-400">
                    <span>Custo ao Tesouro:</span>
                    <span>-R$ 35.000/mês</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Aprovação Popular:</span>
                    <span>+6% nas comunidades</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('correios', 'social')}
                  disabled={cityState.publicCompanies.correios.status === 'social'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.correios.status === 'social'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.correios.status === 'social'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Modelo Social'}
                </button>
              </div>

              {/* Modelo Lucrativo de E-commerce */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.correios.status === 'lucrativa'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Empresa Pública Lucrativa & Logística</span>
                  {cityState.publicCompanies.correios.status === 'lucrativa' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Cria centro de distribuição municipal integrado a lojas virtuais e fretes de carga. A
                  empresa gera lucros comerciais que são creditados no caixa da Prefeitura.
                </p>
                <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                  <div className="flex justify-between text-emerald-400">
                    <span>Dividendo ao Tesouro:</span>
                    <span className="font-bold">+R$ 80.000/mês</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cobertura de Entregas:</span>
                    <span>82% da área</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('correios', 'lucrativa')}
                  disabled={cityState.publicCompanies.correios.status === 'lucrativa'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.correios.status === 'lucrativa'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.correios.status === 'lucrativa'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Modelo Lucrativo'}
                </button>
              </div>

              {/* Concessão Privada */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.correios.status === 'concessao'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Concessão / Terceirização Privada</span>
                  {cityState.publicCompanies.correios.status === 'concessao' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Transfere a operação para transportadoras privadas. A Prefeitura recebe outorga milionária
                  à vista e zera custos de folha do setor.
                </p>
                <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                  <div className="flex justify-between text-emerald-400">
                    <span>Outorga à Vista no Caixa:</span>
                    <span className="font-bold">+R$ 1.800.000</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Custeio Mensal:</span>
                    <span>R$ 0</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('correios', 'concessao')}
                  disabled={cityState.publicCompanies.correios.status === 'concessao'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.correios.status === 'concessao'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.correios.status === 'concessao'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Concessão Privada'}
                </button>
              </div>
            </div>
          </div>

          {/* 2. TRANSPORTE COLETIVO: TARIFA ZERO VS SUBSIDIADO */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                    <Bus className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    TransPorto - Transporte Coletivo & Ônibus Municipais
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Status atual:{' '}
                  <span className="text-sky-300 font-bold uppercase">
                    {cityState.publicCompanies.transporte.status}
                  </span>{' '}
                  • Tarifa de Catraca:{' '}
                  <span className="text-amber-300 font-bold">
                    {cityState.publicCompanies.transporte.fareValue === 0
                      ? 'GRATUITA (R$ 0,00)'
                      : `R$ ${cityState.publicCompanies.transporte.fareValue.toFixed(2)}`}
                  </span>
                </p>
              </div>

              <div className="text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto text-slate-300">
                Frota em Circulação:{' '}
                <span className="font-bold text-sky-400">
                  {cityState.publicCompanies.transporte.busFleet} coletivos
                </span>
              </div>
            </div>

            {/* Opção Atual Salva */}
            <div className="mb-4 px-4 py-2.5 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  Opção Vigente Salva:{' '}
                  <strong className="text-emerald-400 font-bold uppercase">
                    {cityState.publicCompanies.transporte.status === 'tarifa_zero'
                      ? 'Tarifa Zero (Passe Livre 100%)'
                      : cityState.publicCompanies.transporte.status === 'subsidiada'
                      ? 'Tarifa Subsidiada (R$ 4,50)'
                      : 'Concessão Comercial Privada'}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                ✓ Salvo no Diário Oficial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tarifa Zero */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.transporte.status === 'tarifa_zero'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Tarifa Zero (Passe Livre 100%)</span>
                  {cityState.publicCompanies.transporte.status === 'tarifa_zero' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Catracas 100% liberadas para todo morador e trabalhador. Desemprego despenca,
                  comércio local lota de clientes e a aprovação popular dispara.
                </p>
                <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                  <div className="flex justify-between text-rose-400">
                    <span>Subsídio da Prefeitura:</span>
                    <span>-R$ 160.000/mês</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Aprovação Popular:</span>
                    <span className="font-bold">+16% recorde</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('transporte', 'tarifa_zero')}
                  disabled={cityState.publicCompanies.transporte.status === 'tarifa_zero'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.transporte.status === 'tarifa_zero'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.transporte.status === 'tarifa_zero'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Tarifa Zero'}
                </button>
              </div>

              {/* Tarifa Equilibrada */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.transporte.status === 'subsidiada'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Tarifa Subsidiada (R$ 4,50)</span>
                  {cityState.publicCompanies.transporte.status === 'subsidiada' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Prefeitura subsidia parte do diesel para evitar repasse de aumentos à população.
                  Equilíbrio prudente entre contas públicas e mobilidade.
                </p>
                <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                  <div className="flex justify-between text-rose-400">
                    <span>Subsídio da Prefeitura:</span>
                    <span>-R$ 65.000/mês</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tarifa cobrada:</span>
                    <span>R$ 4,50</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('transporte', 'subsidiada')}
                  disabled={cityState.publicCompanies.transporte.status === 'subsidiada'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.transporte.status === 'subsidiada'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.transporte.status === 'subsidiada'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Tarifa Subsidiada'}
                </button>
              </div>

              {/* Concessão Privada */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.transporte.status === 'privatizada'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Concessão Comercial Privada</span>
                  {cityState.publicCompanies.transporte.status === 'privatizada' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Consórcio de viações assume 100% da operação e riscos. A Prefeitura zera gastos com
                  ônibus e recebe outorga de R$ 1,2 milhão no caixa.
                </p>
                <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                  <div className="flex justify-between text-emerald-400">
                    <span>Outorga à Vista no Caixa:</span>
                    <span>+R$ 1.200.000</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tarifa Privada:</span>
                    <span>R$ 5,20</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('transporte', 'privatizada')}
                  disabled={cityState.publicCompanies.transporte.status === 'privatizada'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.transporte.status === 'privatizada'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.transporte.status === 'privatizada'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Concessão Comercial'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. SANEMAP - COMPANHIA DE SANEAMENTO & ÁGUA */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    SANEMAP - Companhia Municipal de Saneamento, Águas e Esgoto
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Regime:{' '}
                  <span className="text-teal-300 font-bold uppercase">
                    {cityState.publicCompanies.saneamento.status}
                  </span>{' '}
                  • Cobertura de água tratada:{' '}
                  <span className="text-teal-400 font-bold">
                    {cityState.waterCoveragePercent}% do território
                  </span>
                </p>
              </div>
            </div>

            {/* Opção Atual Salva */}
            <div className="mb-4 px-4 py-2.5 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  Opção Vigente Salva:{' '}
                  <strong className="text-emerald-400 font-bold uppercase">
                    {cityState.publicCompanies.saneamento.status === 'estatal'
                      ? 'Estatal Municipal com Tarifa Social'
                      : cityState.publicCompanies.saneamento.status === 'mista'
                      ? 'Economia Mista (Ações & Investimentos)'
                      : 'Concessão Plena (Marco Legal)'}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                ✓ Salvo no Diário Oficial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.saneamento.status === 'estatal'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Estatal com Tarifa Social</span>
                  {cityState.publicCompanies.saneamento.status === 'estatal' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Água tratada e esgoto tratados como saúde pública. Famílias cadastradas no CadÚnico
                  recebem desconto social na conta de água.
                </p>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('saneamento', 'estatal')}
                  disabled={cityState.publicCompanies.saneamento.status === 'estatal'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.saneamento.status === 'estatal'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.saneamento.status === 'estatal'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Modelo Estatal'}
                </button>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.saneamento.status === 'mista'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Economia Mista (Ações & Investimentos)</span>
                  {cityState.publicCompanies.saneamento.status === 'mista' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Atrai investidores privados com controle acionário na mão da Prefeitura. Rende +R$
                  65.000/mês de dividendos e acelera novas adutoras.
                </p>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('saneamento', 'mista')}
                  disabled={cityState.publicCompanies.saneamento.status === 'mista'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.saneamento.status === 'mista'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.saneamento.status === 'mista'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Capital Misto'}
                </button>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.saneamento.status === 'concessao'
                    ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Concessão Plena (Marco Legal)</span>
                  {cityState.publicCompanies.saneamento.status === 'concessao' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Leilão na B3 com outorga de R$ 3,5 milhões para o caixa municipal. Empresa vencedora
                  tem obrigação legal de levar água a 99% da cidade em 5 anos.
                </p>
                <button
                  type="button"
                  onClick={() => onSetPublicCompany('saneamento', 'concessao')}
                  disabled={cityState.publicCompanies.saneamento.status === 'concessao'}
                  className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    cityState.publicCompanies.saneamento.status === 'concessao'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                  }`}
                >
                  {cityState.publicCompanies.saneamento.status === 'concessao'
                    ? '✓ Opção Escolhida e Salva'
                    : 'Trocar para Concessão Plena'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ABA 3: MULTAS DE TRÂNSITO & RADARES */}
      {/* ==================================================== */}
      {activeTab === 'multas' && (
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              Fiscalização de Trânsito, Radares e Multas Municipais
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Como prefeito, você calibra a intensidade dos radares eletrônicos e agentes de trânsito.
              Multas rigorosas engordam o caixa municipal, mas geram críticas severas dos motoristas.
            </p>
          </div>

          {/* Opção Atual Salva */}
          <div className="mb-4 px-4 py-2.5 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-300">
                Regime de Fiscalização Vigente:{' '}
                <strong className="text-emerald-400 font-bold uppercase">
                  {cityState.trafficFineSeverity === 'rigorosa'
                    ? 'Fiscalização Rigorosa & Radares 24h'
                    : cityState.trafficFineSeverity === 'padrao'
                    ? 'Nível Padrão Regulatório'
                    : 'Campanhas Educativas & Tolerância'}
                </strong>
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              ✓ Salvo no Diário Oficial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rigorosa */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                cityState.trafficFineSeverity === 'rigorosa'
                  ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Fiscalização Rigorosa & Radares 24h</span>
                {cityState.trafficFineSeverity === 'rigorosa' && (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Radares em todas as avenidas, câmeras de avanço de sinal e tolerância zero.
                Arrecadação recorde para os cofres municipais.
              </p>
              <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Arrecadação de Multas:</span>
                  <span>+R$ 120.000/mês</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>Popularidade com Motoristas:</span>
                  <span>-4% (reclamações)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSetTrafficFines('rigorosa')}
                disabled={cityState.trafficFineSeverity === 'rigorosa'}
                className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  cityState.trafficFineSeverity === 'rigorosa'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                }`}
              >
                {cityState.trafficFineSeverity === 'rigorosa'
                  ? '✓ Opção Escolhida e Salva'
                  : 'Trocar para Fiscalização Rigorosa'}
              </button>
            </div>

            {/* Padrão */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                cityState.trafficFineSeverity === 'padrao'
                  ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Nível Padrão Regulatório</span>
                {cityState.trafficFineSeverity === 'padrao' && (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Radares sinalizados em curvas perigosas e portas de escolas. Fiscalização equilibrada
                sem excesso de autuações.
              </p>
              <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                <div className="flex justify-between text-emerald-400">
                  <span>Arrecadação de Multas:</span>
                  <span>+R$ 55.000/mês</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Popularidade:</span>
                  <span>Neutra</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSetTrafficFines('padrao')}
                disabled={cityState.trafficFineSeverity === 'padrao'}
                className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  cityState.trafficFineSeverity === 'padrao'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                }`}
              >
                {cityState.trafficFineSeverity === 'padrao'
                  ? '✓ Opção Escolhida e Salva'
                  : 'Trocar para Nível Padrão'}
              </button>
            </div>

            {/* Educativa */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                cityState.trafficFineSeverity === 'educativa'
                  ? 'bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Campanhas Educativas & Tolerância</span>
                {cityState.trafficFineSeverity === 'educativa' && (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> ATIVO & SALVO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Agentes aplicam advertências no lugar de multas financeiras. Motoristas e taxistas
                aplaudem o Prefeito, mas a receita cai.
              </p>
              <div className="text-xs space-y-1 py-2 border-t border-slate-800/60 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Arrecadação de Multas:</span>
                  <span>+R$ 18.000/mês</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Popularidade com Motoristas:</span>
                  <span>+4% aprovação</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSetTrafficFines('educativa')}
                disabled={cityState.trafficFineSeverity === 'educativa'}
                className={`w-full mt-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  cityState.trafficFineSeverity === 'educativa'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default flex items-center justify-center gap-1.5'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                }`}
              >
                {cityState.trafficFineSeverity === 'educativa'
                  ? '✓ Opção Escolhida e Salva'
                  : 'Trocar para Trânsito Educativo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
