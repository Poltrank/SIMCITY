import { PrefeitoCityState } from '../types/textGame';
import { createInitialPrefeitoState } from '../simulation/textSimulationEngine';

export interface MayorAccount {
  username: string;
  passwordHash: string;
  titlePrefix: 'Prefeito' | 'Prefeita' | 'Dr.' | 'Dra.' | 'Nenhum';
  mayorName: string;
  cityName: string;
  party: string;
  partyAcronym: string;
  governmentFocus: string;
  createdAt: number;
  lastLogin: number;
  state: PrefeitoCityState;
}

const STORAGE_ACCOUNTS_KEY = 'prefeito_accounts_v2';
const STORAGE_CURRENT_USER_KEY = 'prefeito_current_user_v2';
const CLEANUP_FLAG_KEY = 'prefeito_cleanup_v2_applied';

/**
 * Hash utility for basic client-side credentials
 */
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + password.length;
}

/**
 * Purges all old registrations, test saves, and legacy localStorage keys.
 * Specifically wipes any phantom accounts like "Porto da Aliança" and old unauthenticated saves.
 */
export function purgeAllLegacyData(): void {
  if (typeof window === 'undefined') return;
  try {
    const legacyKeys = [
      'prefeito_registered_profiles_v1',
      'prefeito_active_profile_id_v1',
      'prefeito_identified_mayor_v1',
      'prefeito_persisted_profiles',
      'prefeito_assigned_slot_id',
      'prefeito_player_id',
      'prefeito_mqtt_cid',
      'prefeito_accounts_v1',
    ];

    legacyKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    localStorage.setItem(CLEANUP_FLAG_KEY, 'true');
    console.log('[Auth] All legacy mayoral accounts and test data purged successfully.');
  } catch (err) {
    console.error('[Auth] Error purging legacy data:', err);
  }
}

/**
 * Runs one-time startup cleanup if not already done.
 */
export function ensureInitialCleanup(): void {
  if (typeof window === 'undefined') return;
  try {
    const cleaned = localStorage.getItem(CLEANUP_FLAG_KEY);
    if (!cleaned) {
      purgeAllLegacyData();
    }
  } catch (e) {}
}

export function getAllRegisteredAccounts(): MayorAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    ensureInitialCleanup();
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Auth] Error fetching accounts:', err);
    return [];
  }
}

export function getCurrentUser(): MayorAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    ensureInitialCleanup();
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    const account: MayorAccount = JSON.parse(raw);
    return account;
  } catch (err) {
    console.error('[Auth] Error fetching current user:', err);
    return null;
  }
}

export function setCurrentUser(account: MayorAccount | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!account) {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    } else {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(account));
    }
  } catch (err) {
    console.error('[Auth] Error saving current user:', err);
  }
}

export function registerAccount(params: {
  username: string;
  password: string;
  titlePrefix?: 'Prefeito' | 'Prefeita' | 'Dr.' | 'Dra.' | 'Nenhum';
  mayorName: string;
  cityName: string;
  party: string;
  partyAcronym: string;
  governmentFocus?: string;
}): { success: boolean; account?: MayorAccount; error?: string } {
  const cleanUsername = params.username.trim().toLowerCase();
  const cleanPassword = params.password.trim();

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: 'O nome de usuário deve ter pelo menos 3 caracteres.' };
  }
  if (!cleanPassword || cleanPassword.length < 3) {
    return { success: false, error: 'A senha deve ter pelo menos 3 caracteres.' };
  }
  if (!params.mayorName.trim()) {
    return { success: false, error: 'Informe o nome do(a) Prefeito(a).' };
  }
  if (!params.cityName.trim()) {
    return { success: false, error: 'Informe o nome do Município.' };
  }

  const existingAccounts = getAllRegisteredAccounts();
  if (existingAccounts.some((a) => a.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: `O usuário "${cleanUsername}" já existe. Faça login ou escolha outro nome.` };
  }

  const prefix = params.titlePrefix || 'Prefeito';
  const cleanMayorName = params.mayorName.trim();
  const fullMayorName = prefix === 'Nenhum' ? cleanMayorName : `${prefix} ${cleanMayorName}`;
  const cleanCity = params.cityName.trim();
  const focus = params.governmentFocus || 'equilibrio';

  const initialState = createInitialPrefeitoState({
    mayorName: fullMayorName,
    cityName: cleanCity,
    party: params.party,
    governmentFocus: focus,
  });

  const newAccount: MayorAccount = {
    username: cleanUsername,
    passwordHash: simpleHash(cleanPassword),
    titlePrefix: prefix,
    mayorName: fullMayorName,
    cityName: cleanCity,
    party: params.party,
    partyAcronym: params.partyAcronym,
    governmentFocus: focus,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    state: initialState,
  };

  existingAccounts.push(newAccount);
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(existingAccounts));
  setCurrentUser(newAccount);

  // Sync with server if reachable
  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: cleanUsername,
      password: cleanPassword,
      mayorName: fullMayorName,
      cityName: cleanCity,
      party: params.party,
      state: initialState,
    }),
  }).catch(() => {});

  return { success: true, account: newAccount };
}

export function loginAccount(
  username: string,
  password: string
): { success: boolean; account?: MayorAccount; error?: string } {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername) {
    return { success: false, error: 'Digite seu usuário de login.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Digite sua senha.' };
  }

  const existingAccounts = getAllRegisteredAccounts();
  const matched = existingAccounts.find((a) => a.username.toLowerCase() === cleanUsername);

  if (!matched) {
    return {
      success: false,
      error: `Usuário "${cleanUsername}" não encontrado. Crie uma nova conta no botão abaixo.`,
    };
  }

  const expectedHash = simpleHash(cleanPassword);
  if (matched.passwordHash !== expectedHash) {
    return { success: false, error: 'Senha incorreta. Tente novamente.' };
  }

  matched.lastLogin = Date.now();
  const updatedAccounts = existingAccounts.map((a) => (a.username === matched.username ? matched : a));
  localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  setCurrentUser(matched);

  // Notify server
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
  }).catch(() => {});

  return { success: true, account: matched };
}

export function saveCurrentAccountState(state: PrefeitoCityState): void {
  if (typeof window === 'undefined') return;
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    currentUser.state = state;
    currentUser.cityName = state.cityName;
    currentUser.mayorName = state.mayorName;
    currentUser.party = state.party;
    currentUser.lastLogin = Date.now();

    setCurrentUser(currentUser);

    const accounts = getAllRegisteredAccounts();
    const idx = accounts.findIndex((a) => a.username === currentUser.username);
    if (idx >= 0) {
      accounts[idx] = currentUser;
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  } catch (err) {
    console.error('[Auth] Error updating account state:', err);
  }
}

export const updateCurrentUserState = saveCurrentAccountState;

export function deleteAccountByUsername(username: string): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getAllRegisteredAccounts().filter((a) => a.username !== username);
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));

    const current = getCurrentUser();
    if (current && current.username === username) {
      setCurrentUser(null);
    }
  } catch (err) {
    console.error('[Auth] Error deleting account:', err);
  }
}

export function logoutAccount(): void {
  setCurrentUser(null);
}
