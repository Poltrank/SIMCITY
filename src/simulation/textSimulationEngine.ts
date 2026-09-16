import {
  PrefeitoCityState,
  ActiveDispatch,
  DispatchOutcome,
  GazetteArticle,
  FiscalRating,
  MunicipalEmergencyEvent,
  IntermunicipalLoan,
  CorporateOffer,
  OilDestinationPolicy,
  GoldDestinationPolicy,
  NaturalResourcesStrategy,
} from '../types/textGame';
import { MUNICIPAL_ACTIONS } from '../data/municipalActions';

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const GAME_START_DAY = 15;
export const GAME_START_MONTH = 9; // Setembro
export const GAME_START_YEAR = 2026;
export const FISCAL_CYCLE_SECONDS = 45; // 45 segundos por ciclo fiscal
export const REAL_MS_PER_IN_GAME_DAY = 24 * 60 * 60 * 1000; // 24 horas da vida real = 1 dia no jogo

export const INITIAL_CORPORATE_OFFERS: CorporateOffer[] = [
  {
    id: 'off_telsul_4g',
    companyName: 'TeleSul Conectividade & Torres',
    segment: 'telecom',
    tagline: 'Expansão de Telefonia Móvel & Banda Larga 4G LTE',
    description:
      'A operadora propõe implantar 14 novas antenas ERB e cabeamento subterrâneo, modernizando a cidade com sinal 4G de alta velocidade em todos os distritos urbanos e rurais.',
    badge: '📡 Telecom 4G',
    requirements: {
      minEnergyMw: 5,
      minInfrastructureIndex: 50,
    },
    incentivesRequested: {
      taxExemptionYears: 2,
      landDonationCost: 65000,
      conditionDescription: 'Isenção de taxas de ocupação de solo e alvará para passagem de cabos em vias públicas.',
    },
    benefits: {
      jobsCreated: 520,
      monthlyTaxGain: 62000,
      upgradeTelecom: '4G',
      techIndexBoost: 12,
      attractivenessBoost: 14,
    },
    status: 'pending',
    receivedDateStr: '15/09/2026',
  },
  {
    id: 'off_omni_5g',
    companyName: 'OmniFiber & Antenas 5G Brasil',
    segment: 'telecom',
    tagline: 'Anel Óptico Metropolitano & Cobertura 5G Standalone',
    description:
      'Consórcio de telecomunicações deseja transformar o município em referência de Cidade Inteligente (Smart City), instalando microcélulas 5G e fibra óptica gigabit nos bairros.',
    badge: '🚀 Telecom 5G',
    requirements: {
      minTelecom: '4G',
      minEnergyMw: 10,
      minEducationIndex: 55,
      minInfrastructureIndex: 55,
    },
    incentivesRequested: {
      taxExemptionYears: 3,
      landDonationCost: 140000,
      conditionDescription: 'Permissão para fixar microantenas 5G em postes de semáforos e prédios públicos.',
    },
    benefits: {
      jobsCreated: 1350,
      monthlyTaxGain: 145000,
      upgradeTelecom: '5G',
      techIndexBoost: 25,
      attractivenessBoost: 22,
    },
    status: 'pending',
    receivedDateStr: '16/09/2026',
  },
  {
    id: 'off_agrovalle_alimentos',
    companyName: 'AgroValle Beneficiamento de Alimentos',
    segment: 'alimentos',
    tagline: 'Fábrica de Processamento de Soja, Leite e Derivados',
    description:
      'Empresa do agronegócio planeja construir silos e linha de envase no anel viário, integrando pequenos produtores rurais da região com a rede de supermercados.',
    badge: '🌾 Agroindústria',
    requirements: {
      minEnergyMw: 7,
      minWaterCoverage: 60,
    },
    incentivesRequested: {
      landDonationCost: 110000,
      conditionDescription: 'Terraplanagem do terreno de 40.000m² no distrito agroindustrial.',
    },
    benefits: {
      jobsCreated: 1850,
      monthlyTaxGain: 195000,
      attractivenessBoost: 8,
    },
    status: 'pending',
    receivedDateStr: '15/09/2026',
  },
  {
    id: 'off_eletrobus_brasil',
    companyName: 'AutoMobilis EletroBus do Brasil',
    segment: 'industria',
    tagline: 'Linha de Montagem de Ônibus Elétricos e Tratores Urbanos',
    description:
      'Multinacional quer abrir polo fabril para produção de chassis e baterias elétricas para abastecer frotas metropolitanas, gerando milhares de empregos industriais.',
    badge: '⚡ Indústria Pesada',
    requirements: {
      minTelecom: '4G',
      minEnergyMw: 14,
      minWaterCoverage: 70,
      minInfrastructureIndex: 58,
    },
    incentivesRequested: {
      taxExemptionYears: 4,
      landDonationCost: 280000,
      conditionDescription: 'Doação de lote industrial de 80.000m² com ramal asfaltado e subestação.',
    },
    benefits: {
      jobsCreated: 3400,
      monthlyTaxGain: 385000,
      attractivenessBoost: 18,
    },
    status: 'pending',
    receivedDateStr: '17/09/2026',
  },
  {
    id: 'off_datacenter_verde',
    companyName: 'GreenCloud Data Center & IA',
    segment: 'tecnologia',
    tagline: 'Centro de Processamento em Nuvem e Servidores de Inteligência Artificial',
    description:
      'Companhia de tecnologia da informação busca área com alta confiabilidade elétrica e telecom 5G para instalar data center de IA de baixo impacto de carbono.',
    badge: '💻 Data Center & IA',
    requirements: {
      minTelecom: '5G',
      minEnergyMw: 18,
      minEducationIndex: 65,
    },
    incentivesRequested: {
      taxExemptionYears: 3,
      landDonationCost: 180000,
      conditionDescription: 'Tarifa incentivada de energia e conexão subterrânea de fibra óptica dedicada.',
    },
    benefits: {
      jobsCreated: 820,
      monthlyTaxGain: 310000,
      techIndexBoost: 22,
      attractivenessBoost: 16,
    },
    status: 'pending',
    receivedDateStr: '18/09/2026',
  },
  {
    id: 'off_gassul_redes',
    companyName: 'GásSul Distribuidora de Gás Natural',
    segment: 'energia',
    tagline: 'Expansão da Rede de Gás Canalizado Urbano & Industrial',
    description:
      'Concessionária propõe implantar tubulação subterrânea de gás natural para indústrias, comércios e edifícios, barateando a matriz térmica da cidade em 35%.',
    badge: '🔥 Gás Canalizado',
    requirements: {
      minInfrastructureIndex: 52,
    },
    incentivesRequested: {
      conditionDescription: 'Licença ambiental desburocratizada para abertura de valas viárias.',
    },
    benefits: {
      jobsCreated: 680,
      monthlyTaxGain: 85000,
      attractivenessBoost: 12,
    },
    status: 'pending',
    receivedDateStr: '15/09/2026',
  },
  {
    id: 'off_biopharma_labs',
    companyName: 'BioPharma Medicamentos & Vacinas',
    segment: 'farmaceutica',
    tagline: 'Laboratório de Produção de Fármacos e Genéricos',
    description:
      'Laboratório farmacêutico planeja instalar fábrica para abastecer hospitais e farmácias regionais, atraindo biólogos, químicos e técnicos qualificados.',
    badge: '💊 Farmacêutica',
    requirements: {
      minTelecom: '4G',
      minWaterCoverage: 75,
      minEducationIndex: 60,
    },
    incentivesRequested: {
      landDonationCost: 150000,
      conditionDescription: 'Apoio na estação de tratamento de efluentes e terraplanagem.',
    },
    benefits: {
      jobsCreated: 1450,
      monthlyTaxGain: 240000,
      attractivenessBoost: 14,
    },
    status: 'pending',
    receivedDateStr: '19/09/2026',
  },
];

export function calculateInGameDate(
  gameStartRealTimestamp?: number,
  currentRealTimestamp: number = Date.now()
): {
  day: number;
  month: number;
  monthName: string;
  year: number;
  termMonth: number;
  daysPassed: number;
  dateStr: string;
} {
  // Sincronização direta com a vida real: a data do jogo acompanha rigorosamente o calendário real!
  const realDate = new Date(currentRealTimestamp);
  const day = realDate.getDate();
  const month = realDate.getMonth() + 1; // 1 a 12
  const monthName = MONTH_NAMES[realDate.getMonth()] || 'Setembro';
  const year = realDate.getFullYear();

  const startTs = gameStartRealTimestamp || currentRealTimestamp;
  const elapsedMs = Math.max(0, currentRealTimestamp - startTs);
  const daysPassed = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
  const termMonth = Math.floor(daysPassed / 30) + 1;
  const dateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

  return {
    day,
    month,
    monthName,
    year,
    termMonth,
    daysPassed,
    dateStr,
  };
}

export function sanitizePrefeitoState(state: PrefeitoCityState): PrefeitoCityState {
  if (!state) return createInitialPrefeitoState();

  const now = Date.now();
  let gameStart = state.gameStartRealTimestamp;
  if (!gameStart || state.year < 2026 || (state.year === 2026 && state.month < 9)) {
    gameStart = now;
  }

  const calendar = calculateInGameDate(gameStart, now);

  const currentCycle = state.economicCycle || {
    cycleDurationSeconds: FISCAL_CYCLE_SECONDS,
    secondsRemaining: FISCAL_CYCLE_SECONDS,
    autoTick: true,
    lastTickTimestamp: now,
    lastCycleNet: state.netMonthly || 0,
    totalCyclesCompleted: 0,
  };

  let secondsRemaining = currentCycle.secondsRemaining;
  if (
    currentCycle.cycleDurationSeconds !== FISCAL_CYCLE_SECONDS ||
    secondsRemaining > FISCAL_CYCLE_SECONDS ||
    secondsRemaining <= 0
  ) {
    secondsRemaining = FISCAL_CYCLE_SECONDS;
  }

  return {
    ...state,
    day: calendar.day,
    month: calendar.month,
    monthName: calendar.monthName,
    year: calendar.year,
    termMonth: calendar.termMonth,
    gameStartRealTimestamp: gameStart,
    // Serviços, Moradia e Telecomunicações
    gasCoveragePercent: state.gasCoveragePercent ?? 42,
    gasDistributionKm: state.gasDistributionKm ?? 38,
    telecomGeneration: state.telecomGeneration ?? '3G',
    telecomCoveragePercent: state.telecomCoveragePercent ?? 74,
    fiberCoveragePercent: state.fiberCoveragePercent ?? 32,
    housingUnits: state.housingUnits ?? 16800,
    housingDeficit: state.housingDeficit ?? 1200,
    housingOccupancyRate: state.housingOccupancyRate ?? 96,
    monthlyMigration: state.monthlyMigration ?? 280,
    migrationReasons: state.migrationReasons ?? [
      { factor: 'Oferta de empregos no comércio e serviços', impact: 180, positive: true },
      { factor: 'Custo de vida acessível e moradia estável', impact: 140, positive: true },
      { factor: 'Sinal 3G instável em bairros periféricos', impact: -40, positive: false },
    ],
    cityAttractiveness: state.cityAttractiveness ?? 68,
    corporateOffers: state.corporateOffers && state.corporateOffers.length > 0 ? state.corporateOffers : INITIAL_CORPORATE_OFFERS,
    installedCompanies: state.installedCompanies ?? [
      {
        id: 'comp_logistica_local',
        companyName: 'Armazéns Gerais & Logística Porto',
        segment: 'logistica',
        tagline: 'Entreposto de Cargas & Armazenamento',
        description: 'Centro de distribuição regional e armazenamento de grãos e produtos manufaturados.',
        badge: '📦 Logística',
        requirements: {},
        incentivesRequested: { conditionDescription: 'Galpão no antigo pátio ferroviário com isenção provisória de IPTU' },
        benefits: {
          jobsCreated: 850,
          monthlyTaxGain: 48000,
          attractivenessBoost: 4,
        },
        status: 'accepted',
        receivedDateStr: '15/09/2026',
      },
    ],
    naturalResourcesStrategy: state.naturalResourcesStrategy ?? {
      oilPolicy: 'export_crude',
      goldPolicy: 'sell_bullion_cash',
      sovereignFundBalance: 0,
      sovereignFundMonthlyYield: 0,
      goldReserveKg: 0,
      fuelDiscountActive: false,
      gasDiscountPercent: 0,
    },
    // Obras Habitacionais COHAB e Mobilidade (Metrô, Trem, BRT)
    infrastructureWorks: state.infrastructureWorks ?? {
      cohabHousingProjects: 2,
      cohabUnitsBuilt: 3400,
      metroLinesKm: 0,
      metroStationsCount: 0,
      trainVltLinesKm: 8,
      brtCorridorsKm: 12,
      brtTerminalsCount: 3,
    },
    // Alíquotas SimCity & Nacionais
    taxRates: {
      resPobresPercent: state.taxRates?.resPobresPercent ?? 6.0,
      resMediosPercent: state.taxRates?.resMediosPercent ?? 8.5,
      resRicosPercent: state.taxRates?.resRicosPercent ?? 11.0,
      comPobresPercent: state.taxRates?.comPobresPercent ?? 7.0,
      comMediosPercent: state.taxRates?.comMediosPercent ?? 8.5,
      comRicosPercent: state.taxRates?.comRicosPercent ?? 10.5,
      indPobresPercent: state.taxRates?.indPobresPercent ?? 8.5,
      indMediosPercent: state.taxRates?.indMediosPercent ?? 8.5,
      indRicosPercent: state.taxRates?.indRicosPercent ?? 7.0,
      iptuPercent: state.taxRates?.iptuPercent ?? 1.2,
      issPercent: state.taxRates?.issPercent ?? 3.5,
      itbiPercent: state.taxRates?.itbiPercent ?? 2.0,
      taxaIluminacaoCip: state.taxRates?.taxaIluminacaoCip ?? 18.0,
    },
    economicCycle: {
      ...currentCycle,
      cycleDurationSeconds: FISCAL_CYCLE_SECONDS,
      secondsRemaining,
    },
  };
}

export interface InitialMayorSetup {
  mayorName?: string;
  party?: string;
  cityName?: string;
  governmentFocus?: string;
}

