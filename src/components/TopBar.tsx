import React, { useState } from 'react';
import { CityStats, CityBudget, CityDate } from '../types';
import { sounds } from '../audio/soundManager';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Pause,
  Play,
  FastForward,
  Zap,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  DollarSign,
  Users,
  Smile,
  Meh,
  Frown,
  Landmark,
  UserCheck,
  Flame,
  FolderDown,
  Edit2,
  Check,
  Menu,
  X,
} from 'lucide-react';

interface TopBarProps {
  cityName: string;
  onUpdateCityName: (name: string) => void;
  stats: CityStats;
  budget: CityBudget;
  date: CityDate;
  gameSpeed: number; // 0 = pause, 1 = 1x, 2 = 2x, 3 = 5x
  onChangeSpeed: (speed: number) => void;
  isNight: boolean;
  onToggleNight: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenBudget: () => void;
  onOpenAdvisors: () => void;
  onOpenDisasters: () => void;
  onOpenMapManager: () => void;
  onOpenMultiplayer?: () => void;
  isMultiplayerConnected?: boolean;
  multiplayerRoomId?: string | null;
}

const MONTHS_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export const TopBar: React.FC<TopBarProps> = ({
  cityName,
  onUpdateCityName,
  stats,
  budget,
  date,
  gameSpeed,
  onChangeSpeed,
  isNight,
  onToggleNight,
  isMuted,
  onToggleMute,
  onOpenBudget,
  onOpenAdvisors,
  onOpenDisasters,
  onOpenMapManager,
  onOpenMultiplayer,
  isMultiplayerConnected,
  multiplayerRoomId,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(cityName);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateCityName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const netMonthly = budget.lastMonthIncome.total - budget.lastMonthExpenses.total;

  return (
    <header
      id="simcity-topbar"
      className="w-full bg-slate-900/95 border-b border-slate-800 text-slate-100 px-3 md:px-4 py-2 flex items-center justify-between gap-2 md:gap-3 shadow-xl backdrop-blur-md select-none z-30"
    >
      {/* Left: City Title & Date */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1.5">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                id="input-city-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-xs md:text-sm font-bold text-white focus:outline-none focus:border-amber-400 max-w-[130px]"
                autoFocus
              />
              <button
                id="btn-save-city-name"
                onClick={handleSaveName}
                className="p-1 text-emerald-400 hover:text-emerald-300 rounded"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={() => {
                setNameInput(cityName);
                setIsEditingName(true);
              }}
              title="Toque para renomear a cidade"
            >
              <h1 className="font-black text-sm md:text-base tracking-tight text-amber-400 group-hover:text-amber-300 truncate max-w-[110px] sm:max-w-[180px]">
                {cityName}
              </h1>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          <span className="text-[10px] md:text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700 hidden sm:inline-block">
            {date.day} {MONTHS_PT[date.month - 1]} {date.year}
          </span>
        </div>

        {/* Desktop Speed Controls */}
        <div className="hidden lg:flex items-center bg-slate-950/70 p-0.5 rounded-lg border border-slate-800">
          <button
            id="btn-speed-pause"
            title="Pausar Simulação"
            onClick={() => {
              sounds.playClick();
              onChangeSpeed(0);
            }}
            className={`p-1.5 rounded transition-all ${
              gameSpeed === 0
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-speed-1x"
            title="Velocidade Normal (1x)"
            onClick={() => {
              sounds.playClick();
              onChangeSpeed(1);
            }}
            className={`p-1.5 rounded transition-all ${
              gameSpeed === 1
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-speed-2x"
            title="Velocidade Rápida (2x)"
            onClick={() => {
              sounds.playClick();
              onChangeSpeed(2);
            }}
            className={`p-1.5 rounded transition-all ${
              gameSpeed === 2
                ? 'bg-blue-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-speed-5x"
            title="Velocidade Turbo (5x)"
            onClick={() => {
              sounds.playClick();
              onChangeSpeed(3);
            }}
            className={`p-1.5 rounded transition-all ${
              gameSpeed === 3
                ? 'bg-purple-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Metrics (Always Visible & Clean) */}
      <div className="flex items-center gap-2 md:gap-3 text-xs">
        {/* Treasury */}
        <div
          onClick={onOpenBudget}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 cursor-pointer transition-colors"
          title="Toque para abrir o Balanço Orçamentário da Cidade"
        >
          <DollarSign className={`w-3.5 h-3.5 ${budget.treasury >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          <div>
            <span className="text-[9px] text-slate-400 block uppercase leading-none hidden sm:block">Tesouro</span>
            <span className={`font-black text-xs ${budget.treasury >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${budget.treasury.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Population */}
        <div
          className="flex items-center gap-1 px-2 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60"
          title={`População: ${stats.population.toLocaleString()} cidadãos`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <span className="text-[9px] text-slate-400 block uppercase leading-none hidden sm:block">Habitantes</span>
            <span className="font-bold text-slate-100 text-xs">{stats.population.toLocaleString()}</span>
          </div>
        </div>

        {/* Approval Rating (hidden on small mobile) */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60"
          title={`Aprovação: ${stats.approvalRating}%`}
        >
          {stats.approvalRating >= 70 ? (
            <Smile className="w-4 h-4 text-emerald-400" />
          ) : stats.approvalRating >= 45 ? (
            <Meh className="w-4 h-4 text-amber-400" />
          ) : (
            <Frown className="w-4 h-4 text-red-400" />
          )}
          <span className="font-bold text-slate-100">{stats.approvalRating}%</span>
        </div>

        {/* RCI demand meters */}
        <div
          className="hidden sm:flex items-end gap-1 px-2 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 h-7"
          title={`Demanda RCI: R=${stats.demandR} C=${stats.demandC} I=${stats.demandI}`}
        >
          <div className="w-2 bg-slate-700 rounded-sm h-5 relative overflow-hidden flex items-end">
            <div
              className="w-full bg-emerald-500 rounded-sm"
              style={{ height: `${Math.max(10, Math.min(100, (stats.demandR + 100) / 2))}%` }}
            />
          </div>
          <div className="w-2 bg-slate-700 rounded-sm h-5 relative overflow-hidden flex items-end">
            <div
              className="w-full bg-blue-500 rounded-sm"
              style={{ height: `${Math.max(10, Math.min(100, (stats.demandC + 100) / 2))}%` }}
            />
          </div>
          <div className="w-2 bg-slate-700 rounded-sm h-5 relative overflow-hidden flex items-end">
            <div
              className="w-full bg-amber-400 rounded-sm"
              style={{ height: `${Math.max(10, Math.min(100, (stats.demandI + 100) / 2))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Controls: Desktop toolbar + PWA Button, Mobile Hamburger */}
      <div className="flex items-center gap-1.5">
        {/* 2 Prefeitos (Multiplayer Mode) Button */}
        {onOpenMultiplayer && (
          <button
            id="btn-open-multiplayer"
            title="Jogar com 2 Prefeitos em Celulares Diferentes"
            onClick={() => {
              sounds.playClick();
              onOpenMultiplayer();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-md active:scale-95 ${
              isMultiplayerConnected
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white border-blue-400/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">2 Prefeitos</span>
            {isMultiplayerConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>
        )}

        {/* PWA Install Button for Android / Desktop */}
        <PWAInstallButton compact={true} />

        {/* Desktop Quick Nav Buttons */}
        <div className="hidden lg:flex items-center gap-1.5">
          <button
            id="btn-open-budget"
            onClick={() => {
              sounds.playClick();
              onOpenBudget();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Orçamento</span>
          </button>

          <button
            id="btn-open-advisors"
            onClick={() => {
              sounds.playClick();
              onOpenAdvisors();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Conselhos</span>
          </button>

          <button
            id="btn-open-disasters"
            onClick={() => {
              sounds.playClick();
              onOpenDisasters();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200 rounded-lg border border-red-800/70 text-xs font-semibold transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Desastres</span>
          </button>

          <button
            id="btn-open-map-manager"
            onClick={() => {
              sounds.playClick();
              onOpenMapManager();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <FolderDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Salvar</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-700 mx-0.5"></div>

          {/* Sound toggle */}
          <button
            id="btn-toggle-sound"
            title={isMuted ? 'Ativar Efeitos Sonoros' : 'Silenciar Sons'}
            onClick={() => {
              onToggleMute();
              sounds.playClick();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Day / Night toggle */}
          <button
            id="btn-toggle-night"
            title={isNight ? 'Alternar para Modo Diurno' : 'Alternar para Modo Noturno'}
            onClick={() => {
              sounds.playClick();
              onToggleNight();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
          >
            {isNight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          id="btn-mobile-menu"
          onClick={() => {
            sounds.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95"
          title="Menu do Jogo"
        >
          {mobileMenuOpen ? <X className="w-4 h-4 text-amber-400" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* MOBILE SHEET / DRAWER (Clean, large touch targets for Android phones) */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer-sheet"
          className="fixed inset-x-0 top-12 bottom-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 overflow-y-auto flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200 lg:hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-base text-amber-400">{cityName}</h2>
              <span className="text-xs text-slate-400">
                {date.day} de {MONTHS_PT[date.month - 1]}, {date.year}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Speed Controls (Large 48px touch targets) */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Velocidade do Jogo
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onChangeSpeed(0);
                  sounds.playClick();
                }}
                className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 ${
                  gameSpeed === 0
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Pause className="w-4 h-4" />
                <span className="text-[10px]">Pausar</span>
              </button>
              <button
                onClick={() => {
                  onChangeSpeed(1);
                  sounds.playClick();
                }}
                className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 ${
                  gameSpeed === 1
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Play className="w-4 h-4" />
                <span className="text-[10px]">Normal</span>
              </button>
              <button
                onClick={() => {
                  onChangeSpeed(2);
                  sounds.playClick();
                }}
                className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 ${
                  gameSpeed === 2
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <FastForward className="w-4 h-4" />
                <span className="text-[10px]">Rápido</span>
              </button>
              <button
                onClick={() => {
                  onChangeSpeed(3);
                  sounds.playClick();
                }}
                className={`py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 ${
                  gameSpeed === 3
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[10px]">Turbo</span>
              </button>
            </div>
          </div>

          {/* Quick Management Actions */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Administração Municipal
            </span>

            {/* 2 Mayors Multiplayer Card */}
            {onOpenMultiplayer && (
              <button
                id="drawer-btn-multiplayer"
                onClick={() => {
                  sounds.playClick();
                  onOpenMultiplayer();
                  setMobileMenuOpen(false);
                }}
                className="w-full p-3 bg-gradient-to-r from-blue-900/60 to-emerald-900/60 border border-blue-500/50 rounded-xl flex items-center justify-between text-left text-xs font-bold text-white hover:from-blue-800/70 hover:to-emerald-800/70 shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/40 border border-blue-400 flex items-center justify-center text-blue-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-amber-300">Modo 2 Prefeitos (Multijogador)</span>
                    <p className="text-[10px] text-slate-300 font-normal">
                      Jogue com 2 celulares na mesma região e negocie energia/água
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                  {isMultiplayerConnected ? 'Online' : 'Conectar'}
                </span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenBudget();
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center gap-2.5 text-left text-xs font-bold text-white hover:bg-slate-700"
              >
                <Landmark className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span>Orçamento</span>
                  <p className="text-[10px] text-slate-400 font-normal">Impostos e gastos</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAdvisors();
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center gap-2.5 text-left text-xs font-bold text-white hover:bg-slate-700"
              >
                <UserCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span>Conselheiros</span>
                  <p className="text-[10px] text-slate-400 font-normal">Opinião da equipe</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenDisasters();
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl flex items-center gap-2.5 text-left text-xs font-bold text-red-200 hover:bg-red-900/50"
              >
                <Flame className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <span>Desastres</span>
                  <p className="text-[10px] text-red-400/80 font-normal">Incêndios e meteoro</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenMapManager();
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center gap-2.5 text-left text-xs font-bold text-emerald-200 hover:bg-slate-700"
              >
                <FolderDown className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span>Salvar Cidade</span>
                  <p className="text-[10px] text-slate-400 font-normal">Novo mapa / backup</p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Toggles (Sound & Night) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onToggleMute();
                sounds.playClick();
              }}
              className="p-3 bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-200"
            >
              <span>Efeitos Sonoros</span>
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                onToggleNight();
                sounds.playClick();
              }}
              className="p-3 bg-slate-800/90 border border-slate-700/80 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-200"
            >
              <span>{isNight ? 'Modo Noturno' : 'Modo Diurno'}</span>
              {isNight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
          >
            Voltar para o Jogo
          </button>
        </div>
      )}
    </header>
  );
};
