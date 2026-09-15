import React, { useState, useEffect } from 'react';
import {
  Building2,
  Lock,
  User,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Vote,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { PrefeitoCityState } from '../../types/textGame';
import {
  loginAccount,
  registerAccount,
  getAllRegisteredAccounts,
  getCurrentUser,
  purgeAllLegacyData,
  deleteAccountByUsername,
  MayorAccount,
} from '../../utils/userAuth';
import { PRESET_PARTIES, GOVERNMENT_FOCUSES } from '../../utils/mayorProfiles';
import { sounds } from '../../audio/soundManager';

interface MayorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: PrefeitoCityState;
  onSelectProfile: (state: PrefeitoCityState, profileId: string) => void;
  initialTab?: 'login' | 'novo' | 'gerenciar';
}

export const MayorAuthModal: React.FC<MayorAuthModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onSelectProfile,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'novo' | 'gerenciar'>(initialTab);

  // Login Form
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register Form
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [titlePrefix, setTitlePrefix] = useState<'Prefeito' | 'Prefeita' | 'Dr.' | 'Dra.' | 'Nenhum'>('Prefeito');
  const [mayorNameInput, setMayorNameInput] = useState('');
  const [cityNameInput, setCityNameInput] = useState('');
  const [selectedPartyAcronym, setSelectedPartyAcronym] = useState('PSD');
  const [selectedFocus, setSelectedFocus] = useState('equilibrio');

  // Accounts list
  const [accounts, setAccounts] = useState<MayorAccount[]>(() => getAllRegisteredAccounts());
  const [currentUser, setCurrentUserState] = useState<MayorAccount | null>(() => getCurrentUser());

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAccounts(getAllRegisteredAccounts());
      setCurrentUserState(getCurrentUser());
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = loginAccount(loginUser, loginPass);
    if (!res.success || !res.account) {
      sounds.playAlert();
      setErrorMessage(res.error || 'Erro ao efetuar login.');
      return;
    }

    sounds.playSuccess();
    setSuccessMessage(`Login realizado com sucesso! Bem-vindo(a), ${res.account.mayorName}!`);
    onSelectProfile(res.account.state, res.account.username);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPass !== regPassConfirm) {
      sounds.playAlert();
      setErrorMessage('As senhas digitadas não coincidem. Verifique e tente novamente.');
      return;
    }

    const partyFound = PRESET_PARTIES.find((p) => p.acronym === selectedPartyAcronym);
    const fullParty = partyFound ? `${partyFound.acronym} - ${partyFound.name}` : 'PSD - Partido Social do Desenvolvimento';

    const res = registerAccount({
      username: regUser,
      password: regPass,
      titlePrefix,
      mayorName: mayorNameInput,
      cityName: cityNameInput,
      party: fullParty,
      partyAcronym: selectedPartyAcronym,
      governmentFocus: selectedFocus,
    });

    if (!res.success || !res.account) {
      sounds.playAlert();
      setErrorMessage(res.error || 'Erro ao criar conta.');
      return;
    }

    sounds.playFanfare();
    setSuccessMessage(`Conta criada com sucesso! Gabinete de ${res.account.mayorName} empossado em ${res.account.cityName}!`);
    setAccounts(getAllRegisteredAccounts());
    onSelectProfile(res.account.state, res.account.username);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handlePurgeAll = async () => {
    if (
      !window.confirm(
        'Tem certeza que deseja excluir todos os cadastros anteriores? Isso limpará contas antigas e dados de teste, deixando o jogo pronto para você e a Laís entrarem.'
      )
    ) {
      return;
    }

    sounds.playCash();
    purgeAllLegacyData();
    // Also notify server
    try {
      await fetch('/api/auth/purge-all', { method: 'POST' });
    } catch (e) {}

    setAccounts([]);
    setCurrentUserState(null);
    setSuccessMessage('Todos os cadastros anteriores e dados de teste foram excluídos com sucesso! Crie sua conta agora.');
    setActiveTab('novo');
  };

  const handleDeleteSingleAccount = (username: string) => {
    if (!window.confirm(`Excluir o cadastro de "${username}"?`)) return;
    deleteAccountByUsername(username);
    setAccounts(getAllRegisteredAccounts());
    setCurrentUserState(getCurrentUser());
    sounds.playClick();
  };

  const handleQuickFillLogin = (acc: MayorAccount) => {
    sounds.playClick();
    setLoginUser(acc.username);
    setLoginPass('');
    setActiveTab('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Acesso ao Gabinete Municipal
              </h2>
              <p className="text-xs text-slate-400">
                Sistema Oficial de Login, Cadastro & Multijogador Online
              </p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-3 bg-slate-950 border-b border-slate-800 p-1.5 gap-1.5 text-xs font-bold">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'login'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar (Login)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('novo');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'novo'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Conta</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('gerenciar');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'gerenciar'
                ? 'bg-sky-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Contas & Limpeza</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 bg-rose-950/80 border border-rose-500/80 text-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-5 mt-4 p-3 bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: ENTRAR COM LOGIN E SENHA */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Usuário / Login
              </label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Ex: cassio ou lais"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showLoginPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Digite sua senha cadastrada"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar no Gabinete Municipal</span>
            </button>

            {/* Cadastros Existentes para Acesso Rápido */}
            {accounts.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Contas Salvas neste Aparelho:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {accounts.map((acc) => (
                    <div
                      key={acc.username}
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-2 rounded-lg flex items-center justify-between text-xs transition-colors"
                    >
                      <div
                        onClick={() => handleQuickFillLogin(acc)}
                        className="cursor-pointer flex-1 flex items-center gap-2"
                      >
                        <span className="font-bold text-amber-300">@{acc.username}</span>
                        <span className="text-slate-400">• {acc.mayorName}</span>
                        <span className="text-emerald-400 font-medium">({acc.cityName})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickFillLogin(acc)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-[11px]"
                      >
                        Usar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('novo');
                }}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                Ainda não tem cadastro? Clique aqui para criar seu Prefeito e Cidade
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CRIAR NOVA CONTA & POSSE */}
        {activeTab === 'novo' && (
          <form onSubmit={handleRegisterSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Login e Senha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Login / Usuário
                </label>
                <input
                  type="text"
                  value={regUser}
                  onChange={(e) => setRegUser(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="Ex: cassio ou lais"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  required
                />
                <span className="text-[10px] text-slate-500">Sem espaços (ex: cassio, lais)</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Mínimo 3 dígitos"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 pr-8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type={showRegPass ? 'text' : 'password'}
                  value={regPassConfirm}
                  onChange={(e) => setRegPassConfirm(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>
            </div>

            {/* Dados do Prefeito(a) e Cidade */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Título
                  </label>
                  <select
                    value={titlePrefix}
                    onChange={(e: any) => setTitlePrefix(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Prefeito">Prefeito</option>
                    <option value="Prefeita">Prefeita</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Dra.">Dra.</option>
                    <option value="Nenhum">Nenhum</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Nome do(a) Prefeito(a)
                  </label>
                  <input
                    type="text"
                    value={mayorNameInput}
                    onChange={(e) => setMayorNameInput(e.target.value)}
                    placeholder="Ex: Cássio Kenji ou Laís"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Nome do Município
                </label>
                <input
                  type="text"
                  value={cityNameInput}
                  onChange={(e) => setCityNameInput(e.target.value)}
                  placeholder="Ex: Ratolândia ou Cidade da Laís"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              {/* Escolha do Partido Político */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5 text-emerald-400" />
                  Partido Político
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {PRESET_PARTIES.map((party) => (
                    <button
                      key={party.acronym}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedPartyAcronym(party.acronym);
                      }}
                      className={`p-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between ${
                        selectedPartyAcronym === party.acronym
                          ? 'border-emerald-500 bg-emerald-950/70 text-emerald-200 font-bold shadow'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-black text-xs block">{party.acronym}</span>
                      <span className="text-[10px] text-slate-500 truncate">{party.ideology}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Foco de Governo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Foco Inicial da Gestão
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOVERNMENT_FOCUSES.map((focus) => (
                    <button
                      key={focus.id}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedFocus(focus.id);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                        selectedFocus === focus.id
                          ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold block text-slate-200">{focus.label}</span>
                      <span className="text-[10px] text-slate-400">{focus.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Building className="w-4 h-4" />
              <span>Criar Conta & Tomar Posse Municipal</span>
            </button>
          </form>
        )}

        {/* TAB 3: GERENCIAR & LIMPEZA DE DADOS */}
        {activeTab === 'gerenciar' && (
          <div className="p-5 space-y-5">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                Sessão Atualmente Conectada
              </h3>
              {currentUser ? (
                <div className="mt-2 text-xs space-y-1 text-slate-300">
                  <p>
                    <strong>Usuário:</strong> @{currentUser.username}
                  </p>
                  <p>
                    <strong>Prefeito(a):</strong> {currentUser.mayorName}
                  </p>
                  <p>
                    <strong>Município:</strong> {currentUser.cityName}
                  </p>
                  <p>
                    <strong>Partido:</strong> {currentUser.party}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1">Nenhum prefeito autenticado no momento.</p>
              )}
            </div>

            {/* Limpeza de Cadastros Anteriores Solicitada */}
            <div className="bg-rose-950/40 border-2 border-rose-600/60 p-4 rounded-xl">
              <h3 className="text-sm font-black text-rose-300 mb-1 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                Excluir Todos os Cadastros Anteriores
              </h3>
              <p className="text-xs text-rose-200/80 mb-3 leading-relaxed">
                Remove completamente todas as contas antigas, saves de teste anteriores (como &quot;Porto da Aliança&quot;) e zera as salas multijogador, permitindo que você e a Laís iniciem com dados 100% limpos e sincronizados.
              </p>
              <button
                type="button"
                onClick={handlePurgeAll}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-lg shadow transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirmar Exclusão de Todos os Cadastros Anteriores</span>
              </button>
            </div>

            {/* Lista de Contas Registradas para exclusão individual */}
            {accounts.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Excluir Conta Individual:
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {accounts.map((acc) => (
                    <div
                      key={acc.username}
                      className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">@{acc.username}</span>
                        <span className="text-slate-400 ml-2">({acc.mayorName} - {acc.cityName})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSingleAccount(acc.username)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 rounded"
                        title="Excluir este cadastro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