export function createInitialPrefeitoState(setup?: InitialMayorSetup): PrefeitoCityState {
  const chosenMayorName = setup?.mayorName?.trim() || 'Prefeito Cássio';
  const chosenParty = setup?.party?.trim() || 'PSD - Partido Social do Desenvolvimento';
  const chosenCityName = setup?.cityName?.trim() || 'Ratolândia';

  // Jogo inicia no dia 15 de setembro de 2026
  const startDay = GAME_START_DAY;
  const startMonth = GAME_START_MONTH;
  const startMonthName = 'Setembro';
  const startYear = GAME_START_YEAR;

  const initialMinimumWage = 1412; // Salário mínimo / Piso municipal base
  const initialRevenue = 690000;
  const initialExpenses = 585000;
  const initialPayroll = 260000; // ~37% da receita (dentro do limite prudencial da LRF de 54%)

  const initialRevenueBreakdown = {
    iptu: 145000,
    iss: 165000,
    itbi: 42000,
    fpmIcms: 130000,
    taxaIluminacao: 25000,
    taxaResiduosColeta: 31500,
    estacionamentoRotativo: 28000,
    tarifaTurismoEcologica: 23400,
    concessoesMercadosQuiosques: 19500,
    vendaEnergiaRede: 0,
    receitasEmprestimos: 0,
    multasTransito: 55000,
    royaltiesPetroleo: 0,
    cfemOuro: 0,
    lucroEstatais: 25000,
    total: initialRevenue,
  };

  const initialExpenseBreakdown = {
    payroll: initialPayroll,
    previdenciaServidores: 36400, // RPPS Previdência dos concursados
    saudeSus: 75000,
    educacaoMerenda: 60000,
    segurancaGuarda: 40000,
    limpezaResiduosAterro: 32000,
    combustivelManutencaoFrota: 34600,
    energiaPrediosPublicos: 22000,
    sistemasDigitaisTi: 15000,
    manutencaoUrbana: 35000,
    subsidioEstatais: 35000, // déficit inicial dos correios sociais
    amortizacaoDivida: 15000,
    total: initialExpenses,
  };

  return {
    cityName: chosenCityName,
    mayorName: chosenMayorName,
    party: chosenParty,
    year: startYear,
    month: startMonth,
    monthName: startMonthName,
    day: startDay,
    termMonth: 1,
    gameStartRealTimestamp: Date.now(),
    lastRealTimestamp: Date.now(),
    fractionalTreasuryAccrual: 0,

    treasury: 1850000,
    monthlyRevenue: initialRevenue,
    monthlyExpenses: initialExpenses,
    netMonthly: initialRevenue - initialExpenses,
    payrollExpense: initialPayroll,
    payrollRatio: Number(((initialPayroll / initialRevenue) * 100).toFixed(1)),
    debt: 1200000,
    debtRatio: Number(((1200000 / (initialRevenue * 12)) * 100).toFixed(1)),
    fiscalRating: 'B',

    population: 48500,
    jobs: 21200,
    employed: 19400,
    unemploymentRate: 8.5,
    touristsPerMonth: 5200,
    approvalRating: 62,
    councilSupport: 58,

    oilProductionBpd: 0,
    oilRoyaltiesMonthly: 0,
    goldProductionKg: 0,
    goldTaxesMonthly: 0,
    energyProductionMw: 45,
    energyConsumptionMw: 38,
    energySurplusMw: 7,
    waterCoveragePercent: 68,

    // Serviços Essenciais, Habitação & Telecomunicações (Conectividade)
    gasCoveragePercent: 42,
    gasDistributionKm: 38,
    telecomGeneration: '3G',
    telecomCoveragePercent: 74,
    fiberCoveragePercent: 32,
    housingUnits: 16800,
    housingDeficit: 1200,
    housingOccupancyRate: 96,

    // Dinâmica Populacional Estilo SimCity (Migração)
    monthlyMigration: 280,
    migrationReasons: [
      { factor: 'Oferta de empregos no comércio e serviços', impact: 180, positive: true },
      { factor: 'Custo de vida acessível e aluguel estável', impact: 140, positive: true },
      { factor: 'Sinal 3G oscilante na periferia', impact: -40, positive: false },
    ],
    cityAttractiveness: 68,

    // Atração de Empresas & Investimentos Privados
    corporateOffers: INITIAL_CORPORATE_OFFERS,
    installedCompanies: [
      {
        id: 'comp_logistica_local',
        companyName: 'Armazéns Gerais & Logística Porto',
        segment: 'logistica',
        tagline: 'Entreposto de Cargas & Armazenamento',
        description: 'Centro de distribuição regional e armazenamento de grãos e produtos manufaturados.',
        badge: '📦 Logística',
        requirements: {},
        incentivesRequested: { conditionDescription: 'Galpão no antigo pátio ferroviário com isenção provisória de IPTU' },
        benefits: {
          jobsCreated: 850,
          monthlyTaxGain: 48000,
          attractivenessBoost: 4,
        },
        status: 'accepted',
        receivedDateStr: '15/09/2026',
      },
    ],

    // Destinação Estratégica de Petróleo & Ouro
    naturalResourcesStrategy: {
      oilPolicy: 'export_crude',
      goldPolicy: 'sell_bullion_cash',
      sovereignFundBalance: 0,
      sovereignFundMonthlyYield: 0,
      goldReserveKg: 0,
      fuelDiscountActive: false,
      gasDiscountPercent: 0,
    },

    securityIndex: 60,
    healthIndex: 55,
    educationIndex: 64,
    infrastructureIndex: 58,

    completedActionIds: [],
    activeDispatches: [],
    recentOutcomes: [],
    gazetteFeed: [
      {
        id: 'gaz_init_1',
        title: `Posse Solene do Novo Mandato Municipal em ${chosenCityName}`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: '15/09/2026',
        body: `${chosenMayorName} (${chosenParty}) assumiu oficialmente o comando do Poder Executivo no Palácio Municipal de ${chosenCityName}. Em seu discurso de posse no dia 15 de setembro de 2026, garantiu austeridade fiscal, diálogo republicano com os vereadores e foco no bem-estar da população.`,
        impactSummary: 'Gabinete aberto para despachos e propostas legislativas.',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'gaz_init_2',
        title: 'Geólogos Apontam Potencial Mineral e Petróleo nas Bacias Regionais',
        source: 'Gazeta Municipal',
        type: 'noticia',
        dateStr: '15/09/2026',
        body: 'Relatórios preliminares de universidades sugerem que o subsolo municipal pode abrigar veios de ouro nas serras e bolsões de petróleo na costa. Prefeito estuda abrir editais de prospecção técnica.',
        impactSummary: 'Setor de Recursos Naturais disponível para investimento.',
        timestamp: Date.now() - 1800000,
      },
    ],

    // Políticas Públicas & Salário Mínimo
    minimumWage: initialMinimumWage,
    trafficFineSeverity: 'padrao',

    // Empresas Públicas Municipais
    publicCompanies: {
      correios: {
        name: 'Correios & Logística de Porto',
        status: 'social',
        monthlyResult: -35000,
        coveragePercent: 92,
        description: 'Serviço postal universal e entrega de remédios na periferia e zona rural',
      },
      saneamento: {
        name: 'SANEMAP - Companhia Municipal de Saneamento',
        status: 'estatal',
        monthlyResult: 25000,
        tariffType: 'social',
        waterCoverage: 68,
      },
      transporte: {
        name: 'TransPorto - Coletivos Urbanos',
        status: 'subsidiada',
        monthlyResult: -65000,
        busFleet: 42,
        fareValue: 4.50,
      },
    },

    // Ciclo Econômico em Tempo Real (2 Minutos = 120 Segundos)
    economicCycle: {
      cycleDurationSeconds: FISCAL_CYCLE_SECONDS,
      secondsRemaining: FISCAL_CYCLE_SECONDS,
      autoTick: true,
      lastTickTimestamp: Date.now(),
      lastCycleNet: initialRevenue - initialExpenses,
      totalCyclesCompleted: 0,
    },

    revenueBreakdown: initialRevenueBreakdown,
    expenseBreakdown: initialExpenseBreakdown,

    departmentBudgets: {
      educacao: {
        budgetMonthly: 60000,
        focus: 'merenda',
        effectiveness: 72,
      },
      saude: {
        budgetMonthly: 75000,
        focus: 'upas_24h',
        effectiveness: 68,
      },
      segurancaGuarda: {
        budgetMonthly: 40000,
        focus: 'patrulhamento_bairros',
        effectiveness: 65,
      },
      bombeirosDefesaCivil: {
        budgetMonthly: 30000,
        focus: 'prevencao_enchentes',
        effectiveness: 62,
      },
      energiaIluminacao: {
        budgetMonthly: 35000,
        focus: 'led_100',
        effectiveness: 70,
      },
    },

    taxRates: {
      resPobresPercent: 6.0,
      resMediosPercent: 8.5,
      resRicosPercent: 11.0,
      comPobresPercent: 7.0,
      comMediosPercent: 8.5,
      comRicosPercent: 10.5,
      indPobresPercent: 8.5,
      indMediosPercent: 8.5,
      indRicosPercent: 7.0,
      iptuPercent: 1.2,
      issPercent: 3.5,
      itbiPercent: 2.0,
      taxaIluminacaoCip: 18.0,
    },

    infrastructureWorks: {
      cohabHousingProjects: 2,
      cohabUnitsBuilt: 3400,
      metroLinesKm: 0,
      metroStationsCount: 0,
      trainVltLinesKm: 8,
      brtCorridorsKm: 12,
      brtTerminalsCount: 3,
    },

    intermunicipalLoans: [],
    activeEmergencyEvent: null,
    resolvedEmergenciesCount: 0,
  };
}

