export type FiscalRating = 'A' | 'B' | 'C' | 'D';

export type ActionCategory =
  | 'recursos_naturais'
  | 'bndes_financas'
  | 'turismo_cultura'
  | 'industria_empregos'
  | 'servicos_publicos'
  | 'politica_camara'
  | 'habitacao_mobilidade';

export interface MunicipalActionDef {
  id: string;
  title: string;
  category: ActionCategory;
  categoryLabel: string;
  badge: string;
  shortDesc: string;
  fullDesc: string;
  cost: number; // R$ cost to dispatch
  durationMs: number; // exactly 60000ms (1 minute)
  requirements: {
    minTreasury?: number;
    minPopulation?: number;
    requiredFiscalRating?: FiscalRating[];
    requiresOil?: boolean;
    requiresGold?: boolean;
    minApproval?: number;
    minCouncilSupport?: number;
    prerequisiteId?: string;
  };
  bureaucracyPhases: {
    second: number; // e.g. 0, 15, 30, 45
    label: string;
    department: string;
  }[];
  expectedOutcome: string;
  riskFactor: 'Baixo' | 'Médio' | 'Alto' | 'Severo';
}

export interface ActiveDispatch {
  id: string;
  actionId: string;
  title: string;
  category: ActionCategory;
  badge: string;
  cost: number;
  startTime: number;
  durationMs: number; // 60000
  endTime: number;
  currentPhaseText: string;
  currentDepartment: string;
  progress: number; // 0 to 1
  secondsRemaining: number;
  completed: boolean;
}

export interface DispatchOutcome {
  id: string;
  actionId: string;
  actionTitle: string;
  category: ActionCategory;
  success: boolean;
  isExceptional: boolean; // e.g. discovered mega pré-sal or massive gold vein
  headline: string;
  officialGazetteExcerpt: string;
  detailedReport: string[];
  impacts: {
    treasuryChange?: number;
    monthlyRevenueChange?: number;
    monthlyExpensesChange?: number;
    populationChange?: number;
    jobsChange?: number;
    unemploymentChange?: number;
    touristsChange?: number;
    approvalChange?: number;
    councilSupportChange?: number;
    oilBpdChange?: number;
    goldKgChange?: number;
    energyMwChange?: number;
    waterPercentChange?: number;
    housingUnitsChange?: number;
    housingDeficitChange?: number;
    fiscalRatingChange?: FiscalRating;
    debtChange?: number;
  };
  timestamp: number;
  read: boolean;
}

export interface GazetteArticle {
  id: string;
  title: string;
  source: 'Diário Oficial' | 'Gazeta Municipal' | 'Folha Metropolitana' | 'Tribunal de Contas';
  type: 'decreto' | 'noticia' | 'alerta' | 'crise' | 'celebracao';
  dateStr: string;
  body: string;
  impactSummary?: string;
  timestamp: number;
}

export interface CityCouncilMember {
  id: string;
  name: string;
  party: string;
  alignment: 'base_aliada' | 'independente' | 'oposicao';
  influence: number; // 1 to 10
  stance: string;
  demands: string;
}

export interface PrefeitoCityState {
  cityName: string;
  mayorName: string;
  party: string;
  year: number;
  month: number; // 1 to 12
  monthName: string;
  day?: number; // 1 to 31 (Tempo real - 24 horas por dia)
  termMonth: number; // 1 to 48
  gameStartRealTimestamp?: number; // Timestamp da vida real do início do jogo (inicia em 15/09/2026)
  lastRealTimestamp?: number; // Timestamp da vida real para sincronia e ausência
  fractionalTreasuryAccrual?: number; // Acúmulo de centavos do fluxo contínuo em tempo real

  // Finanças & LRF
  treasury: number; // R$ em caixa
  monthlyRevenue: number;
  monthlyExpenses: number;
  netMonthly: number;
  payrollExpense: number; // Folha de pagamento
  payrollRatio: number; // % da receita corrente (limite LRF 54%)
  debt: number; // Dívida consolidada
  debtRatio: number; // Dívida / Receita (limite 120%)
  fiscalRating: FiscalRating; // CAPAG: A, B, C, D

  // Demografia & Sociedade
  population: number;
  jobs: number;
  employed: number;
  unemploymentRate: number; // % (ex: 6.8%)
  touristsPerMonth: number;
  approvalRating: number; // 0 a 100%
  councilSupport: number; // 0 a 100% (ou vereadores alinhados)

