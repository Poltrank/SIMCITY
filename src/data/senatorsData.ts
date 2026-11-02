import { PresidentialLegislationItem } from '../types/textGame';

export interface Senator {
  id: string;
  name: string;
  gender: 'M' | 'F';
  party: string;
  stateUF: string;
  region: 'Sudeste' | 'Sul' | 'Nordeste' | 'Centro-Oeste' | 'Norte';
  alignment: 'base_governo' | 'centrao' | 'oposicao';
  ideology: 'esquerda' | 'centro-esquerda' | 'centro' | 'centro-direita' | 'direita' | 'liberal' | 'conservador';
  profile:
    | 'Bancada Ruralista'
    | 'Bancada Evangélica'
    | 'Sindicalista / Social'
    | 'Liberal Econômico'
    | 'Centrão Pragmático'
    | 'Legalista & Segurança'
    | 'Ambientalista'
    | 'Desenvolvimentista';
  influence: number; // 1 to 10
  seatNumber: number; // 1 to 50
  avatarBg: string;
}

export interface SenatorVoteRecord {
  vote: 'sim' | 'nao' | 'abstencao';
  quote: string;
}

export interface PlenaryVoteResult {
  lawId: string;
  lawTitle: string;
  lawNumber: string;
  lawType: 'lei' | 'pec' | 'decreto';
  totalSenators: number; // 50
  votesSim: number;
  votesNao: number;
  votesAbstencao: number;
  requiredVotes: number; // 26 para Lei (maioria simples), 30 para PEC (3/5)
  approved: boolean;
  senatorVotes: Record<string, SenatorVoteRecord>;
  timestamp: number;
}