export function startMunicipalDispatch(
  state: PrefeitoCityState,
  actionId: string
): { success: boolean; error?: string; newState: PrefeitoCityState } {
  const action = MUNICIPAL_ACTIONS.find((a) => a.id === actionId);
  if (!action) {
    return { success: false, error: 'Ação não encontrada.', newState: state };
  }

  // Check if treasury is sufficient
  if (state.treasury < action.cost) {
    return {
      success: false,
      error: `Tesouro insuficiente. O projeto exige R$ ${action.cost.toLocaleString()}, mas a cidade possui R$ ${state.treasury.toLocaleString()}.`,
      newState: state,
    };
  }

  // Check if already dispatched and in progress
  if (state.activeDispatches.some((d) => d.actionId === actionId && !d.completed)) {
    return {
      success: false,
      error: 'Este projeto já está tramitando na Mesa de Despachos. Aguarde a conclusão do processo de 1 minuto.',
      newState: state,
    };
  }

  // Check requirements
  if (action.requirements.requiresOil && state.oilProductionBpd <= 0) {
    return {
      success: false,
      error: 'Operação impossível: o município ainda não descobriu petróleo! É necessário prospectar e encontrar reservas primeiro.',
      newState: state,
    };
  }

  if (action.requirements.requiredFiscalRating) {
    if (!action.requirements.requiredFiscalRating.includes(state.fiscalRating)) {
      return {
        success: false,
        error: `Exigência da STN/BNDES: Nota fiscal mínima exigida é ${action.requirements.requiredFiscalRating.join(' ou ')}. O município atualmente possui nota ${state.fiscalRating}. Realize um Ajuste Fiscal antes!`,
        newState: state,
      };
    }
  }

  if (action.requirements.minCouncilSupport && state.councilSupport < action.requirements.minCouncilSupport) {
    return {
      success: false,
      error: `Apoio insuficiente na Câmara de Vereadores (${state.councilSupport}%). O projeto exige pelo menos ${action.requirements.minCouncilSupport}% para não ser vetado de imediato.`,
      newState: state,
    };
  }

  const now = Date.now();
  const totalSeconds = Math.ceil(action.durationMs / 1000);
  const durationMinutes = Math.max(1, Math.round(action.durationMs / 60000));

  const newDispatch: ActiveDispatch = {
    id: 'disp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    actionId: action.id,
    title: action.title,
    category: action.category,
    badge: action.badge,
    cost: action.cost,
    startTime: now,
    durationMs: action.durationMs,
    endTime: now + action.durationMs,
    currentPhaseText: action.bureaucracyPhases[0].label,
    currentDepartment: action.bureaucracyPhases[0].department,
    progress: 0,
    secondsRemaining: totalSeconds,
    completed: false,
  };

  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: state.treasury - action.cost,
    activeDispatches: [newDispatch, ...state.activeDispatches],
    gazetteFeed: [
      {
        id: 'gaz_disp_' + Date.now(),
        title: `Decreto Municipal: Iniciada Tramitação de "${action.title}"`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Gabinete do Prefeito publicou a abertura do processo administrativo. O projeto terá tramitação e execução de ${durationMinutes} minuto${
          durationMinutes > 1 ? 's' : ''
        } em conformidade com as regras de licitação pública e volume de investimento de R$ ${action.cost.toLocaleString()}.`,
        impactSummary: `Tramitando no órgão competente. Desfecho estimado em ${durationMinutes} minuto${
          durationMinutes > 1 ? 's' : ''
        }.`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 25),
    ],
  };

  return { success: true, newState: updatedState };
}

export function updateDispatchesClock(
  state: PrefeitoCityState,
  now: number
): {
  state: PrefeitoCityState;
  newCompletedOutcomes: DispatchOutcome[];
} {
  if (state.activeDispatches.length === 0) {
    return { state, newCompletedOutcomes: [] };
  }

  let stateChanged = false;
  const newCompletedOutcomes: DispatchOutcome[] = [];
  const updatedDispatches: ActiveDispatch[] = [];

  let nextTreasury = state.treasury;
  let nextMonthlyRevenue = state.monthlyRevenue;
  let nextMonthlyExpenses = state.monthlyExpenses;
  let nextPopulation = state.population;
  let nextJobs = state.jobs;
  let nextUnemployment = state.unemploymentRate;
  let nextTourists = state.touristsPerMonth;
  let nextApproval = state.approvalRating;
  let nextCouncil = state.councilSupport;
  let nextOilBpd = state.oilProductionBpd;
  let nextOilRoyalties = state.oilRoyaltiesMonthly;
  let nextGoldKg = state.goldProductionKg;
  let nextGoldTaxes = state.goldTaxesMonthly;
  let nextEnergyProd = state.energyProductionMw;
  let nextWaterCoverage = state.waterCoveragePercent;
  let nextFiscalRating = state.fiscalRating;
  let nextDebt = state.debt;
  let nextSecurity = state.securityIndex;
  let nextHealth = state.healthIndex;
  let nextEducation = state.educationIndex;
  let nextInfrastructure = state.infrastructureIndex;
  let nextHousingUnits = state.housingUnits || 16800;
  let nextInfraWorks = {
    ...(state.infrastructureWorks || {
      cohabHousingProjects: 2,
      cohabUnitsBuilt: 3400,
      metroLinesKm: 0,
      metroStationsCount: 0,
      trainVltLinesKm: 8,
      brtCorridorsKm: 12,
      brtTerminalsCount: 3,
    }),
  };
  const completedIds = [...state.completedActionIds];
  let gazetteArticlesToAdd: GazetteArticle[] = [];

  for (const dispatch of state.activeDispatches) {
    if (dispatch.completed) {
      updatedDispatches.push(dispatch);
      continue;
    }

    const elapsed = now - dispatch.startTime;
    const progress = Math.min(1, elapsed / dispatch.durationMs);
    const secondsRemaining = Math.max(0, Math.ceil((dispatch.endTime - now) / 1000));

    // Phase lookup
    const actionDef = MUNICIPAL_ACTIONS.find((a) => a.id === dispatch.actionId);
    let currentPhase = dispatch.currentPhaseText;
    let currentDept = dispatch.currentDepartment;

    if (actionDef) {
      const elapsedSec = Math.floor(elapsed / 1000);
      for (let i = actionDef.bureaucracyPhases.length - 1; i >= 0; i--) {
        if (elapsedSec >= actionDef.bureaucracyPhases[i].second) {
          currentPhase = actionDef.bureaucracyPhases[i].label;
          currentDept = actionDef.bureaucracyPhases[i].department;
          break;
        }
      }
    }

    if (elapsed >= dispatch.durationMs) {
      // 1 MINUTE EXPIRED! RESOLVE OUTCOME!
      stateChanged = true;
      const outcome = resolveDispatchOutcome(dispatch, state, actionDef);
      newCompletedOutcomes.push(outcome);

      // Apply impacts
      if (outcome.impacts.treasuryChange) nextTreasury += outcome.impacts.treasuryChange;
      if (outcome.impacts.monthlyRevenueChange) nextMonthlyRevenue += outcome.impacts.monthlyRevenueChange;
      if (outcome.impacts.monthlyExpensesChange) nextMonthlyExpenses += outcome.impacts.monthlyExpensesChange;
      if (outcome.impacts.populationChange) nextPopulation += outcome.impacts.populationChange;
      if (outcome.impacts.jobsChange) nextJobs += outcome.impacts.jobsChange;
      if (outcome.impacts.unemploymentChange) nextUnemployment = Math.max(2.5, Number((nextUnemployment + outcome.impacts.unemploymentChange).toFixed(1)));
      if (outcome.impacts.touristsChange) nextTourists = Math.max(0, nextTourists + outcome.impacts.touristsChange);
      if (outcome.impacts.approvalChange) nextApproval = Math.min(100, Math.max(5, nextApproval + outcome.impacts.approvalChange));
      if (outcome.impacts.councilSupportChange) nextCouncil = Math.min(100, Math.max(5, nextCouncil + outcome.impacts.councilSupportChange));
      if (outcome.impacts.oilBpdChange) nextOilBpd += outcome.impacts.oilBpdChange;
      if (outcome.impacts.goldKgChange) nextGoldKg += outcome.impacts.goldKgChange;
      if (outcome.impacts.energyMwChange) nextEnergyProd += outcome.impacts.energyMwChange;
      if (outcome.impacts.waterPercentChange) nextWaterCoverage = Math.min(100, nextWaterCoverage + outcome.impacts.waterPercentChange);
      if (outcome.impacts.fiscalRatingChange) nextFiscalRating = outcome.impacts.fiscalRatingChange;
      if (outcome.impacts.debtChange) nextDebt = Math.max(0, nextDebt + outcome.impacts.debtChange);
      if (outcome.impacts.housingUnitsChange) nextHousingUnits += outcome.impacts.housingUnitsChange;

      // Obras específicas de infraestrutura e habitação
      if (dispatch.actionId === 'cohab_conjunto_habitacional') {
        nextInfraWorks.cohabHousingProjects = (nextInfraWorks.cohabHousingProjects || 0) + 1;
        nextInfraWorks.cohabUnitsBuilt = (nextInfraWorks.cohabUnitsBuilt || 0) + 1500;
      } else if (dispatch.actionId === 'cohab_urbanizacao_favelas') {
        nextInfraWorks.cohabUnitsBuilt = (nextInfraWorks.cohabUnitsBuilt || 0) + 600;
      } else if (dispatch.actionId === 'metro_linha_subterranea') {
        nextInfraWorks.metroLinesKm = (nextInfraWorks.metroLinesKm || 0) + 10;
        nextInfraWorks.metroStationsCount = (nextInfraWorks.metroStationsCount || 0) + 8;
      } else if (dispatch.actionId === 'trem_metropolitano_vlt') {
        nextInfraWorks.trainVltLinesKm = (nextInfraWorks.trainVltLinesKm || 0) + 14;
      } else if (dispatch.actionId === 'corredor_brt_onibus') {
        nextInfraWorks.brtCorridorsKm = (nextInfraWorks.brtCorridorsKm || 0) + 18;
        nextInfraWorks.brtTerminalsCount = (nextInfraWorks.brtTerminalsCount || 0) + 4;
      }

      // Derived resource taxes
      if (outcome.impacts.oilBpdChange) {
        nextOilRoyalties = Math.round(nextOilBpd * 75); // ~R$ 75 de royalties por barril/dia ao mês
      }
      if (outcome.impacts.goldKgChange) {
        nextGoldTaxes = Math.round(nextGoldKg * 850); // tributo CFEM por kg
      }

      if (outcome.success) {
        completedIds.push(dispatch.actionId);
      }

      // Add Gazette article
      gazetteArticlesToAdd.push({
        id: 'gaz_res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title: outcome.headline,
        source: outcome.success ? 'Diário Oficial' : 'Folha Metropolitana',
        type: outcome.isExceptional ? 'celebracao' : outcome.success ? 'decreto' : 'alerta',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: outcome.officialGazetteExcerpt,
        impactSummary: outcome.detailedReport.slice(0, 2).join(' | '),
        timestamp: Date.now(),
      });

      updatedDispatches.push({
        ...dispatch,
        progress: 1,
        secondsRemaining: 0,
        completed: true,
        currentPhaseText: 'Concluído e Homologado no Diário Oficial',
      });
    } else {
      updatedDispatches.push({
        ...dispatch,
        progress,
        secondsRemaining,
        currentPhaseText: currentPhase,
        currentDepartment: currentDept,
      });
    }
  }

  if (newCompletedOutcomes.length === 0) {
    return {
      state: { ...state, activeDispatches: updatedDispatches },
      newCompletedOutcomes: [],
    };
  }

  const nextSurplusEnergy = Math.max(0, nextEnergyProd - state.energyConsumptionMw);
  const netMonthly = nextMonthlyRevenue - nextMonthlyExpenses;

  const intermediateState: PrefeitoCityState = {
    ...state,
    treasury: nextTreasury,
    monthlyRevenue: nextMonthlyRevenue,
    monthlyExpenses: nextMonthlyExpenses,
    netMonthly,
    population: nextPopulation,
    jobs: nextJobs,
    unemploymentRate: nextUnemployment,
    touristsPerMonth: nextTourists,
    approvalRating: nextApproval,
    councilSupport: nextCouncil,
    oilProductionBpd: nextOilBpd,
    oilRoyaltiesMonthly: nextOilRoyalties,
    goldProductionKg: nextGoldKg,
    goldTaxesMonthly: nextGoldTaxes,
    energyProductionMw: nextEnergyProd,
    energySurplusMw: nextSurplusEnergy,
    waterCoveragePercent: nextWaterCoverage,
    fiscalRating: nextFiscalRating,
    debt: nextDebt,
    housingUnits: nextHousingUnits,
    infrastructureWorks: nextInfraWorks,
    completedActionIds: completedIds,
    activeDispatches: updatedDispatches,
    recentOutcomes: [...newCompletedOutcomes, ...state.recentOutcomes].slice(0, 30),
    gazetteFeed: [...gazetteArticlesToAdd, ...state.gazetteFeed].slice(0, 30),
  };

  const finalState = recalculateMunicipalFinances(intermediateState);

  return { state: finalState, newCompletedOutcomes };
}

function resolveDispatchOutcome(
  dispatch: ActiveDispatch,
  state: PrefeitoCityState,
  actionDef?: import('../types/textGame').MunicipalActionDef
): DispatchOutcome {
  const roll = Math.random() * 100;
  const outcomeId = 'out_' + Date.now();

  switch (dispatch.actionId) {
    // =============================
    // 1. RECURSOS: OURO
    // =============================
    case 'prospeccao_ouro': {
      if (roll < 30) {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: false,
          isExceptional: false,
          headline: 'Sondagem Concluída: Amostras com Teor Inexpressivo nas Serras',
          officialGazetteExcerpt:
            'A expedição geológica finalizou a perfuração das amostras rochosas. Os laudos laboratoriais apontaram traços insignificantes de ouro (menos de 0,3g/tonelada), inviabilizando a lavra industrial. Os equipamentos foram desmobilizados sem retorno financeiro.',
          detailedReport: [
            '❌ Nenhuma jazida comercial encontrada nos quadrantes perfurados.',
            '💸 Investimento de R$ 320.000 absorvido pelo custeio municipal.',
            '📉 Leve crítica da oposição na Câmara por gasto em terreno estéril.',
          ],
          impacts: {
            approvalChange: -2,
            councilSupportChange: -3,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else if (roll < 75) {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: false,
          headline: 'DESCOBERTA DE OURO! Veio Comercial Mapeado com Sucesso',
          officialGazetteExcerpt:
            'A Agência Nacional de Mineração homologou a descoberta de veio aurífero de 6,2 gramas de ouro por tonelada na Serra Norte. Foi outorgada a concessão legal para mineradora que recolherá tributos da CFEM diretamente para o tesouro municipal!',
          detailedReport: [
            '⛏️ Produção estimada de 380 kg de ouro/mês.',
            '💰 Recolhimento mensal de CFEM e ISS mineral: +R$ 320.000/mês para os cofres públicos!',
            '👷 Criação de 650 novos empregos diretos de mineração regulamentada.',
            '📈 Queda do desemprego e aprovação popular em alta.',
          ],
          impacts: {
            goldKgChange: 380,
            monthlyRevenueChange: 320000,
            jobsChange: 650,
            unemploymentChange: -0.8,
            approvalChange: 8,
            councilSupportChange: 6,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: true,
          headline: 'MEGA-JAZIDA ESTRATÉGICA! Super-Reserva de Ouro & Terras Raras',
          officialGazetteExcerpt:
            'NOTÍCIA HISTÓRICA: O município descobriu uma das maiores concentrações de ouro e terras raras (lítio e nióbio) do estado! A reserva foi qualificada como ativo estratégico pelo Ministério de Minas e Energia, atraindo consórcios internacionais e multiplicando o orçamento municipal.',
          detailedReport: [
            '🌟 Descoberta de 1.150 kg de ouro e minerais estratégicos/mês!',
            '💎 Injeção contínua de +R$ 980.000/mês em receitas tributárias perpétuas!',
            '👷 Boom de 2.100 empregos de alta qualificação no interior.',
            '🏛️ Tesouro municipal com superávit recorde.',
          ],
          impacts: {
            goldKgChange: 1150,
            monthlyRevenueChange: 980000,
            jobsChange: 2100,
            unemploymentChange: -2.2,
            approvalChange: 16,
            councilSupportChange: 12,
          },
          timestamp: Date.now(),
          read: false,
        };
      }
    }

    // =============================
    // 2. RECURSOS: PETRÓLEO TERRESTRE
    // =============================
    case 'petroleo_terrestre': {
      if (roll < 35) {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: false,
          isExceptional: false,
          headline: 'Poço Seco: Perfuração Não Encontrou Bolsão de Petróleo Viável',
          officialGazetteExcerpt:
            'A sonda atingiu 2.950 metros de profundidade na bacia sedimentar, encontrando apenas água salobra e formações de arenito compacto. A ANP declarou o poço como sub-econômico e determinou o tamponamento seguro.',
          detailedReport: [
            '❌ Poço pioneiro declarado seco sem acúmulo de hidrocarbonetos.',
            '💸 Prejuízo operacional de R$ 950.000.',
            '🗞️ Jornais locais cobram explicações sobre os riscos da perfuração.',
          ],
          impacts: {
            approvalChange: -3,
            councilSupportChange: -4,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else {
        const bpd = roll > 75 ? 3800 : 1600;
        const revenue = Math.round(bpd * 85);
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: roll > 75,
          headline: roll > 75 ? 'PETRÓLEO JORRANDO! Poço Terrestre de Alta Produtividade' : 'Poço Produtivo Homologado pela ANP',
          officialGazetteExcerpt: `A perfuração terrestre atingiu a camada produtiva de óleo leve (32° API). Testes de vazão confirmaram fluxo contínuo de ${bpd.toLocaleString()} barris de petróleo por dia! O município passa a integrar a rota dos royalties petrolíferos do país.`,
          detailedReport: [
            `🛢️ Produção confirmada de ${bpd.toLocaleString()} barris de petróleo/dia.`,
            `💰 Royalties mensais creditados na conta da Fazenda: +R$ ${revenue.toLocaleString()}/mês!`,
            '👷 Atração de 800 trabalhadores especializados e fornecedores de máquinas.',
            '📈 Arrecadação de ICMS de combustíveis dispara.',
          ],
          impacts: {
            oilBpdChange: bpd,
            monthlyRevenueChange: revenue,
            jobsChange: 800,
            unemploymentChange: -1.2,
            approvalChange: 12,
            councilSupportChange: 8,
          },
          timestamp: Date.now(),
          read: false,
        };
      }
    }

    // =============================
    // 3. RECURSOS: PRÉ-SAL OFFSHORE
    // =============================
    case 'petroleo_presal_mar': {
      if (roll < 30) {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: false,
          isExceptional: false,
          headline: 'Fracasso Offshore: Falha Estrutural e Camada de Sal Compacta',
          officialGazetteExcerpt:
            'A perfuração a 5.200m de lâmina total encontrou uma barreira de anidrita impermeável sem migração de óleo. O consórcio suspendeu as operações com prejuízo elevado e encerrou o bloco.',
          detailedReport: [
            '❌ Bloco marítimo declarado não-comercial.',
            '💸 Elevado custo de R$ 2.800.000 da cota municipal.',
            '📉 Desgaste político na Câmara Municipal e cobrança de CPI.',
          ],
          impacts: {
            approvalChange: -6,
            councilSupportChange: -8,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else if (roll < 75) {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: false,
          headline: 'PRÉ-SAL CONFIRMADO! Campo Petrolífero Marítimo Entra em Produção',
          officialGazetteExcerpt:
            'A sonda marítima confirmou coluna de 180 metros de óleo nobre no horizonte pré-sal. Operação homologada com produção inicial de 18.000 barris/dia, gerando uma torrente de royalties para a cidade!',
          detailedReport: [
            '🛢️ +18.000 barris de petróleo pré-sal por dia.',
            '💰 Royalties municipais astronômicos: +R$ 1.350.000/mês!',
            '🚢 Instalação de base de apoio portuário e helicópteros na cidade.',
            '👷 Criação de 2.400 empregos de alta renda.',
          ],
          impacts: {
            oilBpdChange: 18000,
            monthlyRevenueChange: 1350000,
            jobsChange: 2400,
            unemploymentChange: -2.8,
            approvalChange: 18,
            councilSupportChange: 15,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: true,
          headline: 'COLOSSO DO PRÉ-SAL! Descoberto um dos Maiores Campos do Brasil',
          officialGazetteExcerpt:
            'HISTÓRICO: O teste de vazão da bacia costeira encontrou um megacampo gigante de petróleo ultra-profundo! A ANP estima reserva de bilhões de barris. O município se torna a capital nacional da energia e da riqueza petrolífera!',
          detailedReport: [
            '🌟 GIGANTE DO PRÉ-SAL: +42.000 barris de petróleo de alta qualidade/dia!',
            '💰 Enxurrada de royalties: +R$ 3.150.000/mês direto nos cofres da Prefeitura!',
            '🚢 Obras do polo naval e base de apoio offshore iniciadas.',
            '👷 5.200 novos empregos gerados e salário médio da cidade dobra.',
            '🚀 O município passa a ser superavitário para sempre!',
          ],
          impacts: {
            oilBpdChange: 42000,
            monthlyRevenueChange: 3150000,
            jobsChange: 5200,
            unemploymentChange: -4.5,
            approvalChange: 25,
            councilSupportChange: 25,
          },
          timestamp: Date.now(),
          read: false,
        };
      }
    }

    // =============================
    // 4. BNDES: FINANCIAMENTO MOBILIDADE
    // =============================
    case 'financiamento_bndes_mobilidade': {
      if (state.fiscalRating === 'C' || state.fiscalRating === 'D') {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: false,
          isExceptional: false,
          headline: 'BNDES VETA PEDIDO: Município Reprovado na Análise Fiscal da STN',
          officialGazetteExcerpt:
            'A Diretoria de Crédito do BNDES indeferiu formalmente o pedido de financiamento de R$ 15.000.000. O motivo foi o rating fiscal insuficiente (CAPAG C/D) e a proximidade do teto da Lei de Responsabilidade Fiscal.',
          detailedReport: [
            '❌ Financiamento negado integralmente.',
            '⚖️ O BNDES e o Ministério da Fazenda exigem plano prévio de austeridade e equilíbrio de contas.',
            '💸 Contrapartida de R$ 450.000 em projetos técnicos não retornará aos cofres.',
          ],
          impacts: {
            approvalChange: -5,
            councilSupportChange: -6,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: true,
          headline: 'BNDES LIBERA R$ 15 MILHÕES! Contrato Assinado no Palácio Municipal',
          officialGazetteExcerpt:
            'Com parecer favorável da Secretaria do Tesouro Nacional, o BNDES creditou o valor total de R$ 15.000.000 a juros subsidiados de longo prazo para as obras de mobilidade urbana e novos viadutos!',
          detailedReport: [
            '🏦 Injeção de R$ 15.000.000 no caixa municipal!',
            '🚜 Início imediato da duplicação de avenidas e corredores de ônibus.',
            '👷 Criação de 1.100 empregos diretos na construção pesada.',
            '📈 Eficiência do trânsito sobe e aprovação popular dispara.',
          ],
          impacts: {
            treasuryChange: 15000000,
            debtChange: 15000000,
            monthlyExpensesChange: 110000, // parcela amortização
            jobsChange: 1100,
            unemploymentChange: -1.4,
            approvalChange: 15,
            councilSupportChange: 12,
          },
          timestamp: Date.now(),
          read: false,
        };
      }
    }

    // =============================
    // 5. CAIXA: HABITAÇÃO R$ 8M
    // =============================
    case 'credito_caixa_moradia': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: false,
        headline: 'Caixa Econômica Libera R$ 8 Milhões para Regularização e Moradia',
        officialGazetteExcerpt:
          'O contrato do programa Pró-Moradia foi assinado na agência regional. A verba garante o reassentamento digno de famílias de encostas e a pavimentação de três bairros periféricos.',
        detailedReport: [
          '🏗️ R$ 8.000.000 creditados na conta de convênios da Prefeitura.',
          '🏡 450 novas casas populares com escritura registrada entregues.',
          '👷 600 postos de trabalho gerados em alvenaria e saneamento.',
          '📈 Aprovação maciça nas comunidades beneficiadas.',
        ],
        impacts: {
          treasuryChange: 8000000,
          debtChange: 8000000,
          monthlyExpensesChange: 65000,
          jobsChange: 600,
          unemploymentChange: -0.9,
          approvalChange: 11,
          councilSupportChange: 7,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    // =============================
    // 6. ENERGIA SOLAR MUNICIPAL
    // =============================
    case 'usina_solar_municipal': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: false,
        headline: 'Usina Solar de 70 MW Inaugurada e Conectada à Rede Nacional',
        officialGazetteExcerpt:
          'O platô solar com 140.000 placas fotovoltaicas começou a operar em potência nominal. Os prédios públicos, escolas e postos de saúde agora utilizam 100% de energia limpa com conta de luz zerada!',
        detailedReport: [
          '☀️ +70 MW de geração de energia limpa adicionados à matriz municipal.',
          '📉 Economia de R$ 130.000/mês nas contas de energia dos prédios públicos!',
          '⚡ Excedente pronto para ser vendido para a cidade vizinha no modo regional.',
          '🌿 Selo internacional de Sustentabilidade Urbana concedido.',
        ],
        impacts: {
          energyMwChange: 70,
          monthlyExpensesChange: -130000, // economia permanente
          approvalChange: 7,
          councilSupportChange: 5,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    // =============================
    // 7. CARNAVAL MUNICIPAL
    // =============================
    case 'carnaval_municipal': {
      if (state.securityIndex < 45) {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: false,
          isExceptional: false,
          headline: 'Carnaval com Incidentes de Segurança e Reclamação dos Comerciantes',
          officialGazetteExcerpt:
            'Apesar da multidão de foliões, a baixa presença de policiamento gerou tumultos e arrastões no circuito dos blocos. A oposição usou as redes sociais para criticar a falta de planejamento do Gabinete.',
          detailedReport: [
            '⚠️ Furtos e tumultos causaram repercussão negativa na imprensa.',
            '🌴 Aumento de turistas foi menor que o projetado (+18.000).',
            '📉 Queda de 6% na popularidade por desorganização.',
          ],
          impacts: {
            touristsChange: 18000,
            monthlyRevenueChange: 90000,
            approvalChange: -6,
            councilSupportChange: -4,
          },
          timestamp: Date.now(),
          read: false,
        };
      } else {
        return {
          id: outcomeId,
          actionId: dispatch.actionId,
          actionTitle: dispatch.title,
          category: dispatch.category,
          success: true,
          isExceptional: true,
          headline: 'CARNAVAL HISTÓRICO! 75.000 Turistas Lotam Hotéis e Restaurantes',
          officialGazetteExcerpt:
            'O circuito de rua foi consagrado como o mais seguro e animado do estado. Ocupação de 99% na rede hoteleira, injeção maciça de dinheiro no comércio informal e recorde histórico de arrecadação de ISS!',
          detailedReport: [
            '🎭 +75.000 turistas movimentaram a economia no mês!',
            '💰 Comércio faturou milhões; arrecadação municipal extra de +R$ 420.000/mês.',
            '👷 1.400 empregos temporários e renda direta para ambulantes e pousadas.',
            '🎉 Popularidade do Prefeito atinge índice histórico de aprovação.',
          ],
          impacts: {
            touristsChange: 75000,
            monthlyRevenueChange: 420000,
            jobsChange: 1400,
            unemploymentChange: -1.6,
            approvalChange: 14,
            councilSupportChange: 8,
          },
          timestamp: Date.now(),
          read: false,
        };
      }
    }

    // =============================
    // 8. COMPLEXO PETROQUÍMICO
    // =============================
    case 'complexo_petroquimico': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: true,
        headline: 'Complexo Petroquímico Inaugurado: Cidade se Torna Polo Industrial',
        officialGazetteExcerpt:
          'A refinaria municipal começou a craquear o petróleo extraído nos poços locais. O município passa a abastecer frotas de caminhões e indústrias com diesel e polímeros próprios, retendo toda a riqueza dentro do território!',
        detailedReport: [
          '🏭 4.800 novos empregos industriais de alta remuneração!',
          '💰 Arrecadação de ICMS e ISS industrial sobe em +R$ 1.950.000/mês!',
          '📉 Desemprego despenca para níveis históricos.',
          '📈 Salário médio da população aumenta 45%.',
        ],
        impacts: {
          monthlyRevenueChange: 1950000,
          jobsChange: 4800,
          unemploymentChange: -4.2,
          approvalChange: 20,
          councilSupportChange: 18,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    // =============================
    // 9. HABITAÇÃO: COHAB E URBANIZAÇÃO DE FAVELAS
    // =============================
    case 'cohab_conjunto_habitacional': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: true,
        headline: 'SONHO DA CASA PRÓPRIA: Conjunto COHAB Entrega 1.500 Apartamentos',
        officialGazetteExcerpt:
          'Chaves entregues em grande cerimônia no novo Conjunto Habitacional COHAB. Famílias cadastradas no programa de habitação de interesse social comemoram moradia digna com água, luz e transporte público.',
        detailedReport: [
          '🏢 +1.500 apartamentos populares entregues a famílias da fila da habitação.',
          '📉 Déficit habitacional reduzido drasticamente em toda a comarca.',
          '👷 700 postos de trabalho gerados durante as obras da construção civil.',
          '📈 Aprovação popular do Prefeito sobe expressivamente entre os trabalhadores.',
        ],
        impacts: {
          housingUnitsChange: 1500,
          jobsChange: 700,
          unemploymentChange: -0.6,
          approvalChange: 16,
          councilSupportChange: 9,
          monthlyRevenueChange: 45000,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    case 'cohab_urbanizacao_favelas': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: false,
        headline: 'Dignidade Urbana: Regularização Fundiária e Asfalto em Comunidades COHAB',
        officialGazetteExcerpt:
          'O programa municipal de urbanização concluiu obras de drenagem, saneamento e contenção de encostas em três comunidades. 600 lotes receberam escrituras definitivas registradas em cartório.',
        detailedReport: [
          '🏠 600 títulos de propriedade entregues a moradores vulneráveis.',
          '💧 Redes de água encanada e esgoto instaladas nas vielas.',
          '🛡️ Risco de desabamento de encostas eliminado pela Defesa Civil.',
          '📈 Inclusão social e cidadania fortalecem a gestão municipal.',
        ],
        impacts: {
          housingUnitsChange: 600,
          waterPercentChange: 6,
          approvalChange: 12,
          councilSupportChange: 6,
          monthlyRevenueChange: 25000,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    // =============================
    // 10. MOBILIDADE: METRÔ, TREM E BRT
    // =============================
    case 'metro_linha_subterranea': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: true,
        headline: 'METRÔ INAUGURADO: Linha 1 Subterrânea Começa a Operar com 8 Estações',
        officialGazetteExcerpt:
          'A maior obra da história do município foi homologada e aberta ao público. O metrô interliga o centro financeiro aos bairros mais populosos em menos de 15 minutos, revolucionando a produtividade local.',
        detailedReport: [
          '🚇 10 km de trilhos subterrâneos e 8 estações modernas climatizadas.',
          '⏱️ Tempo de deslocamento dos trabalhadores cai em até 65%.',
          '💼 2.800 novos empregos no comércio das estações e manutenção.',
          '📈 Cidade alcança patamar de metrópole desenvolvida no cenário nacional.',
        ],
        impacts: {
          jobsChange: 2800,
          unemploymentChange: -2.1,
          monthlyRevenueChange: 280000,
          approvalChange: 22,
          councilSupportChange: 14,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    case 'trem_metropolitano_vlt': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: false,
        headline: 'Trem Metropolitano VLT Conecta Bairros Periféricos com Trilhos Elétricos',
        officialGazetteExcerpt:
          'Com tecnologia sustentável e zero emissão de carbono, o VLT entrou em circulação nos 14 km de linha férrea modernizada, desafogando avenidas e reduzindo acidentes de trânsito.',
        detailedReport: [
          '🚊 14 km de trilhos de VLT de superfície conectando a periferia ao centro.',
          '🌿 Redução maciça da poluição do ar e desafogamento do tráfego.',
          '👷 950 empregos permanentes de operação e maquinistas.',
          '💰 Aumento de arrecadação comercial no entorno das paradas.',
        ],
        impacts: {
          jobsChange: 950,
          unemploymentChange: -0.9,
          monthlyRevenueChange: 95000,
          approvalChange: 14,
          councilSupportChange: 8,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    case 'corredor_brt_onibus': {
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: true,
        isExceptional: false,
        headline: 'Corredores Exclusivos BRT Implantados com Estações Tubo e Embarque Nível',
        officialGazetteExcerpt:
          'A prefeitura inaugurou 18 km de faixas exclusivas para ônibus articulados. O sistema BRT permite embarque pré-pago em estações tubo, reduzindo paradas em semáforos e viagens 40% mais velozes.',
        detailedReport: [
          '🚌 18 km de pistas exclusivas de concreto e 4 novos terminais de integração.',
          '⚡ Ônibus biarticulados com Wi-Fi e ar-condicionado operando.',
          '👷 600 postos de trabalho para motoristas e fiscais.',
          '👍 Elogios imediatos da população que depende de transporte público.',
        ],
        impacts: {
          jobsChange: 600,
          unemploymentChange: -0.5,
          monthlyRevenueChange: 65000,
          approvalChange: 11,
          councilSupportChange: 7,
        },
        timestamp: Date.now(),
        read: false,
      };
    }

    // Default fallback outcome
    default: {
      const isSuccess = roll >= 20;
      return {
        id: outcomeId,
        actionId: dispatch.actionId,
        actionTitle: dispatch.title,
        category: dispatch.category,
        success: isSuccess,
        isExceptional: roll > 85,
        headline: isSuccess
          ? `Projeto "${dispatch.title}" Homologado com Sucesso`
          : `Projeto "${dispatch.title}" Teve Pendências Burocráticas`,
        officialGazetteExcerpt: isSuccess
          ? `Após 60 segundos de tramitação rigorosa nos departamentos municipais, o projeto "${dispatch.title}" foi homologado e publicado na íntegra no Diário Oficial.`
          : `O Tribunal de Contas e os órgãos reguladores apontaram inconsistências orçamentárias no processo de "${dispatch.title}". O projeto foi parcialmente suspenso para adequações.`,
        detailedReport: isSuccess
          ? [
              '✅ Todas as fases burocráticas cumpridas com conformidade.',
              '📈 Impactos econômicos e sociais integrados ao orçamento.',
              '🏛️ Decreto assinado pelo Prefeito no Palácio Municipal.',
            ]
          : [
              '⚠️ Pendência jurídica ou orçamentária identificada.',
              '📉 Necessário ajuste de contas antes de reabrir o processo.',
            ],
        impacts: isSuccess
          ? {
              approvalChange: 5,
              councilSupportChange: 4,
              monthlyRevenueChange: 80000,
              jobsChange: 250,
            }
          : {
              approvalChange: -2,
              councilSupportChange: -2,
            },
        timestamp: Date.now(),
        read: false,
      };
    }
  }
}

export function calculateSimCityDynamics(state: PrefeitoCityState): {
  newPopulation: number;
  netMigration: number;
  reasons: { factor: string; impact: number; positive: boolean }[];
  attractiveness: number;
  newEmployed: number;
  newUnemploymentRate: number;
  newHousingUnits: number;
  newHousingDeficit: number;
  newHousingOccupancyRate: number;
} {
  const reasons: { factor: string; impact: number; positive: boolean }[] = [];

  // 1. Emprego e Mercado de Trabalho
  const unemp = state.unemploymentRate || 8.5;
  if (unemp < 5.0) {
    const impact = 380;
    reasons.push({ factor: 'Polo de empregos aquecido (desemprego abaixo de 5%)', impact, positive: true });
  } else if (unemp < 7.5) {
    const impact = 220;
    reasons.push({ factor: 'Mercado de trabalho dinâmico e vagas disponíveis', impact, positive: true });
  } else if (unemp <= 10.0) {
    const impact = 70;
    reasons.push({ factor: 'Equilíbrio no comércio e serviços locais', impact, positive: true });
  } else if (unemp <= 14.0) {
    const impact = -180;
    reasons.push({ factor: 'Escassez de vagas no comércio formal', impact, positive: false });
  } else {
    const impact = -450;
    reasons.push({ factor: 'Crise severa de desemprego (famílias buscam outras cidades)', impact, positive: false });
  }

  // 2. Habitação & Custo de Moradia
  const familyCount = Math.round(state.population / 2.9);
  const units = state.housingUnits || 16800;
  const currentDeficit = Math.max(0, familyCount - units);
  if (currentDeficit === 0) {
    const impact = 240;
    reasons.push({ factor: 'Oferta farta de moradias com aluguéis acessíveis', impact, positive: true });
  } else if (currentDeficit < 800) {
    const impact = 80;
    reasons.push({ factor: 'Mercado imobiliário equilibrado', impact, positive: true });
  } else if (currentDeficit < 2000) {
    const impact = -150;
    reasons.push({ factor: 'Déficit habitacional e aumento nos preços dos aluguéis', impact, positive: false });
  } else {
    const impact = -320;
    reasons.push({ factor: 'Crise de moradia e falta de loteamentos populares', impact, positive: false });
  }

  // 3. Segurança Pública
  const sec = state.securityIndex || 60;
  if (sec >= 72) {
    const impact = 210;
    reasons.push({ factor: 'Bairros seguros e presença ostensiva da Guarda', impact, positive: true });
  } else if (sec < 45) {
    const impact = -310;
    reasons.push({ factor: 'Sensação de insegurança e criminalidade nos bairros', impact, positive: false });
  }

  // 4. Educação & Saúde
  const edu = state.educationIndex || 64;
  const health = state.healthIndex || 55;
  if (edu >= 68 && health >= 65) {
    const impact = 200;
    reasons.push({ factor: 'Rede escolar bem avaliada e atendimento ágil no SUS', impact, positive: true });
  } else if (edu < 48 || health < 48) {
    const impact = -220;
    reasons.push({ factor: 'Filas nos postos de saúde e falta de vagas em creches', impact, positive: false });
  }

  // 5. Energia, Água & Gás
  if (state.energySurplusMw < 0) {
    const impact = -400;
    reasons.push({ factor: 'Risco iminente de apagões na rede elétrica', impact, positive: false });
  } else if (state.energySurplusMw >= 8) {
    const impact = 130;
    reasons.push({ factor: 'Matriz energética confiável com superávit de potência', impact, positive: true });
  }

  if (state.waterCoveragePercent >= 80) {
    const impact = 160;
    reasons.push({ factor: 'Universalização do saneamento e água tratada', impact, positive: true });
  } else if (state.waterCoveragePercent < 60) {
    const impact = -250;
    reasons.push({ factor: 'Esgoto a céu aberto e interrupções no fornecimento de água', impact, positive: false });
  }

  if ((state.gasCoveragePercent || 42) >= 60) {
    const impact = 90;
    reasons.push({ factor: 'Ampla rede de gás canalizado residencial e industrial', impact, positive: true });
  }

  // 6. Conectividade & Telecomunicações (2G, 3G, 4G, 5G)
  const telecom = state.telecomGeneration || '3G';
  if (telecom === '5G') {
    const impact = 350;
    reasons.push({ factor: 'Sinal 5G ultrarrápido e Cidade Inteligente (atrai jovens e empresas)', impact, positive: true });
  } else if (telecom === '4G') {
    const impact = 150;
    reasons.push({ factor: 'Conexão móvel 4G veloz em todo o perímetro urbano', impact, positive: true });
  } else if (telecom === '2G') {
    const impact = -220;
    reasons.push({ factor: 'Sinal celular arcaico 2G limita o comércio e modernidade', impact, positive: false });
  }

  // 7. Empresas Instaladas
  const companiesCount = (state.installedCompanies || []).length;
  if (companiesCount >= 2) {
    const impact = 160;
    reasons.push({ factor: 'Polo industrial e de serviços em expansão atrai novas famílias', impact, positive: true });
  }

  // Saldo migratório líquido
  const netMigration = reasons.reduce((sum, r) => sum + r.impact, 0);

  // Nova População
  const newPopulation = Math.max(5000, state.population + netMigration);

  // Dinâmica de Emprego
  // Cerca de 52% dos migrantes entram na força de trabalho
  const deltaWorkforce = Math.round(netMigration * 0.52);
  const newEmployed = Math.max(2000, state.employed + Math.round(deltaWorkforce * (unemp < 10 ? 0.85 : 0.45)));
  const totalWorkforce = Math.round(newPopulation * 0.48);
  const newUnemploymentRate = Number(Math.max(2.0, Math.min(28.0, ((totalWorkforce - newEmployed) / totalWorkforce) * 100)).toFixed(1));

  // Habitação
  const newFamilyCount = Math.round(newPopulation / 2.9);
  const newHousingUnits = state.housingUnits || 16800;
  const newHousingDeficit = Math.max(0, newFamilyCount - newHousingUnits);
  const newHousingOccupancyRate = Math.min(100, Math.round((newFamilyCount / Math.max(1, newHousingUnits)) * 100));

  // Cálculo da pontuação de atratividade (0 a 100)
  const baseScore = 50;
  const migrationBonus = Math.max(-25, Math.min(25, Math.round(netMigration / 30)));
  const secBonus = Math.round((sec - 50) * 0.2);
  const eduBonus = Math.round((edu - 50) * 0.15);
  const healthBonus = Math.round((health - 50) * 0.15);
  const telecomBonus = telecom === '5G' ? 12 : telecom === '4G' ? 6 : telecom === '3G' ? 0 : -8;
  const attractiveness = Math.max(5, Math.min(100, baseScore + migrationBonus + secBonus + eduBonus + healthBonus + telecomBonus));

  return {
    newPopulation,
    netMigration,
    reasons,
    attractiveness,
    newEmployed,
    newUnemploymentRate,
    newHousingUnits,
    newHousingDeficit,
    newHousingOccupancyRate,
  };
}

export function recalculateMunicipalFinances(state: PrefeitoCityState): PrefeitoCityState {
  const minWage = state.minimumWage || 1412;
  const fineSeverity = state.trafficFineSeverity || 'padrao';
  const companies = state.publicCompanies;
  const taxRates = state.taxRates || {
    iptuPobresPercent: 0.2,
    iptuMediosPercent: 1.2,
    iptuRicosPercent: 3.5,
    iptuPercent: 1.2,
    issPercent: 3.5,
    itbiPercent: 2.0,
    taxaIluminacaoCip: 18.0,
  };

  const iptuPobresRate = taxRates.iptuPobresPercent ?? 0.2;
  const iptuMediosRate = taxRates.iptuMediosPercent ?? 1.2;
  const iptuRicosRate = taxRates.iptuRicosPercent ?? 3.5;

  const deptBudgets = state.departmentBudgets || {
    educacao: { budgetMonthly: 60000, focus: 'merenda', effectiveness: 72 },
    saude: { budgetMonthly: 75000, focus: 'upas_24h', effectiveness: 68 },
    segurancaGuarda: { budgetMonthly: 40000, focus: 'patrulhamento_bairros', effectiveness: 65 },
    bombeirosDefesaCivil: { budgetMonthly: 30000, focus: 'prevencao_enchentes', effectiveness: 62 },
    saneamentoBasico: { budgetMonthly: 35000, focus: 'tratamento_agua', effectiveness: 65 },
    infraestruturaObras: { budgetMonthly: 40000, focus: 'recapeamento_asfalto', effectiveness: 66 },
    transporteMobilidade: { budgetMonthly: 30000, focus: 'frota_eletrica', effectiveness: 64 },
    energiaIluminacao: { budgetMonthly: 35000, focus: 'led_100', effectiveness: 70 },
    meioAmbiente: { budgetMonthly: 20000, focus: 'coleta_seletiva', effectiveness: 60 },
  };

  // 1. Receitas Detalhadas - Modo SimCity & Progressividade
  const resPobresRate = taxRates.resPobresPercent ?? 6.0;
  const resMediosRate = taxRates.resMediosPercent ?? 8.5;
  const resRicosRate = taxRates.resRicosPercent ?? 11.0;

  const comPobresRate = taxRates.comPobresPercent ?? 7.0;
  const comMediosRate = taxRates.comMediosPercent ?? 8.5;
  const comRicosRate = taxRates.comRicosPercent ?? 10.5;

  const indPobresRate = taxRates.indPobresPercent ?? 8.5;
  const indMediosRate = taxRates.indMediosPercent ?? 8.5;
  const indRicosRate = taxRates.indRicosPercent ?? 7.0;

  const popFactor = (state.population / 48500);
  const infraFactor = (state.infrastructureIndex / 58);
  const jobsFactor = (state.jobs / 21200);

  // Impostos Residenciais SimCity (R$, R$$, R$$$)
  const resPobres = Math.round(35000 * popFactor * (resPobresRate / 6.0));
  const resMedios = Math.round(75000 * popFactor * infraFactor * (resMediosRate / 8.5));
  const resRicos = Math.round(55000 * popFactor * infraFactor * (resRicosRate / 11.0));
  const totalResidencial = resPobres + resMedios + resRicos;

  // Impostos Comerciais SimCity (C$, C$$, C$$$)
  const comPobres = Math.round(28000 * jobsFactor * (comPobresRate / 7.0));
  const comMedios = Math.round(62000 * jobsFactor * (comMediosRate / 8.5));
  const comRicos = Math.round(48000 * jobsFactor * infraFactor * (comRicosRate / 10.5));
  const totalComercial = comPobres + comMedios + comRicos;

  // Impostos Industriais SimCity (I-P, I-M, I-HT)
  const indPobres = Math.round(32000 * jobsFactor * (indPobresRate / 8.5));
  const indMedios = Math.round(45000 * jobsFactor * (indMediosRate / 8.5));
  const indRicos = Math.round(38000 * (state.telecomGeneration === '5G' ? 1.4 : 1.0) * (indRicosRate / 7.0));
  const totalIndustrial = indPobres + indMedios + indRicos;

  // Harmonização de IPTU e ISS
  const iptu = totalResidencial;
  const iptuPobres = resPobres;
  const iptuMedios = resMedios;
  const iptuRicos = resRicos;

  // Receita de Empresas Atraídas para a Cidade
  let impostosEmpresasInstaladas = 0;
  (state.installedCompanies || []).forEach((comp) => {
    impostosEmpresasInstaladas += comp.benefits?.monthlyTaxGain || 0;
  });

  // Conectividade Telecomunicações & TI
  let issTelecomDigital = 0;
  if (state.telecomGeneration === '5G') {
    issTelecomDigital = 55000;
  } else if (state.telecomGeneration === '4G') {
    issTelecomDigital = 22000;
  }

  // ISS e Setor Produtivo (Comércio + Indústria + Telecom + Empresas atraídas)
  const wageBoostToCommerce = Math.max(0, Math.round((minWage - 1412) * 50));
  const touristBoost = Math.round(state.touristsPerMonth * 4.2);
  const iss = totalComercial + totalIndustrial + impostosEmpresasInstaladas + issTelecomDigital + touristBoost + wageBoostToCommerce;

  // FPM e ICMS (Transferências constitucionais do Estado e União escalam com população)
  let fpmMultiplier = 1.0;
  if (state.population >= 80000) fpmMultiplier = 1.8;
  else if (state.population >= 60000) fpmMultiplier = 1.4;
  else if (state.population >= 40000) fpmMultiplier = 1.0;
  else if (state.population >= 20000) fpmMultiplier = 0.75;
  else fpmMultiplier = 0.5;

  const fpmIcms = Math.round(130000 * (state.population / 48500) * fpmMultiplier);

  // Taxa de Iluminação Pública CIP / COSIP
  const taxaIluminacaoTotal = Math.round((state.population / 3.4) * (taxRates.taxaIluminacaoCip || 18));

  // ITBI - Imposto de Transmissão de Bens Imóveis
  const itbiRate = (taxRates.itbiPercent || 2.0) / 2.0;
  const itbi = Math.round(42000 * (state.population / 48500) * (state.infrastructureIndex / 58) * itbiRate);

  // Zona Azul Digital & Parquímetros
  const estacionamentoRotativo = Math.round(28000 * (state.jobs / 21200) * (state.infrastructureIndex / 55));

  // Taxa de Resíduos Sólidos Urbanos (TCRS)
  const taxaResiduosColeta = Math.round(31500 * (state.population / 48500));

  // Taxa de Preservação Ambiental & Ecoturismo
  const tarifaTurismoEcologica = Math.round(Math.max(0, state.touristsPerMonth || 0) * 4.5);

  // Concessões e Outorga de Espaços Públicos (Quiosques, Feiras e Rede de Gás)
  const tarifaGasRede = Math.round((state.gasDistributionKm || 38) * 350);
  const concessoesMercadosQuiosques = Math.round(19500 * (state.infrastructureIndex / 55)) + tarifaGasRede;

  // Venda de Excedente Energético para o SIN
  const vendaEnergiaRede = Math.round(Math.max(0, state.energySurplusMw || 0) * 850);
  
  // Multas de Trânsito & Postura Municipal
  const multasTransito =
    fineSeverity === 'rigorosa' ? 120000 : fineSeverity === 'padrao' ? 55000 : 18000;

  // Políticas Estratégicas de Petróleo e Minérios
  const natStrategy = state.naturalResourcesStrategy || {
    oilPolicy: 'export_crude',
    goldPolicy: 'sell_bullion_cash',
    sovereignFundBalance: 0,
    sovereignFundMonthlyYield: 0,
    goldReserveKg: 0,
    fuelDiscountActive: false,
    gasDiscountPercent: 0,
  };

  let royaltiesPetroleo = state.oilRoyaltiesMonthly || 0;
  let cfemOuro = state.goldTaxesMonthly || 0;
  let rendimentoFundoSoberano = 0;
  let fatorCombustivelFrota = 1.0; // 1.0 = normal, 0.70 = refino local barateia diesel e gasolina!

  if (state.oilProductionBpd > 0) {
    if (natStrategy.oilPolicy === 'export_crude') {
      royaltiesPetroleo = state.oilRoyaltiesMonthly;
    } else if (natStrategy.oilPolicy === 'local_refinery_consumption') {
      // 35% de royalties em dinheiro vivo; 65% vira refino local: combustível barato para frotas e gás!
      royaltiesPetroleo = Math.round(state.oilRoyaltiesMonthly * 0.35);
      fatorCombustivelFrota = 0.70; // 30% de economia em combustíveis municipais
    } else if (natStrategy.oilPolicy === 'sovereign_wealth_fund') {
      // 40% de royalties em caixa, 60% vai para poupança perpétua que rende dividendos
      royaltiesPetroleo = Math.round(state.oilRoyaltiesMonthly * 0.40);
      rendimentoFundoSoberano = Math.round((natStrategy.sovereignFundBalance || 0) * 0.008); // 0.8% ao mês
    }
  }

  if (state.goldProductionKg > 0) {
    if (natStrategy.goldPolicy === 'sell_bullion_cash') {
      cfemOuro = state.goldTaxesMonthly;
    } else if (natStrategy.goldPolicy === 'industrial_tech_jewelry') {
      cfemOuro = Math.round(state.goldTaxesMonthly * 0.35);
    } else if (natStrategy.goldPolicy === 'strategic_reserve') {
      cfemOuro = 0; // Ouro fica estocado no cofre como lastro financeiro
    }
  }

  // Lucro/Dividendos positivos de empresas públicas
  let lucroEstatais = 0;
  if (companies?.correios?.monthlyResult > 0) lucroEstatais += companies.correios.monthlyResult;
  if (companies?.saneamento?.monthlyResult > 0) lucroEstatais += companies.saneamento.monthlyResult;
  if (companies?.transporte?.monthlyResult > 0) lucroEstatais += companies.transporte.monthlyResult;

  // Receitas de Empréstimos concedidos a outras cidades (parcelas recebidas)
  let receitasEmprestimosRecebidos = 0;
  (state.intermunicipalLoans || []).forEach((loan) => {
    if (loan.status === 'active' && loan.lenderCity === state.cityName) {
      receitasEmprestimosRecebidos += loan.installmentValue;
    }
  });

  const totalRevenue =
    iptu +
    iss +
    itbi +
    fpmIcms +
    taxaIluminacaoTotal +
    taxaResiduosColeta +
    estacionamentoRotativo +
    tarifaTurismoEcologica +
    concessoesMercadosQuiosques +
    vendaEnergiaRede +
    multasTransito +
    royaltiesPetroleo +
    cfemOuro +
    rendimentoFundoSoberano +
    lucroEstatais +
    receitasEmprestimosRecebidos;

  // 2. Despesas Detalhadas
  // Folha de pagamento aumenta proporcionalmente ao piso salarial municipal
  const wageRatio = minWage / 1412;
  const payroll = Math.round(260000 * wageRatio);

  // Previdência Municipal dos Servidores (RPPS - Aposentadorias e Encargos Obrigatórios ~14%)
  const previdenciaServidores = Math.round(payroll * 0.14);

  // Gastos diretos com todas as secretarias definidos pelo prefeito
  const educacaoMerenda = Math.round(deptBudgets.educacao?.budgetMonthly || 60000);
  const saudeSus = Math.round(deptBudgets.saude?.budgetMonthly || 75000);
  const segurancaGuarda = Math.round(deptBudgets.segurancaGuarda?.budgetMonthly || 40000);
  const bombeirosDefesa = Math.round(deptBudgets.bombeirosDefesaCivil?.budgetMonthly || 30000);
  const saneamentoGasto = Math.round(deptBudgets.saneamentoBasico?.budgetMonthly || 35000);
  const obrasGasto = Math.round(deptBudgets.infraestruturaObras?.budgetMonthly || 40000);
  const transporteGasto = Math.round(deptBudgets.transporteMobilidade?.budgetMonthly || 30000);
  const energiaGasto = Math.round(deptBudgets.energiaIluminacao?.budgetMonthly || 35000);
  const meioAmbienteGasto = Math.round(deptBudgets.meioAmbiente?.budgetMonthly || 20000);

  // Contrato Operacional de Limpeza Urbana, Varrição & Aterro Sanitário
  const limpezaResiduosAterro = Math.round(32000 * (state.population / 48500));

  // Combustível, Óleo e Manutenção da Frota Municipal (com desconto se houver refino local)
  const baseCombustivel =
    24000 +
    (deptBudgets.segurancaGuarda?.budgetMonthly || 40000) * 0.14 +
    (deptBudgets.saude?.budgetMonthly || 75000) * 0.08;
  const combustivelManutencaoFrota = Math.round(baseCombustivel * fatorCombustivelFrota);

  // Conta de Energia Elétrica e Água dos Prédios Públicos
  const energiaPrediosPublicos = Math.round(22000 * (state.infrastructureIndex / 58));

  // Sistemas Digitais, Conectividade, Softwares de Saúde (e-SUS) e IPTU Online
  const sistemasDigitaisTi = 15000;

  const manutencaoUrbana =
    Math.round(20000 * (state.infrastructureIndex / 58)) +
    bombeirosDefesa +
    saneamentoGasto +
    obrasGasto +
    transporteGasto +
    energiaGasto +
    meioAmbienteGasto;

  // Subsídio a empresas públicas deficitárias
  let subsidioEstatais = 0;
  if (companies?.correios?.monthlyResult < 0) subsidioEstatais += Math.abs(companies.correios.monthlyResult);
  if (companies?.saneamento?.monthlyResult < 0) subsidioEstatais += Math.abs(companies.saneamento.monthlyResult);
  if (companies?.transporte?.monthlyResult < 0) subsidioEstatais += Math.abs(companies.transporte.monthlyResult);

  // Amortização de Dívida Consolidada regular (se tiver reserva de ouro no cofre, rating sobe e juros caem)
  const descontoLastroOuro = (natStrategy.goldReserveKg || 0) > 20 ? 0.6 : 1.0;
  const amortizacaoDividaRegular = state.debt > 0 ? Math.round(state.debt * 0.01 * descontoLastroOuro) : 0;

  // Parcelas de empréstimos tomados de outras prefeituras
  let parcelasEmprestimosPagos = 0;
  (state.intermunicipalLoans || []).forEach((loan) => {
    if (loan.status === 'active' && loan.borrowerCity === state.cityName) {
      parcelasEmprestimosPagos += loan.installmentValue;
    }
  });

  const amortizacaoDivida = amortizacaoDividaRegular + parcelasEmprestimosPagos;

  const totalExpenses =
    payroll +
    previdenciaServidores +
    saudeSus +
    educacaoMerenda +
    segurancaGuarda +
    limpezaResiduosAterro +
    combustivelManutencaoFrota +
    energiaPrediosPublicos +
    sistemasDigitaisTi +
    manutencaoUrbana +
    subsidioEstatais +
    amortizacaoDivida;

  const netMonthly = totalRevenue - totalExpenses;

  // Ratios da LRF
  const payrollRatio = Number(((payroll / Math.max(1, totalRevenue)) * 100).toFixed(1));
  const debtRatio = Number(((state.debt / Math.max(1, totalRevenue * 12)) * 100).toFixed(1));

  // Rating Fiscal CAPAG da STN
  let fiscalRating: FiscalRating = 'B';
  if (payrollRatio < 48 && debtRatio < 60 && netMonthly > 0) {
    fiscalRating = 'A';
  } else if (payrollRatio < 54 && debtRatio < 100) {
    fiscalRating = 'B';
  } else if (payrollRatio < 60 || debtRatio < 130) {
    fiscalRating = 'C';
  } else {
    fiscalRating = 'D';
  }

  return {
    ...state,
    monthlyRevenue: totalRevenue,
    monthlyExpenses: totalExpenses,
    netMonthly,
    payrollExpense: payroll,
    payrollRatio,
    debtRatio,
    fiscalRating,
    departmentBudgets: deptBudgets,
    taxRates,
    naturalResourcesStrategy: {
      ...natStrategy,
      sovereignFundMonthlyYield: rendimentoFundoSoberano,
      fuelDiscountActive: fatorCombustivelFrota < 1.0,
      gasDiscountPercent: fatorCombustivelFrota < 1.0 ? 25 : 0,
    },
    revenueBreakdown: {
      resPobres,
      resMedios,
      resRicos,
      totalResidencial,
      comPobres,
      comMedios,
      comRicos,
      totalComercial,
      indPobres,
      indMedios,
      indRicos,
      totalIndustrial,
      iptuPobres,
      iptuMedios,
      iptuRicos,
      iptu,
      iss,
      itbi,
      fpmIcms,
      taxaIluminacao: taxaIluminacaoTotal,
      taxaResiduosColeta,
      estacionamentoRotativo,
      tarifaTurismoEcologica,
      concessoesMercadosQuiosques,
      vendaEnergiaRede,
      receitasEmprestimos: receitasEmprestimosRecebidos,
      multasTransito,
      royaltiesPetroleo,
      cfemOuro,
      lucroEstatais: lucroEstatais + receitasEmprestimosRecebidos + rendimentoFundoSoberano,
      total: totalRevenue,
    },
    expenseBreakdown: {
      payroll,
      previdenciaServidores,
      saudeSus,
      educacaoMerenda,
      segurancaGuarda,
      limpezaResiduosAterro,
      combustivelManutencaoFrota,
      energiaPrediosPublicos,
      sistemasDigitaisTi,
      bombeiros: bombeirosDefesa,
      saneamento: saneamentoGasto,
      transporte: transporteGasto,
      manutencaoUrbana,
      subsidioEstatais,
      amortizacaoDivida,
      total: totalExpenses,
    },
  };
}

export function advanceMonthInSimulation(state: PrefeitoCityState): PrefeitoCityState {
  // 1. Dinâmica Populacional Estilo SimCity (Imigração/Emigração conforme atratividade)
  const simCity = calculateSimCityDynamics(state);

  // 2. Fundo Soberano e Reservas Estratégicas de Petróleo e Ouro
  let updatedSovereignFund = state.naturalResourcesStrategy?.sovereignFundBalance || 0;
  let updatedGoldReserve = state.naturalResourcesStrategy?.goldReserveKg || 0;
  if (state.oilProductionBpd > 0 && state.naturalResourcesStrategy?.oilPolicy === 'sovereign_wealth_fund') {
    const monthlyDeposit = Math.round((state.oilRoyaltiesMonthly || 0) * 0.60);
    updatedSovereignFund += monthlyDeposit;
  }
  if (state.goldProductionKg > 0 && state.naturalResourcesStrategy?.goldPolicy === 'strategic_reserve') {
    updatedGoldReserve += state.goldProductionKg;
  }

  const updatedStrategy: NaturalResourcesStrategy = {
    ...(state.naturalResourcesStrategy || {
      oilPolicy: 'export_crude',
      goldPolicy: 'sell_bullion_cash',
      sovereignFundBalance: 0,
      sovereignFundMonthlyYield: 0,
      goldReserveKg: 0,
      fuelDiscountActive: false,
      gasDiscountPercent: 0,
    }),
    sovereignFundBalance: updatedSovereignFund,
    goldReserveKg: updatedGoldReserve,
    fuelDiscountActive:
      state.oilProductionBpd > 0 && state.naturalResourcesStrategy?.oilPolicy === 'local_refinery_consumption',
    gasDiscountPercent:
      state.oilProductionBpd > 0 && state.naturalResourcesStrategy?.oilPolicy === 'local_refinery_consumption' ? 25 : 0,
  };

  // State com população atualizada e estratégia antes do cálculo orçamentário
  const stateWithDemographics: PrefeitoCityState = {
    ...state,
    population: simCity.newPopulation,
    employed: simCity.newEmployed,
    unemploymentRate: simCity.newUnemploymentRate,
    housingUnits: simCity.newHousingUnits,
    housingDeficit: simCity.newHousingDeficit,
    housingOccupancyRate: simCity.newHousingOccupancyRate,
    monthlyMigration: simCity.netMigration,
    migrationReasons: simCity.reasons,
    cityAttractiveness: simCity.attractiveness,
    naturalResourcesStrategy: updatedStrategy,
  };

  const recalculated = recalculateMunicipalFinances(stateWithDemographics);
  
  const now = Date.now();
  const gameStart = state.gameStartRealTimestamp || now;
  const calendar = calculateInGameDate(gameStart, now);

  // Process loan installments
  const updatedLoans = (recalculated.intermunicipalLoans || []).map((loan) => {
    if (loan.status === 'active') {
      const remaining = loan.remainingInstallments - 1;
      return {
        ...loan,
        remainingInstallments: remaining,
        status: (remaining <= 0 ? 'completed' : 'active') as 'completed' | 'active',
      };
    }
    return loan;
  });

  // Monthly/Cycle economic math: Arrecadação e Despesas creditadas/debitadas no Tesouro!
  const nextTreasury = recalculated.treasury + recalculated.netMonthly;

  // Recalculate LRF ratios
  const payrollRatio = Number(((recalculated.payrollExpense / Math.max(1, recalculated.monthlyRevenue)) * 100).toFixed(1));
  const debtRatio = Number(((recalculated.debt / Math.max(1, recalculated.monthlyRevenue * 12)) * 100).toFixed(1));

  let fiscalRating: FiscalRating = 'B';
  if (payrollRatio < 48 && debtRatio < 60 && recalculated.netMonthly > 0) {
    fiscalRating = 'A';
  } else if (payrollRatio < 54 && debtRatio < 100) {
    fiscalRating = 'B';
  } else if (payrollRatio < 60 || debtRatio < 130) {
    fiscalRating = 'C';
  } else {
    fiscalRating = 'D';
  }

  const cycleCount = (recalculated.economicCycle?.totalCyclesCompleted || 0) + 1;

  // Notícia Oficial detalhada no Diário Oficial com Dinâmica Populacional SimCity
  const isSuperavit = recalculated.netMonthly >= 0;
  const migracaoTexto =
    simCity.netMigration >= 0
      ? `+${simCity.netMigration.toLocaleString()} novos moradores se mudaram para a cidade atraídos por empregos e infraestrutura.`
      : `${Math.abs(simCity.netMigration).toLocaleString()} moradores deixaram o município buscando melhores condições.`;

  const newArticle: GazetteArticle = {
    id: 'gaz_cycle_' + Date.now(),
    title: isSuperavit
      ? `Fechamento Fiscal: Superávit de R$ ${recalculated.netMonthly.toLocaleString()} (Ciclo #${cycleCount})`
      : `Alerta Orçamentário: Déficit de R$ ${Math.abs(recalculated.netMonthly).toLocaleString()} (Ciclo #${cycleCount})`,
    source: 'Diário Oficial',
    type: isSuperavit ? 'decreto' : 'alerta',
    dateStr: calendar.dateStr,
    body: `A Secretaria da Fazenda e o Departamento de Demografia emitiram o relatório do ciclo municipal em ${calendar.dateStr}. População atualizada: ${simCity.newPopulation.toLocaleString()} habitantes (${migracaoTexto}). Desemprego apurado: ${simCity.newUnemploymentRate}%. Atratividade urbana: ${simCity.attractiveness}/100. Arrecadação: R$ ${recalculated.monthlyRevenue.toLocaleString()} (IPTU: R$ ${recalculated.revenueBreakdown.iptu.toLocaleString()}, ISS: R$ ${recalculated.revenueBreakdown.iss.toLocaleString()}, FPM: R$ ${recalculated.revenueBreakdown.fpmIcms.toLocaleString()}${recalculated.oilRoyaltiesMonthly > 0 ? `, Royalties Petróleo: R$ ${recalculated.oilRoyaltiesMonthly.toLocaleString()}` : ''}). Despesas: R$ ${recalculated.monthlyExpenses.toLocaleString()}. Saldo no Tesouro: ${isSuperavit ? '+' : '-'}R$ ${Math.abs(recalculated.netMonthly).toLocaleString()}.`,
    impactSummary: `Saldo transferido ao Tesouro: ${isSuperavit ? '+' : '-'}R$ ${Math.abs(recalculated.netMonthly).toLocaleString()} | População: ${simCity.newPopulation.toLocaleString()} (${simCity.netMigration >= 0 ? '+' : ''}${simCity.netMigration})`,
    timestamp: Date.now(),
  };

  // Check if we should spawn an emergency event to keep mayor active
  let nextEmergency = recalculated.activeEmergencyEvent;
  if (!nextEmergency && Math.random() < 0.40) {
    nextEmergency = getRandomEmergencyPool(recalculated);
  }

  return {
    ...recalculated,
    year: calendar.year,
    month: calendar.month,
    monthName: calendar.monthName,
    day: calendar.day,
    termMonth: calendar.termMonth,
    gameStartRealTimestamp: gameStart,
    treasury: nextTreasury,
    payrollRatio,
    debtRatio,
    fiscalRating,
    intermunicipalLoans: updatedLoans,
    activeEmergencyEvent: nextEmergency,
    economicCycle: {
      ...recalculated.economicCycle,
      cycleDurationSeconds: FISCAL_CYCLE_SECONDS,
      secondsRemaining: FISCAL_CYCLE_SECONDS,
      lastCycleNet: recalculated.netMonthly,
      totalCyclesCompleted: cycleCount,
      lastTickTimestamp: Date.now(),
    },
    gazetteFeed: [newArticle, ...recalculated.gazetteFeed].slice(0, 30),
  };
}

// =========================================================================
// AÇÕES DO PREFEITO: ATRAÇÃO DE EMPRESAS, RECURSOS E EXPANSÃO URBANA
// =========================================================================

export function acceptCorporateOffer(
  state: PrefeitoCityState,
  offerId: string
): { state: PrefeitoCityState; success: boolean; message: string } {
  const offer = (state.corporateOffers || []).find((o) => o.id === offerId);
  if (!offer) {
    return { state, success: false, message: 'Proposta empresarial não encontrada.' };
  }

  // 1. Validar Requisitos Técnicos da Empresa
  const telecomHierarchy: Record<string, number> = { '2G': 1, '3G': 2, '4G': 3, '5G': 4 };
  if (offer.requirements.minTelecom) {
    const currentScore = telecomHierarchy[state.telecomGeneration || '3G'] || 2;
    const requiredScore = telecomHierarchy[offer.requirements.minTelecom] || 2;
    if (currentScore < requiredScore) {
      return {
        state,
        success: false,
        message: `Conectividade insuficiente: ${offer.companyName} exige rede móvel ${offer.requirements.minTelecom}. A cidade conta atualmente apenas com ${state.telecomGeneration}.`,
      };
    }
  }

  if (offer.requirements.minEnergyMw && (state.energySurplusMw || 0) < offer.requirements.minEnergyMw) {
    return {
      state,
      success: false,
      message: `Energia insuficiente: a planta industrial exige ${offer.requirements.minEnergyMw} MW de superávit elétrico garantido. A cidade possui apenas ${state.energySurplusMw} MW disponíveis.`,
    };
  }

  if (offer.requirements.minWaterCoverage && (state.waterCoveragePercent || 0) < offer.requirements.minWaterCoverage) {
    return {
      state,
      success: false,
      message: `Saneamento insuficiente: a empresa exige pelo menos ${offer.requirements.minWaterCoverage}% de cobertura de água tratada (cidade possui ${state.waterCoveragePercent}%).`,
    };
  }

  if (offer.requirements.minEducationIndex && (state.educationIndex || 0) < offer.requirements.minEducationIndex) {
    return {
      state,
      success: false,
      message: `Qualificação da mão de obra insuficiente: exige Índice de Educação de pelo menos ${offer.requirements.minEducationIndex} (cidade possui ${state.educationIndex}).`,
    };
  }

  if (offer.requirements.minInfrastructureIndex && (state.infrastructureIndex || 0) < offer.requirements.minInfrastructureIndex) {
    return {
      state,
      success: false,
      message: `Infraestrutura viária insuficiente: exige Índice de Infraestrutura de pelo menos ${offer.requirements.minInfrastructureIndex} (cidade possui ${state.infrastructureIndex}).`,
    };
  }

  // 2. Cobrir custo de incentivo (se houver desapropriação / terraplanagem)
  const landCost = offer.incentivesRequested?.landDonationCost || 0;
  if (landCost > 0 && state.treasury < landCost) {
    return {
      state,
      success: false,
      message: `Tesouro insuficiente para cobrir o incentivo de terraplanagem/distrito industrial de R$ ${landCost.toLocaleString()}. Saldo em caixa: R$ ${state.treasury.toLocaleString()}.`,
    };
  }

  // 3. Aplicar Instalação da Empresa
  const newTreasury = state.treasury - landCost;
  const newJobs = state.jobs + offer.benefits.jobsCreated;
  const newEmployed = state.employed + Math.round(offer.benefits.jobsCreated * 0.85);
  const totalWorkforce = Math.round(state.population * 0.48);
  const newUnemploymentRate = Number(
    Math.max(2.0, Math.min(28.0, ((totalWorkforce - newEmployed) / totalWorkforce) * 100)).toFixed(1)
  );

  // Telecom Upgrade se a empresa trouxer 4G ou 5G!
  let newTelecomGen = state.telecomGeneration;
  let newTelecomCoverage = state.telecomCoveragePercent;
  let newFiberCoverage = state.fiberCoveragePercent;

  if (offer.benefits.upgradeTelecom) {
    newTelecomGen = offer.benefits.upgradeTelecom;
    newTelecomCoverage = Math.min(100, (state.telecomCoveragePercent || 74) + 18);
    newFiberCoverage = Math.min(100, (state.fiberCoveragePercent || 32) + 24);
  }

  // Atualizar listas
  const acceptedOffer: CorporateOffer = {
    ...offer,
    status: 'accepted',
  };

  const updatedPendingOffers = (state.corporateOffers || []).filter((o) => o.id !== offerId);
  const updatedInstalled = [acceptedOffer, ...(state.installedCompanies || [])];

  // Matéria no Diário Oficial
  const officialArticle: GazetteArticle = {
    id: 'gaz_corp_' + Date.now(),
    title: `Acordo Histórico: ${offer.companyName} Inicia Instalação no Município`,
    source: 'Diário Oficial',
    type: 'decreto',
    dateStr: state.day + '/' + state.month + '/' + state.year,
    body: `O Gabinete do Prefeito assinou o termo de atração de investimentos com a diretoria de ${offer.companyName} (${offer.tagline}). A operação vai gerar ${offer.benefits.jobsCreated.toLocaleString()} novos postos de trabalho diretos e tributos mensais estimados em R$ ${offer.benefits.monthlyTaxGain.toLocaleString()}.${offer.benefits.upgradeTelecom ? ` O acordo garante a modernização da infraestrutura digital da cidade para sinal ${offer.benefits.upgradeTelecom}!` : ''}`,
    impactSummary: `+${offer.benefits.jobsCreated} empregos | +R$ ${offer.benefits.monthlyTaxGain.toLocaleString()}/mês em impostos${offer.benefits.upgradeTelecom ? ` | Conectividade elevada para ${offer.benefits.upgradeTelecom}` : ''}`,
    timestamp: Date.now(),
  };

  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: newTreasury,
    jobs: newJobs,
    employed: newEmployed,
    unemploymentRate: newUnemploymentRate,
    telecomGeneration: newTelecomGen,
    telecomCoveragePercent: newTelecomCoverage,
    fiberCoveragePercent: newFiberCoverage,
    corporateOffers: updatedPendingOffers,
    installedCompanies: updatedInstalled,
    approvalRating: Math.min(100, state.approvalRating + 4),
    councilSupport: Math.min(100, state.councilSupport + 3),
    gazetteFeed: [officialArticle, ...(state.gazetteFeed || [])].slice(0, 30),
  };

  return {
    state: recalculateMunicipalFinances(updatedState),
    success: true,
    message: `Sucesso! O protocolo de intenções com ${offer.companyName} foi homologado com sucesso!`,
  };
}

export function declineCorporateOffer(
  state: PrefeitoCityState,
  offerId: string
): { state: PrefeitoCityState; message: string } {
  const updatedOffers = (state.corporateOffers || []).filter((o) => o.id !== offerId);
  return {
    state: {
      ...state,
      corporateOffers: updatedOffers,
    },
    message: 'Proposta arquivada pela Secretaria de Desenvolvimento Econômico.',
  };
}

export function setNaturalResourcesStrategy(
  state: PrefeitoCityState,
  oilPolicy: OilDestinationPolicy,
  goldPolicy: GoldDestinationPolicy
): { state: PrefeitoCityState; message: string } {
  const previousStrategy = state.naturalResourcesStrategy || {
    oilPolicy: 'export_crude',
    goldPolicy: 'sell_bullion_cash',
    sovereignFundBalance: 0,
    sovereignFundMonthlyYield: 0,
    goldReserveKg: 0,
    fuelDiscountActive: false,
    gasDiscountPercent: 0,
  };

  const updatedStrategy: NaturalResourcesStrategy = {
    ...previousStrategy,
    oilPolicy,
    goldPolicy,
    fuelDiscountActive: oilPolicy === 'local_refinery_consumption',
    gasDiscountPercent: oilPolicy === 'local_refinery_consumption' ? 25 : 0,
  };

  let policySummary = '';
  if (oilPolicy === 'local_refinery_consumption') {
    policySummary = 'Petróleo direcionado para refino local (combustível e gás mais baratos e incentivo à indústria).';
  } else if (oilPolicy === 'sovereign_wealth_fund') {
    policySummary = 'Royalties do petróleo destinados ao Fundo Soberano de Poupança Permanente.';
  } else {
    policySummary = 'Petróleo vendido no mercado spot (100% dos royalties creditados no caixa).';
  }

  const gazetteNotice: GazetteArticle = {
    id: 'gaz_natres_' + Date.now(),
    title: 'Decreto Municipal Regulamenta Destinação Estratégica dos Recursos Naturais',
    source: 'Diário Oficial',
    type: 'decreto',
    dateStr: state.day + '/' + state.month + '/' + state.year,
    body: `O Prefeito Municipal promulgou decreto estabelecendo as novas diretrizes para o aproveitamento de petróleo, ouro e minérios do município. ${policySummary}`,
    impactSummary: `Política do Petróleo: ${oilPolicy} | Política Mineral: ${goldPolicy}`,
    timestamp: Date.now(),
  };

  const nextState: PrefeitoCityState = {
    ...state,
    naturalResourcesStrategy: updatedStrategy,
    gazetteFeed: [gazetteNotice, ...(state.gazetteFeed || [])].slice(0, 30),
  };

  return {
    state: recalculateMunicipalFinances(nextState),
    message: 'Diretriz estratégica de recursos minerais e energéticos atualizada com sucesso!',
  };
}

export function buildHousingAction(
  state: PrefeitoCityState,
  unitsCount: number,
  cost: number
): { state: PrefeitoCityState; success: boolean; message: string } {
  if (state.treasury < cost) {
    return {
      state,
      success: false,
      message: `Tesouro insuficiente. O programa habitacional de ${unitsCount} moradias custa R$ ${cost.toLocaleString()}, mas a cidade possui R$ ${state.treasury.toLocaleString()}.`,
    };
  }

  const newUnits = (state.housingUnits || 16800) + unitsCount;
  const newFamilyCount = Math.round(state.population / 2.9);
  const newDeficit = Math.max(0, newFamilyCount - newUnits);
  const newOccupancy = Math.min(100, Math.round((newFamilyCount / Math.max(1, newUnits)) * 100));

  const article: GazetteArticle = {
    id: 'gaz_house_' + Date.now(),
    title: `Entrega de Chaves: Programa Habitacional Municipal Conclui ${unitsCount} Novas Moradias`,
    source: 'Diário Oficial',
    type: 'decreto',
    dateStr: state.day + '/' + state.month + '/' + state.year,
    body: `Em cerimônia no Paço Municipal, a Prefeitura formalizou a entrega de ${unitsCount} unidades habitacionais populares equipadas com rede de água, energia e gás, reduzindo significativamente o déficit habitacional da cidade.`,
    impactSummary: `+${unitsCount} moradias | Déficit habitacional reduzido para ${newDeficit} famílias`,
    timestamp: Date.now(),
  };

  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: state.treasury - cost,
    housingUnits: newUnits,
    housingDeficit: newDeficit,
    housingOccupancyRate: newOccupancy,
    approvalRating: Math.min(100, state.approvalRating + 3),
    gazetteFeed: [article, ...(state.gazetteFeed || [])].slice(0, 30),
  };

  return {
    state: recalculateMunicipalFinances(updatedState),
    success: true,
    message: `Parabéns! ${unitsCount} novas moradias foram entregues à população!`,
  };
}

