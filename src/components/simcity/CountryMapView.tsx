import React, { useState } from 'react';
import {
  BRAZIL_STATES,
  BrazilStateInfo,
} from '../../data/brazilStatesData';
import { SENATORS_50, Senator } from '../../data/senatorsData';
import { PrefeitoCityState } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';
import {
  Globe,
  Landmark,
  Scale,
  Shield,
  Ship,
  TrendingUp,
  Users,
  Briefcase,
  Zap,
  Building2,
  DollarSign,
  Compass,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface CountryMapViewProps {
  cityState: PrefeitoCityState;
  onUpdateState: (newState: PrefeitoCityState) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onOpenLegislationModal?: () => void;
  onOpenTradeModal?: () => void;
}

export const CountryMapView: React.FC<CountryMapViewProps> = ({
  cityState,
  onUpdateState,
  onShowToast,
  onOpenLegislationModal,
  onOpenTradeModal,
}) => {
  const [selectedUf, setSelectedUf] = useState<string>('DF');
  const [selectedRegion, setSelectedRegion] = useState<string>('todos');
  const [stateInterventionCount, setStateInterventionCount] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'mapa' | 'senadores' | 'logistica'>('mapa');

  const currentState: BrazilStateInfo = BRAZIL_STATES[selectedUf] || BRAZIL_STATES['DF'];

  // Filter senators belonging to this state
  const stateSenators: Senator[] = SENATORS_50.filter((s) => s.stateUF === selectedUf);

  // Region colors
  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Norte':
        return 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 hover:border-emerald-400';
      case 'Nordeste':
        return 'border-amber-500/60 bg-amber-950/40 text-amber-300 hover:border-amber-400';
      case 'Centro-Oeste':
        return 'border-yellow-500/60 bg-yellow-950/40 text-yellow-300 hover:border-yellow-400';
      case 'Sudeste':
        return 'border-blue-500/60 bg-blue-950/40 text-blue-300 hover:border-blue-400';
      case 'Sul':
        return 'border-teal-500/60 bg-teal-950/40 text-teal-300 hover:border-teal-400';
      default:
        return 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500';
    }
  };

  const getRegionBadge = (region: string) => {
    switch (region) {
      case 'Norte':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-600/50';
      case 'Nordeste':
        return 'bg-amber-900/60 text-amber-300 border-amber-600/50';
      case 'Centro-Oeste':
        return 'bg-yellow-900/60 text-yellow-300 border-yellow-600/50';
      case 'Sudeste':
        return 'bg-blue-900/60 text-blue-300 border-blue-600/50';
      case 'Sul':
        return 'bg-teal-900/60 text-teal-300 border-teal-600/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Presidential Federal Actions
  const handlePacInvestment = (uf: string) => {
    const cost = 80000;
    if (cityState.treasury < cost) {
      sounds.playAlert();
      onShowToast(`Tesouro Nacional insuficiente! Necessário R$ ${cost.toLocaleString()} para aporte PAC.`, 'error');
      return;
    }

    const stateObj = BRAZIL_STATES[uf];
    if (!stateObj) return;

    sounds.playCash();
    setStateInterventionCount((prev) => ({
      ...prev,
      [uf]: (prev[uf] || 0) + 1,
    }));

    const updatedState: PrefeitoCityState = {
      ...cityState,
      treasury: cityState.treasury - cost,
      approvalRating: Math.min(100, cityState.approvalRating + 2),
      councilSupport: Math.min(100, cityState.councilSupport + 3),
      infrastructureIndex: Math.min(100, cityState.infrastructureIndex + 1),
      jobs: cityState.jobs + 450,
      gazetteFeed: [
        {
          id: `pac_${Date.now()}`,
          title: `🏛️ Planalto autoriza R$ ${cost.toLocaleString()} em obras do PAC para ${stateObj.name} (${uf})!`,
          source: 'Diário Oficial da União (DOU)',
          type: 'decreto',
          dateStr: `${cityState.day || 15} de ${cityState.monthName || 'Setembro'} de ${cityState.year || 2026}`,
          body: `O Presidente da República despachou aporte federal extraordinário para modernização de rodovias, ferrovias e infraestrutura logística em ${stateObj.name}. O governador ${stateObj.governor} agradeceu os recursos federais que devem gerar mais de 450 novos postos de trabalho.`,
          timestamp: Date.now(),
        },
        ...cityState.gazetteFeed,
      ],
    };

    onUpdateState(updatedState);
    onShowToast(`🏗️ PAC Federal liberado: R$ ${cost.toLocaleString()} investidos em ${stateObj.name}! (+Aprovação & Apoio)`, 'success');
  };

  const handleSendNationalForce = (uf: string) => {
    const cost = 45000;
    if (cityState.treasury < cost) {
      sounds.playAlert();
      onShowToast(`Tesouro insuficiente para deslocamento da Força Nacional (R$ ${cost.toLocaleString()}).`, 'error');
      return;
    }

    const stateObj = BRAZIL_STATES[uf];
    if (!stateObj) return;

    sounds.playSuccess();
    const updatedState: PrefeitoCityState = {
      ...cityState,
      treasury: cityState.treasury - cost,
      securityIndex: Math.min(100, cityState.securityIndex + 3),
      approvalRating: Math.min(100, cityState.approvalRating + 1),
      gazetteFeed: [
        {
          id: `fn_${Date.now()}`,
          title: `🛡️ Força Nacional de Segurança é destacada para operações especiais em ${stateObj.name}!`,
          source: 'Diário Oficial da União (DOU)',
          type: 'noticia',
          dateStr: `${cityState.day || 15} de ${cityState.monthName || 'Setembro'} de ${cityState.year || 2026}`,
          body: `Por determinação do Ministério da Justiça e Presidência da República, tropas especializadas da Força Nacional e da Polícia Rodoviária Federal reforçam o policiamento ostensivo e o combate ao crime organizado no território de ${stateObj.name}.`,
          timestamp: Date.now(),
        },
        ...cityState.gazetteFeed,
      ],
    };

    onUpdateState(updatedState);
    onShowToast(`🛡️ Força Nacional destacada com sucesso para ${stateObj.name}! (+Segurança Nacional)`, 'success');
  };

  const handleTaxIncentive = (uf: string) => {
    const stateObj = BRAZIL_STATES[uf];
    if (!stateObj) return;

    sounds.playVictory();
    const updatedState: PrefeitoCityState = {
      ...cityState,
      councilSupport: Math.min(100, cityState.councilSupport + 2),
      cityAttractiveness: Math.min(100, cityState.cityAttractiveness + 2),
      gazetteFeed: [
        {
          id: `tax_${Date.now()}`,
          title: `🏭 Presidência concede regime especial de incentivos fiscais para indústrias em ${stateObj.name}!`,
          source: 'Diário Oficial da União (DOU)',
          type: 'decreto',
          dateStr: `${cityState.day || 15} de ${cityState.monthName || 'Setembro'} de ${cityState.year || 2026}`,
          body: `Decreto presidencial promulga isenção temporária de IPI e tarifas alfandegárias para atração de novas fábricas multinacionais e centros de inovação tecnológica em ${stateObj.name}.`,
          timestamp: Date.now(),
        },
        ...cityState.gazetteFeed,
      ],
    };

    onUpdateState(updatedState);
    onShowToast(`🏭 Incentivo Fiscal promulgado para ${stateObj.name}! (+Atratividade Industrial)`, 'success');
  };

  // List of all states for cards/grid
  const allStatesList = Object.values(BRAZIL_STATES);
  const filteredStates = selectedRegion === 'todos'
    ? allStatesList
    : allStatesList.filter((s) => s.region.toLowerCase() === selectedRegion.toLowerCase());

  // Macro-indicators
  const totalBrazilGdp = allStatesList.reduce((acc, s) => acc + s.gdpBillionR, 0);
  const totalBrazilPop = allStatesList.reduce((acc, s) => acc + s.population, 0);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Strategic Republic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/60 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-700 flex items-center justify-center shadow-lg border border-indigo-400/30 text-white">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  🇧🇷 República Federativa do Brasil • Mapa Soberano
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  26 Estados + DF
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Gestão Estratégica da União • Palácio do Planalto • Integração Federativa e Comércio Exterior
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenLegislationModal && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLegislationModal();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 shadow-sm transition-all"
              >
                <Scale className="w-4 h-4 text-purple-400" />
                <span>Congresso (50 Senadores)</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-purple-500 text-white rounded font-mono">
                  ⏱ {cityState.congressVotingSecondsRemaining ?? 60}s
                </span>
              </button>
            )}

            {onOpenTradeModal && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenTradeModal();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 border border-sky-500/50 shadow-sm transition-all"
              >
                <Ship className="w-4 h-4 text-sky-400" />
                <span>Balança & Exportações</span>
              </button>
            )}
          </div>
        </div>

        {/* National Macro Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">PIB Nacional da União</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              R$ {totalBrazilGdp.toLocaleString()} bi
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">População Federativa</span>
            <span className="text-sm font-bold text-sky-400 tabular-nums">
              {totalBrazilPop.toLocaleString()} hab.
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tesouro Nacional Livre</span>
            <span className="text-sm font-bold text-amber-300 tabular-nums">
              R$ {cityState.treasury.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Apoio no Congresso</span>
            <span className={`text-sm font-bold tabular-nums ${
              cityState.councilSupport >= 60 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {cityState.councilSupport}% ({Math.round(50 * (cityState.councilSupport / 100))} Senadores)
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Superávit da Balança</span>
            <span className={`text-sm font-bold tabular-nums ${
              (cityState.tradeBalance?.netTradeBalanceUsd || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              +US$ {((cityState.tradeBalance?.netTradeBalanceUsd || 2800000) / 1000000).toFixed(1)}M / ciclo
            </span>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rating Soberano</span>
            <span className="text-sm font-bold text-indigo-300">
              {cityState.sovereignRating || 'AAA'} (Grau de Investimento)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Map (Left/Center) + Selected State Strategic Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Territory Canvas & State Matrix (7 Cols on Large) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'todos', label: 'Todo o Brasil (27)' },
                { id: 'sudeste', label: 'Sudeste (4)' },
                { id: 'sul', label: 'Sul (3)' },
                { id: 'nordeste', label: 'Nordeste (9)' },
                { id: 'centro-oeste', label: 'Centro-Oeste (4)' },
                { id: 'norte', label: 'Norte (7)' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRegion(r.id);
                    sounds.playClick();
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedRegion === r.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1">
              <span>Selecione um Estado para despachar ações federais</span>
            </div>
          </div>

          {/* Interactive Cartogram Map of Brazil */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
            {/* Background Map Watermark & Maritime Trade Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
              <Compass className="w-96 h-96 text-sky-500 animate-spin" style={{ animationDuration: '180s' }} />
            </div>

            {/* Maritime Route Banners */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-b border-slate-800/80 mb-3">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <Ship className="w-3.5 h-3.5 animate-bounce" />
                Rotas de Exportação Marítima: Santos • Paranaguá • Suape • Itaqui
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                Bacia Pré-Sal: Bacia de Santos / Campos
              </span>
            </div>

            {/* States Grid Cartogram (Geographically Arranged) */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2.5 relative z-10">
              {filteredStates.map((st) => {
                const isSelected = st.uf === selectedUf;
                const interventions = stateInterventionCount[st.uf] || 0;

                return (
                  <button
                    key={st.uf}
                    onClick={() => {
                      setSelectedUf(st.uf);
                      sounds.playClick();
                    }}
                    className={`relative p-2.5 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between min-h-[92px] ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-950/80 shadow-md ring-2 ring-indigo-400/50 scale-[1.02]'
                        : `${getRegionColor(st.region)} hover:scale-[1.02]`
                    }`}
                  >
                    {/* Top Row: Sigla & Region dot */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-base font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                        {st.uf}
                      </span>
                      {st.uf === 'DF' ? (
                        <span className="px-1 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] rounded">
                          DF
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          R$ {st.gdpBillionR} bi
                        </span>
                      )}
                    </div>

                    {/* State Name & Capital */}
                    <div className="mt-1">
                      <div className="text-xs font-bold text-slate-200 truncate group-hover:text-white">
                        {st.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {st.capital}
                      </div>
                    </div>

                    {/* Bottom Indicator: PAC or Landmark icon */}
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-1">
                      <span className="text-[10px] text-slate-400 truncate">
                        {st.region}
                      </span>
                      {interventions > 0 ? (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">
                          +{interventions} PAC
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500">
                          {st.pacProjectsCount} PAC
                        </span>
                      )}
                    </div>

                    {/* Landmark badge for major capitals */}
                    {st.uf === 'DF' && (
                      <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow">
                        Capital
                      </div>
                    )}
                    {st.uf === 'SP' && (
                      <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[9px] font-bold px-1 rounded shadow">
                        Porto/B3
                      </div>
                    )}
                    {st.uf === 'RJ' && (
                      <div className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[9px] font-bold px-1 rounded shadow">
                        Pré-Sal
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Strategic Federal Transport Corridors Info Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  BR-101 / BR-116 (Eixo Litoral)
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Ferrovia Norte-Sul (Eixo de Grãos)
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Hidrovia Tietê-Paraná
                </span>
              </div>
              <span className="text-slate-500 text-[11px]">
                Clique no estado para acionar investimentos e ver senadores
              </span>
            </div>
          </div>
        </div>

        {/* Selected State Dossier & Presidential Interventions (5 Cols on Large) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative">
            {/* Header: State Name & UF */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">
                    {currentState.uf}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${getRegionBadge(currentState.region)}`}>
                    Região {currentState.region}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {currentState.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Capital: <strong className="text-slate-200">{currentState.capital}</strong> • {currentState.specialLandmark}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">PIB Estadual</span>
                <span className="text-base font-black text-emerald-400 tabular-nums">
                  R$ {currentState.gdpBillionR} bilhões
                </span>
                <span className="text-[10px] text-slate-400 block">
                  R$ {currentState.gdpPerCapitaR.toLocaleString()} / hab.
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 my-4 text-xs">
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">População</span>
                <strong className="text-slate-200 font-bold tabular-nums">
                  {(currentState.population / 1000000).toFixed(1)}M
                </strong>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Infraestrutura</span>
                <strong className="text-sky-400 font-bold tabular-nums">
                  {currentState.infrastructureIndex}/100
                </strong>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Segurança</span>
                <strong className="text-emerald-400 font-bold tabular-nums">
                  {currentState.securityIndex}/100
                </strong>
              </div>
            </div>

            {/* Political Alignment & Governor */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Governador(a):
                </span>
                <span className="font-bold text-white">
                  {currentState.governor} ({currentState.governorParty})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" />
                  Alinhamento com o Palácio do Planalto:
                </span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  currentState.governorAlignment === 'base_governo'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : currentState.governorAlignment === 'neutro'
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/40'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {currentState.governorAlignment === 'base_governo'
                    ? 'Aliado do Governo'
                    : currentState.governorAlignment === 'neutro'
                    ? 'Independente / Diálogo'
                    : 'Oposição Federativa'}
                </span>
              </div>
            </div>

            {/* Pauta de Exportações & Principais Setores */}
            <div className="space-y-2.5 text-xs mb-4">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider mb-1">
                  Principais Setores Produtivos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentState.mainSectors.map((sector, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/60"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider mb-1">
                  Pauta de Exportação Internacional:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentState.topExports.map((exp, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 text-[11px] border border-sky-800/40 font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* State Senators in the 50-Senator Congress */}
            <div className="bg-slate-950/90 p-3 rounded-lg border border-slate-800 text-xs mb-5">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  Bancada no Congresso (Votações a cada 1 min):
                </span>
                <span className="text-[11px] text-purple-300 font-mono">
                  {stateSenators.length} Senadores
                </span>
              </div>

              {stateSenators.length > 0 ? (
                <div className="space-y-1.5">
                  {stateSenators.map((sen) => (
                    <div
                      key={sen.id}
                      className="flex items-center justify-between p-1.5 rounded bg-slate-900/80 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-purple-300">
                          {sen.name.charAt(0)}
                        </span>
                        <div>
                          <strong className="text-slate-200 block text-xs">{sen.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {sen.party} • {sen.profile}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        sen.alignment === 'base_governo'
                          ? 'bg-emerald-950 text-emerald-400'
                          : sen.alignment === 'centrao'
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}>
                        {sen.alignment === 'base_governo' ? 'Vota SIM' : sen.alignment === 'centrao' ? 'Negociável' : 'Vota NÃO'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  Representado pela bancada regional de {currentState.region} nas votações de Leis e PECs.
                </p>
              )}
            </div>

            {/* Presidential Federal Interventions Buttons */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider mb-2">
                Ações Presidenciais Soberanas para {currentState.name}:
              </span>

              <button
                onClick={() => handlePacInvestment(currentState.uf)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-[0.99]"
              >
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-indigo-200" />
                  <span>Aporte PAC (Infraestrutura & Obras)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-700/80 px-2 py-0.5 rounded text-[11px] font-mono">
                    -R$ 80.000
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendNationalForce(currentState.uf)}
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Força Nacional</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono shrink-0">
                    -R$ 45k
                  </span>
                </button>

                <button
                  onClick={() => handleTaxIncentive(currentState.uf)}
                  className="flex items-center justify-between p-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Incentivo Fiscal</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                    +Indústrias
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