  // Recursos Naturais & Matriz Energética
  oilProductionBpd: number; // Barris de petróleo por dia
  oilRoyaltiesMonthly: number; // R$ royalties do petróleo
  goldProductionKg: number; // kg de ouro por mês
  goldTaxesMonthly: number; // R$ impostos de mineração (CFEM)
  energyProductionMw: number; // Geração própria em Megawatts
  energyConsumptionMw: number; // Demanda da cidade
  energySurplusMw: number; // Excedente disponível para exportação regional
  waterCoveragePercent: number; // % saneamento e água tratada

  // Serviços Essenciais, Habitação & Conectividade (Telecomunicações)
  gasCoveragePercent: number; // % de acesso a gás canalizado e GLP estável
  gasDistributionKm: number; // km de rede de distribuição de gás canalizado
  telecomGeneration: '2G' | '3G' | '4G' | '5G'; // Nível de rede móvel (2G, 3G, 4G ou 5G)
  telecomCoveragePercent: number; // % do território com cobertura celular
  fiberCoveragePercent: number; // % de cobertura de fibra óptica residencial e industrial
  housingUnits: number; // Total de moradias / unidades habitacionais existentes
  housingDeficit: number; // Déficit habitacional (famílias sem teto ou coabitação)
  housingOccupancyRate: number; // % de moradias ocupadas (0 a 100%)
  
  // Dinâmica Populacional Estilo SimCity (Migração)
  monthlyMigration: number; // Saldo migratório líquido do ciclo (+ imigrantes / - emigrantes)
  migrationReasons: { factor: string; impact: number; positive: boolean }[];
  cityAttractiveness: number; // Atratividade geral da cidade (0 a 100)

  // Atração de Empresas & Investimentos Privados
  corporateOffers: CorporateOffer[];
  installedCompanies: CorporateOffer[];

  // Destinação Estratégica de Petróleo, Ouro & Minérios
  naturalResourcesStrategy: NaturalResourcesStrategy;

  // Índices Municipais
  securityIndex: number; // 0 a 100
  healthIndex: number; // 0 a 100
  educationIndex: number; // 0 a 100
  infrastructureIndex: number; // 0 a 100

  // Histórico & Obras
  completedActionIds: string[];
  activeDispatches: ActiveDispatch[];
  recentOutcomes: DispatchOutcome[];
  gazetteFeed: GazetteArticle[];

  // Políticas Públicas & Salário Mínimo
  minimumWage: number; // Piso municipal / Salário mínimo (ex: R$ 1.412 ou ajustado)
  trafficFineSeverity: 'educativa' | 'padrao' | 'rigorosa';

  // Empresas Públicas Municipais
  publicCompanies: {
    correios: {
      name: string;
      status: 'social' | 'lucrativa' | 'concessao';
      monthlyResult: number; // e.g. -35000 (custo de serviço universal) ou +80000 (lucro com logística) ou 0
      coveragePercent: number;
      description: string;
    };
    saneamento: {
      name: string;
      status: 'estatal' | 'mista' | 'concessao';
      monthlyResult: number;
      tariffType: 'social' | 'comercial';
      waterCoverage: number;
    };
    transporte: {
      name: string;
      status: 'tarifa_zero' | 'subsidiada' | 'privatizada';
      monthlyResult: number; // e.g. -160000 no passe livre, ou neutro
      busFleet: number;
      fareValue: number;
    };
  };

  // Ciclo Econômico em Tempo Real (Segundos)
  economicCycle: {
    cycleDurationSeconds: number; // 45 segundos por ciclo de arrecadação/despesa
    secondsRemaining: number;
    autoTick: boolean;
    lastTickTimestamp: number;
    lastCycleNet: number;
    totalCyclesCompleted: number;
  };

  // Detalhamento Contábil de Arrecadação & Despesas
  revenueBreakdown: {
    // Modo SimCity Arrecadação por Classe & Zona
    resPobres?: number;
    resMedios?: number;
    resRicos?: number;
    comPobres?: number;
    comMedios?: number;
    comRicos?: number;
    indPobres?: number;
    indMedios?: number;
    indRicos?: number;
    totalResidencial?: number;
    totalComercial?: number;
    totalIndustrial?: number;

    iptuPobres?: number;
    iptuMedios?: number;
    iptuRicos?: number;
    iptu: number;
    iss: number;
    itbi?: number; // Imposto de Transmissão de Bens Imóveis (Cartórios & Compra/Venda)
    fpmIcms: number;
    taxaIluminacao?: number;
    taxaResiduosColeta?: number; // Taxa de Coleta de Resíduos & Saneamento
    estacionamentoRotativo?: number; // Zona Azul Digital & Parquímetros
    tarifaTurismoEcologica?: number; // Taxa de Ecoturismo & Preservação (TPA)
    concessoesMercadosQuiosques?: number; // Concessões de quiosques, feiras e espaços públicos
    vendaEnergiaRede?: number; // Injeção de superávit elétrico na rede nacional
    receitasEmprestimos?: number; // Juros e parcelas de empréstimos a outros municípios
    multasTransito: number;
    royaltiesPetroleo: number;
    cfemOuro: number;
    lucroEstatais: number;
    total: number;
  };

