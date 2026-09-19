import { PresidentialLegislationItem } from '../types/textGame';

export const INITIAL_PRESIDENTIAL_LEGISLATION: PresidentialLegislationItem[] = [
  // =========================================================================
  // 1. DECRETOS PRESIDENCIAIS (PODER EXECUTIVO DIRETO - ASSINATURA DA CANETA)
  // =========================================================================
  {
    id: 'dec_desoneracao_exportacao',
    type: 'decreto',
    numberStr: 'Decreto nº 11.420/2026',
    title: 'Desoneração Tarifária Imediata para Insumos de Exportação (Drawback)',
    theme: 'comercio_exterior',
    badge: '✍️ Decreto Imediato',
    description: 'Zera tarifas alfandegárias de matérias-primas importadas destinadas à industrialização para reexportação.',
    detailedJustification:
      'Com um simples ato da caneta presidencial, as indústrias exportadoras de máquinas, alimentos e tecnologia deixam de pagar tributos sobre componentes estrangeiros que serão reexportados, turbinando a competitividade do produto nacional no mercado global.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'caneta_presidencial',
    politicalCapitalCost: 45000,
    minTreasury: 45000,
    status: 'disponivel',
    impacts: {
      exportBonusPercent: 18,
      importCostDiscountPercent: 12,
      monthlyRevenueBonus: 85000, // Ganho no giro comercial
      approvalChange: 3,
      customNote: '+18% no faturamento das exportações e corte de 12% nos custos de insumos industriais importados.',
    },
  },
  {
    id: 'dec_intervencao_cambial_bc',
    type: 'decreto',
    numberStr: 'Decreto nº 11.425/2026',
    title: 'Diretriz de Intervenção Cambial & Leilões Estratégicos de Swap',
    theme: 'economia',
    badge: '💵 Câmbio & BC',
    description: 'Autoriza o Banco Central a realizar leilões de linha em dólar para estabilizar o câmbio e gerar lucros de arbitragem para o Tesouro.',
    detailedJustification:
      'Em momentos de volatilidade internacional, o Presidente determina leilões cirúrgicos das reservas cambiais. Isso contém a inflação dos alimentos importados e reverte ágio em moeda forte diretamente para o caixa soberano.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'caneta_presidencial',
    politicalCapitalCost: 60000,
    minTreasury: 60000,
    status: 'disponivel',
    impacts: {
      monthlyRevenueBonus: 110000,
      approvalChange: 2,
      customNote: 'Lucro mensal com operações cambiais no Banco Central (+R$ 110.000/ciclo) e âncora contra desvalorização.',
    },
  },
  {
    id: 'dec_racionalizacao_cargos_esplanada',
    type: 'decreto',
    numberStr: 'Decreto nº 11.432/2026',
    title: 'Extinção de Cargos Comissionados & Racionalização da Esplanada',
    theme: 'economia',
    badge: '✂️ Corte de Gastos',
    description: 'Extingue 3.500 funções de confiança, unifica diretorias em ministérios e reduz despesas de representação.',
    detailedJustification:
      'Combate a ineficiência administrativa cortando mordomias, passagens de primeira classe e estruturas redundantes da máquina federal, aliviando o Tesouro imediatamente.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'caneta_presidencial',
    politicalCapitalCost: 35000,
    status: 'disponivel',
    impacts: {
      monthlyExpenseReduction: 95000,
      approvalChange: 6,
      congressSupportChange: -4, // Parte dos parlamentares perde indicações políticas
      customNote: 'Economia direta de R$ 95.000 por ciclo na folha federal. Sobe aprovação popular, com leve tensão no Congresso.',
    },
  },
  {
    id: 'dec_tarifa_protecionista_aco_plastico',
    type: 'decreto',
    numberStr: 'Decreto nº 11.440/2026',
    title: 'Tarifaço Antidumping sobre Aço e Polímeros Estrangeiros Subsidiados',
    theme: 'comercio_exterior',
    badge: '🛡️ Protecionismo',
    description: 'Eleva a alíquota do Imposto de Importação sobre manufaturas pesadas que praticam concorrência predatória contra usinas nacionais.',
    detailedJustification:
      'Garante a sobrevivência dos altos-fornos nacionais contra o excesso de produção subsidiada estrangeira, gerando grande arrecadação alfandegária e preservando dezenas de milhares de postos de trabalho.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'caneta_presidencial',
    politicalCapitalCost: 55000,
    status: 'disponivel',
    impacts: {
      monthlyRevenueBonus: 130000, // Arrecadação de tarifas alfandegárias
      jobsCreated: 1800,
      approvalChange: 3,
      customNote: '+R$ 130.000/ciclo em receitas alfandegárias e criação de 1.800 empregos industriais pesados.',
    },
  },
  {
    id: 'dec_plano_safra_credito_emergencial',
    type: 'decreto',
    numberStr: 'Decreto nº 11.448/2026',
    title: 'Subvenção ao Seguro Agrícola & Crédito Verde de Exportação',
    theme: 'comercio_exterior',
    badge: '🌾 Plano Safra',
    description: 'Destina linhas de crédito soberano aos produtores de soja, milho e carnes com foco em escoamento portuário e certificação verde.',
    detailedJustification:
      'Garante que as safras brasileiras atinjam recordes de produtividade e alcancem os maiores preços nos portos de Roterdã e Xangai, consolidando o país como celeiro do mundo.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'caneta_presidencial',
    politicalCapitalCost: 70000,
    minTreasury: 70000,
    status: 'disponivel',
    impacts: {
      exportBonusPercent: 22,
      monthlyRevenueBonus: 140000,
      congressSupportChange: 5, // Agronegócio apoia o governo
      approvalChange: 4,
      customNote: '+22% de volume exportador de commodities agrícolas e alinhamento da bancada ruralista.',
    },
  },

  // =========================================================================
  // 2. LEIS DO CONGRESSO NACIONAL (MAIORIA SIMPLES > 50% NO PARLAMENTO)
  // =========================================================================
  {
    id: 'lei_marco_semicondutores_chips',
    type: 'lei',
    numberStr: 'Lei nº 14.850/2026',
    title: 'Marco Nacional de Semicondutores, Microchips & Inteligência Artificial',
    theme: 'economia',
    badge: '🔬 Lei do Congresso',
    description: 'Cria incentivos fiscais para implantação de fundições (fabs) de chips e polos de IA soberana no território nacional.',
    detailedJustification:
      'Reduz a dependência crônica de importação de microchips asiáticos que paralisam a indústria automobilística e hospitalar. Cria um ecossistema de alta tecnologia com salários elevados e superávit de serviços de ponta.',
    author: 'Comissão do Congresso Nacional',
    requiredQuorum: 'maioria_simples',
    minCongressSupport: 50,
    politicalCapitalCost: 120000,
    minTreasury: 120000,
    status: 'disponivel',
    impacts: {
      importCostDiscountPercent: 25,
      monthlyRevenueBonus: 190000,
      jobsCreated: 4200,
      sovereignRatingUpgrade: true,
      approvalChange: 5,
      customNote: 'Reduz dependência de chips importados em 25%, gera +R$ 190.000/ciclo em novos impostos de alta tecnologia.',
    },
  },
  {
    id: 'lei_ferrovias_hidrovias_escoamento',
    type: 'lei',
    numberStr: 'Lei nº 14.862/2026',
    title: 'Nova Lei de Ferrovias por Autorização & Corredores Hidroviários',
    theme: 'infraestrutura_defesa',
    badge: '🚂 Logística Portuária',
    description: 'Destrava autorizações para a iniciativa privada construir malhas ferroviárias e terminais portuários privativos.',
    detailedJustification:
      'O "Custo-Brasil" do frete rodoviário é cortado em 40%. Trens de carga levam grãos e minérios do centro do país diretamente aos navios graneleiros, barateando a exportação e multiplicando as divisas.',
    author: 'Liderança Partidária',
    requiredQuorum: 'maioria_simples',
    minCongressSupport: 52,
    politicalCapitalCost: 140000,
    minTreasury: 140000,
    status: 'disponivel',
    impacts: {
      exportBonusPercent: 28,
      monthlyExpenseReduction: 60000, // Menos gasto com conservação de rodovias
      monthlyRevenueBonus: 175000,
      approvalChange: 6,
      customNote: '+28% na competitividade dos portos e economia mensal em manutenção asfáltica rodoviária.',
    },
  },
  {
    id: 'lei_reforma_minerais_estrategicos_litio_niobio',
    type: 'lei',
    numberStr: 'Lei nº 14.875/2026',
    title: 'Marco dos Minerais Estratégicos, Terras Raras, Lítio & Nióbio',
    theme: 'energia_mineracao',
    badge: '⛏️ Mineração Soberana',
    description: 'Exige agregação de valor local antes da exportação de minérios para baterias de veículos elétricos e superligas.',
    detailedJustification:
      'Acaba com a exportação de rocha bruta sem refino. Obriga a instalação de refinarias de lítio e cátodos de baterias no país, multiplicando por 6 o valor de cada tonelada embarcada para o exterior.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'maioria_simples',
    minCongressSupport: 54,
    politicalCapitalCost: 150000,
    minTreasury: 150000,
    status: 'disponivel',
    impacts: {
      exportBonusPercent: 32,
      monthlyRevenueBonus: 220000,
      sovereignRatingUpgrade: true,
      approvalChange: 7,
      customNote: 'Eleva royalties minerais e multiplica a receita de exportação de lítio e nióbio em +R$ 220.000/ciclo.',
    },
  },
  {
    id: 'lei_responsabilidade_fiscal_soberana',
    type: 'lei',
    numberStr: 'Lei Complementar nº 205/2026',
    title: 'Novo Marco Fiscal Soberano & Regra de Ouro da Dívida Pública',
    theme: 'economia',
    badge: '📊 Equilíbrio Fiscal',
    description: 'Fixa metas anticíclicas de superávit primário e trava o crescimento de despesas correntes quando o endividamento subir.',
    detailedJustification:
      'Garante a confiança de bancos internacionais e agências de classificação de risco. O Risco-País desaba e a taxa básica de juros (Selic) pode ser reduzida sem risco de inflação.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'maioria_simples',
    minCongressSupport: 55,
    politicalCapitalCost: 160000,
    minTreasury: 160000,
    status: 'disponivel',
    impacts: {
      selicInterestCutBps: 150, // -1.5% na Selic
      monthlyExpenseReduction: 120000, // Economia gigantesca no serviço da dívida soberana
      sovereignRatingUpgrade: true,
      approvalChange: 4,
      customNote: 'Corta a taxa Selic em 1,5 ponto e economiza R$ 120.000 por ciclo em juros da dívida soberana.',
    },
  },

  // =========================================================================
  // 3. PECs - PROPOSTAS DE EMENDA À CONSTITUIÇÃO (3/5 QUÓRUM QUALIFICADO >= 60%)
  // =========================================================================
  {
    id: 'pec_reforma_tributaria_iva_dual',
    type: 'pec',
    numberStr: 'PEC nº 45/2026',
    title: 'PEC da Reforma Tributária: IVA Dual Soberano & Fim do Custo Tributário',
    theme: 'tributaria',
    badge: '🏛️ Emenda Constitucional',
    description: 'Extingue 5 tributos arcaicos e institui o IBS (Estados/Municípios) e CBS (União), tributando no destino com desoneração total de exportações.',
    detailedJustification:
      'A maior reforma econômica em 40 anos! Elimina a cumulatividade, atrai trilhões em investimentos externos e desonera 100% os produtos nacionais exportados, transformando o país em potência exportadora com segurança jurídica internacional.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'tres_quintos',
    minCongressSupport: 60,
    politicalCapitalCost: 350000,
    minTreasury: 350000,
    status: 'disponivel',
    impacts: {
      monthlyRevenueBonus: 380000, // Explosão na arrecadação pela eficiência
      exportBonusPercent: 35,
      sovereignRatingUpgrade: true,
      approvalChange: 10,
      congressSupportChange: 8,
      customNote: 'Reforma histórica! +R$ 380.000/ciclo em arrecadação limpa, +35% de exportações e atração maciça de capital estrangeiro.',
    },
  },
  {
    id: 'pec_previdencia_social_equilíbrio_atuarial',
    type: 'pec',
    numberStr: 'PEC nº 06/2026',
    title: 'PEC do Equilíbrio Previdenciário Nacional & Poupança Soberana',
    theme: 'trabalho_previdencia',
    badge: '⚖️ Emenda Constitucional',
    description: 'Alinha as regras de transição demográfica do INSS e cria regime de capitalização mista para conter o déficit atuarial.',
    detailedJustification:
      'O déficit da previdência consome fatias monumentais do orçamento federal todos os meses. Essa emenda constitucional estanca o rombo do INSS, garantindo a sustentabilidade das aposentadorias pelas próximas gerações.',
    author: 'Comissão do Congresso Nacional',
    requiredQuorum: 'tres_quintos',
    minCongressSupport: 62,
    politicalCapitalCost: 400000,
    minTreasury: 400000,
    status: 'disponivel',
    impacts: {
      inssDeficitReduction: 210000, // Reduz o rombo do INSS
      monthlyExpenseReduction: 210000,
      sovereignRatingUpgrade: true,
      approvalChange: -2, // Medida dura, mas essencial
      congressSupportChange: 6,
      customNote: 'Extingue mais de R$ 210.000/ciclo do rombo previdenciário do INSS, equilibrando as finanças federais de vez.',
    },
  },
  {
    id: 'pec_soberania_pre_sal_refino_nacional',
    type: 'pec',
    numberStr: 'PEC nº 72/2026',
    title: 'PEC da Autossuficiência no Refino do Petróleo & Soberania Energética',
    theme: 'energia_mineracao',
    badge: '🛢️ Emenda Constitucional',
    description: 'Constitucionaliza a vinculação de 50% dos royalties do petróleo do pré-sal para expansão de refinarias domésticas e fundo soberano.',
    detailedJustification:
      'Garante que o país não apenas extraia óleo cru para vender barato e comprar diesel caro lá fora. Transforma o país em exportador líquido de derivados de alto valor agregado, barateando frotas e gás de cozinha internamente.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'tres_quintos',
    minCongressSupport: 63,
    politicalCapitalCost: 380000,
    minTreasury: 380000,
    status: 'disponivel',
    impacts: {
      monthlyRevenueBonus: 320000,
      importCostDiscountPercent: 30, // Reduz drasticamente a importação de diesel
      exportBonusPercent: 25,
      approvalChange: 9,
      customNote: '+R$ 320.000/ciclo no Tesouro, corte de 30% nas despesas com importação de combustíveis e diesel mais barato.',
    },
  },
  {
    id: 'pec_livre_comercio_global_portos',
    type: 'pec',
    numberStr: 'PEC nº 91/2026',
    title: 'PEC da Abertura Comercial Soberana, Cabotagem & Eficiência Aduaneira',
    theme: 'comercio_exterior',
    badge: '🚢 Emenda Constitucional',
    description: 'Desregulamenta a navegação de cabotagem ("BR do Mar"), moderniza aduanas e ratifica acordos de livre comércio intercontinentais.',
    detailedJustification:
      'Quebra cartéis de transporte marítimo e reduz o tempo médio de desembaraço aduaneiro de 9 dias para 6 horas. Os portos nacionais passam a operar no mesmo nível de eficiência dos portos de Roterdã e Singapura.',
    author: 'Poder Executivo (Presidente)',
    requiredQuorum: 'tres_quintos',
    minCongressSupport: 61,
    politicalCapitalCost: 360000,
    minTreasury: 360000,
    status: 'disponivel',
    impacts: {
      exportBonusPercent: 40,
      monthlyRevenueBonus: 290000,
      jobsCreated: 5800,
      approvalChange: 7,
      customNote: 'Salto histórico de +40% no volume exportado pelos portos e criação de quase 6 mil empregos de comércio exterior.',
    },
  },
  {
    id: 'pec_reforma_administrativa_meritocracia',
    type: 'pec',
    numberStr: 'PEC nº 32/2026',
    title: 'PEC da Modernização do Estado, Desburocratização & Avaliação de Desempenho',
    theme: 'economia',
    badge: '🏛️ Emenda Constitucional',
    description: 'Regulamenta avaliação periódica de desempenho para o funcionalismo público federal, digitalização de serviços e fim de penduricalhos.',
    detailedJustification:
      'Garante que o cidadão receba serviços públicos de excelência com agendamento instantâneo via celular. Elimina privilégios de castas burocráticas e moderniza toda a administração federal.',
    author: 'Liderança Partidária',
    requiredQuorum: 'tres_quintos',
    minCongressSupport: 64,
    politicalCapitalCost: 420000,
    minTreasury: 420000,
    status: 'disponivel',
    impacts: {
      monthlyExpenseReduction: 180000,
      monthlyRevenueBonus: 90000,
      approvalChange: 8,
      sovereignRatingUpgrade: true,
      customNote: 'Economia permanente de R$ 180.000/ciclo na máquina pública e desburocratização total para abertura de empresas.',
    },
  },
];
