import { TradeCommodity, TradeAgreementPartner, NationalTradeBalanceState } from '../types/textGame';

export const INITIAL_TRADE_COMMODITIES: TradeCommodity[] = [
  // =========================================================================
  // EXPORTAÇÕES NACIONAIS (SUPERÁVIT & LUCRO SOBERANO EM DÓLARES & REAIS)
  // =========================================================================
  {
    id: 'exp_soja_graos',
    type: 'export',
    name: 'Complexo Soja, Milho & Farelo (Agronegócio Soberano)',
    category: 'agronegocio',
    icon: '🌾',
    unit: 'milhares de ton/mês',
    baseVolumePerCycle: 480,
    currentVolume: 480,
    internationalPriceUsd: 420, // US$ 420 por tonelada
    domesticCostBrl: 1100, // Custo de plantio e transporte interno R$ por tonelada
    tariffApplicablePercent: 0, // Desonerado (Lei Kandir / Drawback)
    active: true,
    marketDemandStatus: 'Em Alta',
    strategicImpact: 'Principal motor do superávit comercial do país. Garante bilhões de dólares fluindo para a economia.',
  },
  {
    id: 'exp_petroleo_pre_sal',
    type: 'export',
    name: 'Petróleo Bruto Brent (Bacias do Pré-Sal & Onshore)',
    category: 'petroleo_combustivel',
    icon: '🛢️',
    unit: 'barris de óleo/dia (k bpd)',
    baseVolumePerCycle: 120,
    currentVolume: 120,
    internationalPriceUsd: 78, // US$ 78 por barril
    domesticCostBrl: 140, // Custo de extração (lifting cost) em R$
    tariffApplicablePercent: 2.5,
    active: true,
    marketDemandStatus: 'Estável',
    strategicImpact: 'Gera royalties soberanos diretos no Tesouro Nacional e enche os cofres em moeda forte.',
  },
  {
    id: 'exp_minerio_ferro_terras_raras',
    type: 'export',
    name: 'Minério de Ferro de Alto Teor, Pelotas & Nióbio',
    category: 'mineracao',
    icon: '⛏️',
    unit: 'milhares de ton/mês',
    baseVolumePerCycle: 350,
    currentVolume: 350,
    internationalPriceUsd: 115, // US$ 115 por tonelada
    domesticCostBrl: 220, // Custo logístico ferroviário e lavra
    tariffApplicablePercent: 1.5,
    active: true,
    marketDemandStatus: 'Explosiva',
    strategicImpact: 'Exportado para as maiores siderúrgicas da Ásia e Europa para construção e carros elétricos.',
  },
  {
    id: 'exp_aeronaves_defesa',
    type: 'export',
    name: 'Jatos Regionais Comerciais & Sistemas Aeroespaciais',
    category: 'industria_aeroespacial',
    icon: '✈️',
    unit: 'unidades aeronáuticas/ciclo',
    baseVolumePerCycle: 3,
    currentVolume: 3,
    internationalPriceUsd: 48000000, // US$ 48 milhões por aeronave
    domesticCostBrl: 180000000, // Custo de engenharia e montagem
    tariffApplicablePercent: 0,
    active: true,
    marketDemandStatus: 'Em Alta',
    strategicImpact: 'Exportação de altíssimo valor tecnológico, gerando milhares de empregos de engenharia qualificada.',
  },
  {
    id: 'exp_carnes_proteina',
    type: 'export',
    name: 'Proteína Animal (Carne Bovina, Frango & Suínos)',
    category: 'agronegocio',
    icon: '🥩',
    unit: 'milhares de ton/mês',
    baseVolumePerCycle: 180,
    currentVolume: 180,
    internationalPriceUsd: 3800, // US$ 3.800 por tonelada
    domesticCostBrl: 9500,
    tariffApplicablePercent: 0,
    active: true,
    marketDemandStatus: 'Em Alta',
    strategicImpact: 'Abastece o mercado global de carnes halal e frigoríficos do Oriente Médio e Ásia.',
  },
  {
    id: 'exp_energia_eletrica_superavit',
    type: 'export',
    name: 'Superávit Hidrelétrico & Eólico (Rede Interconectada)',
    category: 'petroleo_combustivel',
    icon: '⚡',
    unit: 'MWh exportados/ciclo',
    baseVolumePerCycle: 15000,
    currentVolume: 15000,
    internationalPriceUsd: 65, // US$ 65 por MWh
    domesticCostBrl: 120,
    tariffApplicablePercent: 0,
    active: true,
    marketDemandStatus: 'Estável',
    strategicImpact: 'Venda de excedente elétrico soberano para países vizinhos do continente.',
  },

  // =========================================================================
  // IMPORTAÇÕES ESTRATÉGICAS (CUSTOS CRÍTICOS & DEPENDÊNCIA EXTERNA)
  // =========================================================================
  {
    id: 'imp_fertilizantes_npk',
    type: 'import',
    name: 'Fertilizantes Químicos & Adubos NPK (Nitrogênio, Fósforo, Potássio)',
    category: 'agronegocio',
    icon: '🧪',
    unit: 'milhares de ton/mês',
    baseVolumePerCycle: 260,
    currentVolume: 260,
    internationalPriceUsd: 380, // US$ 380 por tonelada importada
    domesticCostBrl: 2200,
    tariffApplicablePercent: 4.0, // Alíquota de importação
    active: true,
    marketDemandStatus: 'Estável',
    strategicImpact: 'Insumo vital! Sem fertilizantes a safra agrícola perde 40% de produtividade.',
    domesticCriticalNeed: 'Abastece lavouras de soja, milho e café em todo o território.',
  },
  {
    id: 'imp_chips_semicondutores',
    type: 'import',
    name: 'Microchips, Processadores & Semicondutores Integrados',
    category: 'tecnologia',
    icon: '💾',
    unit: 'milhões de chips/mês',
    baseVolumePerCycle: 85,
    currentVolume: 85,
    internationalPriceUsd: 14.5, // US$ 14.50 por unidade
    domesticCostBrl: 85,
    tariffApplicablePercent: 8.0,
    active: true,
    marketDemandStatus: 'Explosiva',
    strategicImpact: 'Sem semicondutores importados, fábricas de automóveis e montadoras de eletrônicos param as esteiras.',
    domesticCriticalNeed: 'Componente obrigatório de carros, smartphones, computadores e equipamentos médicos.',
  },
  {
    id: 'imp_diesel_combustiveis',
    type: 'import',
    name: 'Óleo Diesel Refinado & Nafta Petroquímica',
    category: 'petroleo_combustivel',
    icon: '⛽',
    unit: 'milhares de barris/mês',
    baseVolumePerCycle: 140,
    currentVolume: 140,
    internationalPriceUsd: 92, // US$ 92 por barril refinado
    domesticCostBrl: 520,
    tariffApplicablePercent: 6.5,
    active: true,
    marketDemandStatus: 'Em Alta',
    strategicImpact: 'Movimenta os caminhões nas rodovias e o maquinário pesado nas colheitas.',
    domesticCriticalNeed: 'Se o diesel importado faltar, há desabastecimento de alimentos nos centros urbanos.',
  },
  {
    id: 'imp_insumos_farmaceuticos_ifa',
    type: 'import',
    name: 'Insumos Farmacêuticos Ativos (IFAs) & Antibióticos',
    category: 'farmaceutica',
    icon: '💊',
    unit: 'toneladas de matéria-prima',
    baseVolumePerCycle: 45,
    currentVolume: 45,
    internationalPriceUsd: 6200, // US$ 6.200 por tonelada
    domesticCostBrl: 35000,
    tariffApplicablePercent: 2.0,
    active: true,
    marketDemandStatus: 'Estável',
    strategicImpact: 'Base para a produção de remédios nos laboratórios nacionais e abastecimento do SUS.',
    domesticCriticalNeed: 'Remédios de alta complexidade para UPAs, hospitais oncológicos e farmácias populares.',
  },
  {
    id: 'imp_maquinas_eletronicos_consumo',
    type: 'import',
    name: 'Maquinário Industrial de Precisão & Eletrônicos de Consumo',
    category: 'tecnologia',
    icon: '📦',
    unit: 'contêineres/mês',
    baseVolumePerCycle: 220,
    currentVolume: 220,
    internationalPriceUsd: 12500, // US$ 12.500 por contêiner
    domesticCostBrl: 72000,
    tariffApplicablePercent: 18.0, // Alta tarifa para arrecadar e proteger montagem interna
    active: true,
    marketDemandStatus: 'Em Alta',
    strategicImpact: 'Grande gerador de arrecadação do Imposto de Importação (II) e ICMS alfandegário.',
    domesticCriticalNeed: 'Equipamentos industriais robóticos e bens de consumo tecnológicos importados.',
  },
];