  expenseBreakdown: {
    payroll: number;
    previdenciaServidores?: number; // RPPS - Previdência Municipal & Aposentadorias
    saudeSus: number;
    educacaoMerenda: number;
    segurancaGuarda: number;
    limpezaResiduosAterro?: number; // Limpeza Urbana, Varrição & Aterro Sanitário
    combustivelManutencaoFrota?: number; // Combustível & Manutenção da Frota Municipal (SAMU, Ônibus, Viaturas)
    energiaPrediosPublicos?: number; // Conta de Luz de Escolas, UPAs, Semáforos e Prefeitura
    sistemasDigitaisTi?: number; // Digitalização, Softwares de Saúde, IPTU Online & Nuvem
    bombeiros?: number;
    saneamento?: number;
    transporte?: number;
    manutencaoUrbana: number;
    subsidioEstatais: number;
    amortizacaoDivida: number;
    total: number;
  };

  // Orçamentos Específicos das Secretarias Municipais (Educação, Saúde, Polícia, Bombeiros, Saneamento, Obras, etc.)
  departmentBudgets: {
    educacao: {
      budgetMonthly: number;
      focus: 'merenda' | 'piso_salarial' | 'reforma_escolas' | 'transporte_rural' | string;
      effectiveness: number; // 0 to 100
    };
    saude: {
      budgetMonthly: number;
      focus: 'upas_24h' | 'medicos_especialistas' | 'samu' | 'remedios_gratuitos' | string;
      effectiveness: number;
    };
    segurancaGuarda: {
      budgetMonthly: number;
      focus: 'armamento' | 'videomonitoramento_ia' | 'patrulhamento_bairros' | 'ronda_escolar' | string;
      effectiveness: number;
    };
    bombeirosDefesaCivil: {
      budgetMonthly: number;
      focus: 'combate_incendios' | 'prevencao_enchentes' | 'resgate_salvamento' | 'sirenes_alerta' | string;
      effectiveness: number;
    };
    saneamentoBasico?: {
      budgetMonthly: number;
      focus: 'tratamento_agua' | 'esgoto_periferia' | 'aterro_sanitario' | 'drenagem_pluvial' | string;
      effectiveness: number;
    };
    infraestruturaObras?: {
      budgetMonthly: number;
      focus: 'recapeamento_asfalto' | 'pontes_viadutos' | 'iluminacao_led' | 'habitacao_popular' | string;
      effectiveness: number;
    };
    transporteMobilidade?: {
      budgetMonthly: number;
      focus: 'frota_eletrica' | 'tarifa_social' | 'corredor_onibus' | 'ciclovias' | string;
      effectiveness: number;
    };
    energiaIluminacao: {
      budgetMonthly: number;
      focus: 'led_100' | 'eficiencia_solar' | 'expansao_periferia' | 'tarifa_social' | string;
      effectiveness: number;
    };
    meioAmbiente?: {
      budgetMonthly: number;
      focus: 'coleta_seletiva' | 'arborizacao' | 'parques_municipais' | 'fiscalizacao_poluicao' | string;
      effectiveness: number;
    };
  };