export function expandGasNetworkAction(
  state: PrefeitoCityState,
  kmCount: number,
  cost: number
): { state: PrefeitoCityState; success: boolean; message: string } {
  if (state.treasury < cost) {
    return {
      state,
      success: false,
      message: `Tesouro insuficiente para expandir a rede de gás canalizado. Custo: R$ ${cost.toLocaleString()}, Caixa: R$ ${state.treasury.toLocaleString()}.`,
    };
  }

  const newKm = (state.gasDistributionKm || 38) + kmCount;
  const newCoverage = Math.min(95, Math.round((newKm / 75) * 100));

  const article: GazetteArticle = {
    id: 'gaz_gas_' + Date.now(),
    title: `Gás Canalizado Urbano: Rede Expandida em +${kmCount} Quilômetros`,
    source: 'Diário Oficial',
    type: 'decreto',
    dateStr: state.day + '/' + state.month + '/' + state.year,
    body: `A expansão das tubulações de gás natural e canalizado alcançou novos bairros e distritos comerciais. A cobertura de gás agora atinge ${newCoverage}% do perímetro urbano, barateando a energia das famílias e cozinhas industriais.`,
    impactSummary: `+${kmCount} km de rede de gás | Cobertura agora em ${newCoverage}%`,
    timestamp: Date.now(),
  };

  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: state.treasury - cost,
    gasDistributionKm: newKm,
    gasCoveragePercent: newCoverage,
    approvalRating: Math.min(100, state.approvalRating + 2),
    gazetteFeed: [article, ...(state.gazetteFeed || [])].slice(0, 30),
  };

  return {
    state: recalculateMunicipalFinances(updatedState),
    success: true,
    message: `Rede de gás canalizado expandida em +${kmCount} km com sucesso!`,
  };
}