export const INITIAL_TRADE_PARTNERS: TradeAgreementPartner[] = [
  {
    id: 'partner_china',
    countryName: 'República Popular da China & Ásia',
    flag: '🇨🇳',
    bloc: 'Ásia & China',
    tradeStatus: 'livre_comercio',
    bilateralTradeVolumeUsd: 125000000,
    tariffDiscountPercent: 15,
    exportDemandBoostPercent: 28,
    description: 'Maior parceiro comercial do país. Compra volumes recordes de soja, minério de ferro e petróleo.',
  },
  {
    id: 'partner_usa',
    countryName: 'Estados Unidos da América & Nafta',
    flag: '🇺🇸',
    bloc: 'Estados Unidos & Nafta',
    tradeStatus: 'padrao',
    bilateralTradeVolumeUsd: 85000000,
    tariffDiscountPercent: 10,
    exportDemandBoostPercent: 18,
    description: 'Comprador de produtos manufaturados de alto valor, jatos comerciais, aço e derivados.',
  },
  {
    id: 'partner_eu',
    countryName: 'União Europeia (Mercado Comum)',
    flag: '🇪🇺',
    bloc: 'União Europeia',
    tradeStatus: 'padrao',
    bilateralTradeVolumeUsd: 72000000,
    tariffDiscountPercent: 12,
    exportDemandBoostPercent: 22,
    description: 'Exige certificação ambiental e de rastreabilidade para alimentos, celulose e café de alta qualidade.',
  },
  {
    id: 'partner_mercosur',
    countryName: 'Bloco Mercosul & Vizinhos Sul-Americanos',
    flag: '🌎',
    bloc: 'Mercosul & Vizinhos',
    tradeStatus: 'livre_comercio',
    bilateralTradeVolumeUsd: 45000000,
    tariffDiscountPercent: 25,
    exportDemandBoostPercent: 30,
    description: 'Tarifa Externa Comum (TEC). Destino principal dos automóveis, ônibus e manufaturados nacionais.',
  },
  {
    id: 'partner_mideast',
    countryName: 'Oriente Médio & Nações do Golfo',
    flag: '🇦🇪',
    bloc: 'Oriente Médio',
    tradeStatus: 'padrao',
    bilateralTradeVolumeUsd: 38000000,
    tariffDiscountPercent: 8,
    exportDemandBoostPercent: 20,
    description: 'Importador maciço de carnes halal, proteína animal e fornecedor de fertilizantes fosfatados.',
  },
];

