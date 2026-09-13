export type FiscalRating = 'A' | 'B' | 'C' | 'D';

export type ActionCategory =
  | 'recursos_naturais'
  | 'bndes_financas'
  | 'turismo_cultura'
  | 'industria_empregos'
  | 'servicos_publicos'
  | 'politica_camara';

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
  termMonth: number; // 1 to 48

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

  // Ciclo Econômico em Tempo Real (Minutos)
  economicCycle: {
    cycleDurationSeconds: number; // 60 segundos por ciclo de arrecadação/despesa
    secondsRemaining: number;
    autoTick: boolean;
    lastTickTimestamp: number;
    lastCycleNet: number;
    totalCyclesCompleted: number;
  };

  // Detalhamento Contábil de Arrecadação & Despesas
  revenueBreakdown: {
    iptu: number;
    iss: number;
    fpmIcms: number;
    multasTransito: number;
    royaltiesPetroleo: number;
    cfemOuro: number;
    lucroEstatais: number;
    total: number;
  };

  expenseBreakdown: {
    payroll: number;
    saudeSus: number;
    educacaoMerenda: number;
    segurancaGuarda: number;
    manutencaoUrbana: number;
    subsidioEstatais: number;
    amortizacaoDivida: number;
    total: number;
  };
}

// Multiplayer Regional
export interface RegionalMayorProfile {
  id: string;
  name: string;
  cityName: string;
  role: 'mayor_north' | 'mayor_south';
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
  lastUpdated: number;
}

export interface RegionalTreaty {
  id: string;
  fromMayorRole: 'mayor_north' | 'mayor_south';
  fromMayorName: string;
  targetMayorRole: 'mayor_north' | 'mayor_south';
  type:
    | 'tourism_corridor' // Corredor de turismo conjunto (+30% turistas para ambas)
    | 'worker_migration' // Intercâmbio de mão-de-obra e empregos industriais
    | 'power_contract' // Venda de energia elétrica em MW
    | 'oil_supply' // Fornecimento de barris de petróleo refinado
    | 'financial_aid' // Pacote de socorro financeiro
    | 'joint_infrastructure'; // Ponte/ferrovia interestadual
  title: string;
  details: string;
  amount: number; // MW, Tourists, Money, etc.
  monthlyCostOrPrice: number;
  status: 'pending_ratification' | 'active' | 'rejected' | 'canceled';
  startTime: number;
  ratificationSecondsRemaining: number; // Takes 60s for treaty registry!
  timestamp: number;
}

export interface RegionalChatMessage {
  id: string;
  sender: string;
  role: 'mayor_north' | 'mayor_south' | 'system';
  text: string;
  time: string;
}

export interface DirectAidEvent {
  id: string;
  fromMayorName: string;
  fromCityName: string;
  fromRole: 'mayor_north' | 'mayor_south';
  targetRole: 'mayor_north' | 'mayor_south';
  amount: number;
  category: 'financeira' | 'energia' | 'agua';
  note?: string;
  timestamp: number;
}

export interface NegotiationNotification {
  id: string;
  type: 'treaty_proposed' | 'treaty_ratified' | 'treaty_rejected' | 'aid_received';
  title: string;
  senderMayor: string;
  senderCity: string;
  senderRole: 'mayor_north' | 'mayor_south';
  targetRole?: 'mayor_north' | 'mayor_south';
  message: string;
  details?: string;
  treatyId?: string;
  amount?: number;
  monthlyCostOrPrice?: number;
  timestamp: number;
  read: boolean;
}
