import { MunicipalActionDef } from '../types/textGame';

/**
 * Escalonamento de Duração por Custo:
 * Conforme determinação do Gabinete do Prefeito, o Tempo Oficial do Contador é fixado em 30 segundos
 * para celeridade na tramitação e execução dos despachos e obras públicas.
 */
export function getActionDurationMs(_cost?: number): number {
  return 30 * 1000; // 30 segundos oficiais para todos os despachos e obras municipais
}

export function formatActionDuration(_durationMs?: number): string {
  return '30 segundos';
}

const RAW_MUNICIPAL_ACTIONS: MunicipalActionDef[] = [
  // ==========================================
  // 1. RECURSOS NATURAIS, ENERGIA & MINERAÇÃO
  // ==========================================
  {
    id: 'prospeccao_ouro',
    title: 'Sondagem Geológica nas Serras (Ouro & Terras Raras)',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '⛏️ Mineração',
    shortDesc: 'Contrata sondas e geólogos para mapear veios de ouro e minerais estratégicos no interior.',
    fullDesc:
      'Uma expedição técnica com geo-radar e perfuratrizes fará levantamento topográfico nas serras municipais. Há histórico de garimpo antigo. Se confirmar veio de ouro comercial, gerará tributos (CFEM) e empregos. Risco de encontrar rocha estéril.',
    cost: 320000,
    durationMs: 60000,
    requirements: {
      minTreasury: 320000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Licenciamento e contratação da empresa geológica', department: 'Sec. de Meio Ambiente' },
      { second: 15, label: 'Instalação do acampamento e perfuração das primeiras amostras', department: 'Corpo Técnico' },
      { second: 30, label: 'Análise espectrométrica de amostras de rocha em laboratório', department: 'ANM (Agência Nacional de Mineração)' },
      { second: 45, label: 'Consolidação do relatório volumétrico e teor de pureza (g/t)', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Possibilidade de descobrir jazida de ouro (300kg a 1.200kg/ano) ou terras raras, gerando arrecadação vitalícia.',
    riskFactor: 'Médio',
  },
  {
    id: 'petroleo_terrestre',
    title: 'Perfuração de Poço de Petróleo Terrestre (Bacia Onshore)',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '🛢️ Petróleo',
    shortDesc: 'Perfuração pioneira de poço exploratório em áreas sedimentares da zona rural.',
    fullDesc:
      'Contratação de sonda de perfuração para atingir profundidade de 2.800 metros. Estudos sísmicos indicam possível bolsão de óleo leve e gás natural. Se for produtivo, colocará o município no mapa dos royalties petrolíferos.',
    cost: 950000,
    durationMs: 60000,
    requirements: {
      minTreasury: 950000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Protocolo de outorga na Agência Nacional do Petróleo (ANP)', department: 'ANP & Fazenda' },
      { second: 15, label: 'Montagem da torre de perfuração e barreiras de contenção ambiental', department: 'Sec. de Obras' },
      { second: 30, label: 'Descida da broca diamantada além de 2.000m e testes de pressão', department: 'Engenharia de Perfuração' },
      { second: 45, label: 'Teste de fluxo e verificação de hidrocarbonetos e densidade API', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Descoberta de poço com 500 a 4.000 barris/dia ou retorno nulo com poço seco.',
    riskFactor: 'Alto',
  },
  {
    id: 'petroleo_presal_mar',
    title: 'Perfuração Offshore Pré-Sal em Águas Profundas',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '🌊 Pré-Sal',
    shortDesc: 'Consórcio e estudos sismográficos 3D para campos petrolíferos marítimos da costa municipal.',
    fullDesc:
      'O investimento mais ousado do município: formalizar consórcio com operadoras e licenciar a perfuração de lâmina d’água profunda em busca do pré-sal. Custo elevadíssimo, mas o retorno transforma a cidade em uma capital bilionária de royalties.',
    cost: 2800000,
    durationMs: 60000,
    requirements: {
      minTreasury: 2800000,
      minPopulation: 30000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Licitação internacional de bloco exploratório marinho', department: 'Ministério de Minas e Energia' },
      { second: 15, label: 'Emissão da Licença de Instalação e Parecer do IBAMA', department: 'IBAMA' },
      { second: 30, label: 'Sonda semi-submersível perfura camada de sal a 5.000m de profundidade', department: 'Consórcio de Operadoras' },
      { second: 45, label: 'Testemunhagem do reservatório e anúncio ao mercado financeiro', department: 'ANP & Palácio Municipal' },
    ],
    expectedOutcome: 'Se jorrar petróleo no pré-sal: de 15.000 a 60.000 barris/dia, R$ 1.500.000+ em royalties mensais.',
    riskFactor: 'Severo',
  },
  {
    id: 'usina_solar_municipal',
    title: 'Complexo de Usina Solar Fotovoltaica Municipal (70 MW)',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '☀️ Energia Limpa',
    shortDesc: 'Instalação de 140.000 módulos solares para zerar a conta de luz dos prédios públicos e exportar energia.',
    fullDesc:
      'Parque solar em terreno municipal desapropriado. Garante independência energética contra apagões, reduz as despesas de manutenção da prefeitura e gera excedente de Megawatts (MW) para vender no mercado regional.',
    cost: 750000,
    durationMs: 60000,
    requirements: {
      minTreasury: 750000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Desapropriação e terraplanagem do platô solar', department: 'Sec. de Planejamento' },
      { second: 15, label: 'Importação e desalfandegamento dos inversores e painéis bifaciais', department: 'Receita Federal' },
      { second: 30, label: 'Construção da subestação elevadora e cabeamento subterrâneo', department: 'Engenharia Elétrica' },
      { second: 45, label: 'Comissionamento e conexão à rede do Sistema Interligado Nacional', department: 'ONS (Operador Elétrico)' },
    ],
    expectedOutcome: '+70 MW de geração limpa, economia de R$ 120.000/mês e excedente para vender a cidades vizinhas.',
    riskFactor: 'Baixo',
  },
  {
    id: 'parque_eolico_serras',
    title: 'Complexo de Energia Eólica das Serras (150 MW)',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '💨 Energia Eólica',
    shortDesc: 'Instalação de 30 aerogeradores gigantes nas cristas das montanhas com vento constante.',
    fullDesc:
      'Aproveitamento dos corredores de vento que sopram o ano todo. Torna o município um exportador líquido de energia verde, atraindo indústrias eletrointensivas e gerando royalties de arrendamento.',
    cost: 1400000,
    durationMs: 60000,
    requirements: {
      minTreasury: 1400000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Medição anemométrica e licenciamento ambiental nas serras', department: 'Sec. de Meio Ambiente' },
      { second: 15, label: 'Transporte das pás de 75m por carretas especiais nas rodovias', department: 'Polícia Rodoviária' },
      { second: 30, label: 'Concretagem das bases de 800 toneladas e içamento das turbinas', department: 'Engenharia Pesada' },
      { second: 45, label: 'Testes de sincronismo com a rede regional e acionamento dos freios', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+150 MW de geração firme, R$ 260.000/mês em contratos de venda e selo de Cidade Carbono Zero.',
    riskFactor: 'Médio',
  },
  {
    id: 'saneamento_universal',
    title: 'Universalização do Saneamento Básico e Estação de Esgoto',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '🚰 Saneamento',
    shortDesc: 'Implantação de emissário e estação de tratamento de esgoto para alcançar 95% de cobertura.',
    fullDesc:
      'Acaba com esgoto a céu aberto na periferia, despolui o rio municipal e reduz em 40% as internações por doenças de veiculação hídrica nos postos de saúde. Cumpre as metas do Marco Legal do Saneamento.',
    cost: 850000,
    durationMs: 60000,
    requirements: {
      minTreasury: 850000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Abertura de valas e assentamento da tubulação tronco', department: 'Sec. de Saneamento' },
      { second: 15, label: 'Construção dos reatores biológicos e decantadores da ETE', department: 'Engenharia Sanitária' },
      { second: 30, label: 'Ligação das residências periféricas à rede pública de água limpa', department: 'Companhia de Águas' },
      { second: 45, label: 'Fiscalização da Agência Reguladora e emissão de laudo de pureza', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+35% de cobertura de água tratada, melhora no IDH e aprovação popular de +12%.',
    riskFactor: 'Baixo',
  },

  // ==========================================
  // 2. BNDES, FINANÇAS & GOVERNO FEDERAL
  // ==========================================
  {
    id: 'financiamento_bndes_mobilidade',
    title: 'Financiamento BNDES - Grandes Obras de Mobilidade Urbana',
    category: 'bndes_financas',
    categoryLabel: 'BNDES & Finanças',
    badge: '🏦 BNDES R$ 15M',
    shortDesc: 'Pleito de empréstimo de R$ 15.000.000 para viadutos, duplicação de avenidas e corredores.',
    fullDesc:
      'O BNDES exige nota fiscal CAPAG A ou B, contrapartida municipal de 15% (R$ 450.000) e aprovação de 2/3 da Câmara de Vereadores. Se a cidade estiver endividada ou com pendências cadastrais no CAUC/SIAFI, o pedido é sumariamente reprovado.',
    cost: 450000, // contrapartida
    durationMs: 60000,
    requirements: {
      minTreasury: 450000,
      requiredFiscalRating: ['A', 'B'],
      minCouncilSupport: 50,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Cadastro do projeto de engenharia e certidões negativas no BNDES', department: 'Sec. da Fazenda' },
      { second: 15, label: 'Análise de risco de crédito pelo Comitê de Elegibilidade do Banco', department: 'BNDES Rio de Janeiro' },
      { second: 30, label: 'Votação do projeto de lei de garantia soberana na Câmara', department: 'Câmara de Vereadores' },
      { second: 45, label: 'Emissão da Portaria da Secretaria do Tesouro Nacional (STN)', department: 'Ministério da Fazenda' },
    ],
    expectedOutcome: 'Se aprovado: injeção de R$ 15.000.000 no caixa municipal e modernização total do trânsito.',
    riskFactor: 'Alto',
  },
  {
    id: 'credito_caixa_moradia',
    title: 'Linha de Crédito Caixa Econômica - Urbanização & Moradia',
    category: 'bndes_financas',
    categoryLabel: 'BNDES & Finanças',
    badge: '🏗️ Caixa R$ 8M',
    shortDesc: 'Captação de R$ 8.000.000 para regularização fundiária, asfalto e moradias populares.',
    fullDesc:
      'Programa Pró-Moradia com a Caixa Econômica Federal. Remove famílias de áreas de risco de deslizamento, entrega casas com escritura registrada e pavimenta bairros esquecidos.',
    cost: 250000,
    durationMs: 60000,
    requirements: {
      minTreasury: 250000,
      requiredFiscalRating: ['A', 'B', 'C'],
    },
    bureaucracyPhases: [
      { second: 0, label: 'Cadastramento socioeconômico das famílias no CadÚnico', department: 'Sec. de Assistência Social' },
      { second: 15, label: 'Vistoria técnica da gerência de governo da Caixa (GIGOV)', department: 'Caixa Econômica Federal' },
      { second: 30, label: 'Licitação das construtoras e assinatura dos lotes de obras', department: 'Sec. de Obras' },
      { second: 45, label: 'Liberação da primeira parcela e ordem de serviço pelo Prefeito', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Liberação de R$ 8.000.000, geração de 400 empregos na construção civil e +8% de aprovação.',
    riskFactor: 'Médio',
  },
  {
    id: 'emendas_parlamentares_brasilia',
    title: 'Articulação de Emenda Parlamentar de Bancada em Brasília',
    category: 'bndes_financas',
    categoryLabel: 'BNDES & Finanças',
    badge: '🏛️ Emenda R$ 4M',
    shortDesc: 'Viagem a Brasília e negociação com deputados federais e senadores por recursos livres.',
    fullDesc:
      'O Prefeito viaja ao Congresso Nacional em busca de emendas de comissão e bancada estadual. Exige concessões políticas e lealdade partidária. Recurso entra direto na conta da saúde e custeio municipal.',
    cost: 120000, // custo de articulação e projetos
    durationMs: 60000,
    requirements: {
      minTreasury: 120000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Reuniões de articulação nos gabinetes da Câmara dos Deputados', department: 'Brasília / Congresso' },
      { second: 15, label: 'Inclusão da cidade no relatório setorial da Lei Orçamentária Anual', department: 'Comissão Mista de Orçamento' },
      { second: 30, label: 'Empenho da verba no Ministério das Cidades e da Saúde', department: 'Ministério do Planejamento' },
      { second: 45, label: 'Ordem bancária emitida pelo Banco do Brasil para o Fundo Municipal', department: 'Tesouro Nacional' },
    ],
    expectedOutcome: 'Repasse a fundo perdido de R$ 3.500.000 a R$ 5.000.000 para a saúde e recapeamento asfáltico.',
    riskFactor: 'Médio',
  },
  {
    id: 'auditoria_sonegacao_fiscal',
    title: 'Mega Auditoria Fiscal contra Sonegação de IPTU & ISS',
    category: 'bndes_financas',
    categoryLabel: 'BNDES & Finanças',
    badge: '🔍 Fazenda Municipal',
    shortDesc: 'Cruzamento digital de notas fiscais, cartórios e drones contra grandes sonegadores.',
    fullDesc:
      'Combate à inadimplência de grandes empresas e especuladores imobiliários. Recupera receitas sem aumentar impostos para a população simples. Pode gerar atrito com empresários locais influentes.',
    cost: 90000,
    durationMs: 60000,
    requirements: {
      minTreasury: 90000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Cruzamento de dados fiscais com a Receita Federal e cartórios', department: 'Sec. da Fazenda' },
      { second: 15, label: 'Voo de drones para recadastramento de mansões e áreas subavaliadas', department: 'Fiscalização Tributária' },
      { second: 30, label: 'Emissão de autos de infração e cobrança administrativa de dívida ativa', department: 'Procuradoria Geral' },
      { second: 45, label: 'Acordos de parcelamento (REFIS) e entrada dos primeiros pagamentos', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+R$ 180.000/mês de arrecadação contínua e recuperação de R$ 1.200.000 em atrasados.',
    riskFactor: 'Baixo',
  },
  {
    id: 'ajuste_fiscal_capag',
    title: 'Plano Emergencial de Ajuste Fiscal & Recuperação da Nota CAPAG',
    category: 'bndes_financas',
    categoryLabel: 'BNDES & Finanças',
    badge: '⚖️ Nota Fiscal STN',
    shortDesc: 'Corta cargos comissionados inúteis, renegocia contratos e sobe a nota da cidade para A ou B.',
    fullDesc:
      'Uma medida austera porém indispensável. Sem nota fiscal positiva no Tesouro Nacional, o município é proibido por lei de contrair qualquer financiamento externo. Eleva o prestígio econômico da prefeitura.',
    cost: 60000,
    durationMs: 60000,
    requirements: {
      minTreasury: 60000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Decreto de contenção de despesas e auditoria de contratos terceirizados', department: 'Controladoria Geral' },
      { second: 15, label: 'Renegociação de tarifas de fornecedores e revisão de licitações', department: 'Sec. de Administração' },
      { second: 30, label: 'Apresentação do balanço com superávit primário ao Tribunal de Contas', department: 'TCE' },
      { second: 45, label: 'Atualização do rating municipal no portal da Secretaria do Tesouro', department: 'Tesouro Nacional' },
    ],
    expectedOutcome: 'Elevação da nota fiscal (de C/D para B ou de B para A), desbloqueando empréstimos no BNDES.',
    riskFactor: 'Médio',
  },

  // ==========================================
  // 3. TURISMO, CULTURA & EVENTOS
  // ==========================================
  {
    id: 'carnaval_municipal',
    title: 'Mega Carnaval Municipal de Rua & Circuito de Trios',
    category: 'turismo_cultura',
    categoryLabel: 'Turismo & Cultura',
    badge: '🎭 Carnaval',
    shortDesc: 'Estrutura palcos, camarotes e segurança para atrair multidão de foliões de todo o estado.',
    fullDesc:
      'O Carnaval é o maior motor sazonal da economia: enche 100% dos hotéis, movimenta bares, restaurantes e ambulantes. Se a segurança falhar, arrastões e brigas derrubam a imagem da cidade.',
    cost: 480000,
    durationMs: 60000,
    requirements: {
      minTreasury: 480000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Edital de patrocínio com cervejarias e montagem dos palcos', department: 'Sec. de Turismo' },
      { second: 15, label: 'Plano integrado de desvio de trânsito e fechamento de avenidas', department: 'Engenharia de Tráfego' },
      { second: 30, label: 'Reforço operacional da Guarda Municipal e Polícia Militar', department: 'Sec. de Segurança' },
      { second: 45, label: 'Abertura oficial com entrega simbólica da chave da cidade pelo Prefeito', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+65.000 turistas no mês, R$ 380.000 em arrecadação de ISS e comércio e 1.200 vagas temporárias.',
    riskFactor: 'Médio',
  },
  {
    id: 'resort_hoteleiro_costa',
    title: 'Edital de Atração de Mega-Resort Hoteleiro 5 Estrelas',
    category: 'turismo_cultura',
    categoryLabel: 'Turismo & Cultura',
    badge: '🏨 Resort 5 Estrelas',
    shortDesc: 'Incentivos de IPTU e concessão de praia para grupo hoteleiro erguer resort de luxo internacional.',
    fullDesc:
      'Complexo de 400 suítes, parque aquático, quadras de tênis e centro de spa. Converte o município em polo turístico permanente de alta renda, com voos executivos e divisas internacionais.',
    cost: 350000,
    durationMs: 60000,
    requirements: {
      minTreasury: 350000,
      minPopulation: 20000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Mapeamento da orla e delimitação da área de interesse turístico', department: 'Sec. de Turismo' },
      { second: 15, label: 'Audiência pública com pescadores locais e conselho ambiental', department: 'Câmara Municipal' },
      { second: 30, label: 'Assinatura do protocolo de intenções com o grupo investidor', department: 'Gabinete do Prefeito' },
      { second: 45, label: 'Início das fundações e lançamento dos catálogos turísticos', department: 'Trade Hoteleiro' },
    ],
    expectedOutcome: '+30.000 turistas permanentes/mês, 900 empregos com carteira assinada e R$ 220.000/mês em impostos.',
    riskFactor: 'Baixo',
  },
  {
    id: 'centro_convencoes_negocios',
    title: 'Centro de Convenções Municipal & Arena de Feiras',
    category: 'turismo_cultura',
    categoryLabel: 'Turismo & Cultura',
    badge: '🏛️ Feiras & Congressos',
    shortDesc: 'Pavilhão climatizado para 8.000 pessoas focado em turismo corporativo de negócios.',
    fullDesc:
      'Garante ocupação hoteleira nos meses de baixa temporada (março a novembro). Abriga congressos médicos, feiras industriais e fóruns de tecnologia.',
    cost: 650000,
    durationMs: 60000,
    requirements: {
      minTreasury: 650000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Projeto arquitetônico com eficiência acústica e solar', department: 'Sec. de Obras' },
      { second: 15, label: 'Licitação da empreiteira e concretagem da grande cúpula', department: 'Sec. de Planejamento' },
      { second: 30, label: 'Acordo com a federação das indústrias para calendário anual de feiras', department: 'FIESP/FIRJAN/Federações' },
      { second: 45, label: 'Inauguração solene com a primeira feira regional de agronegócio', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+18.000 turistas corporativos/mês, aumento do ticket médio do comércio e receita de locação.',
    riskFactor: 'Baixo',
  },
  {
    id: 'parque_ecologico_cachoeiras',
    title: 'Parque Natural Ecoturístico com Mirantes e Tirolesa',
    category: 'turismo_cultura',
    categoryLabel: 'Turismo & Cultura',
    badge: '🌿 Ecoturismo',
    shortDesc: 'Preservação de cânions e cachoeiras com trilhas sinalizadas e turismo de aventura.',
    fullDesc:
      'Combina conservação ambiental com renda para comunidades rurais. Guia turistas para rapel, trilhas de mountain bike e gastronomia caipira.',
    cost: 210000,
    durationMs: 60000,
    requirements: {
      minTreasury: 210000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Demarcação do perímetro do parque e reflorestamento de matas ciliares', department: 'Sec. de Meio Ambiente' },
      { second: 15, label: 'Construção do centro de visitantes e deck panorâmico', department: 'Sec. de Turismo' },
      { second: 30, label: 'Capacitação de guias locais e instalação da tirolesa radical', department: 'Corpo de Bombeiros' },
      { second: 45, label: 'Abertura ao público e cobrança de taxa de conservação sustentável', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+12.000 turistas/mês, preservação de mananciais e valorização do artesanato local.',
    riskFactor: 'Baixo',
  },

  // ==========================================
  // 4. INDÚSTRIA, COMÉRCIO & EMPREGOS
  // ==========================================
  {
    id: 'complexo_petroquimico',
    title: 'Complexo Petroquímico e Usina de Refino Municipal',
    category: 'industria_empregos',
    categoryLabel: 'Indústria & Empregos',
    badge: '🏭 Petroquímica',
    shortDesc: 'Refina o petróleo extraído no município em diesel, gasolina, querosene e polímeros.',
    fullDesc:
      'Requer petróleo descoberto no município! Multiplica em 4x o valor agregado do óleo bruto. Transforma a cidade em um pólo industrial pesado de nível nacional, gerando salários elevados e atração de indústrias químicas.',
    cost: 3200000,
    durationMs: 60000,
    requirements: {
      minTreasury: 3200000,
      requiresOil: true,
      minPopulation: 25000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Estudo de impacto ambiental rigoroso e audiências com o Ministério Público', department: 'IBAMA & MPF' },
      { second: 15, label: 'Terraplanagem do megassítio e construção dos tanques de craqueamento', department: 'Consórcio de Engenharia' },
      { second: 30, label: 'Instalação da torre de fracionamento de destilação e tochas de segurança', department: 'ANP' },
      { second: 45, label: 'Entrada do primeiro barril bruto e queima do primeiro combustível refinado', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Criação de 4.500 empregos industriais, R$ 1.800.000/mês de ICMS/ISS e queda expressiva do desemprego.',
    riskFactor: 'Médio',
  },
  {
    id: 'distrito_industrial_porto_seco',
    title: 'Distrito Industrial com Zona Fiscal Livre & Porto Seco',
    category: 'industria_empregos',
    categoryLabel: 'Indústria & Empregos',
    badge: '🚛 Polo Industrial',
    shortDesc: 'Loteamento de 200 hectares com ferrovia, isenção de IPTU e alfândega para atrair 50 fábricas.',
    fullDesc:
      'Terrenos planos com energia trifásica, ramal ferroviário e fibra óptica. Atrai indústrias de manufatura, centros de distribuição do comércio eletrônico e empresas de logística interestadual.',
    cost: 1100000,
    durationMs: 60000,
    requirements: {
      minTreasury: 1100000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Projeto de lei de isenção fiscal por 10 anos aprovado na Câmara', department: 'Câmara de Vereadores' },
      { second: 15, label: 'Abertura das pistas para carretas bitrem e drenagem de alta vazão', department: 'Sec. de Infraestrutura' },
      { second: 30, label: 'Assinatura dos contratos de concessão de lotes com as indústrias', department: 'Sec. de Desenvolvimento' },
      { second: 45, label: 'Início da operação do terminal alfandegário e pátio de contêineres', department: 'Receita Federal' },
    ],
    expectedOutcome: 'Geração de 3.200 novos empregos diretos, redução da taxa de desemprego em 3.5% e dinamismo comercial.',
    riskFactor: 'Baixo',
  },
  {
    id: 'polo_tecnologico_startups',
    title: 'Parque Tecnológico, Data Centers & Hub de Inovação',
    category: 'industria_empregos',
    categoryLabel: 'Indústria & Empregos',
    badge: '💻 Tecnologia & IA',
    shortDesc: 'Prédios modernos com internet gigabit, laboratórios de IA e incentivo para empresas de software.',
    fullDesc:
      'Gera empregos limpos de alta remuneração para os jovens da cidade, impedindo a fuga de cérebros para as grandes capitais. Atrai fundos de venture capital e data centers de nuvem.',
    cost: 580000,
    durationMs: 60000,
    requirements: {
      minTreasury: 580000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Parceria com universidades federais para incubação de ideias', department: 'Sec. de Ciência e Tecnologia' },
      { second: 15, label: 'Implantação do anel municipal de fibra óptica de 100 Gbps', department: 'Telebrás & Empresas' },
      { second: 30, label: 'Seleção das 40 primeiras startups de IA, agtech e fintech', department: 'Comitê de Inovação' },
      { second: 45, label: 'Inauguração do polo com presença de investidores internacionais', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+1.400 postos de trabalho de nível superior, aumento de arrecadação de ISS e reputação de Cidade Inteligente.',
    riskFactor: 'Baixo',
  },
  {
    id: 'cooperativa_agroindustrial',
    title: 'Cooperativa Agroindustrial & Silos de Grãos e Fruticultura',
    category: 'industria_empregos',
    categoryLabel: 'Indústria & Empregos',
    badge: '🌾 Agronegócio',
    shortDesc: 'Construção de armazéns refrigerados e fábrica de processamento de alimentos dos produtores rurais.',
    fullDesc:
      'Evita que os pequenos agricultores percam sua safra por falta de armazenagem. Processa polpas de frutas, laticínios e grãos com marca própria da cidade para exportação.',
    cost: 490000,
    durationMs: 60000,
    requirements: {
      minTreasury: 490000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Fundação jurídica da cooperativa municipal de produtores', department: 'Sec. de Agricultura' },
      { second: 15, label: 'Montagem dos silos metálicos de 10.000 toneladas de estocagem', department: 'Engenharia de Silos' },
      { second: 30, label: 'Obtenção do Selo de Inspeção Federal (SIF) para exportação', department: 'Ministério da Agricultura' },
      { second: 45, label: 'Primeiro embarque de caminhões com produtos beneficiados', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Fixação das famílias no campo, +850 empregos agroindustriais e alimentos 30% mais baratos na feira da cidade.',
    riskFactor: 'Baixo',
  },

  // ==========================================
  // 5. SERVIÇOS PÚBLICOS: SEGURANÇA, SAÚDE & EDUCAÇÃO
  // ==========================================
  {
    id: 'guarda_municipal_muralha',
    title: 'Concurso Público para Guarda Armada & Muralha Digital',
    category: 'servicos_publicos',
    categoryLabel: 'Serviços Públicos',
    badge: '🚓 Segurança Total',
    shortDesc: 'Contrata 200 guardas, compra 40 viaturas e espalha 300 câmeras com reconhecimento de placas.',
    fullDesc:
      'Cria um cerco inteligente nas entradas da cidade. Carros roubados são interceptados em segundos. Queda abrupta de furtos e assaltos no comércio, gerando sensação de paz e segurança.',
    cost: 520000,
    durationMs: 60000,
    requirements: {
      minTreasury: 520000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Edital do concurso público com teste de aptidão física e psicológico', department: 'Sec. de Segurança' },
      { second: 15, label: 'Curso de tiro e defesa cidadã na academia de formação policial', department: 'Polícia Federal' },
      { second: 30, label: 'Instalação das câmeras nos semáforos e centro de inteligência (CICC)', department: 'Sec. de Tecnologia' },
      { second: 45, label: 'Formatura dos guardas e início do patrulhamento intensivo 24h', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Índice de segurança sobe de forma expressiva (+28%), criminalidade cai 45% e popularidade +15%.',
    riskFactor: 'Baixo',
  },
  {
    id: 'hospital_trauma_especialidades',
    title: 'Construção do Hospital Municipal de Trauma & Especialidades',
    category: 'servicos_publicos',
    categoryLabel: 'Serviços Públicos',
    badge: '🏥 Hospital Geral',
    shortDesc: 'Hospital de 180 leitos com UTI, centro cirúrgico de ponta e tomografia para zerar filas do SUS.',
    fullDesc:
      'A maior obra social da gestão. Os pacientes não precisarão mais ser transportados de ambulância para a capital em estado grave. Atrai médicos especialistas e salva vidas diariamente.',
    cost: 1650000,
    durationMs: 60000,
    requirements: {
      minTreasury: 1650000,
      minPopulation: 25000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Aprovação do projeto sanitário na ANVISA e Ministério da Saúde', department: 'ANVISA' },
      { second: 15, label: 'Erguimento da estrutura com alas de isolamento e heliponto médico', department: 'Sec. de Saúde' },
      { second: 30, label: 'Instalação de ressonância magnética, leitos de UTI e oxigênio central', department: 'Equipamentos Médicos' },
      { second: 45, label: 'Contratação da equipe de intensivistas e atendimento do primeiro paciente', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Índice de saúde +35%, zera a fila de cirurgias eletivas e aprovação popular de +22%.',
    riskFactor: 'Médio',
  },
  {
    id: 'escolas_tempo_integral',
    title: 'Rede de Escolas em Tempo Integral com Robótica & Merenda Nobre',
    category: 'servicos_publicos',
    categoryLabel: 'Serviços Públicos',
    badge: '🎓 Educação Nota 10',
    shortDesc: 'As crianças passam o dia todo na escola: almoço balanceado, esportes, inglês e computação.',
    fullDesc:
      'Tira os jovens das ruas e do tráfico, permitindo que os pais trabalhem com tranquilidade. O IDEB da cidade sobe ao topo do ranking estadual, garantindo prêmios e repasses maiores do Fundeb.',
    cost: 680000,
    durationMs: 60000,
    requirements: {
      minTreasury: 680000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Reforma das salas de aula com ar-condicionado e quadras cobertas', department: 'Sec. de Educação' },
      { second: 15, label: 'Aquisição de kits de robótica e tablets para todos os alunos', department: 'MEC' },
      { second: 30, label: 'Cardápio supervisionado por nutricionistas com produtos da agricultura local', department: 'Conselho de Alimentação' },
      { second: 45, label: 'Início do ano letivo estendido com fanfarras e presença dos pais', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Índice educacional +30%, atrai famílias de classe média e eleva a satisfação comunitária.',
    riskFactor: 'Baixo',
  },
  {
    id: 'mutirao_asfalto_drenagem',
    title: 'Mega Mutirão de Pavimentação Asfáltica e Drenagem Pluvial',
    category: 'servicos_publicos',
    categoryLabel: 'Serviços Públicos',
    badge: '🚜 Asfalto Novo',
    shortDesc: 'Asfalta 100km de ruas de barro na periferia e constrói galerias pluviais contra enchentes.',
    fullDesc:
      'Acaba com a poeira no tempo seco e com a lama e alagamentos no inverno. Valoriza os imóveis dos bairros pobres e garante que ônibus e ambulâncias cheguem na porta de todos.',
    cost: 620000,
    durationMs: 60000,
    requirements: {
      minTreasury: 620000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Mapeamento topográfico dos pontos críticos de enxurrada e alagamento', department: 'Defesa Civil' },
      { second: 15, label: 'Enterramento das manilhas de concreto armado de drenagem', department: 'Sec. de Obras' },
      { second: 30, label: 'Aplicação do asfalto quente (CBUQ) com rolo compressor e meio-fio', department: 'Usina de Asfalto' },
      { second: 45, label: 'Pintura de faixas e instalação de placas e iluminação em LED', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Infraestrutura +25%, zera enchentes nos bairros periféricos e gera aprovação em massa.',
    riskFactor: 'Baixo',
  },

  // ==========================================
  // 6. CÂMARA DE VEREADORES & POLÍTICA MUNICIPAL
  // ==========================================
  {
    id: 'iptu_progressivo_terrenos',
    title: 'Projeto de Lei: IPTU Progressivo contra Terrenos Especulativos',
    category: 'politica_camara',
    categoryLabel: 'Política & Câmara',
    badge: '📜 Lei Municipal',
    shortDesc: 'Eleva imposto sobre latifúndios urbanos abandonados para forçar construção de moradias.',
    fullDesc:
      'Enfrenta forte lobby de grandes famílias imobiliárias que seguram terrenos no centro esperando valorização. Exige negociação tensa e maioria na Câmara de Vereadores. Se passar, destrava a construção civil.',
    cost: 40000,
    durationMs: 60000,
    requirements: {
      minTreasury: 40000,
      minCouncilSupport: 50,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Protocolo da mensagem de lei na mesa diretora do Legislativo', department: 'Câmara Municipal' },
      { second: 15, label: 'Debate inflamado na Comissão de Constituição e Justiça (CCJ)', department: 'Vereadores' },
      { second: 30, label: 'Votação nominal em 2º turno no plenário da Câmara de Vereadores', department: 'Plenário Legislativo' },
      { second: 45, label: 'Sanção da lei pelo Prefeito com publicação no Diário Oficial', department: 'Diário Oficial' },
    ],
    expectedOutcome: '+R$ 150.000/mês de IPTU, boom na construção civil privada e modernização urbana.',
    riskFactor: 'Alto',
  },
  {
    id: 'emendas_impositivas_vereadores',
    title: 'Acordo Político de Emendas Impositivas com a Câmara',
    category: 'politica_camara',
    categoryLabel: 'Política & Câmara',
    badge: '🤝 Base Aliada',
    shortDesc: 'Libera verbas para os 15 vereadores indicarem obras em suas bases eleitorais.',
    fullDesc:
      'Mecanismo clássico da política brasileira: ao liberar recursos para praças e reformas indicadas pelos vereadores, a prefeitura constrói uma base sólida e aprova todos os projetos de lei futuros sem sobressaltos.',
    cost: 300000,
    durationMs: 60000,
    requirements: {
      minTreasury: 300000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Reunião de líderes partidários a portas fechadas no gabinete', department: 'Articulação Política' },
      { second: 15, label: 'Elaboração das emendas impositivas por bancada legislativa', department: 'Sec. de Governo' },
      { second: 30, label: 'Publicação do cronograma de desembolso no Diário Oficial', department: 'Sec. da Fazenda' },
      { second: 45, label: 'Declaração formal de apoio da bancada independente ao Prefeito', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Apoio da Câmara sobe para 85%+, blindagem contra CPIs e facilidade para aprovar reformas.',
    riskFactor: 'Baixo',
  },
  {
    id: 'audiencia_orcamento_participativo',
    title: 'Audiência Pública do Orçamento Participativo Cidadão',
    category: 'politica_camara',
    categoryLabel: 'Política & Câmara',
    badge: '📢 Transparência',
    shortDesc: 'Reúne lideranças comunitárias em ginásio para votar as prioridades reais dos bairros.',
    fullDesc:
      'Fortalece a democracia direta e a transparência fiscal. Mostra para a população que o Prefeito escuta as pessoas simples, desmontando discursos da oposição.',
    cost: 35000,
    durationMs: 60000,
    requirements: {
      minTreasury: 35000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Convocação pública nos rádios locais e redes comunitárias', department: 'Sec. de Comunicação' },
      { second: 15, label: 'Reuniões plenárias nos bairros e preenchimento de cédulas de prioridade', department: 'Conselhos de Bairro' },
      { second: 30, label: 'Compilação das 10 principais demandas de saúde, creche e asfalto', department: 'Sec. de Planejamento' },
      { second: 45, label: 'Compromisso público assinado pelo Prefeito com a comunidade', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Popularidade +14%, maior engajamento cívico e eficiência no gasto público.',
    riskFactor: 'Baixo',
  },

  // ==========================================
  // 7. HABITAÇÃO COHAB, METRÔ & MOBILIDADE URBANA (SIMCITY)
  // ==========================================
  {
    id: 'cohab_conjunto_habitacional',
    title: 'Construção de Conjunto Habitacional COHAB (Minha Casa Minha Vida)',
    category: 'habitacao_mobilidade',
    categoryLabel: 'Habitação & Mobilidade',
    badge: '🏢 COHAB 1.500 Aptos',
    shortDesc: 'Edifica condomínios populares verticais com praça, saneamento completo e creche integrada.',
    fullDesc:
      'Grande projeto habitacional municipal executado pela COHAB. Transfere famílias de palafitas e áreas de encosta para blocos modernos de apartamentos com escritura registrada e IPTU social.',
    cost: 480000,
    durationMs: 60000,
    requirements: {
      minTreasury: 480000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Desapropriação e terraplanagem do terreno público da COHAB', department: 'Sec. de Habitação' },
      { second: 15, label: 'Fundações, lajes e alvenaria dos blocos de edifícios residenciais', department: 'Sec. de Obras' },
      { second: 30, label: 'Instalação de redes de água tratada, esgoto, gás e iluminação LED', department: 'SANEMAP' },
      { second: 45, label: 'Sorteio público das unidades e entrega solene das chaves aos moradores', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '+1.500 moradias populares, reduz o déficit habitacional, atrai novos moradores (+3.800 hab) e aprovação popular +16%.',
    riskFactor: 'Baixo',
  },
  {
    id: 'cohab_urbanizacao_favelas',
    title: 'Programa COHAB de Urbanização de Favelas & Regularização Fundiária',
    category: 'habitacao_mobilidade',
    categoryLabel: 'Habitação & Mobilidade',
    badge: '🏡 Urbanização & Escrituras',
    shortDesc: 'Drenagem de vielas, contenção de encostas, água encanada e entrega de títulos de posse.',
    fullDesc:
      'Garante que as comunidades periféricas se transformem em bairros com dignidade, permitindo a entrada de ambulâncias do SAMU, viaturas da Guarda e caminhões de coleta de lixo.',
    cost: 280000,
    durationMs: 60000,
    requirements: {
      minTreasury: 280000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Topografia e mapeamento geológico das áreas de risco de desabamento', department: 'Defesa Civil' },
      { second: 15, label: 'Muros de gabião, escadarias drenantes e canalização de esgoto', department: 'COHAB' },
      { second: 30, label: 'Asfaltamento de acessos principais e iluminação pública inteligente', department: 'Sec. de Infraestrutura' },
      { second: 45, label: 'Entrega formal de escrituras e registros de imóvel em cartório', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Zera riscos de soterramento, +800 habitações regularizadas, eleva segurança e inclusão social.',
    riskFactor: 'Baixo',
  },
  {
    id: 'metro_linha_subterranea',
    title: 'Megaobra da Linha 1 do Metrô Subterrâneo Municipal',
    category: 'habitacao_mobilidade',
    categoryLabel: 'Habitação & Mobilidade',
    badge: '🚇 Metrô Subterrâneo',
    shortDesc: 'Túneis de 10km escavados por tatuzão, 8 estações modernas e capacidade para 120.000 passageiros/dia.',
    fullDesc:
      'A maior obra viária da história do município! Conecta a periferia de alta densidade ao centro financeiro e comercial em 15 minutos, eliminando gargalos de trânsito e poluição.',
    cost: 2400000,
    durationMs: 60000,
    requirements: {
      minTreasury: 2400000,
      minPopulation: 35000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Montagem do tatuzão (Shield TBM) e escavação dos túneis sob as avenidas', department: 'Consórcio Metroviário' },
      { second: 15, label: 'Construção subterrânea das 8 estações e plataformas com portas de vidro', department: 'Sec. de Transportes' },
      { second: 30, label: 'Eletrificação por terceiro trilho e testes de segurança automatizados', department: 'Engenharia de Tráfego' },
      { second: 45, label: 'Primeira viagem inaugural do Metrô com o Prefeito e lideranças', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '10km de metrô, 8 estações, transporta 120.000 pessoas/dia, trânsito cai 40%, comércio e ISS disparam (+R$ 180.000/mês).',
    riskFactor: 'Médio',
  },
  {
    id: 'trem_metropolitano_vlt',
    title: 'Implantação de Trem Metropolitano / VLT Elétrico de Superfície',
    category: 'habitacao_mobilidade',
    categoryLabel: 'Habitação & Mobilidade',
    badge: '🚊 Trem VLT Urbano',
    shortDesc: 'Rede sobre trilhos de 14km com composições elétricas conectando pólos industriais e aeroporto.',
    fullDesc:
      'Alternativa moderna e silenciosa aos combustíveis fósseis. Reativa antigos leitos ferroviários e expande novos ramais urbanos com ar-condicionado e integração tarifária.',
    cost: 950000,
    durationMs: 60000,
    requirements: {
      minTreasury: 950000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Assentamento de dormentes de concreto e trilhos soldados contínuos', department: 'Sec. de Mobilidade' },
      { second: 15, label: 'Subestações retificadoras e cabeamento aéreo de alimentação elétrica', department: 'Companhia de Trens' },
      { second: 30, label: 'Chegada dos trens VLT articulados e capacitação de maquinistas', department: 'Sec. de Obras' },
      { second: 45, label: 'Início da operação comercial integrada com bilhete único', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '14km de trilhos, transporta 55.000 passageiros/dia, valoriza bairros periféricos e atrai novos polos de emprego.',
    riskFactor: 'Baixo',
  },
  {
    id: 'corredor_brt_onibus',
    title: 'Corredor Exclusivo de Ônibus BRT com Faixa Dedicada & Estações Tubo',
    category: 'habitacao_mobilidade',
    categoryLabel: 'Habitação & Mobilidade',
    badge: '🚌 Corredor BRT 18km',
    shortDesc: '18km de canaletas exclusivas segregadas com ônibus biarticulados elétricos e embarque rápido.',
    fullDesc:
      'Implantado nos principais eixos viários, garante que os coletivos não fiquem presos no congestionamento. Reduz em 60% o tempo gasto no deslocamento diário do trabalhador.',
    cost: 520000,
    durationMs: 60000,
    requirements: {
      minTreasury: 520000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Fresagem e pavimentação em concreto rígido das canaletas exclusivas', department: 'Sec. de Infraestrutura' },
      { second: 15, label: 'Montagem das estações tubo com ar-condicionado e catracas pré-embarque', department: 'Consórcio BRT' },
      { second: 30, label: 'Entrega da frota de 40 ônibus biarticulados com Wi-Fi e ar', department: 'Sec. de Transportes' },
      { second: 45, label: 'Ativação dos semáforos inteligentes com prioridade de onda verde para o BRT', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: '18km de BRT, 40 biarticulados, tempo de viagem cai pela metade, satisfação dos usuários sobe para 88%.',
    riskFactor: 'Baixo',
  },

  // ==========================================
  // 8. GRANDES MEGAPROJETOS & OBRAS ESTRUTURANTES (ALTO CUSTO)
  // ==========================================
  {
    id: 'complexo_hospitalar_oncologico',
    title: 'Mega Complexo Hospitalar Universitário & Centro Oncológico',
    category: 'servicos_publicos',
    categoryLabel: 'Serviços Públicos',
    badge: '🏥 Alta Complexidade',
    shortDesc: 'Hospital de 450 leitos, centro oncológico, hemodiálise e heliponto para zerar filas regionais.',
    fullDesc:
      'A maior obra hospitalar da história do município. Transforma a cidade em polo médico de referência, atrai 400 médicos especialistas, enfermeiros e pesquisadores, salvando milhares de vidas e aliviando a rede SUS de 15 municípios vizinhos.',
    cost: 5800000,
    durationMs: 30000,
    requirements: {
      minTreasury: 5800000,
      minPopulation: 35000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Licitação internacional e aprovação do projeto no Ministério da Saúde e ANVISA', department: 'Sec. de Saúde' },
      { second: 8, label: 'Concretagem das torres de internação, centros cirúrgicos e heliponto', department: 'Sec. de Obras' },
      { second: 16, label: 'Instalação de aceleradores lineares para radioterapia e 60 leitos de UTI', department: 'Equipamentos Médicos' },
      { second: 24, label: 'Inauguração do complexo e integração com a faculdade de medicina', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Saúde municipal atinge nível de excelência (+45%), atrai 6.000 moradores de classe média e alta, mas gera custo mensal de manutenção de R$ 60k/mês.',
    riskFactor: 'Médio',
  },
  {
    id: 'anel_viario_metropolitano',
    title: 'Anel Viário Perimetral & Viadutos Estaiados de Ligação Regional',
    category: 'desenvolvimento_economico',
    categoryLabel: 'Desenvolvimento Econômico',
    badge: '🛣️ Anel Viário 42km',
    shortDesc: '42km de rodovia duplicada contornando a cidade para desviar caminhões pesados e interligar indústrias.',
    fullDesc:
      'Retira mais de 5.000 carretas diárias do centro urbano. Cria novos eixos de desenvolvimento imobiliário e logístico, reduz acidentes fatais em 70% e conecta o distrito fabril às rodovias federais com viadutos modernos e iluminação 100% solar.',
    cost: 7200000,
    durationMs: 30000,
    requirements: {
      minTreasury: 7200000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Desapropriação da faixa de domínio e licenciamento ambiental estadual', department: 'Procuradoria Geral' },
      { second: 8, label: 'Terraplanagem pesada e estaqueamento das pontes e viadutos estaiados', department: 'Sec. de Infraestrutura' },
      { second: 16, label: 'Pavimentação em asfalto polímero de alta durabilidade e praças de pesagem', department: 'Consórcio Viário' },
      { second: 24, label: 'Liberação do tráfego expresso e inauguração dos arcos perimetrais', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Infraestrutura +35%, gera 2.800 empregos logísticos, atrai grandes transportadoras e arrecadação de ISS salta +R$ 140k/mês.',
    riskFactor: 'Baixo',
  },
  {
    id: 'aeroporto_cargas_internacional',
    title: 'Aeroporto Regional de Cargas & Terminal Internacional de Passageiros',
    category: 'desenvolvimento_economico',
    categoryLabel: 'Desenvolvimento Econômico',
    badge: '✈️ Aeroporto & Logística',
    shortDesc: 'Pista de 3.200m para cargueiros Boeing 777, terminal de passageiros e alfândega da Receita Federal.',
    fullDesc:
      'Coloca a cidade na rota internacional de comércio e turismo. Permite exportação direta de produtos agrícolas e industriais sem depender da capital. Atrai voos diários de grandes companhias e milhares de empresários e turistas.',
    cost: 11500000,
    durationMs: 30000,
    requirements: {
      minTreasury: 11500000,
      minPopulation: 40000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Homologação na ANAC, DECEA e Receita Federal para terminal alfandegado', department: 'ANAC / Ministério dos Portos' },
      { second: 8, label: 'Construção da pista de pouso para aeronaves de grande porte e pistas de táxi', department: 'Engenharia Aeronáutica' },
      { second: 16, label: 'Ereção do terminal de passageiros climatizado e galpões de carga refrigerada', department: 'Consórcio Aeroportuário' },
      { second: 24, label: 'Pouso inaugural de aeronave comercial e início das operações alfandegadas', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Turismo +4.000/mês, gera 4.200 empregos, novas receitas de tarifas e ISS aeroportuário (+R$ 260k/mês), com despesa operacional de R$ 75k/mês.',
    riskFactor: 'Médio',
  },
  {
    id: 'parque_tecnologico_ia_aeroespacial',
    title: 'Mega Parque Tecnológico, Inteligência Artificial & Supercomputação',
    category: 'desenvolvimento_economico',
    categoryLabel: 'Desenvolvimento Econômico',
    badge: '💻 Vale do Silício Local',
    shortDesc: 'Campus de inovação para data centers de IA, empresas de software, aeroespacial e nanotecnologia.',
    fullDesc:
      'Concede incentivos fiscais para fixar os cérebros mais brilhantes da região. Cria incubadoras de unicórnios, laboratórios de IA e robótica. Multiplica os salários médios da cidade e atrai a instalação de multinacionais com empregos que pagam mais de R$ 15.000.',
    cost: 8900000,
    durationMs: 30000,
    requirements: {
      minTreasury: 8900000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Criação do marco legal de inovação municipal e zona franca de tecnologia', department: 'Sec. de Ciência & Tecnologia' },
      { second: 8, label: 'Instalação de rede de fibra óptica quântica redundante e subestação dedicada', department: 'Telebrás / Infra TI' },
      { second: 16, label: 'Construção do edifício inteligente do supercomputador e centro de pesquisa', department: 'Parque Tecnológico' },
      { second: 24, label: 'Instalação das primeiras 45 startups e empresas de alta tecnologia', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Explosão de arrecadação do ISS digital e IPTU de classes ricas (+R$ 210k/mês), 3.500 empregos de elite, com despesa mensal de fomento de R$ 55k/mês.',
    riskFactor: 'Baixo',
  },
  {
    id: 'macrodrenagem_subterranea_inundacoes',
    title: 'Macro-Drenagem Pluvial Subterrânea & Pôlderes Contra Enchentes',
    category: 'servicos_publicos',
    categoryLabel: 'Serviços Públicos',
    badge: '🌊 Blindagem Anti-Enchente',
    shortDesc: 'Piscinões subterrâneos com bombas de alta vazão e canalização de rios para zerar inundações por 50 anos.',
    fullDesc:
      'Obras monumentais de engenharia civil que passam por debaixo de avenidas e bairros. Acaba definitivamente com o terror das enchentes nos períodos de tempestades tropicais, valorizando imóveis residenciais e eliminando perdas do comércio.',
    cost: 4900000,
    durationMs: 30000,
    requirements: {
      minTreasury: 4900000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Estudo hidrológico de bacia hidrográfica e modelagem 3D de cheias centenárias', department: 'Defesa Civil / ANA' },
      { second: 8, label: 'Escavação dos piscinões subterrâneos de contenção de até 150 milhões de litros', department: 'Sec. de Obras' },
      { second: 16, label: 'Instalação das comportas automatizadas e bombas de drenagem de alta pressão', department: 'Engenharia Hídrica' },
      { second: 24, label: 'Conexão das galerias e testes de escoamento no primeiro temporal do ano', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Zera riscos de inundações, valorização imobiliária geral de +18%, aprovação popular sobe +20%, custo de bombeamento de R$ 35k/mês.',
    riskFactor: 'Baixo',
  },
  {
    id: 'termeletrica_gas_natural',
    title: 'Complexo de Geração a Gás Natural & Transição Energética (250 MW)',
    category: 'recursos_naturais',
    categoryLabel: 'Recursos Naturais',
    badge: '⚡ Usina Termelétrica',
    shortDesc: 'Usina termelétrica de ciclo combinado a gás de 250 MW para autossuficiência e venda ao SIN.',
    fullDesc:
      'Conecta-se diretamente aos gasodutos municipais e bacias de gás. Gera energia elétrica confiável sem risco de apagões na estiagem. O excedente produzido é vendido para a rede elétrica nacional (SIN), garantindo faturamento mensal de milhões para a prefeitura.',
    cost: 9800000,
    durationMs: 30000,
    requirements: {
      minTreasury: 9800000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Leilão de energia na ANEEL e outorga da ONS para injeção no SIN', department: 'ANEEL / MME' },
      { second: 8, label: 'Instalação das turbinas de alta eficiência e geradores de ciclo combinado', department: 'Consórcio Térmico' },
      { second: 16, label: 'Construção da linha de transmissão de alta tensão e subestação elevadora', department: 'Sec. de Energia' },
      { second: 24, label: 'Sincronização com o Sistema Interligado Nacional e início do despacho contínuo', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Produção de energia sobe +250 MW, gerando R$ 220.000/mês líquidos com venda de excedente, despesa de manutenção de R$ 80k/mês.',
    riskFactor: 'Baixo',
  },
  {
    id: 'expansao_metro_linha2_tatuzao',
    title: 'Expansão da Linha 2 do Metrô Subterrâneo & Túneis Shield (Tatuzão)',
    category: 'habitacao_mobilidade',
    categoryLabel: 'Habitação & Mobilidade',
    badge: '🚇 Metrô Linha 2',
    shortDesc: '12km de novas linhas subterrâneas com 8 estações com escadas rolantes e trens autônomos.',
    fullDesc:
      'A maior obra metroviária já executada. Utiliza escavadeira Shield (Tatuzão) para perfurar túneis sem interditar as vias da superfície. Transporta 140 mil pessoas por dia, interligando a periferia aos centros financeiros e polos hospitalares.',
    cost: 14500000,
    durationMs: 30000,
    requirements: {
      minTreasury: 14500000,
      minPopulation: 45000,
    },
    bureaucracyPhases: [
      { second: 0, label: 'Descida da tuneladora Shield (Tatuzão) no poço de embocadura', department: 'Consórcio Metroviário' },
      { second: 8, label: 'Escavação dos 12km de túneis e assentamento dos anéis de concreto', department: 'Companhia do Metrô' },
      { second: 16, label: 'Montagem dos sistemas de sinalização CBTC e teste dos trens climatizados', department: 'Sec. de Transportes' },
      { second: 24, label: 'Viagem inaugural com autoridades e abertura das 8 novas estações', department: 'Gabinete do Prefeito' },
    ],
    expectedOutcome: 'Infraestrutura atinge 98%, tempo de viagem cai 70%, gera R$ 180k/mês em bilhetagem e publicidade, com despesa de manutenção e tração de R$ 95k/mês.',
    riskFactor: 'Baixo',
  },
];

export const MUNICIPAL_ACTIONS: MunicipalActionDef[] = RAW_MUNICIPAL_ACTIONS.map((action) => {
  const durationMs = 30 * 1000; // 30 segundos oficiais para todos os despachos
  const phases = [
    { second: 0, label: action.bureaucracyPhases[0]?.label || 'Abertura do processo e licitação oficial', department: action.bureaucracyPhases[0]?.department || 'Sec. Municipal' },
    { second: 8, label: action.bureaucracyPhases[1]?.label || 'Mobilização técnica e contratação', department: action.bureaucracyPhases[1]?.department || 'Corpo Técnico' },
    { second: 16, label: action.bureaucracyPhases[2]?.label || 'Execução estrutural e vistorias de campo', department: action.bureaucracyPhases[2]?.department || 'Fiscalização' },
    { second: 24, label: action.bureaucracyPhases[3]?.label || 'Homologação e publicação no Diário Oficial', department: 'Gabinete do Prefeito' },
  ];

  return {
    ...action,
    durationMs,
    bureaucracyPhases: phases,
  };
});