export function advanceDayInSimulation(state: PrefeitoCityState): PrefeitoCityState {
  const currentStart = state.gameStartRealTimestamp || Date.now();
  const newStart = currentStart - REAL_MS_PER_IN_GAME_DAY;
  const calendar = calculateInGameDate(newStart, Date.now());

  const newArticle: GazetteArticle = {
    id: 'gaz_day_' + Date.now(),
    title: `Abertura do Expediente Municipal: ${calendar.day} de ${calendar.monthName} de ${calendar.year}`,
    source: 'Diário Oficial',
    type: 'decreto',
    dateStr: calendar.dateStr,
    body: `Início do novo dia de mandato no Palácio Municipal de ${state.cityName}. Gabinete do(a) Prefeito(a) ${state.mayorName} aberto para audiências públicas, despachos de secretários e tramitações de projetos.`,
    impactSummary: `Dia ${calendar.daysPassed + 1} do Mandato • Exercício ${calendar.year}`,
    timestamp: Date.now(),
  };

  return {
    ...state,
    gameStartRealTimestamp: newStart,
    day: calendar.day,
    month: calendar.month,
    monthName: calendar.monthName,
    year: calendar.year,
    termMonth: calendar.termMonth,
    gazetteFeed: [newArticle, ...state.gazetteFeed].slice(0, 30),
  };
}