export const SENATORS_50: Senator[] = [
  // 1-10: Sudeste & Grandes Bancadas
  {
    id: 'sen_1',
    name: 'Jaques Wagner',
    gender: 'M',
    party: 'PT',
    stateUF: 'BA',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'esquerda',
    profile: 'Desenvolvimentista',
    influence: 9,
    seatNumber: 1,
    avatarBg: 'bg-red-600',
  },
  {
    id: 'sen_2',
    name: 'Rogério Marinho',
    gender: 'M',
    party: 'PL',
    stateUF: 'RN',
    region: 'Nordeste',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Liberal Econômico',
    influence: 9,
    seatNumber: 2,
    avatarBg: 'bg-blue-700',
  },
  {
    id: 'sen_3',
    name: 'Simone Tebet',
    gender: 'F',
    party: 'MDB',
    stateUF: 'MS',
    region: 'Centro-Oeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Liberal Econômico',
    influence: 9,
    seatNumber: 3,
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'sen_4',
    name: 'Sergio Moro',
    gender: 'M',
    party: 'UNIÃO',
    stateUF: 'PR',
    region: 'Sul',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Legalista & Segurança',
    influence: 8,
    seatNumber: 4,
    avatarBg: 'bg-indigo-700',
  },
  {
    id: 'sen_5',
    name: 'Renan Calheiros',
    gender: 'M',
    party: 'MDB',
    stateUF: 'AL',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 9,
    seatNumber: 5,
    avatarBg: 'bg-emerald-700',
  },
  {
    id: 'sen_6',
    name: 'Damares Alves',
    gender: 'F',
    party: 'REPUBLICANOS',
    stateUF: 'DF',
    region: 'Centro-Oeste',
    alignment: 'oposicao',
    ideology: 'conservador',
    profile: 'Bancada Evangélica',
    influence: 8,
    seatNumber: 6,
    avatarBg: 'bg-sky-700',
  },
  {
    id: 'sen_7',
    name: 'Flávio Bolsonaro',
    gender: 'M',
    party: 'PL',
    stateUF: 'RJ',
    region: 'Sudeste',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Liberal Econômico',
    influence: 9,
    seatNumber: 7,
    avatarBg: 'bg-blue-800',
  },
  {
    id: 'sen_8',
    name: 'Paulo Paim',
    gender: 'M',
    party: 'PT',
    stateUF: 'RS',
    region: 'Sul',
    alignment: 'base_governo',
    ideology: 'esquerda',
    profile: 'Sindicalista / Social',
    influence: 8,
    seatNumber: 8,
    avatarBg: 'bg-red-700',
  },
  {
    id: 'sen_9',
    name: 'Tereza Cristina',
    gender: 'F',
    party: 'PP',
    stateUF: 'MS',
    region: 'Centro-Oeste',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Bancada Ruralista',
    influence: 9,
    seatNumber: 9,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_10',
    name: 'Randolfe Rodrigues',
    gender: 'M',
    party: 'PT',
    stateUF: 'AP',
    region: 'Norte',
    alignment: 'base_governo',
    ideology: 'centro-esquerda',
    profile: 'Ambientalista',
    influence: 8,
    seatNumber: 10,
    avatarBg: 'bg-red-600',
  },

  // 11-20: Sudeste & Sul
  {
    id: 'sen_11',
    name: 'Astronauta Marcos Pontes',
    gender: 'M',
    party: 'PL',
    stateUF: 'SP',
    region: 'Sudeste',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Desenvolvimentista',
    influence: 7,
    seatNumber: 11,
    avatarBg: 'bg-blue-600',
  },
  {
    id: 'sen_12',
    name: 'Mara Gabrilli',
    gender: 'F',
    party: 'PSD',
    stateUF: 'SP',
    region: 'Sudeste',
    alignment: 'centrao',
    ideology: 'centro',
    profile: 'Sindicalista / Social',
    influence: 7,
    seatNumber: 12,
    avatarBg: 'bg-amber-500',
  },
  {
    id: 'sen_13',
    name: 'Romário Faria',
    gender: 'M',
    party: 'PL',
    stateUF: 'RJ',
    region: 'Sudeste',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Centrão Pragmático',
    influence: 8,
    seatNumber: 13,
    avatarBg: 'bg-blue-600',
  },
  {
    id: 'sen_14',
    name: 'Carlos Portinho',
    gender: 'M',
    party: 'PL',
    stateUF: 'RJ',
    region: 'Sudeste',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Liberal Econômico',
    influence: 7,
    seatNumber: 14,
    avatarBg: 'bg-blue-700',
  },
  {
    id: 'sen_15',
    name: 'Cleitinho Azevedo',
    gender: 'M',
    party: 'REPUBLICANOS',
    stateUF: 'MG',
    region: 'Sudeste',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Liberal Econômico',
    influence: 8,
    seatNumber: 15,
    avatarBg: 'bg-sky-600',
  },
  {
    id: 'sen_16',
    name: 'Rodrigo Pacheco',
    gender: 'M',
    party: 'PSD',
    stateUF: 'MG',
    region: 'Sudeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 10,
    seatNumber: 16,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_17',
    name: 'Fabiano Contarato',
    gender: 'M',
    party: 'PT',
    stateUF: 'ES',
    region: 'Sudeste',
    alignment: 'base_governo',
    ideology: 'esquerda',
    profile: 'Legalista & Segurança',
    influence: 7,
    seatNumber: 17,
    avatarBg: 'bg-red-600',
  },
  {
    id: 'sen_18',
    name: 'Magno Malta',
    gender: 'M',
    party: 'PL',
    stateUF: 'ES',
    region: 'Sudeste',
    alignment: 'oposicao',
    ideology: 'conservador',
    profile: 'Bancada Evangélica',
    influence: 7,
    seatNumber: 18,
    avatarBg: 'bg-blue-800',
  },
  {
    id: 'sen_19',
    name: 'Esperidião Amin',
    gender: 'M',
    party: 'PP',
    stateUF: 'SC',
    region: 'Sul',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Desenvolvimentista',
    influence: 8,
    seatNumber: 19,
    avatarBg: 'bg-amber-700',
  },
  {
    id: 'sen_20',
    name: 'Jorge Seif',
    gender: 'M',
    party: 'PL',
    stateUF: 'SC',
    region: 'Sul',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Liberal Econômico',
    influence: 7,
    seatNumber: 20,
    avatarBg: 'bg-blue-700',
  },

  // 21-30: Sul, Centro-Oeste & Nordeste
  {
    id: 'sen_21',
    name: 'Hamilton Mourão',
    gender: 'M',
    party: 'REPUBLICANOS',
    stateUF: 'RS',
    region: 'Sul',
    alignment: 'oposicao',
    ideology: 'conservador',
    profile: 'Legalista & Segurança',
    influence: 8,
    seatNumber: 21,
    avatarBg: 'bg-sky-800',
  },
  {
    id: 'sen_22',
    name: 'Luis Carlos Heinze',
    gender: 'M',
    party: 'PP',
    stateUF: 'RS',
    region: 'Sul',
    alignment: 'centrao',
    ideology: 'direita',
    profile: 'Bancada Ruralista',
    influence: 7,
    seatNumber: 22,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_23',
    name: 'Oriovisto Guimarães',
    gender: 'M',
    party: 'PODEMOS',
    stateUF: 'PR',
    region: 'Sul',
    alignment: 'centrao',
    ideology: 'liberal',
    profile: 'Liberal Econômico',
    influence: 7,
    seatNumber: 23,
    avatarBg: 'bg-cyan-700',
  },
  {
    id: 'sen_24',
    name: 'Flávio Arns',
    gender: 'M',
    party: 'PSB',
    stateUF: 'PR',
    region: 'Sul',
    alignment: 'base_governo',
    ideology: 'centro-esquerda',
    profile: 'Sindicalista / Social',
    influence: 6,
    seatNumber: 24,
    avatarBg: 'bg-yellow-600',
  },
  {
    id: 'sen_25',
    name: 'Vanderlan Cardoso',
    gender: 'M',
    party: 'PSD',
    stateUF: 'GO',
    region: 'Centro-Oeste',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Liberal Econômico',
    influence: 8,
    seatNumber: 25,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_26',
    name: 'Jorge Kajuru',
    gender: 'M',
    party: 'PSB',
    stateUF: 'GO',
    region: 'Centro-Oeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Sindicalista / Social',
    influence: 7,
    seatNumber: 26,
    avatarBg: 'bg-yellow-600',
  },
  {
    id: 'sen_27',
    name: 'Jayme Campos',
    gender: 'M',
    party: 'UNIÃO',
    stateUF: 'MT',
    region: 'Centro-Oeste',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Bancada Ruralista',
    influence: 8,
    seatNumber: 27,
    avatarBg: 'bg-indigo-600',
  },
  {
    id: 'sen_28',
    name: 'Wellington Fagundes',
    gender: 'M',
    party: 'PL',
    stateUF: 'MT',
    region: 'Centro-Oeste',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Bancada Ruralista',
    influence: 7,
    seatNumber: 28,
    avatarBg: 'bg-blue-700',
  },
  {
    id: 'sen_29',
    name: 'Soraya Thronicke',
    gender: 'F',
    party: 'PODEMOS',
    stateUF: 'MS',
    region: 'Centro-Oeste',
    alignment: 'centrao',
    ideology: 'liberal',
    profile: 'Liberal Econômico',
    influence: 7,
    seatNumber: 29,
    avatarBg: 'bg-cyan-600',
  },
  {
    id: 'sen_30',
    name: 'Leila Barros (Leila do Vôlei)',
    gender: 'F',
    party: 'PDT',
    stateUF: 'DF',
    region: 'Centro-Oeste',
    alignment: 'base_governo',
    ideology: 'centro-esquerda',
    profile: 'Sindicalista / Social',
    influence: 7,
    seatNumber: 30,
    avatarBg: 'bg-rose-600',
  },

  // 31-40: Nordeste
  {
    id: 'sen_31',
    name: 'Otto Alencar',
    gender: 'M',
    party: 'PSD',
    stateUF: 'BA',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Desenvolvimentista',
    influence: 8,
    seatNumber: 31,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_32',
    name: 'Angelo Coronel',
    gender: 'M',
    party: 'PSD',
    stateUF: 'BA',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 7,
    seatNumber: 32,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_33',
    name: 'Cid Gomes',
    gender: 'M',
    party: 'PSB',
    stateUF: 'CE',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro-esquerda',
    profile: 'Desenvolvimentista',
    influence: 8,
    seatNumber: 33,
    avatarBg: 'bg-yellow-600',
  },
  {
    id: 'sen_34',
    name: 'Eduardo Girão',
    gender: 'M',
    party: 'NOVO',
    stateUF: 'CE',
    region: 'Nordeste',
    alignment: 'oposicao',
    ideology: 'liberal',
    profile: 'Liberal Econômico',
    influence: 7,
    seatNumber: 34,
    avatarBg: 'bg-orange-600',
  },
  {
    id: 'sen_35',
    name: 'Humberto Costa',
    gender: 'M',
    party: 'PT',
    stateUF: 'PE',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'esquerda',
    profile: 'Sindicalista / Social',
    influence: 8,
    seatNumber: 35,
    avatarBg: 'bg-red-600',
  },
  {
    id: 'sen_36',
    name: 'Teresa Leitão',
    gender: 'F',
    party: 'PT',
    stateUF: 'PE',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'esquerda',
    profile: 'Sindicalista / Social',
    influence: 6,
    seatNumber: 36,
    avatarBg: 'bg-red-500',
  },
  {
    id: 'sen_37',
    name: 'Efraim Filho',
    gender: 'M',
    party: 'UNIÃO',
    stateUF: 'PB',
    region: 'Nordeste',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Liberal Econômico',
    influence: 8,
    seatNumber: 37,
    avatarBg: 'bg-indigo-600',
  },
  {
    id: 'sen_38',
    name: 'Veneziano Vital do Rêgo',
    gender: 'M',
    party: 'MDB',
    stateUF: 'PB',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 7,
    seatNumber: 38,
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'sen_39',
    name: 'Eliziane Gama',
    gender: 'F',
    party: 'PSD',
    stateUF: 'MA',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro-esquerda',
    profile: 'Bancada Evangélica',
    influence: 8,
    seatNumber: 39,
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'sen_40',
    name: 'Weverton Rocha',
    gender: 'M',
    party: 'PDT',
    stateUF: 'MA',
    region: 'Nordeste',
    alignment: 'base_governo',
    ideology: 'centro-esquerda',
    profile: 'Desenvolvimentista',
    influence: 7,
    seatNumber: 40,
    avatarBg: 'bg-rose-600',
  },

  // 41-50: Norte & Amazônia
  {
    id: 'sen_41',
    name: 'Omar Aziz',
    gender: 'M',
    party: 'PSD',
    stateUF: 'AM',
    region: 'Norte',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 9,
    seatNumber: 41,
    avatarBg: 'bg-amber-700',
  },
  {
    id: 'sen_42',
    name: 'Eduardo Braga',
    gender: 'M',
    party: 'MDB',
    stateUF: 'AM',
    region: 'Norte',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Desenvolvimentista',
    influence: 9,
    seatNumber: 42,
    avatarBg: 'bg-emerald-700',
  },
  {
    id: 'sen_43',
    name: 'Jader Barbalho',
    gender: 'M',
    party: 'MDB',
    stateUF: 'PA',
    region: 'Norte',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 8,
    seatNumber: 43,
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'sen_44',
    name: 'Beto Faro',
    gender: 'M',
    party: 'PT',
    stateUF: 'PA',
    region: 'Norte',
    alignment: 'base_governo',
    ideology: 'esquerda',
    profile: 'Sindicalista / Social',
    influence: 7,
    seatNumber: 44,
    avatarBg: 'bg-red-600',
  },
  {
    id: 'sen_45',
    name: 'Davi Alcolumbre',
    gender: 'M',
    party: 'UNIÃO',
    stateUF: 'AP',
    region: 'Norte',
    alignment: 'centrao',
    ideology: 'centro',
    profile: 'Centrão Pragmático',
    influence: 10,
    seatNumber: 45,
    avatarBg: 'bg-indigo-700',
  },
  {
    id: 'sen_46',
    name: 'Confúcio Moura',
    gender: 'M',
    party: 'MDB',
    stateUF: 'RO',
    region: 'Norte',
    alignment: 'base_governo',
    ideology: 'centro',
    profile: 'Desenvolvimentista',
    influence: 7,
    seatNumber: 46,
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'sen_47',
    name: 'Marcos Rogério',
    gender: 'M',
    party: 'PL',
    stateUF: 'RO',
    region: 'Norte',
    alignment: 'oposicao',
    ideology: 'direita',
    profile: 'Legalista & Segurança',
    influence: 8,
    seatNumber: 47,
    avatarBg: 'bg-blue-700',
  },
  {
    id: 'sen_48',
    name: 'Alan Rick',
    gender: 'M',
    party: 'UNIÃO',
    stateUF: 'AC',
    region: 'Norte',
    alignment: 'centrao',
    ideology: 'centro-direita',
    profile: 'Bancada Evangélica',
    influence: 6,
    seatNumber: 48,
    avatarBg: 'bg-indigo-600',
  },
  {
    id: 'sen_49',
    name: 'Dorinha Seabra',
    gender: 'F',
    party: 'UNIÃO',
    stateUF: 'TO',
    region: 'Norte',
    alignment: 'centrao',
    ideology: 'centro',
    profile: 'Sindicalista / Social',
    influence: 7,
    seatNumber: 49,
    avatarBg: 'bg-indigo-600',
  },
  {
    id: 'sen_50',
    name: 'Eduardo Gomes',
    gender: 'M',
    party: 'PL',
    stateUF: 'TO',
    region: 'Norte',
    alignment: 'oposicao',
    ideology: 'centro-direita',
    profile: 'Centrão Pragmático',
    influence: 8,
    seatNumber: 50,
    avatarBg: 'bg-blue-700',
  },
];

