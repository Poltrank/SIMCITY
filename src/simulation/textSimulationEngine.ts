import {
  PrefeitoCityState,
  ActiveDispatch,
  DispatchOutcome,
  GazetteArticle,
  FiscalRating,
  MunicipalEmergencyEvent,
  IntermunicipalLoan,
} from '../types/textGame';
import { MUNICIPAL_ACTIONS } from '../data/municipalActions';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

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

  const realNow = new Date();
  const realYear = realNow.getFullYear();
  const realMonth = realNow.getMonth() + 1;
  const realMonthName = MONTH_NAMES[realNow.getMonth()];
  const realDay = realNow.getDate();

  const initialMinimumWage = 1412; // Salário mínimo / Piso municipal base
  const initialRevenue = 520000;
  const initialExpenses = 440000;
  const initialPayroll = 260000; // 50% da receita (dentro do limite da LRF de 54%)

  const initialRevenueBreakdown = {
    iptu: 145000,
    iss: 165000,
    fpmIcms: 130000,
    multasTransito: 55000,
    royaltiesPetroleo: 0,
    cfemOuro: 0,
    lucroEstatais: 25000,
    total: initialRevenue,
  };

  const initialExpenseBreakdown = {
    payroll: initialPayroll,
    saudeSus: 75000,
    educacaoMerenda: 60000,
    segurancaGuarda: 40000,
    manutencaoUrbana: 35000,
    subsidioEstatais: 35000, // déficit inicial dos correios sociais
    amortizacaoDivida: 15000,
    total: initialExpenses,
  };

  return {
    cityName: chosenCityName,
    mayorName: chosenMayorName,
    party: chosenParty,
    year: realYear,
    month: realMonth,
    monthName: realMonthName,
    day: realDay,
    termMonth: realMonth,
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
        dateStr: '01/01/2026',
        body: `${chosenMayorName} (${chosenParty}) assumiu oficialmente o comando do Poder Executivo no Palácio Municipal de ${chosenCityName}. Em seu discurso de posse, garantiu austeridade fiscal, diálogo republicano com os vereadores e foco no bem-estar da população.`,
        impactSummary: 'Gabinete aberto para despachos e propostas legislativas.',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'gaz_init_2',
        title: 'Geólogos Apontam Potencial Mineral e Petróleo nas Bacias Regionais',
        source: 'Gazeta Municipal',
        type: 'noticia',
        dateStr: '04/01/2026',
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

    // Ciclo Econômico em Tempo Real (60 Segundos)
    economicCycle: {
      cycleDurationSeconds: 60,
      secondsRemaining: 60,
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
      iptuPercent: 1.2,
      issPercent: 3.5,
      itbiPercent: 2.0,
      taxaIluminacaoCip: 18.0,
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

  // 1. Receitas Detalhadas
  // IPTU Progressivo por Classe Social (Pobres, Médios, Ricos)
  const iptuBase = 145000 * (state.population / 48500) * (state.infrastructureIndex / 58);
  const iptuPobres = Math.round(iptuBase * 0.20 * (iptuPobresRate / 0.2));
  const iptuMedios = Math.round(iptuBase * 0.50 * (iptuMediosRate / 1.2));
  const iptuRicos = Math.round(iptuBase * 0.30 * (iptuRicosRate / 3.5));
  const iptu = iptuPobres + iptuMedios + iptuRicos;

  // ISS varia com alíquota (2% a 5%), atividade econômica e turismo
  const wageBoostToCommerce = Math.max(0, Math.round((minWage - 1412) * 50));
  const touristBoost = Math.round(state.touristsPerMonth * 4.2);
  const issBase = 165000 * (state.jobs / 21200) + touristBoost + wageBoostToCommerce;
  const iss = Math.round(issBase * (taxRates.issPercent / 3.5));

  // FPM e ICMS (Transferências constitucionais do Estado e União)
  const fpmIcms = Math.round(130000 * (state.population / 48500));

  // Taxa de Iluminação Pública CIP / COSIP
  const taxaIluminacaoTotal = Math.round((state.population / 3.4) * (taxRates.taxaIluminacaoCip || 18));
  
  // Multas de Trânsito & Postura Municipal
  const multasTransito =
    fineSeverity === 'rigorosa' ? 120000 : fineSeverity === 'padrao' ? 55000 : 18000;

  const royaltiesPetroleo = state.oilRoyaltiesMonthly || 0;
  const cfemOuro = state.goldTaxesMonthly || 0;

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
    fpmIcms +
    taxaIluminacaoTotal +
    multasTransito +
    royaltiesPetroleo +
    cfemOuro +
    lucroEstatais +
    receitasEmprestimosRecebidos;

  // 2. Despesas Detalhadas
  // Folha de pagamento aumenta proporcionalmente ao piso salarial municipal
  const wageRatio = minWage / 1412;
  const payroll = Math.round(260000 * wageRatio);

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

  // Amortização de Dívida Consolidada regular
  const amortizacaoDividaRegular = state.debt > 0 ? Math.round(state.debt * 0.01) : 0;

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
    saudeSus +
    educacaoMerenda +
    segurancaGuarda +
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
    revenueBreakdown: {
      iptuPobres,
      iptuMedios,
      iptuRicos,
      iptu,
      iss,
      fpmIcms,
      multasTransito,
      royaltiesPetroleo,
      cfemOuro,
      lucroEstatais: lucroEstatais + receitasEmprestimosRecebidos,
      total: totalRevenue,
    },
    expenseBreakdown: {
      payroll,
      saudeSus,
      educacaoMerenda,
      segurancaGuarda,
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
  const recalculated = recalculateMunicipalFinances(state);
  const nextMonth = recalculated.month === 12 ? 1 : recalculated.month + 1;
  const nextYear = recalculated.month === 12 ? recalculated.year + 1 : recalculated.year;
  const nextTermMonth = recalculated.termMonth + 1;

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

  // Monthly economic math: Arrecadação e Despesas creditadas/debitadas no Tesouro!
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

  // Notícia Oficial detalhada no Diário Oficial
  const isSuperavit = recalculated.netMonthly >= 0;
  const newArticle: GazetteArticle = {
    id: 'gaz_month_' + Date.now(),
    title: isSuperavit
      ? `Fechamento Fiscal: Superávit de R$ ${recalculated.netMonthly.toLocaleString()} em ${recalculated.monthName}`
      : `Alerta Orçamentário: Déficit de R$ ${Math.abs(recalculated.netMonthly).toLocaleString()} em ${recalculated.monthName}`,
    source: 'Diário Oficial',
    type: isSuperavit ? 'decreto' : 'alerta',
    dateStr: `${String(nextMonth).padStart(2, '0')}/${nextYear}`,
    body: `A Secretaria da Fazenda finalizou a apuração do ciclo municipal. Arrecadação total: R$ ${recalculated.monthlyRevenue.toLocaleString()} (IPTU: R$ ${recalculated.revenueBreakdown.iptu.toLocaleString()}, ISS: R$ ${recalculated.revenueBreakdown.iss.toLocaleString()}, FPM: R$ ${recalculated.revenueBreakdown.fpmIcms.toLocaleString()}, Multas: R$ ${recalculated.revenueBreakdown.multasTransito.toLocaleString()}${recalculated.oilRoyaltiesMonthly > 0 ? `, Royalties Petróleo: R$ ${recalculated.oilRoyaltiesMonthly.toLocaleString()}` : ''}). Despesas consolidadas: R$ ${recalculated.monthlyExpenses.toLocaleString()} (Folha Salarial: R$ ${recalculated.payrollExpense.toLocaleString()} - ${recalculated.payrollRatio}% da RCL, Custeio SUS & Escolas: R$ ${(recalculated.expenseBreakdown.saudeSus + recalculated.expenseBreakdown.educacaoMerenda).toLocaleString()}, Estatais: R$ ${recalculated.expenseBreakdown.subsidioEstatais.toLocaleString()}).`,
    impactSummary: `Saldo transferido ao Tesouro: ${isSuperavit ? '+' : '-'}R$ ${Math.abs(recalculated.netMonthly).toLocaleString()} | CAPAG: ${fiscalRating}`,
    timestamp: Date.now(),
  };

  // Check if we should spawn an emergency event to keep mayor active
  let nextEmergency = recalculated.activeEmergencyEvent;
  if (!nextEmergency && Math.random() < 0.45) {
    nextEmergency = getRandomEmergencyPool(recalculated);
  }

  return {
    ...recalculated,
    year: nextYear,
    month: nextMonth,
    monthName: MONTH_NAMES[nextMonth - 1],
    termMonth: nextTermMonth,
    treasury: nextTreasury,
    payrollRatio,
    debtRatio,
    fiscalRating,
    intermunicipalLoans: updatedLoans,
    activeEmergencyEvent: nextEmergency,
    economicCycle: {
      ...recalculated.economicCycle,
      secondsRemaining: recalculated.economicCycle.cycleDurationSeconds,
      lastCycleNet: recalculated.netMonthly,
      totalCyclesCompleted: recalculated.economicCycle.totalCyclesCompleted + 1,
      lastTickTimestamp: Date.now(),
    },
    gazetteFeed: [newArticle, ...recalculated.gazetteFeed].slice(0, 30),
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
  if (!state.economicCycle || !state.economicCycle.autoTick) {
    return { state, cycleCompleted: false };
  }

  const lastTick = state.economicCycle.lastTickTimestamp || now;
  const elapsedSec = Math.floor((now - lastTick) / 1000);

  if (elapsedSec < 1) {
    return { state, cycleCompleted: false };
  }

  const newSecondsRemaining = state.economicCycle.secondsRemaining - elapsedSec;

  if (newSecondsRemaining <= 0) {
    // 1 MINUTE EXPIRED! EXECUTE RECOLHIMENTO FISCAL E PAGAMENTO DA FOLHA!
    const advanced = advanceMonthInSimulation(state);
    const isSuperavit = advanced.netMonthly >= 0;
    const notification = isSuperavit
      ? `Ciclo de 1 minuto concluído: +R$ ${advanced.netMonthly.toLocaleString()} arrecadados do povo e governos!`
      : `Ciclo de 1 minuto concluído: Déficit de -R$ ${Math.abs(advanced.netMonthly).toLocaleString()} pago pelo Tesouro.`;

    return {
      state: advanced,
      cycleCompleted: true,
      notification,
    };
  }

  return {
    state: {
      ...state,
      economicCycle: {
        ...state.economicCycle,
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
// CONTROLE DE TRIBUTOS E ALÍQUOTAS (IPTU POBRES, MÉDIOS, RICOS, ISS, ITBI, CIP)
// ==========================================
export function setTaxRatesPolicy(
  state: PrefeitoCityState,
  newTaxRates: {
    iptuPobresPercent?: number;
    iptuMediosPercent?: number;
    iptuRicosPercent?: number;
    iptuPercent: number;
    issPercent: number;
    itbiPercent: number;
    taxaIluminacaoCip: number;
  }
): { state: PrefeitoCityState; message: string } {
  const currentRates = state.taxRates || {
    iptuPobresPercent: 0.2,
    iptuMediosPercent: 1.2,
    iptuRicosPercent: 3.5,
    iptuPercent: 1.2,
    issPercent: 3.5,
    itbiPercent: 2.0,
    taxaIluminacaoCip: 18.0,
  };

  let approvalChange = 0;
  if (newTaxRates.iptuPobresPercent !== undefined && currentRates.iptuPobresPercent !== undefined) {
    if (newTaxRates.iptuPobresPercent > currentRates.iptuPobresPercent) approvalChange -= 7;
    else if (newTaxRates.iptuPobresPercent < currentRates.iptuPobresPercent) approvalChange += 8;
  }
  if (newTaxRates.iptuRicosPercent !== undefined && currentRates.iptuRicosPercent !== undefined) {
    if (newTaxRates.iptuRicosPercent > currentRates.iptuRicosPercent) approvalChange += 4;
    else if (newTaxRates.iptuRicosPercent < currentRates.iptuRicosPercent) approvalChange -= 3;
  }
  if (newTaxRates.iptuMediosPercent !== undefined && currentRates.iptuMediosPercent !== undefined) {
    if (newTaxRates.iptuMediosPercent > currentRates.iptuMediosPercent) approvalChange -= 4;
    else if (newTaxRates.iptuMediosPercent < currentRates.iptuMediosPercent) approvalChange += 4;
  }
  if (newTaxRates.issPercent > currentRates.issPercent) approvalChange -= 3;
  else if (newTaxRates.issPercent < currentRates.issPercent) approvalChange += 4;

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
        title: `Código Tributário: Reforma das Alíquotas Municipais (IPTU Pobres ${updatedRates.iptuPobresPercent ?? 0.2}%, Médios ${updatedRates.iptuMediosPercent ?? 1.2}%, Ricos ${updatedRates.iptuRicosPercent ?? 3.5}%)`,
        source: 'Diário Oficial',
        type: 'decreto',
        dateStr: `${String(state.month).padStart(2, '0')}/${state.year}`,
        body: `O Executivo Municipal promulgou as novas alíquotas tributárias: IPTU Pobres ${updatedRates.iptuPobresPercent ?? 0.2}%, IPTU Médios ${updatedRates.iptuMediosPercent ?? 1.2}%, IPTU Grandes Mansões ${updatedRates.iptuRicosPercent ?? 3.5}%, ISS ${updatedRates.issPercent}% e Taxa de Iluminação R$ ${updatedRates.taxaIluminacaoCip.toFixed(2)}.`,
        impactSummary: `Nova calibragem tributária progressiva promulgada pelo Prefeito`,
        timestamp: Date.now(),
      },
      ...state.gazetteFeed.slice(0, 29),
    ],
  };

  const finalState = recalculateMunicipalFinances(updatedState);
  return {
    state: finalState,
    message: `Código tributário municipal progressivo atualizado! Receitas e impacto popular recalculados.`,
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