export function createInitialTradeBalanceState(): NationalTradeBalanceState {
  // Cotação do dólar base
  const dollarExchangeRate = 5.40;
  // Reservas internacionais do Banco Central (US$ 320 bilhões em escala nacional de simulação proporcional)
  const forexReservesUsd = 2800000; // US$ 2.80 milhões em escala de jogo

  let totalExportUsd = 0;
  let totalImportUsd = 0;

  INITIAL_TRADE_COMMODITIES.forEach((c) => {
    if (c.active) {
      if (c.type === 'export') {
        // cálculo de exportação em escala proporcional de simulação
        const unitRev = (c.currentVolume * c.internationalPriceUsd) / 1000;
        totalExportUsd += unitRev;
      } else {
        const unitCost = (c.currentVolume * c.internationalPriceUsd) / 1000;
        totalImportUsd += unitCost;
      }
    }
  });

  const netTradeBalanceUsd = Math.round(totalExportUsd - totalImportUsd);
  const netTradeBalanceBrl = Math.round(netTradeBalanceUsd * dollarExchangeRate);

  return {
    totalExportUsd: Math.round(totalExportUsd),
    totalImportUsd: Math.round(totalImportUsd),
    netTradeBalanceUsd,
    netTradeBalanceBrl,
    dollarExchangeRate,
    forexReservesUsd,
    importTariffAveragePercent: 12.0,
    exportCreditSubsidyActive: true,
    commodities: INITIAL_TRADE_COMMODITIES,
    partners: INITIAL_TRADE_PARTNERS,
  };
}
