import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Shield,
  GraduationCap,
  HeartPulse,
  Zap,
  Droplets,
  Flame,
  Radio,
  Building,
  Home,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Factory,
  Pickaxe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coins,
  ArrowRight,
  Wifi,
  ChevronRight,
  Layers,
  Fuel,
  Scale,
  Award,
} from 'lucide-react';
import {
  PrefeitoCityState,
  OilDestinationPolicy,
  GoldDestinationPolicy,
  CorporateOffer,
} from '../../types/textGame';
import { sounds } from '../../audio/soundManager';
import {
  acceptCorporateOffer,
  declineCorporateOffer,
  setNaturalResourcesStrategy,
  buildHousingAction,
  expandGasNetworkAction,
} from '../../simulation/textSimulationEngine';

interface CityGeneralStatsViewProps {
  cityState: PrefeitoCityState;
  onUpdateState: (newState: PrefeitoCityState) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const CityGeneralStatsView: React.FC<CityGeneralStatsViewProps> = ({
  cityState,
  onUpdateState,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'demografia' | 'empresas' | 'recursos'>('geral');
  const [housingBatch, setHousingBatch] = useState<number>(500);
  const [gasKmBatch, setGasKmBatch] = useState<number>(10);

  // Demographic values
  const population = cityState.population || 48500;
  const netMigration = cityState.monthlyMigration || 0;
  const attractiveness = cityState.cityAttractiveness || 65;
  const unemp = cityState.unemploymentRate || 8.5;
  const housingUnits = cityState.housingUnits || 16800;
  const familyCount = Math.round(population / 2.9);
  const housingDeficit = cityState.housingDeficit || Math.max(0, familyCount - housingUnits);
  const occupancyRate = cityState.housingOccupancyRate || 95;

  // Resource strategy
  const natStrategy = cityState.naturalResourcesStrategy || {
    oilPolicy: 'export_crude',
    goldPolicy: 'sell_bullion_cash',
    sovereignFundBalance: 0,
    sovereignFundMonthlyYield: 0,
    goldReserveKg: 0,
    fuelDiscountActive: false,
    gasDiscountPercent: 0,
  };

  // Handlers for Corporate Offers
  const handleAcceptOffer = (offer: CorporateOffer) => {
    sounds.playClick();
    const result = acceptCorporateOffer(cityState, offer.id);
    if (result.success) {
      sounds.playCash();
      onUpdateState(result.state);
      onShowToast(result.message, 'success');
    } else {
      sounds.playAlert();
      onShowToast(result.message, 'error');
    }
  };

  const handleDeclineOffer = (offerId: string) => {
    sounds.playClick();
    const result = declineCorporateOffer(cityState, offerId);
    onUpdateState(result.state);
    onShowToast(result.message, 'info');
  };

  // Handlers for Natural Resources
  const handleSetOilPolicy = (policy: OilDestinationPolicy) => {
    sounds.playClick();
    const result = setNaturalResourcesStrategy(cityState, policy, natStrategy.goldPolicy);
    onUpdateState(result.state);
    onShowToast(`Nova política do Petróleo: ${policy === 'local_refinery_consumption' ? 'Refino Local & Consumo' : policy === 'sovereign_wealth_fund' ? 'Fundo Soberano' : 'Venda Spot no Caixa'}`, 'success');
  };

  const handleSetGoldPolicy = (policy: GoldDestinationPolicy) => {
    sounds.playClick();
    const result = setNaturalResourcesStrategy(cityState, natStrategy.oilPolicy, policy);
    onUpdateState(result.state);
    onShowToast(`Nova política Mineral: ${policy === 'industrial_tech_jewelry' ? 'Cadeia de Tecnologia e Jóias' : policy === 'strategic_reserve' ? 'Reserva no Cofre do Município' : 'Venda ao Banco Central'}`, 'success');
  };

  // Handlers for Housing and Gas expansion
  const handleBuildHousing = () => {
    const costPerUnit = 280; // R$ 280 por casa popular
    const totalCost = housingBatch * costPerUnit;
    sounds.playClick();
    const result = buildHousingAction(cityState, housingBatch, totalCost);
    if (result.success) {
      sounds.playCash();
      onUpdateState(result.state);
      onShowToast(result.message, 'success');
    } else {
      sounds.playAlert();
      onShowToast(result.message, 'error');
    }
  };

  const handleExpandGas = () => {
    const costPerKm = 12000; // R$ 12.000 por km de tubulação subterrânea
    const totalCost = gasKmBatch * costPerKm;
    sounds.playClick();
    const result = expandGasNetworkAction(cityState, gasKmBatch, totalCost);
    if (result.success) {
      sounds.playCash();
      onUpdateState(result.state);
      onShowToast(result.message, 'success');
    } else {
      sounds.playAlert();
      onShowToast(result.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Banner com Resumo e Atratividade */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Painel do Município & SimCity
              </span>
              <span className="text-xs text-slate-400">
                Atualizado a cada ciclo econômico de 2 min
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Estatísticas Gerais & Expansão da Cidade
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Monitore os indicadores vitais de {cityState.cityName}: emprego, segurança, energia, água, gás, conectividade e a dinâmica de migração populacional.
            </p>
          </div>

          {/* Card Indicador de Atratividade e Saldo Migratório */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center pr-4 border-r border-slate-800">
              <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">
                Atratividade
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-2xl font-black text-amber-300">
                  {attractiveness}
                </span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {attractiveness >= 70 ? 'Cidade Magnética' : attractiveness >= 50 ? 'Estável' : 'Repulsiva'}
              </span>
            </div>

            <div className="text-center">
              <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">
                Saldo Migratório
              </span>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                {netMigration >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-rose-400" />
                )}
                <span
                  className={`text-2xl font-black ${
                    netMigration >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {netMigration >= 0 ? `+${netMigration}` : netMigration}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                hab. / ciclo
              </span>
            </div>
          </div>
        </div>

        {/* Sub-navegação interna */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => {
              setActiveSubTab('geral');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'geral'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Serviços Essenciais & Indicadores
          </button>

          <button
            onClick={() => {
              setActiveSubTab('demografia');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'demografia'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            Dinâmica Populacional & Habitação
            {housingDeficit > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500/30 text-amber-200 border border-amber-500/40">
                Déficit: {housingDeficit}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubTab('empresas');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'empresas'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Factory className="w-4 h-4" />
            Ofertas de Empresas & Conectividade
            {(cityState.corporateOffers || []).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 animate-pulse">
                {(cityState.corporateOffers || []).length} propostas
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveSubTab('recursos');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'recursos'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Pickaxe className="w-4 h-4" />
            Destinação de Petróleo & Minérios
            {cityState.oilProductionBpd > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500/30 text-amber-300">
                Petróleo Ativo
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ABA 1: SERVIÇOS ESSENCIAIS & INDICADORES GERAIS */}
      {activeSubTab === 'geral' && (
        <div className="space-y-6">
          {/* Grid dos Principais Indicadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Emprego & Desemprego */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Desemprego
                </span>
                <div className={`p-2 rounded-lg ${unemp < 6 ? 'bg-emerald-950/80 text-emerald-400' : unemp < 10 ? 'bg-blue-950/80 text-blue-400' : 'bg-rose-950/80 text-rose-400'}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white">{unemp}%</span>
                <span className="text-xs text-slate-400 ml-2">
                  ({cityState.employed?.toLocaleString()} ocupados)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    unemp < 6 ? 'bg-emerald-500' : unemp < 10 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, unemp * 5)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {unemp < 6 ? '✓ Pleno emprego municipal' : unemp < 10 ? '✓ Nível saudável e equilibrado' : '⚠ Crise de vagas no comércio'}
              </p>
            </div>

            {/* 2. Segurança Pública */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Segurança Pública
                </span>
                <div className="p-2 rounded-lg bg-sky-950/80 text-sky-400">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white">
                  {cityState.securityIndex || 60}/100
                </span>
                <span className="text-xs text-slate-400 ml-2">Guarda Municipal</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${cityState.securityIndex || 60}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {cityState.securityIndex >= 70 ? '✓ Bairros seguros com patrulha ativa' : '⚠ Moradores pedem reforço na vigilância'}
              </p>
            </div>

            {/* 3. Educação & Escolas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Educação & Escolas
                </span>
                <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white">
                  {cityState.educationIndex || 64}/100
                </span>
                <span className="text-xs text-slate-400 ml-2">IDEB 5.8</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${cityState.educationIndex || 64}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {cityState.educationIndex >= 65 ? '✓ Merenda nutritiva e escolas estruturadas' : '⚠ Demanda por mais creches municipais'}
              </p>
            </div>

            {/* 4. Saúde & SUS */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Saúde Municipal (SUS)
                </span>
                <div className="p-2 rounded-lg bg-rose-950/80 text-rose-400">
                  <HeartPulse className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-white">
                  {cityState.healthIndex || 55}/100
                </span>
                <span className="text-xs text-slate-400 ml-2">UPAs 24h & SAMU</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${cityState.healthIndex || 55}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {cityState.healthIndex >= 60 ? '✓ Atendimento ágil e farmácias abastecidas' : '⚠ Filas de espera em consultas de especialidades'}
              </p>
            </div>
          </div>

          {/* Linha de Serviços Físicos: Energia, Água, Gás, Telecomunicações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bloco Energia & Água */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Zap className="w-5 h-5 text-amber-400" />
                Matriz Elétrica & Saneamento Básico
              </h3>

              {/* Energia */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Potência Energética Elétrica
                  </span>
                  <span className="font-bold text-amber-300">
                    {cityState.energyProductionMw} MW produzidos
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Demanda atual da cidade: {cityState.energyConsumptionMw} MW</span>
                  <span className="font-semibold text-emerald-400">
                    Sobrando: +{cityState.energySurplusMw} MW
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{
                      width: `${Math.min(
                        100,
                        (cityState.energyConsumptionMw / Math.max(1, cityState.energyProductionMw)) * 100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  O excedente elétrico de +{cityState.energySurplusMw} MW é vendido para o Sistema Interligado Nacional (SIN), gerando R$ {(cityState.energySurplusMw * 850).toLocaleString()}/mês ao Tesouro.
                </p>
              </div>

              {/* Água e Esgoto */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    Cobertura de Água Tratada & Esgoto
                  </span>
                  <span className="font-bold text-sky-300">
                    {cityState.waterCoveragePercent}% da cidade
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-sky-500"
                    style={{ width: `${cityState.waterCoveragePercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Operado pela autarquia municipal de saneamento. Cobertura elevada é requisito indispensável para atrair polos industriais e multinacionais.
                </p>
              </div>
            </div>

            {/* Bloco Gás Canalizado & Conectividade */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Flame className="w-5 h-5 text-orange-400" />
                Rede de Gás Canalizado & Telecomunicações
              </h3>

              {/* Gás */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-orange-400" />
                    Tubulação de Gás Urbano
                  </span>
                  <span className="font-bold text-orange-300">
                    {cityState.gasDistributionKm || 38} km ({cityState.gasCoveragePercent || 42}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${cityState.gasCoveragePercent || 42}%` }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-slate-850">
                  <span className="text-xs text-slate-400">
                    Expandir rede (+{gasKmBatch} km por R$ {(gasKmBatch * 12000).toLocaleString()}):
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={gasKmBatch}
                      onChange={(e) => setGasKmBatch(Number(e.target.value))}
                      className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                    >
                      <option value={5}>+5 km</option>
                      <option value={10}>+10 km</option>
                      <option value={20}>+20 km</option>
                    </select>
                    <button
                      onClick={handleExpandGas}
                      className="px-3 py-1 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded shadow transition-all"
                    >
                      Construir
                    </button>
                  </div>
                </div>
              </div>

              {/* Conectividade Telecom (2G, 3G, 4G, 5G) */}
              <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-violet-400" />
                    Infraestrutura Digital & Antenas
                  </span>
                  <span className="px-2.5 py-0.5 rounded font-black text-xs bg-violet-950 text-violet-300 border border-violet-600/50">
                    Sinal {cityState.telecomGeneration || '3G'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {['2G', '3G', '4G', '5G'].map((gen) => {
                    const active = cityState.telecomGeneration === gen;
                    const hierarchy: Record<string, number> = { '2G': 1, '3G': 2, '4G': 3, '5G': 4 };
                    const currentScore = hierarchy[cityState.telecomGeneration || '3G'] || 2;
                    const thisScore = hierarchy[gen] || 1;
                    const passed = thisScore <= currentScore;

                    return (
                      <div
                        key={gen}
                        className={`p-2 rounded-lg text-center border transition-all ${
                          active
                            ? 'bg-violet-600/30 border-violet-500 text-violet-200 ring-2 ring-violet-400/40'
                            : passed
                            ? 'bg-slate-800/40 border-slate-700 text-slate-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                        }`}
                      >
                        <span className="text-xs font-bold block">{gen}</span>
                        <span className="text-[10px] block">
                          {gen === '5G' ? 'Smart City' : gen === '4G' ? 'Banda Larga' : gen === '3G' ? 'Voz & Dados' : 'Legado'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-3">
                  {cityState.telecomGeneration === '5G'
                    ? '✓ Cidade conectada com sinal 5G e sensores IoT urbanos.'
                    : 'Para atrair operadoras de 4G e 5G, confira as propostas na aba "Ofertas de Empresas".'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: DINÂMICA POPULACIONAL & HABITAÇÃO (ESTILO SIMCITY) */}
      {activeSubTab === 'demografia' && (
        <div className="space-y-6">
          {/* Banner SimCity explicando por que pessoas mudam */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Mecânica Demográfica: O que atrai ou expulsa moradores?
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Assim como no SimCity, famílias e trabalhadores se mudam para {cityState.cityName} quando encontram habitação acessível, empregos em expansão, segurança e serviços públicos confiáveis. Quando há falta de moradia ou crise no mercado, a população emigra para municípios vizinhos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">
                  População Total
                </span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {population.toLocaleString()} hab.
                </span>
                <span className="text-[11px] text-slate-400">
                  Estimada em {familyCount.toLocaleString()} famílias
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">
                  Moradias Cadastradas
                </span>
                <span className="text-2xl font-black text-sky-400 mt-1 block">
                  {housingUnits.toLocaleString()} unidades
                </span>
                <span className="text-[11px] text-slate-400">
                  Taxa de ocupação urbana: {occupancyRate}%
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold block">
                  Déficit Habitacional
                </span>
                <span
                  className={`text-2xl font-black mt-1 block ${
                    housingDeficit > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {housingDeficit.toLocaleString()} famílias
                </span>
                <span className="text-[11px] text-slate-400">
                  {housingDeficit === 0 ? '✓ Oferta plena de moradias' : '⚠ Faltam casas populares na cidade'}
                </span>
              </div>
            </div>
          </div>

          {/* Construção de Conjuntos Habitacionais para atrair moradores */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Home className="w-4 h-4 text-amber-400" />
                Programa Municipal de Habitação Popular
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Construa loteamentos urbanizados com água, esgoto e energia para reduzir o déficit e acelerar o crescimento populacional.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <select
                value={housingBatch}
                onChange={(e) => setHousingBatch(Number(e.target.value))}
                className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg border border-slate-700"
              >
                <option value={200}>+200 Moradias (R$ 56.000)</option>
                <option value={500}>+500 Moradias (R$ 140.000)</option>
                <option value={1000}>+1.000 Moradias (R$ 280.000)</option>
                <option value={2500}>+2.500 Moradias (R$ 700.000)</option>
              </select>

              <button
                onClick={handleBuildHousing}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-md transition-all flex items-center gap-1.5"
              >
                <Building className="w-4 h-4" />
                Construir Moradias
              </button>
            </div>
          </div>

          {/* Lista de Fatores que Afetam a Migração neste Momento */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              Balanço de Fatores Migratórios (Apuração do Ciclo)
            </h4>

            <div className="space-y-2">
              {(cityState.migrationReasons || []).length > 0 ? (
                cityState.migrationReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {reason.positive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="text-slate-200 font-medium">{reason.factor}</span>
                    </div>
                    <span
                      className={`font-black ${
                        reason.impact >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {reason.impact >= 0 ? `+${reason.impact}` : reason.impact} hab.
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">
                  A dinâmica populacional será consolidada no fechamento do próximo ciclo.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: OFERTAS DE EMPRESAS & CONECTIVIDADE */}
      {activeSubTab === 'empresas' && (
        <div className="space-y-6">
          {/* Introdução */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Factory className="w-5 h-5 text-amber-400" />
                  Atração de Investimentos & Empresas
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                  Empresas e polos de tecnologia buscam cidades com infraestrutura confiável (energia, água, conectividade 2G/3G/4G/5G). Ao aceitar as propostas, a cidade ganha empregos, arrecadação mensal e saltos tecnológicos.
                </p>
              </div>

              <div className="hidden sm:block text-right">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Sinal Atual da Cidade
                </span>
                <span className="text-lg font-black text-violet-400 block">
                  Rede {cityState.telecomGeneration || '3G'}
                </span>
              </div>
            </div>
          </div>

          {/* Lista de Propostas Pendentes */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Propostas Empresariais na Mesa do Gabinete ({(cityState.corporateOffers || []).length})
            </h4>

            {(cityState.corporateOffers || []).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-base font-bold text-white">Todas as propostas foram avaliadas!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Novas ofertas surgirão à medida que a infraestrutura municipal e a atratividade urbana evoluírem.
                </p>
              </div>
            ) : (
              (cityState.corporateOffers || []).map((offer) => {
                // Verificar se a cidade atende aos requisitos
                const telecomHierarchy: Record<string, number> = { '2G': 1, '3G': 2, '4G': 3, '5G': 4 };
                const currentTelecom = telecomHierarchy[cityState.telecomGeneration || '3G'] || 2;
                const requiredTelecom = offer.requirements.minTelecom ? telecomHierarchy[offer.requirements.minTelecom] : 0;
                const hasTelecom = currentTelecom >= requiredTelecom;

                const hasEnergy = (cityState.energySurplusMw || 0) >= (offer.requirements.minEnergyMw || 0);
                const hasWater = (cityState.waterCoveragePercent || 0) >= (offer.requirements.minWaterCoverage || 0);
                const hasTreasury = cityState.treasury >= (offer.incentivesRequested?.landDonationCost || 0);
                const canAccept = hasTelecom && hasEnergy && hasWater && hasTreasury;

                return (
                  <div
                    key={offer.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {offer.sector}
                          </span>
                          {offer.benefits.upgradeTelecom && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-violet-600/30 text-violet-300 border border-violet-500/40 flex items-center gap-1">
                              <Wifi className="w-3 h-3" />
                              Traz Sinal {offer.benefits.upgradeTelecom}!
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mt-1.5">{offer.companyName}</h4>
                        <p className="text-xs text-slate-300">{offer.tagline}</p>
                        <p className="text-xs text-slate-400 mt-2 max-w-2xl">{offer.description}</p>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => handleDeclineOffer(offer.id)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        >
                          Arquivar
                        </button>
                        <button
                          onClick={() => handleAcceptOffer(offer)}
                          disabled={!canAccept}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                            canAccept
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Assinar Protocolo de Instalação
                        </button>
                      </div>
                    </div>

                    {/* Benefícios vs Requisitos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
                      {/* Ganhos para a Cidade */}
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                        <span className="text-[11px] font-bold text-emerald-400 block uppercase mb-1">
                          Benefícios para o Município:
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          <li>• +{offer.benefits.jobsCreated.toLocaleString()} novos postos de trabalho diretos</li>
                          <li>• +R$ {offer.benefits.monthlyTaxGain.toLocaleString()}/mês em impostos municipais</li>
                          {offer.benefits.upgradeTelecom && (
                            <li className="text-violet-300 font-semibold">
                              • Atualização tecnológica para sinal móvel {offer.benefits.upgradeTelecom}
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Exigências da Empresa */}
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                        <span className="text-[11px] font-bold text-amber-400 block uppercase mb-1">
                          Exigências Estruturais da Empresa:
                        </span>
                        <div className="space-y-1 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            {hasTelecom ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            )}
                            <span>Exige telecom: {offer.requirements.minTelecom || 'Qualquer'}</span>
                          </div>

                          {offer.requirements.minEnergyMw && (
                            <div className="flex items-center gap-1.5">
                              {hasEnergy ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                              <span>Superávit elétrico: {offer.requirements.minEnergyMw} MW</span>
                            </div>
                          )}

                          {offer.requirements.minWaterCoverage && (
                            <div className="flex items-center gap-1.5">
                              {hasWater ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                              <span>Água tratada: {offer.requirements.minWaterCoverage}%</span>
                            </div>
                          )}

                          {offer.incentivesRequested?.landDonationCost && (
                            <div className="flex items-center gap-1.5">
                              {hasTreasury ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                              <span>Incentivo de terraplanagem: R$ {offer.incentivesRequested.landDonationCost.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Empresas já instaladas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Parque Fabril & Empresas Instaladas no Município ({(cityState.installedCompanies || []).length})
            </h4>

            {(cityState.installedCompanies || []).length === 0 ? (
              <p className="text-xs text-slate-400">
                Nenhuma multinacional instalada ainda. Aprove propostas para impulsionar a economia local!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cityState.installedCompanies.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{comp.companyName}</span>
                      <span className="text-slate-400 block">{comp.sector}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold block">
                        +{comp.benefits?.jobsCreated} empregos
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        +R$ {comp.benefits?.monthlyTaxGain.toLocaleString()}/mês
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 4: DESTINAÇÃO ESTRATÉGICA DE PETRÓLEO E MINÉRIOS */}
      {activeSubTab === 'recursos' && (
        <div className="space-y-6">
          {/* Banner Geral de Recursos */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Pickaxe className="w-5 h-5 text-amber-400" />
              Gestão Estratégica de Petróleo, Ouro e Terras Raras
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Quem descobre petróleo ou jazidas minerais tem opções estratégicas: vender tudo diretamente para engordar o caixa do Tesouro em dinheiro vivo, ou destinar para o refino local e indústria para baratear custos das famílias e frotas, ou acumular em um Fundo Soberano de Poupança Permanente!
            </p>
          </div>

          {/* Módulo 1: Petróleo */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400">
                  <Fuel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Petróleo & Gás Natural</h4>
                  <span className="text-xs text-slate-400">
                    Produção: <strong>{cityState.oilProductionBpd?.toLocaleString() || 0} bpd</strong> (Royalties base: R$ {cityState.oilRoyaltiesMonthly?.toLocaleString() || 0}/mês)
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                cityState.oilProductionBpd > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
              }`}>
                {cityState.oilProductionBpd > 0 ? 'Bacia em Extração Ativa' : 'Sem Petróleo Local'}
              </span>
            </div>

            {/* As 3 Opções Estratégicas para o Petróleo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opção 1: Vender Cru no Caixa */}
              <div
                onClick={() => handleSetOilPolicy('export_crude')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  natStrategy.oilPolicy === 'export_crude'
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-400">Opção 1</span>
                  {natStrategy.oilPolicy === 'export_crude' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <h5 className="font-bold text-sm mt-1 text-white">Venda Direta no Mercado Spot</h5>
                <p className="text-xs text-slate-400 mt-1">
                  100% dos royalties de petróleo entram imediatamente como receita no caixa do Tesouro da Prefeitura.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-400">
                  +R$ {cityState.oilRoyaltiesMonthly?.toLocaleString() || 0}/mês no caixa
                </div>
              </div>

              {/* Opção 2: Refino Local & Consumo Industrial */}
              <div
                onClick={() => handleSetOilPolicy('local_refinery_consumption')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  natStrategy.oilPolicy === 'local_refinery_consumption'
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-400">Opção 2</span>
                  {natStrategy.oilPolicy === 'local_refinery_consumption' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <h5 className="font-bold text-sm mt-1 text-white">Refino Local & Consumo da Cidade</h5>
                <p className="text-xs text-slate-400 mt-1">
                  O óleo é refinado no município: barateia diesel e gasolina de ambulâncias e ônibus em 30%, gás canalizado em 25% e impulsiona indústrias.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-sky-400">
                  30% economia na frota municipal + atrai fábricas
                </div>
              </div>

              {/* Opção 3: Fundo Soberano de Poupança Permanente */}
              <div
                onClick={() => handleSetOilPolicy('sovereign_wealth_fund')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  natStrategy.oilPolicy === 'sovereign_wealth_fund'
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-400">Opção 3</span>
                  {natStrategy.oilPolicy === 'sovereign_wealth_fund' && (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <h5 className="font-bold text-sm mt-1 text-white">Fundo Soberano das Próximas Gerações</h5>
                <p className="text-xs text-slate-400 mt-1">
                  60% dos royalties vão para um fundo de renda perpétua que rende 0.8% ao mês para a cidade, garantindo o futuro mesmo após o petróleo acabar.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-amber-300">
                  Saldo no Fundo: R$ {(natStrategy.sovereignFundBalance || 0).toLocaleString()} (Rende R$ {(natStrategy.sovereignFundMonthlyYield || 0).toLocaleString()}/mês)
                </div>
              </div>
            </div>
          </div>

          {/* Módulo 2: Ouro & Terras Raras */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-yellow-950/80 text-yellow-400">
                  <Pickaxe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Ouro & Terras Raras</h4>
                  <span className="text-xs text-slate-400">
                    Produção: <strong>{cityState.goldProductionKg || 0} kg/mês</strong> (CFEM base: R$ {cityState.goldTaxesMonthly?.toLocaleString() || 0}/mês)
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                cityState.goldProductionKg > 0 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-slate-800 text-slate-500'
              }`}>
                {cityState.goldProductionKg > 0 ? 'Mina Ativa no Município' : 'Sem Extração Mineral'}
              </span>
            </div>

            {/* As 3 Opções Estratégicas para o Ouro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opção 1: Venda em Lingotes ao BC */}
              <div
                onClick={() => handleSetGoldPolicy('sell_bullion_cash')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  natStrategy.goldPolicy === 'sell_bullion_cash'
                    ? 'bg-yellow-500/10 border-yellow-500 ring-2 ring-yellow-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-yellow-400">Opção 1</span>
                  {natStrategy.goldPolicy === 'sell_bullion_cash' && (
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <h5 className="font-bold text-sm mt-1 text-white">Venda Direta em Lingotes ao BC</h5>
                <p className="text-xs text-slate-400 mt-1">
                  100% do imposto mineral CFEM entra diretamente em dinheiro no Tesouro da cidade.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-emerald-400">
                  +R$ {cityState.goldTaxesMonthly?.toLocaleString() || 0}/mês em tributos
                </div>
              </div>

              {/* Opção 2: Cadeia de Tecnologia & Joalheria */}
              <div
                onClick={() => handleSetGoldPolicy('industrial_tech_jewelry')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  natStrategy.goldPolicy === 'industrial_tech_jewelry'
                    ? 'bg-yellow-500/10 border-yellow-500 ring-2 ring-yellow-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-yellow-400">Opção 2</span>
                  {natStrategy.goldPolicy === 'industrial_tech_jewelry' && (
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <h5 className="font-bold text-sm mt-1 text-white">Polo de Tecnologia & Circuitos Eletrônicos</h5>
                <p className="text-xs text-slate-400 mt-1">
                  O ouro e terras raras abastecem indústrias de semicondutores, microchips e cabos de alta precisão na cidade.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-sky-400">
                  Gera empregos industriais qualificados e atrai techs
                </div>
              </div>

              {/* Opção 3: Reserva Estratégica no Cofre */}
              <div
                onClick={() => handleSetGoldPolicy('strategic_reserve')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  natStrategy.goldPolicy === 'strategic_reserve'
                    ? 'bg-yellow-500/10 border-yellow-500 ring-2 ring-yellow-400/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-yellow-400">Opção 3</span>
                  {natStrategy.goldPolicy === 'strategic_reserve' && (
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <h5 className="font-bold text-sm mt-1 text-white">Reserva de Ouro no Cofre Municipal</h5>
                <p className="text-xs text-slate-400 mt-1">
                  Ouro físico estocado no Paço Municipal como lastro. Eleva o rating CAPAG da STN e corta os juros da dívida em 40%.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-yellow-300">
                  Estoque no cofre: {natStrategy.goldReserveKg || 0} kg de ouro puro
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
