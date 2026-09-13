import { PrefeitoCityState } from '../types/textGame';

export interface PoliticalPartyOption {
  acronym: string;
  name: string;
  ideology: string;
  badgeColor: string;
  textBadgeColor: string;
  motto: string;
}

export const PRESET_PARTIES: PoliticalPartyOption[] = [
  {
    acronym: 'PSD',
    name: 'Partido Social do Desenvolvimento',
    ideology: 'Centro & Gestão Pública Eficiente',
    badgeColor: 'bg-blue-600 border-blue-400',
    textBadgeColor: 'text-blue-400',
    motto: 'Equilíbrio fiscal, atração de investimentos e modernização urbana.',
  },
  {
    acronym: 'PRM',
    name: 'Partido Republicano Municipalista',
    ideology: 'Municipalismo Forte & Ordem Pública',
    badgeColor: 'bg-emerald-600 border-emerald-400',
    textBadgeColor: 'text-emerald-400',
    motto: 'Infraestrutura pesada, apoio às forças de segurança e autonomia das cidades.',
  },
  {
    acronym: 'PTM',
    name: 'Partido Trabalhista Municipal',
    ideology: 'Social & Serviços Públicos Universais',
    badgeColor: 'bg-rose-600 border-rose-400',
    textBadgeColor: 'text-rose-400',
    motto: 'Piso salarial justo, fortalecimento do SUS, educação infantil e passe livre.',
  },
  {
    acronym: 'PLB',
    name: 'Partido Liberal Brasileiro',
    ideology: 'Livre Mercado & Desregulamentação',
    badgeColor: 'bg-amber-600 border-amber-400',
    textBadgeColor: 'text-amber-400',
    motto: 'Corte de burocracia, incentivos fiscais a empresas e privatização de estatais deficitárias.',
  },
  {
    acronym: 'REDE',
    name: 'Rede Cidadã de Sustentabilidade',
    ideology: 'Ecologia Urbana & Transição Energética',
    badgeColor: 'bg-teal-600 border-teal-400',
    textBadgeColor: 'text-teal-400',
    motto: 'Energia solar, proteção de mananciais, saneamento 100% e ecoturismo.',
  },
  {
    acronym: 'NOVO',
    name: 'Movimento Nova Gestão',
    ideology: 'Inovação, Tecnologia & Compliance',
    badgeColor: 'bg-orange-600 border-orange-400',
    textBadgeColor: 'text-orange-400',
    motto: 'Governo digital, transparência total e corte de privilégios na máquina pública.',
  },
];

export const PRESET_CITIES = [
  'Porto da Aliança',
  'Nova Esperança do Sul',
  'Vila dos Pinhais',
  'São Bento das Águas',
  'Costa Dourada',
  'Serra do Sol',
];

export const GOVERNMENT_FOCUSES = [
  {
    id: 'equilibrio',
    label: 'Responsabilidade Fiscal & Poupança',
    desc: 'Foco na Lei de Responsabilidade Fiscal e classificação CAPAG A no BNDES/STN.',
  },
  {
    id: 'industrial',
    label: 'Polo Industrial & Mineração',
    desc: 'Atração de indústrias pesadas, exploração de petróleo e royalties.',
  },
  {
    id: 'social',
    label: 'Saúde SUS & Direitos Sociais',
    desc: 'Valorização dos servidores, piso salarial elevado e correios sociais.',
  },
  {
    id: 'turismo',
    label: 'Turismo Regional & Cultura',
    desc: 'Investimento em balneários, festas populares e parcerias metropolitanas.',
  },
];

export interface MayorProfileRecord {
  id: string;
  mayorName: string;
  party: string;
  partyAcronym: string;
  partyColor?: string;
  cityName: string;
  governmentFocus: string;
  treasury: number;
  population: number;
  termMonth: number;
  year: number;
  lastPlayed: number;
  state: PrefeitoCityState;
}

const STORAGE_PROFILES_KEY = 'prefeito_registered_profiles_v1';
const ACTIVE_PROFILE_KEY = 'prefeito_active_profile_id_v1';

export function getSavedMayorProfiles(): MayorProfileRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading mayor profiles:', err);
    return [];
  }
}

export function saveMayorProfile(profile: MayorProfileRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const profiles = getSavedMayorProfiles();
    const existingIndex = profiles.findIndex((p) => p.id === profile.id);
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.unshift(profile);
    }
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
  } catch (err) {
    console.error('Error saving mayor profile:', err);
  }
}

export function deleteMayorProfile(profileId: string): MayorProfileRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const profiles = getSavedMayorProfiles().filter((p) => p.id !== profileId);
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    const active = getActiveMayorProfileId();
    if (active === profileId) {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
    return profiles;
  } catch (err) {
    console.error('Error deleting mayor profile:', err);
    return [];
  }
}

export function getActiveMayorProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function setActiveMayorProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } catch {}
}