  // Tributos & Alíquotas Municipais Progressivas SimCity (Residencial, Comercial, Industrial por classes Pobres, Médios e Ricos)
  taxRates: {
    // Modo SimCity: Residencial (R)
    resPobresPercent?: number; // R$ Habitação Popular / Baixa Renda (ex: 6.0%)
    resMediosPercent?: number; // R$$ Classe Média (ex: 8.5%)
    resRicosPercent?: number; // R$$$ Mansões & Alta Renda (ex: 11.0%)
    // Modo SimCity: Comercial (C)
    comPobresPercent?: number; // C$ Comércio Básico, Mercadinhos & Ambulantes (ex: 7.0%)
    comMediosPercent?: number; // C$$ Comércio Médio, Galerias & Serviços (ex: 8.5%)
    comRicosPercent?: number; // C$$$ Grandes Redes, Shoppings & Bancos (ex: 10.5%)
    // Modo SimCity: Industrial (I)
    indPobresPercent?: number; // I-P Indústria Pesada / Sucata / Poluente (ex: 8.5%)
    indMediosPercent?: number; // I-M Indústria Manufatureira / Fábricas (ex: 8.5%)
    indRicosPercent?: number; // I-HT Alta Tecnologia / Inovação Limpa (ex: 7.0%)

    // Tributos Nacionais & Legado
    iptuPobresPercent?: number;
    iptuMediosPercent?: number;
    iptuRicosPercent?: number;
    iptuPercent: number; // alíquota base ou média
    issPercent: number; // ex: 3.5% (mínimo 2%, máximo 5% pela CF/88)
    itbiPercent: number; // ex: 2.0%
    taxaIluminacaoCip: number; // ex: R$ 18.00 por economia
  };

  // Obras Estruturantes de Habitação (COHAB) & Mobilidade (Metrô, Trem, BRT)
  infrastructureWorks?: {
    cohabHousingProjects: number; // Conjuntos habitacionais construídos
    cohabUnitsBuilt: number; // Total de moradias entregues
    metroLinesKm: number; // Linhas de metrô subterrâneo em km
    metroStationsCount: number; // Estações de metrô
    trainVltLinesKm: number; // Linhas de trem metropolitano / VLT em km
    brtCorridorsKm: number; // Corredores exclusivos de ônibus BRT em km
    brtTerminalsCount: number; // Terminais de integração urbana
  };

  // Empréstimos Intermunicipais Concedidos ou Tomados
  intermunicipalLoans: IntermunicipalLoan[];

  // Ocorrência Emergencial Ativa na Mesa do Prefeito
  activeEmergencyEvent?: MunicipalEmergencyEvent | null;
  resolvedEmergenciesCount?: number;
}

export interface IntermunicipalLoan {
  id: string;
  lenderRole: 'mayor_north' | 'mayor_south';
  lenderMayor: string;
  lenderCity: string;
  borrowerRole: 'mayor_north' | 'mayor_south';
  borrowerMayor: string;
  borrowerCity: string;
  principal: number;
  interestRateMonthly: number; // ex: 3.5%
  totalInstallments: number; // ex: 6 parcelas
  remainingInstallments: number;
  installmentValue: number;
  totalRepayment: number;
  purpose: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  timestamp: number;
}

export interface EmergencyOption {
  id: string;
  label: string;
  cost: number;
  revenueGain?: number;
  approvalImpact: number;
  indicatorKey?: 'healthIndex' | 'educationIndex' | 'securityIndex' | 'infrastructureIndex';
  indicatorDelta?: number;
  feedback: string;
}

export interface MunicipalEmergencyEvent {
  id: string;
  title: string;
  category: 'educacao' | 'saude' | 'policia' | 'bombeiros' | 'energia' | 'tributos' | 'clima' | 'economia';
  urgencyLevel: 'alerta' | 'grave' | 'critico' | 'oportunidade';
  department: string;
  description: string;
  options: EmergencyOption[];
  timestamp: number;
  resolved: boolean;
  chosenOptionId?: string;
}

// Multiplayer Regional
export interface RegionalMayorProfile {
  id: string;
  name: string;
  cityName: string;
  role: 'mayor_north' | 'mayor_south' | string;
  party?: string;
  color: string;
  population: number;
  treasury: number;
  jobs: number;
  unemploymentRate: number;
  touristsPerMonth: number;
  oilProductionBpd: number;
  goldProductionKg: number;
  energyProductionMw: number;
  energySurplusMw: number;
  fiscalRating: FiscalRating;
  approvalRating: number;
  isOnline?: boolean;
  isRealPlayer?: boolean;
  lastUpdated: number;
}