// SIMULADOR DE VOTAÇÃO NO SENADO
export function simulateSenatorsVote(
  law: PresidentialLegislationItem,
  congressSupport: number, // 0 a 100%
  approvalRating: number, // 0 a 100%
  presidentialParty = 'PSD'
): PlenaryVoteResult {
  let votesSim = 0;
  let votesNao = 0;
  let votesAbstencao = 0;
  const senatorVotes: Record<string, SenatorVoteRecord> = {};

  // Quórum:
  // Lei Ordinária/Complementar: Maioria Simples (26 de 50 votos)
  // PEC: 3/5 Qualificado (30 de 50 votos)
  const isPec = law.type === 'pec';
  const requiredVotes = isPec ? 30 : 26;

  // Law properties
  const theme = law.theme;
  const isExpansive = (law.impacts.monthlyExpenseReduction || 0) < 0; // Gastança
  const isTaxCut = (law.impacts.monthlyRevenueBonus || 0) < 0; // Corte de tributos
  const isJobCreator = (law.impacts.jobsCreated || 0) > 500;
  const isExportFostering = (law.impacts.exportBonusPercent || 0) > 0;
  const highPopularityBonus = approvalRating >= 60;
  const lowPopularityPenalty = approvalRating < 40;

  SENATORS_50.forEach((senator) => {
    let probabilitySim = 50; // base 50%

    // 1. Alinhamento Político Base
    if (senator.alignment === 'base_governo') {
      probabilitySim += 35; // base aliada é muito propensa a votar sim
      if (congressSupport >= 60) probabilitySim += 10;
    } else if (senator.alignment === 'centrao') {
      probabilitySim += (congressSupport - 50) * 0.8; // Centrão responde à articulação
      if (highPopularityBonus) probabilitySim += 10;
      if (lowPopularityPenalty) probabilitySim -= 15;
    } else {
      // Oposição
      probabilitySim -= 35;
      if (congressSupport < 45) probabilitySim -= 15;
    }

    // 2. Afinidade Temática & Perfil
    if (senator.profile === 'Bancada Ruralista') {
      if (theme === 'comercio_exterior' || isExportFostering || theme === 'energia_mineracao') {
        probabilitySim += 25;
      }
      if (theme === 'tributaria' && !isTaxCut) {
        probabilitySim -= 20; // Rejeita aumento de tributos
      }
    } else if (senator.profile === 'Liberal Econômico') {
      if (isTaxCut || (law.impacts.monthlyExpenseReduction || 0) > 0) {
        probabilitySim += 30; // Ama corte de impostos e corte de gastos
      }
      if (isExpansive) {
        probabilitySim -= 30; // Odeia aumento de despesas públicas
      }
    } else if (senator.profile === 'Sindicalista / Social') {
      if (theme === 'trabalho_previdencia' || isJobCreator || (law.impacts.approvalChange || 0) > 0) {
        probabilitySim += 30;
      }
      if ((law.impacts.monthlyExpenseReduction || 0) > 40000 && theme === 'trabalho_previdencia') {
        probabilitySim -= 25; // Rejeita corte brusco de benefícios sociais
      }
    } else if (senator.profile === 'Desenvolvimentista') {
      if (isJobCreator || theme === 'infraestrutura_defesa' || theme === 'energia_mineracao') {
        probabilitySim += 25;
      }
    } else if (senator.profile === 'Legalista & Segurança') {
      if (theme === 'infraestrutura_defesa') {
        probabilitySim += 25;
      }
    }

    // Clamp probability
    probabilitySim = Math.min(95, Math.max(5, probabilitySim));

    // Determinar Voto
    const roll = Math.random() * 100;
    let vote: 'sim' | 'nao' | 'abstencao' = 'sim';
    let quote = '';

    if (roll < probabilitySim) {
      vote = 'sim';
      votesSim++;
      const quotesSim = [
        `Pelo desenvolvimento de ${senator.stateUF} e do Brasil, meu voto é SIM!`,
        `Seguindo a orientação da liderança partidária do ${senator.party}, voto SIM!`,
        `Essa matéria traz avanços fundamentais para a nossa nação. Voto favorável!`,
        `O plenário ouve a voz do povo brasileiro. Sim ao ${law.numberStr}!`,
        `Pela responsabilidade com o futuro e o povo de ${senator.stateUF}: SIM!`,
      ];
      quote = quotesSim[Math.floor(Math.random() * quotesSim.length)];
    } else if (roll < probabilitySim + 8) {
      vote = 'abstencao';
      votesAbstencao++;
      quote = `A bancada do ${senator.party} mantém cautela técnica. Declaro abstenção neste momento regimental.`;
    } else {
      vote = 'nao';
      votesNao++;
      const quotesNao = [
        `Esta medida compromete o equilíbrio das contas públicas! Meu voto é NÃO!`,
        `Em respeito aos eleitores de ${senator.stateUF} e aos princípios do ${senator.party}, voto NÃO!`,
        `A matéria carece de amadurecimento e diálogo federativo. Rejeito a proposta!`,
        `A oposição cumpre seu papel fiscalizador. Voto contrário ao ${law.numberStr}!`,
      ];
      quote = quotesNao[Math.floor(Math.random() * quotesNao.length)];
    }

    senatorVotes[senator.id] = { vote, quote };
  });

  const approved = votesSim >= requiredVotes;

  return {
    lawId: law.id,
    lawTitle: law.title,
    lawNumber: law.numberStr,
    lawType: law.type,
    totalSenators: 50,
    votesSim,
    votesNao,
    votesAbstencao,
    requiredVotes,
    approved,
    senatorVotes,
    timestamp: Date.now(),
  };
}