export function updateEconomicCycleTick(
  state: PrefeitoCityState,
  now: number
): {
  state: PrefeitoCityState;
  cycleCompleted: boolean;
  notification?: string;
} {
  const gameStart = state.gameStartRealTimestamp || now;
  const calendar = calculateInGameDate(gameStart, now);

  let baseState = state;
  if (
    state.day !== calendar.day ||
    state.month !== calendar.month ||
    state.year !== calendar.year ||
    !state.gameStartRealTimestamp
  ) {
    baseState = {
      ...state,
      gameStartRealTimestamp: gameStart,
      day: calendar.day,
      month: calendar.month,
      monthName: calendar.monthName,
      year: calendar.year,
      termMonth: calendar.termMonth,
    };
  }

  const cycleDuration = FISCAL_CYCLE_SECONDS;
  const currentCycle = baseState.economicCycle || {
    cycleDurationSeconds: cycleDuration,
    secondsRemaining: cycleDuration,
    autoTick: true,
    lastTickTimestamp: now,
    lastCycleNet: baseState.netMonthly,
    totalCyclesCompleted: 0,
  };

  if (!currentCycle.autoTick) {
    return { state: baseState, cycleCompleted: false };
  }

  const lastTick = currentCycle.lastTickTimestamp || now;
  const elapsedSec = Math.floor((now - lastTick) / 1000);

  if (elapsedSec < 1) {
    return { state: baseState, cycleCompleted: false };
  }

  let adjustedRemaining = currentCycle.secondsRemaining;
  if (
    currentCycle.cycleDurationSeconds !== cycleDuration ||
    adjustedRemaining > cycleDuration ||
    adjustedRemaining <= 0
  ) {
    adjustedRemaining = Math.min(cycleDuration, adjustedRemaining > 0 ? adjustedRemaining : cycleDuration);
  }

  const newSecondsRemaining = adjustedRemaining - elapsedSec;

  if (newSecondsRemaining <= 0) {
    // 45 SEGUNDOS EXPIRADOS! EXECUTA FECHAMENTO FISCAL E FOLHA SALARIAL!
    const advanced = advanceMonthInSimulation(baseState);
    const isSuperavit = advanced.netMonthly >= 0;
    const cycleNum = advanced.economicCycle.totalCyclesCompleted;
    const notification = isSuperavit
      ? `Ciclo fiscal #${cycleNum} (45s): +R$ ${advanced.netMonthly.toLocaleString()} arrecadados no Tesouro!`
      : `Ciclo fiscal #${cycleNum} (45s): Déficit de -R$ ${Math.abs(advanced.netMonthly).toLocaleString()} liquidado pelo Tesouro.`;

    return {
      state: advanced,
      cycleCompleted: true,
      notification,
    };
  }

  return {
    state: {
      ...baseState,
      economicCycle: {
        ...currentCycle,
        cycleDurationSeconds: cycleDuration,
        secondsRemaining: newSecondsRemaining,
        lastTickTimestamp: now,
      },
    },
    cycleCompleted: false,
  };
}