export interface RegionalTreaty {
  id: string;
  fromMayorRole: 'mayor_north' | 'mayor_south' | string;
  fromMayorName: string;
  targetMayorRole: 'mayor_north' | 'mayor_south' | string;
  targetMayorName?: string;
  targetCityName?: string;
  type:
    | 'tourism_corridor' // Corredor de turismo conjunto (+30% turistas para ambas)
    | 'worker_migration' // Intercâmbio de mão-de-obra e empregos industriais
    | 'power_contract' // Venda de energia elétrica em MW
    | 'oil_supply' // Fornecimento de barris de petróleo refinado
    | 'financial_aid' // Pacote de socorro financeiro
    | 'joint_infrastructure' // Ponte/ferrovia interestadual
    | 'health_consortium' // Consórcio metropolitano de saúde e leitos de UTI
    | 'sanitation_consortium' // Aterro sanitário compartilhado e redução de custo de lixo
    | 'transit_integration' // Bilhete único metropolitano e linhas conjuntas
    | 'security_pact' // Muralha digital e patrulha integrada das divisas
    | 'tax_incentive_hub'; // Polo industrial binacional com incentivos fiscais
  title: string;
  details: string;
  amount: number; // MW, Tourists, Money, etc.
  monthlyCostOrPrice: number;
  status: 'pending_ratification' | 'active' | 'rejected' | 'canceled' | 'expired';
  startTime: number;
  expiresAt?: number; // Proposta válida por 24 horas (24h) para o prefeito parceiro deliberar
  ratificationSecondsRemaining?: number;
  timestamp: number;
}

export interface RegionalChatMessage {
  id: string;
  sender: string;
  role: 'mayor_north' | 'mayor_south' | 'system' | string;
  targetMayor?: string;
  text: string;
  time: string;
}

export interface DirectAidEvent {
  id: string;
  fromMayorName: string;
  fromCityName: string;
  fromRole: 'mayor_north' | 'mayor_south' | string;
  targetRole: 'mayor_north' | 'mayor_south' | string;
  targetMayorName?: string;
  amount: number;
  category: 'financeira' | 'energia' | 'agua';
  note?: string;
  timestamp: number;
}

export interface NegotiationNotification {
  id: string;
  type: 'treaty_proposed' | 'treaty_ratified' | 'treaty_rejected' | 'aid_received' | 'loan_proposed' | 'loan_accepted' | 'loan_rejected';
  title: string;
  senderMayor: string;
  senderCity: string;
  senderRole: 'mayor_north' | 'mayor_south' | string;
  targetRole?: 'mayor_north' | 'mayor_south' | string;
  targetMayorName?: string;
  message: string;
  details?: string;
  treatyId?: string;
  loanId?: string;
  loanDetails?: IntermunicipalLoan;
  amount?: number;
  monthlyCostOrPrice?: number;
  interestRateMonthly?: number;
  installments?: number;
  timestamp: number;
  read: boolean;
}

// Políticas Estratégicas de Petróleo e Minérios
export type OilDestinationPolicy = 'export_crude' | 'local_refinery_consumption' | 'sovereign_wealth_fund';
export type GoldDestinationPolicy = 'sell_bullion_cash' | 'industrial_tech_jewelry' | 'strategic_reserve';

export interface NaturalResourcesStrategy {
  oilPolicy: OilDestinationPolicy;
  goldPolicy: GoldDestinationPolicy;
  sovereignFundBalance: number; // Saldo do Fundo Soberano Municipal do Petróleo em R$
  sovereignFundMonthlyYield: number; // Rendimento mensal gerado pelo fundo (dividendos)
  goldReserveKg: number; // Barras de ouro no cofre municipal como lastro
  fuelDiscountActive: boolean; // Se a refinaria local barateia combustível (-30% em despesas com frota)
  gasDiscountPercent: number; // Desconto no botijão e gás canalizado
}

// Propostas de Empresas Querendo se Instalar na Cidade (Atração de Investimentos)
export interface CorporateOffer {
  id: string;
  companyName: string;
  segment: 'telecom' | 'industria' | 'tecnologia' | 'logistica' | 'alimentos' | 'farmaceutica' | 'energia';
  tagline: string;
  description: string;
  badge: string;
  requirements: {
    minTelecom?: '2G' | '3G' | '4G' | '5G';
    minEnergyMw?: number;
    minWaterCoverage?: number;
    minEducationIndex?: number;
    minInfrastructureIndex?: number;
    minSecurityIndex?: number;
  };
  incentivesRequested: {
    taxExemptionYears?: number; // Anos de isenção de IPTU/ISS
    landDonationCost?: number; // Custo de terraplanagem / distrito industrial (R$)
    conditionDescription: string;
  };
  benefits: {
    jobsCreated: number;
    monthlyTaxGain: number; // Ganho mensal em ISS / ICMS
    upgradeTelecom?: '2G' | '3G' | '4G' | '5G'; // Ex: Operadora trazendo 4G ou 5G!
    additionalEnergyMw?: number;
    attractivenessBoost: number;
    techIndexBoost?: number;
  };
  status: 'pending' | 'accepted' | 'declined';
  receivedDateStr: string;
}
