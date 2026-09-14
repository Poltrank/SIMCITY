import React, { useState } from 'react';
import {
  Building2,
  Award,
  Vote,
  UserCheck,
  UserPlus,
  LogIn,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { PrefeitoCityState } from '../../types/textGame';
import {
  PRESET_PARTIES,
  PRESET_CITIES,
  GOVERNMENT_FOCUSES,
  MayorProfileRecord,
  getSavedMayorProfiles,
  saveMayorProfile,
  deleteMayorProfile,
  setActiveMayorProfileId,
} from '../../utils/mayorProfiles';
import { createInitialPrefeitoState } from '../../simulation/textSimulationEngine';
import { sounds } from '../../audio/soundManager';

interface MayorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: PrefeitoCityState;
  onSelectProfile: (state: PrefeitoCityState, profileId: string) => void;
  initialTab?: 'login' | 'novo' | 'perfil';
}

const RANDOM_MAYOR_NAMES = [
  'Carlos Mendonça',
  'Helena Silveira',
  'Roberto Alencar',
  'Beatriz Nogueira',
  'Fernando Peixoto',
  'Cláudia Ramos',
  'Arthur Guimarães',
  'Mariana Albuquerque',
  'Rodrigo Valadares',
  'Luciana Farias',
];

export const MayorAuthModal: React.FC<MayorAuthModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onSelectProfile,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'novo' | 'perfil'>(initialTab);

  // Form State for Login / New Mayor
  const [titlePrefix, setTitlePrefix] = useState<'Prefeito' | 'Prefeita' | 'Dr.' | 'Dra.' | 'Nenhum'>('Prefeito');
  const [mayorNameInput, setMayorNameInput] = useState(currentState.mayorName || 'Carlos Mendonça');
  const [selectedPartyAcronym, setSelectedPartyAcronym] = useState(() => {
    const found = PRESET_PARTIES.find((p) => currentState.party?.includes(p.acronym));
    return found ? found.acronym : 'PSD';
  });
  const [customPartyAcronym, setCustomPartyAcronym] = useState('');
  const [customPartyName, setCustomPartyName] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentState.cityName || 'Porto da Aliança');
  const [selectedFocus, setSelectedFocus] = useState('equilibrio');

  // Login / Saved profiles state
  const [savedProfiles, setSavedProfiles] = useState<MayorProfileRecord[]>(() => getSavedMayorProfiles());
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRandomizeName = () => {
    sounds.playClick();
    const randomIndex = Math.floor(Math.random() * RANDOM_MAYOR_NAMES.length);
    setMayorNameInput(RANDOM_MAYOR_NAMES[randomIndex]);
  };

  const getFinalMayorFullName = () => {
    const cleanName = mayorNameInput.trim() || 'Gestor Municipal';
    if (titlePrefix === 'Nenhum') return cleanName;
    return `${titlePrefix} ${cleanName}`;
  };

  const getFinalPartyString = () => {
    if (selectedPartyAcronym === 'CUSTOM') {
      const acronym = customPartyAcronym.trim().toUpperCase() || 'PBM';
      const name = customPartyName.trim() || 'Partido Brasileiro Municipalista';
      return `${acronym} - ${name}`;
    }
    const found = PRESET_PARTIES.find((p) => p.acronym === selectedPartyAcronym);
    return found ? `${found.acronym} - ${found.name}` : 'PSD - Partido Social do Desenvolvimento';
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMayorName = getFinalMayorFullName();
    const finalParty = getFinalPartyString();
    const cleanInput = mayorNameInput.trim().toLowerCase();

    // Check if matching saved profile exists
    const matchingProfile = savedProfiles.find(
      (p) =>
        p.mayorName.toLowerCase() === finalMayorName.toLowerCase() ||
        p.mayorName.toLowerCase().includes(cleanInput)
    );

    if (matchingProfile) {
      sounds.playSuccess();
      setActiveMayorProfileId(matchingProfile.id);
      const updated = {
        ...matchingProfile,
        lastPlayed: Date.now(),
      };
      saveMayorProfile(updated);
      onSelectProfile(matchingProfile.state, matchingProfile.id);
      onClose();
      return;
    }

    // Otherwise create and login with this Mayor & Party
    sounds.playFanfare();
    const finalCity = selectedCity.trim() || 'Porto da Aliança';
    const newState = createInitialPrefeitoState({
      mayorName: finalMayorName,
      party: finalParty,
      cityName: finalCity,
      governmentFocus: selectedFocus,
    });

    const newProfile: MayorProfileRecord = {
      id: 'mayor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      mayorName: finalMayorName,
      party: finalParty,
      partyAcronym:
        selectedPartyAcronym === 'CUSTOM'
          ? customPartyAcronym.toUpperCase() || 'PBM'
          : selectedPartyAcronym,
      cityName: finalCity,
      governmentFocus: selectedFocus,
      treasury: newState.treasury,
      population: newState.population,
      termMonth: newState.termMonth,
      year: newState.year,
      lastPlayed: Date.now(),
      state: newState,
    };

    saveMayorProfile(newProfile);
    setSavedProfiles(getSavedMayorProfiles());
    onSelectProfile(newState, newProfile.id);
    onClose();
  };

  const handleCreateNewMayor = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playFanfare();

    const finalMayorName = getFinalMayorFullName();
    const finalParty = getFinalPartyString();
    const finalCity = selectedCity.trim() || 'Porto da Aliança';

    const newState = createInitialPrefeitoState({
      mayorName: finalMayorName,
      party: finalParty,
      cityName: finalCity,
      governmentFocus: selectedFocus,
    });

    const newProfile: MayorProfileRecord = {
      id: 'mayor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      mayorName: finalMayorName,
      party: finalParty,
      partyAcronym:
        selectedPartyAcronym === 'CUSTOM'
          ? customPartyAcronym.toUpperCase() || 'PBM'
          : selectedPartyAcronym,
      cityName: finalCity,
      governmentFocus: selectedFocus,
      treasury: newState.treasury,
      population: newState.population,
      termMonth: newState.termMonth,
      year: newState.year,
      lastPlayed: Date.now(),
      state: newState,
    };

    saveMayorProfile(newProfile);
    setSavedProfiles(getSavedMayorProfiles());
    onSelectProfile(newState, newProfile.id);
    onClose();
  };

  const handleLoadProfile = (profile: MayorProfileRecord) => {
    sounds.playSuccess();
    setActiveMayorProfileId(profile.id);
    const updated = {
      ...profile,
      lastPlayed: Date.now(),
    };
    saveMayorProfile(updated);
    onSelectProfile(profile.state, profile.id);
    onClose();
  };

  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza de que deseja apagar os registros deste mandato municipal?')) {
      sounds.playAlert();
      const updated = deleteMayorProfile(profileId);
      setSavedProfiles(updated);
    }
  };

  const handleImportSave = () => {
    try {
      if (!importJsonText.trim()) return;
      const parsed = JSON.parse(importJsonText.trim());
      if (!parsed.state || !parsed.mayorName) {
        throw new Error('Formato de dados do Gabinete inválido.');
      }
      const importedRecord: MayorProfileRecord = {
        id: 'imported_' + Date.now(),
        mayorName: parsed.mayorName,
        party: parsed.party || 'Independente',
        partyAcronym: parsed.partyAcronym || 'IND',
        cityName: parsed.cityName || parsed.state?.cityName || 'Cidade',
        governmentFocus: parsed.governmentFocus || 'equilibrio',
        treasury: parsed.state?.treasury || 1000000,
        population: parsed.state?.population || 40000,
        termMonth: parsed.state?.termMonth || 1,
        year: parsed.state?.year || 2026,
        lastPlayed: Date.now(),
        state: parsed.state,
      };
      saveMayorProfile(importedRecord);
      setSavedProfiles(getSavedMayorProfiles());
      setShowImportBox(false);
      setImportJsonText('');
      sounds.playSuccess();
    } catch (err: any) {
      setErrorMessage('Erro ao importar código de mandato: ' + (err.message || 'JSON inválido'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Oficial do Palácio Municipal */}
        <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-950 p-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg border border-amber-400/40 text-slate-950 font-black">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Vote className="w-4 h-4" />
                Justiça Eleitoral & Tribunal Municipal
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Diplomação do Prefeito & Escolha de Partido
              </h2>
              <p className="text-xs text-slate-300">
                Inicie um novo mandato com seu nome e partido ou acesse um gabinete salvo.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('login');
              setSavedProfiles(getSavedMayorProfiles());
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'login'
                ? 'bg-slate-900 text-amber-300 border-amber-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login de Prefeito & Partido
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('novo');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'novo'
                ? 'bg-slate-900 text-amber-300 border-amber-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Novo Mandato Personalizado
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('perfil');
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'perfil'
                ? 'bg-slate-900 text-amber-300 border-amber-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Meu Gabinete
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ABA 1: LOGIN DE PREFEITO & PARTIDO */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              {/* Formulário de Identificação */}
              <form onSubmit={handleQuickLogin} className="space-y-4 bg-slate-950 p-4 md:p-5 rounded-xl border border-amber-500/30 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                      <Vote className="w-4 h-4 text-amber-400" />
                      Identificação do Prefeito(a)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Informe o seu nome e o partido político para entrar na prefeitura e governar.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                    Acesso Oficial
                  </span>
                </div>

                {/* 1. Nome do Prefeito */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                    Nome do Prefeito(a)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={titlePrefix}
                      onChange={(e) => setTitlePrefix(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 w-full sm:w-32"
                    >
                      <option value="Prefeito">Prefeito</option>
                      <option value="Prefeita">Prefeita</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Dra.">Dra.</option>
                      <option value="Nenhum">Sem Título</option>
                    </select>

                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        required
                        value={mayorNameInput}
                        onChange={(e) => setMayorNameInput(e.target.value)}
                        placeholder="Ex: Carlos Mendonça"
                        className="flex-1 bg-slate-900 border border-slate-700 text-sm font-bold text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleRandomizeName}
                        title="Gerar Nome Aleatório"
                        className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Aleatório
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Seleção de Partido Político */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                    Partido Político
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_PARTIES.map((party) => {
                      const isSelected = selectedPartyAcronym === party.acronym;
                      return (
                        <div
                          key={party.acronym}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedPartyAcronym(party.acronym);
                          }}
                          className={`cursor-pointer p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-950/50 border-amber-400 shadow-md ring-1 ring-amber-400'
                              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-[11px] font-black px-2 py-0.5 rounded text-white ${party.badgeColor}`}
                            >
                              {party.acronym}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white leading-tight">{party.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{party.ideology}</p>
                        </div>
                      );
                    })}

                    {/* Opção de Partido Personalizado */}
                    <div
                      onClick={() => {
                        sounds.playClick();
                        setSelectedPartyAcronym('CUSTOM');
                      }}
                      className={`cursor-pointer p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        selectedPartyAcronym === 'CUSTOM'
                          ? 'bg-purple-950/50 border-purple-400 shadow-md ring-1 ring-purple-400'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-black px-2 py-0.5 rounded text-white bg-purple-600">
                          OUTRO
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">Partido Personalizado</h4>
                      <p className="text-[10px] text-purple-300 mt-1">Digitar minha própria sigla</p>
                    </div>
                  </div>

                  {selectedPartyAcronym === 'CUSTOM' && (
                    <div className="p-3 bg-purple-950/20 border border-purple-500/40 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-purple-300 block mb-1">
                          Sigla (Ex: PBR)
                        </label>
                        <input
                          type="text"
                          maxLength={8}
                          value={customPartyAcronym}
                          onChange={(e) => setCustomPartyAcronym(e.target.value.toUpperCase())}
                          placeholder="SIGLA"
                          className="w-full bg-slate-900 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white uppercase focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-purple-300 block mb-1">
                          Nome da Legenda
                        </label>
                        <input
                          type="text"
                          value={customPartyName}
                          onChange={(e) => setCustomPartyName(e.target.value)}
                          placeholder="Ex: Partido Republicano da Aliança Cidadã"
                          className="w-full bg-slate-900 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Cidade */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                    Município / Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="Ex: Porto da Aliança"
                    className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-white px-3.5 py-2 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Botão de Entrar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-slate-950" />
                    Entrar no Gabinete como Prefeito(a)
                  </button>
                </div>
              </form>

              {/* Lista de Gabinetes Salvos / Histórico */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    Gabinetes Salvos neste Dispositivo ({savedProfiles.length})
                  </h4>
                  <button
                    onClick={() => setShowImportBox(!showImportBox)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-bold border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3 h-3" />
                    Importar Backup
                  </button>
                </div>

                {/* Caixa de Importar Backup */}
                {showImportBox && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-sky-500/40 space-y-3">
                    <span className="text-xs font-bold text-sky-400 block">
                      Restaurar Gabinete por Código JSON:
                    </span>
                    <textarea
                      rows={3}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder="Cole o código do mandato aqui..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                    />
                    {errorMessage && (
                      <div className="text-xs text-rose-400 font-semibold">{errorMessage}</div>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowImportBox(false)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleImportSave}
                        className="px-4 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold"
                      >
                        Restaurar Gabinete
                      </button>
                    </div>
                  </div>
                )}

                {savedProfiles.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400">
                      Nenhum outro gabinete salvo anteriormente. Digite seu nome e partido acima para começar!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {savedProfiles.map((prof) => {
                      const isCurrent =
                        currentState.mayorName === prof.mayorName &&
                        currentState.cityName === prof.cityName;

                      return (
                        <div
                          key={prof.id}
                          onClick={() => handleLoadProfile(prof)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-amber-950/30 border-amber-500/60 shadow-md'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-300 font-black flex-shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h5 className="font-bold text-white text-xs truncate">{prof.mayorName}</h5>
                                <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-600/40">
                                  {prof.partyAcronym || prof.party}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">
                                {prof.cityName} • R$ {prof.treasury.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleLoadProfile(prof)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded transition-colors"
                            >
                              Entrar
                            </button>
                            <button
                              onClick={(e) => handleDeleteProfile(prof.id, e)}
                              title="Apagar este mandato"
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 2: NOVO MANDATO COMPLETO */}
          {activeTab === 'novo' && (
            <form onSubmit={handleCreateNewMayor} className="space-y-6">
              {/* 1. Nome do Prefeito */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  1. Nome do Prefeito(a)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={titlePrefix}
                    onChange={(e) => setTitlePrefix(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-amber-500 w-full sm:w-32"
                  >
                    <option value="Prefeito">Prefeito</option>
                    <option value="Prefeita">Prefeita</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Dra.">Dra.</option>
                    <option value="Nenhum">Sem Título</option>
                  </select>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      required
                      value={mayorNameInput}
                      onChange={(e) => setMayorNameInput(e.target.value)}
                      placeholder="Ex: Carlos Mendonça"
                      className="flex-1 bg-slate-900 border border-slate-700 text-sm font-bold text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleRandomizeName}
                      title="Gerar Nome Aleatório"
                      className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Aleatório
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Nome oficial que aparecerá no Diário Oficial, Decretos e Cúpulas Metropolitanas com outros
                  prefeitos.
                </p>
              </div>

              {/* 2. Escolha do Partido Político */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                    2. Filiação Partidária
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Escolha a legenda da sua coligação ou crie um partido novo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-3">
                  {PRESET_PARTIES.map((party) => {
                    const isSelected = selectedPartyAcronym === party.acronym;
                    return (
                      <div
                        key={party.acronym}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedPartyAcronym(party.acronym);
                        }}
                        className={`cursor-pointer p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 shadow-md'
                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className={`text-xs font-black px-2 py-0.5 rounded text-white ${party.badgeColor}`}
                            >
                              {party.acronym}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Partido</span>
                          </div>
                          <h4 className="text-xs font-bold text-white leading-snug">{party.name}</h4>
                          <p className="text-[10px] text-amber-300/90 font-medium mt-1">
                            {party.ideology}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-800/80 pt-1.5 italic">
                          "{party.motto}"
                        </p>
                      </div>
                    );
                  })}

                  {/* Opção de Partido Personalizado */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setSelectedPartyAcronym('CUSTOM');
                    }}
                    className={`cursor-pointer p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      selectedPartyAcronym === 'CUSTOM'
                        ? 'bg-amber-950/40 border-amber-400 shadow-md'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-black px-2 py-0.5 rounded text-white bg-purple-600 border-purple-400">
                          NOVO
                        </span>
                        <span className="text-[10px] text-purple-300 font-mono">Personalizado</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">Criar Meu Próprio Partido</h4>
                      <p className="text-[10px] text-purple-200 font-medium mt-1">
                        Defina a sigla e o nome da sua legenda livremente.
                      </p>
                    </div>
                    <span className="text-[10px] text-purple-300 mt-2 border-t border-slate-800/80 pt-1.5 font-bold">
                      Clique para digitar
                    </span>
                  </div>
                </div>

                {/* Campos quando selecionado Custom Party */}
                {selectedPartyAcronym === 'CUSTOM' && (
                  <div className="p-3 bg-purple-950/20 border border-purple-500/40 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-purple-300 block mb-1">
                        Sigla (Ex: PBR)
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        value={customPartyAcronym}
                        onChange={(e) => setCustomPartyAcronym(e.target.value.toUpperCase())}
                        placeholder="SIGLA"
                        className="w-full bg-slate-900 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white uppercase focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-purple-300 block mb-1">
                        Nome Completo da Legenda
                      </label>
                      <input
                        type="text"
                        value={customPartyName}
                        onChange={(e) => setCustomPartyName(e.target.value)}
                        placeholder="Ex: Partido Republicano da Aliança Cidadã"
                        className="w-full bg-slate-900 border border-purple-400/50 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Nome do Município */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  3. Nome da Cidade / Município
                </label>
                <input
                  type="text"
                  required
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  placeholder="Ex: Porto da Aliança"
                  className="w-full bg-slate-900 border border-slate-700 text-sm font-bold text-white px-3.5 py-2 rounded-lg focus:outline-none focus:border-amber-500 mb-2"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500 self-center mr-1">Sugestões:</span>
                  {PRESET_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setSelectedCity(c);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md text-[11px] font-medium border border-slate-700/60 transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Foco de Governo */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  4. Diretriz Prioritária de Governo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GOVERNMENT_FOCUSES.map((foc) => {
                    const isSelected = selectedFocus === foc.id;
                    return (
                      <div
                        key={foc.id}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedFocus(foc.id);
                        }}
                        className={`cursor-pointer p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 shadow-sm'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <h4 className="text-xs font-bold text-white mb-1">{foc.label}</h4>
                        <p className="text-[11px] text-slate-400 leading-snug">{foc.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botão de Posse */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 font-black text-sm md:text-base rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5 text-slate-950" />
                  Tomar Posse e Começar Mandato Oficial
                </button>
              </div>
            </form>
          )}

          {/* ABA 3: PERFIL ATUAL */}
          {activeTab === 'perfil' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Titular do Poder Executivo Municipal
                    </span>
                    <h3 className="text-xl font-black text-white">{currentState.mayorName}</h3>
                    <p className="text-xs text-slate-400">{currentState.party}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-300 block">{currentState.cityName}</span>
                    <span className="text-[11px] text-amber-400 font-medium">
                      Mês {currentState.termMonth} • Mandato Contínuo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Tesouro em Caixa</span>
                    <strong className="text-sm font-black text-emerald-400">
                      R$ {currentState.treasury.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">População</span>
                    <strong className="text-sm font-bold text-white">
                      {currentState.population.toLocaleString()} hab.
                    </strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Classificação CAPAG</span>
                    <strong className="text-sm font-bold text-sky-400">Nota {currentState.fiscalRating}</strong>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Aprovação Popular</span>
                    <strong className="text-sm font-bold text-amber-400">{currentState.approvalRating}%</strong>
                  </div>
                </div>

                {/* Opções de Renúncia / Novo Mandato */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveTab('novo');
                    }}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    Iniciar Novo Mandato com Outro Prefeito
                  </button>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      const exportObj = {
                        mayorName: currentState.mayorName,
                        party: currentState.party,
                        cityName: currentState.cityName,
                        state: currentState,
                      };
                      navigator.clipboard?.writeText(JSON.stringify(exportObj));
                      alert('Código do Gabinete copiado para a área de transferência!');
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors border border-slate-700"
                  >
                    Copiar Código de Backup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