// ==========================================
// POLÍTICAS PÚBLICAS: SALÁRIO MÍNIMO & PISO
// ==========================================
export function setMinimumWagePolicy(
  state: PrefeitoCityState,
  newWage: number
): { state: PrefeitoCityState; message: string } {
  const oldWage = state.minimumWage || 1412;
  const diff = newWage - oldWage;

  let approvalChange = 0;
  let councilChange = 0;

  if (diff > 0) {
    approvalChange = Math.min(18, Math.round((diff / 100) * 2.5));
    // Vereadores da base comemoram popularidade, mas oposição questiona caixa
    councilChange = Math.round((diff / 100) * 1.5);
  } else if (diff < 0) {
    approvalChange = Math.max(-20, Math.round((diff / 100) * 4));
    councilChange = Math.max(-15, Math.round((diff / 100) * 2));
  }

  const withNewWage = {
    ...state,
    minimumWage: newWage,
    approvalRating: Math.min(100, Math.max(5, state.approvalRating + approvalChange)),
    councilSupport: Math.min(100, Math.max(5, state.councilSupport + councilChange)),
    gazetteFeed: [
      {
        id: 'gaz_wage_' + Date.now(),
        title: `Decreto Municipal: Prefeito Fixa Salário Mínimo / Piso Municipal em R$ ${newWage.toLocaleString()}`,
        source: 'Diário Oficial' as const,
        type: 'decreto' as const,
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Gabinete do Prefeito publicou decreto regulamentando o novo piso salarial dos servidores e categorias públicas municipais em R$ ${newWage.toLocaleString()} (anterior: R$ ${oldWage.toLocaleString()}). A medida visa ${
          diff >= 0
            ? 'valorizar o poder de compra das famílias e aquecer o comércio de bairro.'
            : 'adequar a folha de pagamento aos limites austeros da LRF.'
        }`,
        impactSummary: `Folha reajustada | Aprovação popular ${approvalChange >= 0 ? '+' : ''}${approvalChange}%`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(withNewWage);
  return {
    state: finalState,
    message: `Piso salarial municipal reajustado para R$ ${newWage.toLocaleString()}! Impacto integrado na folha.`,
  };
}

// ==========================================
// CONTROLE DE EMPRESAS PÚBLICAS & CONCESSÕES
// ==========================================
export function setPublicCompanyStatus(
  state: PrefeitoCityState,
  company: 'correios' | 'saneamento' | 'transporte',
  newStatus: string
): { state: PrefeitoCityState; message: string } {
  const currentCompanies = { ...state.publicCompanies };

  let gazetteTitle = '';
  let gazetteBody = '';
  let approvalDiff = 0;
  let treasuryInjection = 0;

  if (company === 'correios') {
    if (newStatus === 'social') {
      currentCompanies.correios = {
        name: 'Correios & Logística de Porto',
        status: 'social',
        monthlyResult: -35000,
        coveragePercent: 95,
        description: 'Serviço universal com entrega gratuita de remédios e cartas nos morros e zonas rurais.',
      };
      approvalDiff = 6;
      gazetteTitle = 'Correios Municipais: Modelo Social Garantido com Entregas Gratuitas';
      gazetteBody = 'O Prefeito determinou que a empresa de correios atenda 100% dos bairros periféricos com entrega de correspondências e medicamentos do SUS.';
    } else if (newStatus === 'lucrativa') {
      currentCompanies.correios = {
        name: 'Correios & Logística de Porto S.A.',
        status: 'lucrativa',
        monthlyResult: 80000,
        coveragePercent: 82,
        description: 'Empresa pública moderna e lucrativa com centros de e-commerce e logística regional.',
      };
      approvalDiff = 3;
      gazetteTitle = 'Correios de Porto se Tornam Empresa Pública Lucrativa (+R$ 80.000/mês)';
      gazetteBody = 'Parceria com plataformas de e-commerce e transporte de cargas transforma os correios em ativo financeiro que injeta lucros no caixa municipal.';
    } else {
      currentCompanies.correios = {
        name: 'Concessão Privada de Logística & Encomendas',
        status: 'concessao',
        monthlyResult: 0,
        coveragePercent: 72,
        description: 'Operação privada concedida. Custo zero para o Tesouro e outorga recebida.',
      };
      approvalDiff = -4;
      treasuryInjection = 1800000;
      gazetteTitle = 'Concessão dos Correios: R$ 1,8 Milhão Injetados no Caixa Municipal';
      gazetteBody = 'O serviço foi transferido para consórcio privado que pagou outorga milionária à vista, eliminando despesas de custeio municipal.';
    }
  } else if (company === 'saneamento') {
    if (newStatus === 'estatal') {
      currentCompanies.saneamento = {
        name: 'SANEMAP - Companhia Municipal de Saneamento',
        status: 'estatal',
        monthlyResult: 25000,
        tariffType: 'social',
        waterCoverage: Math.max(state.waterCoveragePercent, 72),
      };
      approvalDiff = 7;
      gazetteTitle = 'Saneamento 100% Público com Tarifa Social de Água nos Bairros';
      gazetteBody = 'A companhia municipal de águas mantém subsídio para famílias de baixa renda, garantindo água potável e coleta de esgoto como direito básico.';
    } else if (newStatus === 'mista') {
      currentCompanies.saneamento = {
        name: 'SANEMAP - Sociedade de Economia Mista',
        status: 'mista',
        monthlyResult: 65000,
        tariffType: 'comercial',
        waterCoverage: Math.max(state.waterCoveragePercent, 80),
      };
      approvalDiff = 2;
      gazetteTitle = 'SANEMAP Abre Capital Misto para Acelerar Obras de Esgoto';
      gazetteBody = 'Atração de acionistas minoritários eleva o investimento em novas adutoras e gera dividendos regulares para os cofres públicos.';
    } else {
      currentCompanies.saneamento = {
        name: 'Concessão de Água & Esgoto (Marco Legal)',
        status: 'concessao',
        monthlyResult: 20000,
        tariffType: 'comercial',
        waterCoverage: Math.max(state.waterCoveragePercent, 90),
      };
      approvalDiff = -2;
      treasuryInjection = 3500000;
      gazetteTitle = 'Leilão do Saneamento: Outorga de R$ 3,5 Milhões no Tesouro';
      gazetteBody = 'Consórcio vencedor assume a meta de atingir 99% de água tratada em 5 anos, desonerando o município de obras pesadas.';
    }
  } else if (company === 'transporte') {
    if (newStatus === 'tarifa_zero') {
      currentCompanies.transporte = {
        name: 'TransPorto Tarifa Zero (Passe Livre Municipal)',
        status: 'tarifa_zero',
        monthlyResult: -160000,
        busFleet: 55,
        fareValue: 0,
      };
      approvalDiff = 16;
      gazetteTitle = 'REVOLUÇÃO NO TRANSPORTE: Tarifa Zero Implantada em Todos os Ônibus!';
      gazetteBody = 'Porto da Aliança entra para a história como município de Tarifa Zero. Catracas liberadas para toda a população, facilitando o acesso ao emprego e comércio.';
    } else if (newStatus === 'subsidiada') {
      currentCompanies.transporte = {
        name: 'TransPorto - Coletivos Urbanos',
        status: 'subsidiada',
        monthlyResult: -65000,
        busFleet: 42,
        fareValue: 4.50,
      };
      approvalDiff = 1;
      gazetteTitle = 'Transporte Coletivo Mantém Tarifa Padrão Equilibrada (R$ 4,50)';
      gazetteBody = 'A prefeitura mantém subsídio ao óleo diesel para conter o aumento de passagens sem desequilibrar as contas fiscais.';
    } else {
      currentCompanies.transporte = {
        name: 'Consórcio Privado de Ônibus & Vans',
        status: 'privatizada',
        monthlyResult: 0,
        busFleet: 40,
        fareValue: 5.20,
      };
      approvalDiff = -6;
      treasuryInjection = 1200000;
      gazetteTitle = 'Concessão do Transporte Coletivo: Redução de Custos para a Prefeitura';
      gazetteBody = 'O sistema de ônibus passa a ser gerido integralmente por empresas privadas com tarifa comercial de R$ 5,20.';
    }
  }

  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: state.treasury + treasuryInjection,
    approvalRating: Math.min(100, Math.max(5, state.approvalRating + approvalDiff)),
    publicCompanies: currentCompanies,
    gazetteFeed: [
      {
        id: 'gaz_comp_' + Date.now(),
        title: gazetteTitle,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: gazetteBody,
        impactSummary: `Empresas Públicas Reorganizadas ${treasuryInjection > 0 ? `| +R$ ${treasuryInjection.toLocaleString()} em caixa` : ''}`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    message: `Política da empresa pública atualizada com sucesso!`,
  };
}

// ==========================================
// CONTROLE DE MULTAS E RADARES DE TRÂNSITO
// ==========================================
export function setTrafficFinePolicy(
  state: PrefeitoCityState,
  severity: 'educativa' | 'padrao' | 'rigorosa'
): { state: PrefeitoCityState; message: string } {
  let approvalChange = 0;
  let title = '';
  let body = '';

  if (severity === 'rigorosa') {
    approvalChange = -4;
    title = 'Decreto: Fiscalização Eletrônica Rigorosa e Tolerância Zero no Trânsito';
    body = 'A prefeitura ativou novos radares de velocidade e fiscalização com câmeras inteligentes. A arrecadação de multas sobe para R$ 120.000/mês, gerando críticas de motoristas mas reduzindo acidentes graves.';
  } else if (severity === 'padrao') {
    approvalChange = 0;
    title = 'Fiscalização de Trânsito Opera em Nível Padrão Regulatório';
    body = 'Radares em pontos críticos com sinalização clara e agentes em horários de pico. Arrecadação média de R$ 55.000/mês.';
  } else {
    approvalChange = 4;
    title = 'Operação Trânsito Educativo: Advertências no Lugar de Multas Pesadas';
    body = 'O Prefeito orientou a Guarda de Trânsito a focar em campanhas de conscientização. As multas caem para R$ 18.000/mês com aprovação dos motoristas.';
  }

  const updatedState: PrefeitoCityState = {
    ...state,
    trafficFineSeverity: severity,
    approvalRating: Math.min(100, Math.max(5, state.approvalRating + approvalChange)),
    gazetteFeed: [
      {
        id: 'gaz_traffic_' + Date.now(),
        title,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body,
        impactSummary: `Sistema de Multas: ${severity.toUpperCase()}`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    message: `Política de multas atualizada para nível ${severity}!`,
  };
}

export function toggleAutoFiscalCycle(state: PrefeitoCityState): PrefeitoCityState {
  const current = state.economicCycle?.autoTick ?? true;
  return {
    ...state,
    economicCycle: {
      ...state.economicCycle,
      autoTick: !current,
      lastTickTimestamp: Date.now(),
    },
  };
}

// ==========================================
// CONTROLE DE ORÇAMENTOS POR SECRETARIA
// ==========================================
export function setDepartmentBudgetPolicy(
  state: PrefeitoCityState,
  department:
    | 'educacao'
    | 'saude'
    | 'segurancaGuarda'
    | 'bombeirosDefesaCivil'
    | 'saneamentoBasico'
    | 'infraestruturaObras'
    | 'transporteMobilidade'
    | 'energiaIluminacao'
    | 'meioAmbiente'
    | string,
  monthlyBudget: number,
  focus: string
): { state: PrefeitoCityState; message: string } {
  const currentBudgets: any = { ...state.departmentBudgets };
  const oldBudget = currentBudgets[department]?.budgetMonthly || monthlyBudget;
  const diff = monthlyBudget - oldBudget;

  currentBudgets[department] = {
    budgetMonthly: monthlyBudget,
    focus: focus as any,
    effectiveness: Math.min(100, Math.max(20, (monthlyBudget / 50000) * 60)),
  };

  let approvalChange = 0;
  let councilChange = 0;
  if (diff > 0) {
    approvalChange = Math.min(10, Math.round(diff / 15000));
  } else if (diff < 0) {
    approvalChange = Math.max(-12, Math.round(diff / 10000));
    councilChange = Math.max(-8, Math.round(diff / 15000));
  }

  const deptNames: Record<string, string> = {
    educacao: 'Secretaria de Educação & Merenda',
    saude: 'Secretaria de Saúde & SUS',
    segurancaGuarda: 'Secretaria de Segurança & Guarda Municipal',
    bombeirosDefesaCivil: 'Corpo de Bombeiros & Defesa Civil',
    saneamentoBasico: 'Secretaria de Saneamento & Águas',
    infraestruturaObras: 'Secretaria de Infraestrutura & Obras',
    transporteMobilidade: 'Secretaria de Transportes & Mobilidade',
    energiaIluminacao: 'Secretaria de Energia & Iluminação Pública',
    meioAmbiente: 'Secretaria de Meio Ambiente & Parques',
  };

  const deptTitle = deptNames[department] || `Secretaria de ${department}`;

  const updatedState: PrefeitoCityState = {
    ...state,
    departmentBudgets: currentBudgets,
    approvalRating: Math.min(100, Math.max(5, state.approvalRating + approvalChange)),
    councilSupport: Math.min(100, Math.max(5, state.councilSupport + councilChange)),
    gazetteFeed: [
      {
        id: 'gaz_budget_' + Date.now(),
        title: `Gabinete Ajusta Orçamento da ${deptTitle} para R$ ${monthlyBudget.toLocaleString()}/mês`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Prefeito despachou decreto redefinindo a dotação orçamentária da pasta com foco estratégico em "${focus.replace('_', ' ').toUpperCase()}".`,
        impactSummary: `Orçamento mensal ajustado para R$ ${monthlyBudget.toLocaleString()}`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    message: `Orçamento da pasta atualizado para R$ ${monthlyBudget.toLocaleString()}/mês!`,
  };
}

// ==========================================
// CONTROLE DE TRIBUTOS E ALÍQUOTAS SIMCITY (RESIDENCIAL, COMERCIAL, INDUSTRIAL POR CLASSES)
// ==========================================
export function setTaxRatesPolicy(
  state: PrefeitoCityState,
  newTaxRates: {
    resPobresPercent?: number;
    resMediosPercent?: number;
    resRicosPercent?: number;
    comPobresPercent?: number;
    comMediosPercent?: number;
    comRicosPercent?: number;
    indPobresPercent?: number;
    indMediosPercent?: number;
    indRicosPercent?: number;
    iptuPobresPercent?: number;
    iptuMediosPercent?: number;
    iptuRicosPercent?: number;
    iptuPercent?: number;
    issPercent?: number;
    itbiPercent?: number;
    taxaIluminacaoCip?: number;
  }
): { state: PrefeitoCityState; message: string } {
  const currentRates = state.taxRates || {
    resPobresPercent: 6.0,
    resMediosPercent: 8.5,
    resRicosPercent: 11.0,
    comPobresPercent: 7.0,
    comMediosPercent: 8.5,
    comRicosPercent: 10.5,
    indPobresPercent: 8.5,
    indMediosPercent: 8.5,
    indRicosPercent: 7.0,
    iptuPercent: 1.2,
    issPercent: 3.5,
    itbiPercent: 2.0,
    taxaIluminacaoCip: 18.0,
  };

  let approvalChange = 0;
  // Residencial
  if (newTaxRates.resPobresPercent !== undefined) {
    if (newTaxRates.resPobresPercent > (currentRates.resPobresPercent ?? 6.0)) approvalChange -= 6;
    else if (newTaxRates.resPobresPercent < (currentRates.resPobresPercent ?? 6.0)) approvalChange += 7;
  }
  if (newTaxRates.resMediosPercent !== undefined) {
    if (newTaxRates.resMediosPercent > (currentRates.resMediosPercent ?? 8.5)) approvalChange -= 4;
    else if (newTaxRates.resMediosPercent < (currentRates.resMediosPercent ?? 8.5)) approvalChange += 4;
  }
  if (newTaxRates.resRicosPercent !== undefined) {
    if (newTaxRates.resRicosPercent > (currentRates.resRicosPercent ?? 11.0)) approvalChange += 3;
    else if (newTaxRates.resRicosPercent < (currentRates.resRicosPercent ?? 11.0)) approvalChange -= 2;
  }
  // Comercial & Industrial
  if (newTaxRates.comPobresPercent !== undefined) {
    if (newTaxRates.comPobresPercent > (currentRates.comPobresPercent ?? 7.0)) approvalChange -= 4;
    else if (newTaxRates.comPobresPercent < (currentRates.comPobresPercent ?? 7.0)) approvalChange += 4;
  }
  if (newTaxRates.indPobresPercent !== undefined) {
    if (newTaxRates.indPobresPercent > (currentRates.indPobresPercent ?? 8.5)) approvalChange -= 3;
    else if (newTaxRates.indPobresPercent < (currentRates.indPobresPercent ?? 8.5)) approvalChange += 3;
  }

  const updatedRates = {
    ...currentRates,
    ...newTaxRates,
  };

  const updatedState: PrefeitoCityState = {
    ...state,
    taxRates: updatedRates,
    approvalRating: Math.min(100, Math.max(5, state.approvalRating + approvalChange)),
    gazetteFeed: [
      {
        id: 'gaz_tax_' + Date.now(),
        title: `Reforma Tributária SimCity: Decreto de Alíquotas por Classes Sociais & Zonas`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Prefeito promulgou o novo Código Tributário SimCity: Residencial (Pobres: ${updatedRates.resPobresPercent ?? 6}%, Médios: ${updatedRates.resMediosPercent ?? 8.5}%, Ricos: ${updatedRates.resRicosPercent ?? 11}%), Comercial (Pequenos: ${updatedRates.comPobresPercent ?? 7}%, Médios: ${updatedRates.comMediosPercent ?? 8.5}%, Grandes Redes: ${updatedRates.comRicosPercent ?? 10.5}%), e Industrial (Pesada: ${updatedRates.indPobresPercent ?? 8.5}%, Manufatura: ${updatedRates.indMediosPercent ?? 8.5}%, Alta Tecnologia: ${updatedRates.indRicosPercent ?? 7}%).`,
        impactSummary: `Sistema tributário progressivo por zonas ativado | Aprovação ${approvalChange >= 0 ? '+' : ''}${approvalChange}%`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    message: `Código Tributário SimCity sancionado com sucesso! Alíquotas de Residências, Comércio e Indústrias publicadas no Diário Oficial.`,
  };
}

// ==========================================
// PISCINA DE OCORRÊNCIAS & CRISES EMERGENCIAIS DO PREFEITO
// ==========================================
export function getRandomEmergencyPool(state: PrefeitoCityState): MunicipalEmergencyEvent {
  const events: MunicipalEmergencyEvent[] = [
    {
      id: 'emg_temporal_' + Date.now(),
      title: '⛈️ Temporal Severo Derruba Postes e Rompe Rede de Energia',
      category: 'energia',
      urgencyLevel: 'grave',
      department: 'Secretaria de Infraestrutura & Defesa Civil',
      description:
        'Fortes ventos atingiram o município provocando quedas de árvores sobre fiações de alta tensão, deixando 3 bairros sem luz e o trânsito em pane.',
      options: [
        {
          id: 'opt_mobilizar_equipes',
          label: 'Mobilizar Força-Tarefa e Trocar Postes com Verba Suplementar (-R$ 45.000)',
          cost: 45000,
          approvalImpact: 7,
          indicatorKey: 'infrastructureIndex',
          indicatorDelta: 4,
          feedback: 'Equipes municipais trabalharam na madrugada. Energia restabelecida em 4 horas com aplauso dos moradores!',
        },
        {
          id: 'opt_aguardar_concessionaria',
          label: 'Apenas Notificar Concessionária sem Gastos Públicos (Custo R$ 0)',
          cost: 0,
          approvalImpact: -8,
          indicatorKey: 'infrastructureIndex',
          indicatorDelta: -3,
          feedback: 'A demora de 36h revoltou os comerciantes locais, gerando panelaço na frente do Gabinete.',
        },
      ],
      timestamp: Date.now(),
      resolved: false,
    },
    {
      id: 'emg_adutora_' + Date.now(),
      title: '💧 Rompimento de Adutora Mestra da Companhia de Água',
      category: 'saude',
      urgencyLevel: 'critico',
      department: 'SANEMAP & Secretaria de Saneamento',
      description:
        'A tubulação de 500mm da adutora central cedeu, jorrando milhares de litros e desabastecendo 15.000 moradores da zona leste.',
      options: [
        {
          id: 'opt_obra_emergencial_agua',
          label: 'Contratação Emergencial de Reparo & Caminhões-Pipa (-R$ 60.000)',
          cost: 60000,
          approvalImpact: 8,
          indicatorKey: 'healthIndex',
          indicatorDelta: 5,
          feedback: 'Caminhões-pipa abasteceram postos de saúde e a adutora foi soldada no mesmo dia.',
        },
        {
          id: 'opt_racionar_agua',
          label: 'Decretar Rodízio e Racionamento Preventivo (-R$ 10.000)',
          cost: 10000,
          approvalImpact: -5,
          feedback: 'O racionamento evitou gastos elevados, mas escolas municipais tiveram aulas suspensas.',
        },
      ],
      timestamp: Date.now(),
      resolved: false,
    },
    {
      id: 'emg_professores_' + Date.now(),
      title: '📚 Vigília dos Professores: Cobrança por Piso e Merenda Orgânica',
      category: 'educacao',
      urgencyLevel: 'alerta',
      department: 'Secretaria de Educação',
      description:
        'Docentes municipais reuniram 400 servidores em frente à Prefeitura cobrando abono pedagógico e compra direta da agricultura familiar.',
      options: [
        {
          id: 'opt_conceder_abono',
          label: 'Aprovar Abono e Merenda da Agricultura Familiar (-R$ 75.000)',
          cost: 75000,
          approvalImpact: 9,
          indicatorKey: 'educationIndex',
          indicatorDelta: 6,
          feedback: 'Acordo histórico assinado! Professores cancelaram indicativo de greve e a merenda escolar melhorou.',
        },
        {
          id: 'opt_mesa_negociacao',
          label: 'Criar Comissão de Estudos sem Aporte Financeiro Imediato (R$ 0)',
          cost: 0,
          approvalImpact: -6,
          feedback: 'O sindicato criticou a falta de agilidade e convocou paralisação de 24 horas.',
        },
      ],
      timestamp: Date.now(),
      resolved: false,
    },
    {
      id: 'emg_dengue_' + Date.now(),
      title: '🦟 Alerta Epidemiológico: Disparada de Casos de Dengue nas UPAs',
      category: 'saude',
      urgencyLevel: 'grave',
      department: 'Secretaria de Saúde & Vigilância Sanitária',
      description:
        'O índice de infestação predial do mosquito Aedes aegypti quadruplicou após chuvas de verão. Filas nas UPAs superam 3 horas.',
      options: [
        {
          id: 'opt_fumace_upas',
          label: 'Contratar 15 Médicos Extras e Fumacê em Todos os Bairros (-R$ 55.000)',
          cost: 55000,
          approvalImpact: 9,
          indicatorKey: 'healthIndex',
          indicatorDelta: 7,
          feedback: 'Atendimento nas UPAs foi normalizado e os focos de larva caíram 70% em duas semanas.',
        },
        {
          id: 'opt_campanha_panfletos',
          label: 'Realizar Apenas Campanha Educativa em Redes Sociais (-R$ 8.000)',
          cost: 8000,
          approvalImpact: -4,
          feedback: 'A população reclamou da lentidão no atendimento dos postos de saúde.',
        },
      ],
      timestamp: Date.now(),
      resolved: false,
    },
    {
      id: 'emg_polo_tecnologico_' + Date.now(),
      title: '💼 Oportunidade: Centro Logístico Regional Quer se Instalar na Cidade',
      category: 'economia',
      urgencyLevel: 'oportunidade',
      department: 'Secretaria de Desenvolvimento Econômico',
      description:
        'Um grande consórcio logístico de e-commerce planeja galpão de 40.000 m² gerando 900 empregos, solicitando terraplenagem e alvará célere.',
      options: [
        {
          id: 'opt_atrair_empresa',
          label: 'Oferecer Obra de Acesso Viário e Agilizar Licenciamento (-R$ 80.000)',
          cost: 80000,
          revenueGain: 95000,
          approvalImpact: 11,
          indicatorKey: 'infrastructureIndex',
          indicatorDelta: 6,
          feedback: 'Contrato firmado! 900 novos empregos no município e injeção de ISS na arrecadação!',
        },
        {
          id: 'opt_tramitacao_padrao',
          label: 'Exigir Trâmite Burocrático Comum sem Obras da Prefeitura (R$ 0)',
          cost: 0,
          approvalImpact: -2,
          feedback: 'A empresa decidiu abrir galpão em cidade vizinha mais receptiva.',
        },
      ],
      timestamp: Date.now(),
      resolved: false,
    },
    {
      id: 'emg_incendio_fabrica_' + Date.now(),
      title: '🚒 Incêndio de Grandes Proporções em Galpão de Reciclagem',
      category: 'bombeiros',
      urgencyLevel: 'critico',
      department: 'Corpo de Bombeiros & Defesa Civil',
      description:
        'Chamas de 15 metros ameaçam residências vizinhas. Bombeiros e Guarda Municipal solicitam retroescavadeiras e apoio imediato.',
      options: [
        {
          id: 'opt_socorro_bombeiros',
          label: 'Mobilizar Bombeiros, Carros-Pipa e Isolamento com Guarda (-R$ 38.000)',
          cost: 38000,
          approvalImpact: 10,
          indicatorKey: 'securityIndex',
          indicatorDelta: 5,
          feedback: 'Incêndio controlado sem nenhuma vítima fatal! Ação corajosa elogiada pela comunidade.',
        },
        {
          id: 'opt_evacuar_apenas',
          label: 'Evacuar Bairro sem Contratação de Equipamentos Extras (-R$ 5.000)',
          cost: 5000,
          approvalImpact: -6,
          feedback: 'O fogo se alastrou e destruiu dois comércios adjacentes, gerando indignação popular.',
        },
      ],
      timestamp: Date.now(),
      resolved: false,
    },
  ];

  const pick = events[Math.floor(Math.random() * events.length)];
  return pick;
}

export function triggerManualEmergency(state: PrefeitoCityState): PrefeitoCityState {
  const newEmergency = getRandomEmergencyPool(state);
  return {
    ...state,
    activeEmergencyEvent: newEmergency,
  };
}

export function resolveEmergencyEvent(
  state: PrefeitoCityState,
  eventId: string,
  optionId: string
): { state: PrefeitoCityState; feedback: string } {
  const event = state.activeEmergencyEvent;
  if (!event || event.id !== eventId) {
    return { state, feedback: 'Ocorrência não encontrada.' };
  }

  const option = event.options.find((o) => o.id === optionId);
  if (!option) {
    return { state, feedback: 'Opção inválida.' };
  }

  const cost = option.cost || 0;
  const revGain = option.revenueGain || 0;
  const newTreasury = state.treasury - cost;

  let newHealth = state.healthIndex;
  let newEdu = state.educationIndex;
  let newSec = state.securityIndex;
  let newInfra = state.infrastructureIndex;

  if (option.indicatorKey === 'healthIndex') newHealth = Math.min(100, Math.max(10, newHealth + (option.indicatorDelta || 0)));
  if (option.indicatorKey === 'educationIndex') newEdu = Math.min(100, Math.max(10, newEdu + (option.indicatorDelta || 0)));
  if (option.indicatorKey === 'securityIndex') newSec = Math.min(100, Math.max(10, newSec + (option.indicatorDelta || 0)));
  if (option.indicatorKey === 'infrastructureIndex') newInfra = Math.min(100, Math.max(10, newInfra + (option.indicatorDelta || 0)));

  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: newTreasury,
    monthlyRevenue: state.monthlyRevenue + revGain,
    approvalRating: Math.min(100, Math.max(5, state.approvalRating + option.approvalImpact)),
    healthIndex: newHealth,
    educationIndex: newEdu,
    securityIndex: newSec,
    infrastructureIndex: newInfra,
    activeEmergencyEvent: null,
    resolvedEmergenciesCount: (state.resolvedEmergenciesCount || 0) + 1,
    gazetteFeed: [
      {
        id: 'gaz_despacho_' + Date.now(),
        title: `Despacho de Crise: Prefeito Soluciona "${event.title}"`,
        source: 'Diário Oficial',
        type: option.approvalImpact >= 0 ? 'decreto' : 'alerta',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Chefe do Executivo deliberou: ${option.label}. Resultado: ${option.feedback}`,
        impactSummary: `Tesouro: ${cost > 0 ? `-R$ ${cost.toLocaleString()}` : 'R$ 0'} | Aprovação: ${option.approvalImpact >= 0 ? '+' : ''}${option.approvalImpact}%`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    feedback: option.feedback,
  };
}

// ==========================================
// EMPRÉSTIMOS INTERMUNICIPAIS (LINHA DE CRÉDITO ENTRE CIDADES)
// ==========================================
export function grantIntermunicipalLoan(
  state: PrefeitoCityState,
  loanOrData:
    | IntermunicipalLoan
    | {
        borrowerMayor: string;
        borrowerCity: string;
        principal: number;
        interestRateMonthly: number;
        totalInstallments: number;
        purpose: string;
      }
): { state: PrefeitoCityState; loan: IntermunicipalLoan; message: string } {
  let loan: IntermunicipalLoan;

  if ('id' in loanOrData) {
    loan = loanOrData;
  } else {
    const totalInterest = (loanOrData.principal * (loanOrData.interestRateMonthly / 100)) * loanOrData.totalInstallments;
    const totalRepayment = Math.round(loanOrData.principal + totalInterest);
    const installmentValue = Math.round(totalRepayment / loanOrData.totalInstallments);

    loan = {
      id: 'loan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      lenderRole: 'mayor_north',
      lenderMayor: state.mayorName,
      lenderCity: state.cityName,
      borrowerRole: 'mayor_south',
      borrowerMayor: loanOrData.borrowerMayor,
      borrowerCity: loanOrData.borrowerCity,
      principal: loanOrData.principal,
      interestRateMonthly: loanOrData.interestRateMonthly,
      totalInstallments: loanOrData.totalInstallments,
      remainingInstallments: loanOrData.totalInstallments,
      installmentValue,
      totalRepayment,
      purpose: loanOrData.purpose,
      status: 'active',
      timestamp: Date.now(),
    };
  }

  if (state.treasury < loan.principal) {
    return {
      state,
      loan,
      message: `Tesouro insuficiente para conceder empréstimo de R$ ${loan.principal.toLocaleString()}.`,
    };
  }

  const updatedLoans = [...(state.intermunicipalLoans || []), loan];
  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: state.treasury - loan.principal,
    intermunicipalLoans: updatedLoans,
    gazetteFeed: [
      {
        id: 'gaz_loan_grant_' + Date.now(),
        title: `Cooperação Regional: Município Concede Empréstimo de R$ ${loan.principal.toLocaleString()} para ${loan.borrowerCity}`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `Termo de mútuo financeiro intermunicipal formalizado com ${loan.borrowerCity} (${loan.borrowerMayor}). Taxa de juros de ${loan.interestRateMonthly}% a.m. em ${loan.totalInstallments} parcelas mensais de R$ ${loan.installmentValue.toLocaleString()}. Destinação: ${loan.purpose}.`,
        impactSummary: `Crédito concedido | Rendimento mensal garantido ao Tesouro`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    loan,
    message: `Empréstimo de R$ ${loan.principal.toLocaleString()} concedido com sucesso para ${loan.borrowerCity}!`,
  };
}

export function acceptIntermunicipalLoan(
  state: PrefeitoCityState,
  loan: IntermunicipalLoan
): { state: PrefeitoCityState; message: string } {
  const activeLoan: IntermunicipalLoan = {
    ...loan,
    status: 'active',
  };

  const existingWithoutCurrent = (state.intermunicipalLoans || []).filter((l) => l.id !== loan.id);
  const updatedLoans = [activeLoan, ...existingWithoutCurrent];
  const updatedState: PrefeitoCityState = {
    ...state,
    treasury: state.treasury + loan.principal,
    debt: state.debt + loan.totalRepayment,
    intermunicipalLoans: updatedLoans,
    gazetteFeed: [
      {
        id: 'gaz_loan_accept_' + Date.now(),
        title: `Socorro Financeiro: Tesouro Recebe R$ ${loan.principal.toLocaleString()} de Empréstimo de ${loan.lenderCity}`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Prefeito ratificou o contrato de crédito intermunicipal com ${loan.lenderCity} (${loan.lenderMayor}). O valor de R$ ${loan.principal.toLocaleString()} foi creditado na conta do Tesouro. O pagamento será feito em ${loan.totalInstallments} parcelas mensais de R$ ${loan.installmentValue.toLocaleString()}.`,
        impactSummary: `Recurso em caixa: +R$ ${loan.principal.toLocaleString()} | Parcelas provisionadas no orçamento`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    message: `Empréstimo aceito! R$ ${loan.principal.toLocaleString()} creditados no caixa municipal.`,
  };
}

export function rejectIntermunicipalLoan(
  state: PrefeitoCityState,
  loanId: string
): { state: PrefeitoCityState; message: string } {
  const updatedLoans = (state.intermunicipalLoans || []).map((l) => {
    if (l.id === loanId) {
      return { ...l, status: 'rejected' as const };
    }
    return l;
  });

  return {
    state: {
      ...state,
      intermunicipalLoans: updatedLoans,
    },
    message: 'Proposta de empréstimo rejeitada formalmente.',
  };
}

// ==========================================
// AÇÕES DIRETAS: OBRAS HABITACIONAIS (COHAB) & MOBILIDADE URBANA
// ==========================================
export function buildCohabProjectAction(
  state: PrefeitoCityState,
  projectType: 'habitacional' | 'favelas'
): { success: boolean; state: PrefeitoCityState; message: string } {
  const isHabitacional = projectType === 'habitacional';
  const cost = isHabitacional ? 420000 : 180000;
  const unitsToAdd = isHabitacional ? 1500 : 600;

  if (state.treasury < cost) {
    return {
      success: false,
      state,
      message: `Tesouro insuficiente! O projeto exige R$ ${cost.toLocaleString()}, mas a cidade possui R$ ${state.treasury.toLocaleString()}.`,
    };
  }

  const currentWorks = state.infrastructureWorks || {
    cohabHousingProjects: 2,
    cohabUnitsBuilt: 3400,
    metroLinesKm: 0,
    metroStationsCount: 0,
    trainVltLinesKm: 8,
    brtCorridorsKm: 12,
    brtTerminalsCount: 3,
  };

  const updatedWorks = {
    ...currentWorks,
    cohabHousingProjects: currentWorks.cohabHousingProjects + (isHabitacional ? 1 : 0),
    cohabUnitsBuilt: currentWorks.cohabUnitsBuilt + unitsToAdd,
  };

  const newHousingUnits = (state.housingUnits || 16800) + unitsToAdd;
  const title = isHabitacional
    ? `COHAB: Novo Conjunto Habitacional Entregue (+${unitsToAdd} Moradias)`
    : `COHAB: Regularização & Asfalto em Comunidades (+${unitsToAdd} Escrituras)`;

  const intermediate: PrefeitoCityState = {
    ...state,
    treasury: state.treasury - cost,
    housingUnits: newHousingUnits,
    infrastructureWorks: updatedWorks,
    approvalRating: Math.min(100, state.approvalRating + (isHabitacional ? 14 : 9)),
    councilSupport: Math.min(100, state.councilSupport + (isHabitacional ? 7 : 5)),
    gazetteFeed: [
      {
        id: 'gaz_cohab_' + Date.now(),
        title,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: isHabitacional
          ? `O Prefeito assinou a entrega de ${unitsToAdd} novas moradias populares do programa COHAB. Com infraestrutura completa de água, luz e transporte, o projeto reduz drasticamente a fila habitacional.`
          : `O programa COHAB de urbanização regularizou ${unitsToAdd} lotes urbanos, garantindo títulos de propriedade, canalização de esgoto e iluminação em áreas carentes.`,
        impactSummary: `+${unitsToAdd} moradias | Déficit habitacional reduzido | Aprovação popular em alta`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(intermediate);
  return {
    success: true,
    state: finalState,
    message: `${title} realizado com sucesso!`,
  };
}

export function buildTransitProjectAction(
  state: PrefeitoCityState,
  transitType: 'metro' | 'vlt' | 'brt'
): { success: boolean; state: PrefeitoCityState; message: string } {
  let cost = 950000;
  let title = '';
  let gazetteBody = '';
  let approvalBonus = 12;

  const currentWorks = state.infrastructureWorks || {
    cohabHousingProjects: 2,
    cohabUnitsBuilt: 3400,
    metroLinesKm: 0,
    metroStationsCount: 0,
    trainVltLinesKm: 8,
    brtCorridorsKm: 12,
    brtTerminalsCount: 3,
  };

  const updatedWorks = { ...currentWorks };

  if (transitType === 'metro') {
    cost = 950000;
    updatedWorks.metroLinesKm += 10;
    updatedWorks.metroStationsCount += 8;
    approvalBonus = 18;
    title = 'METRÔ SUBTERRÂNEO: Expansão de Linha & 8 Novas Estações Inauguradas';
    gazetteBody = 'As novas estações do Metrô iniciaram as operações com trens climatizados e intervalo de 3 minutos nos horários de pico, integrando bairros periféricos aos centros comerciais.';
  } else if (transitType === 'vlt') {
    cost = 520000;
    updatedWorks.trainVltLinesKm += 14;
    approvalBonus = 13;
    title = 'TREM METROPOLITANO VLT: Mais 14 km de Trilhos Elétricos em Operação';
    gazetteBody = 'O sistema de VLT sustentável expandiu a malha férrea de superfície, proporcionando transporte seguro, silencioso e limpo para milhares de passageiros diários.';
  } else {
    cost = 310000;
    updatedWorks.brtCorridorsKm += 18;
    updatedWorks.brtTerminalsCount += 4;
    approvalBonus = 10;
    title = 'CORREDOR BRT: Mais 18 km de Pistas Exclusivas & Terminais Tubo';
    gazetteBody = 'Novos corredores expressos de ônibus articulados BRT entraram em funcionamento, encurtando o trajeto até o trabalho em 40% com embarque rápido nas estações.';
  }

  if (state.treasury < cost) {
    return {
      success: false,
      state,
      message: `Tesouro insuficiente! Esta obra de transporte exige R$ ${cost.toLocaleString()}, mas a cidade possui R$ ${state.treasury.toLocaleString()}.`,
    };
  }

  const intermediate: PrefeitoCityState = {
    ...state,
    treasury: state.treasury - cost,
    infrastructureWorks: updatedWorks,
    infrastructureIndex: Math.min(100, state.infrastructureIndex + (transitType === 'metro' ? 8 : transitType === 'vlt' ? 5 : 4)),
    approvalRating: Math.min(100, state.approvalRating + approvalBonus),
    councilSupport: Math.min(100, state.councilSupport + Math.round(approvalBonus * 0.6)),
    gazetteFeed: [
      {
        id: 'gaz_transit_' + Date.now(),
        title,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: gazetteBody,
        impactSummary: `Mobilidade urbana expandida | Custo: R$ ${cost.toLocaleString()} | Índice de Infraestrutura aumentado`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(intermediate);
  return {
    success: true,
    state: finalState,
    message: `${title} executado com sucesso!`,
  };
}


