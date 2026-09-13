import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'salario' | 'estatais' | 'multas'>('salario');

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
    { label: 'Piso Valorizado (+24%)', wage: 1750, note: 'Aumenta compras no comércio' },
    { label: 'Piso Cidadania (+41%)', wage: 2000, note: 'Impacto forte na LRF' },
  ];

  const handleApplyWage = () => {
    sounds.playStamp();
    onSetMinimumWage(selectedWage);
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
              <label className="text-xs font-bold text-slate-300 block">
                Escolha o patamar ou selecione um reajuste:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {wagePresets.map((preset) => (
                  <button
                    key={preset.wage}
                    type="button"
                    onClick={() => {
                      setSelectedWage(preset.wage);
                      sounds.playClick();
                    }}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedWage === preset.wage
                        ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.label}</div>
                    <div className="text-sm font-black text-amber-400 mt-1">
                      R$ {preset.wage.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{preset.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de ajuste fino */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Ajuste Fino do Valor:</span>
                <span className="font-mono text-amber-400 font-black text-base">
                  R$ {selectedWage.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1300}
                max={2500}
                step={25}
                value={selectedWage}
                onChange={(e) => setSelectedWage(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>R$ 1.300 (Austeridade)</span>
                <span>R$ 1.412 (Federal)</span>
                <span>R$ 1.800</span>
                <span>R$ 2.500 (Máximo)</span>
              </div>
            </div>

            {/* Botão de Decretar */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                {selectedWage !== currentWage ? (
                  <span className="text-amber-300 font-medium">
                    Alteração pendente: {selectedWage > currentWage ? '+' : ''}
                    R$ {(selectedWage - currentWage).toLocaleString()}
                  </span>
                ) : (
                  <span>Piso igual ao valor já sancionado no Diário Oficial.</span>
                )}
              </div>
              <button
                type="button"
                onClick={handleApplyWage}
                disabled={selectedWage === currentWage}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  selectedWage !== currentWage
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 font-black cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                Sancionar Decreto de Piso Salarial
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

            {/* Opções de Modelo de Gestão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Modelo Social */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.correios.status === 'social'
                    ? 'bg-amber-500/10 border-amber-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Empresa Pública de Interesse Social</span>
                  {cityState.publicCompanies.correios.status === 'social' && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.correios.status === 'social'
                    ? 'Modelo em Vigor'
                    : 'Adotar Modelo Social'}
                </button>
              </div>

              {/* Modelo Lucrativo de E-commerce */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.correios.status === 'lucrativa'
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Empresa Pública Lucrativa & Logística</span>
                  {cityState.publicCompanies.correios.status === 'lucrativa' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.correios.status === 'lucrativa'
                    ? 'Modelo em Vigor'
                    : 'Tornar Empresa Lucrativa'}
                </button>
              </div>

              {/* Concessão Privada */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.correios.status === 'concessao'
                    ? 'bg-sky-500/10 border-sky-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Concessão / Terceirização Privada</span>
                  {cityState.publicCompanies.correios.status === 'concessao' && (
                    <span className="text-[10px] bg-sky-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.correios.status === 'concessao'
                    ? 'Modelo em Vigor'
                    : 'Leiloar Concessão Privada'}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tarifa Zero */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.transporte.status === 'tarifa_zero'
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Tarifa Zero (Passe Livre 100%)</span>
                  {cityState.publicCompanies.transporte.status === 'tarifa_zero' && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.transporte.status === 'tarifa_zero'
                    ? 'Tarifa Zero em Vigor'
                    : 'Implantar Tarifa Zero'}
                </button>
              </div>

              {/* Tarifa Equilibrada */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.transporte.status === 'subsidiada'
                    ? 'bg-amber-500/10 border-amber-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Tarifa Subsidiada (R$ 4,50)</span>
                  {cityState.publicCompanies.transporte.status === 'subsidiada' && (
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.transporte.status === 'subsidiada'
                    ? 'Modelo em Vigor'
                    : 'Manter Tarifa R$ 4,50'}
                </button>
              </div>

              {/* Concessão Privada */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.transporte.status === 'privatizada'
                    ? 'bg-sky-500/10 border-sky-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Concessão Comercial Privada</span>
                  {cityState.publicCompanies.transporte.status === 'privatizada' && (
                    <span className="text-[10px] bg-sky-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.transporte.status === 'privatizada'
                    ? 'Modelo em Vigor'
                    : 'Conceder Transporte'}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.saneamento.status === 'estatal'
                    ? 'bg-teal-500/10 border-teal-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Estatal com Tarifa Social</span>
                  {cityState.publicCompanies.saneamento.status === 'estatal' && (
                    <span className="text-[10px] bg-teal-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.saneamento.status === 'estatal'
                    ? 'Modelo em Vigor'
                    : 'Manter Estatal'}
                </button>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.saneamento.status === 'mista'
                    ? 'bg-blue-500/10 border-blue-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Economia Mista (Ações & Investimentos)</span>
                  {cityState.publicCompanies.saneamento.status === 'mista' && (
                    <span className="text-[10px] bg-blue-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-blue-500 hover:bg-blue-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.saneamento.status === 'mista'
                    ? 'Modelo em Vigor'
                    : 'Abrir Capital Misto'}
                </button>
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  cityState.publicCompanies.saneamento.status === 'concessao'
                    ? 'bg-sky-500/10 border-sky-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-white">Concessão Plena (Marco Legal)</span>
                  {cityState.publicCompanies.saneamento.status === 'concessao' && (
                    <span className="text-[10px] bg-sky-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      ATIVO
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
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-sky-500 hover:bg-sky-400 text-slate-950 cursor-pointer font-black'
                  }`}
                >
                  {cityState.publicCompanies.saneamento.status === 'concessao'
                    ? 'Modelo em Vigor'
                    : 'Leiloar Concessão'}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rigorosa */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                cityState.trafficFineSeverity === 'rigorosa'
                  ? 'bg-rose-500/10 border-rose-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Fiscalização Rigorosa & Radares 24h</span>
                {cityState.trafficFineSeverity === 'rigorosa' && (
                  <span className="text-[10px] bg-rose-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                    ATIVO
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
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : 'bg-rose-500 hover:bg-rose-400 text-slate-950 cursor-pointer font-black'
                }`}
              >
                {cityState.trafficFineSeverity === 'rigorosa' ? 'Em Vigor' : 'Ativar Fiscalização Rigorosa'}
              </button>
            </div>

            {/* Padrão */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                cityState.trafficFineSeverity === 'padrao'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Nível Padrão Regulatório</span>
                {cityState.trafficFineSeverity === 'padrao' && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                    ATIVO
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
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer font-black'
                }`}
              >
                {cityState.trafficFineSeverity === 'padrao' ? 'Em Vigor' : 'Manter Nível Padrão'}
              </button>
            </div>

            {/* Educativa */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                cityState.trafficFineSeverity === 'educativa'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Campanhas Educativas & Tolerância</span>
                {cityState.trafficFineSeverity === 'educativa' && (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                    ATIVO
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
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer font-black'
                }`}
              >
                {cityState.trafficFineSeverity === 'educativa' ? 'Em Vigor' : 'Priorizar Trânsito Educativo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
