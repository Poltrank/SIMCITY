import React from 'react';
import { Tile } from '../types';
import { BUILDINGS_CATALOG } from '../simulation/buildingData';
import { sounds } from '../audio/soundManager';
import {
  X,
  MapPin,
  Home,
  Users,
  Briefcase,
  Zap,
  Droplet,
  Route,
  Trash2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface TileInspectorModalProps {
  tile: Tile | null;
  onClose: () => void;
  onDemolishTile: (x: number, y: number) => void;
}

export const TileInspectorModal: React.FC<TileInspectorModalProps> = ({
  tile,
  onClose,
  onDemolishTile,
}) => {
  if (!tile) return null;

  const def = tile.buildingId ? BUILDINGS_CATALOG[tile.buildingId] : null;

  return (
    <div
      id="tile-inspector-popover"
      className="absolute top-16 right-4 z-30 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-xs text-slate-200 select-none animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white leading-tight">
              {def?.name || (tile.zone !== 'none' ? `Zona ${tile.zone.toUpperCase()} Vazia` : `Terreno Natural: ${tile.terrain.toUpperCase()}`)}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Coordenadas: ({tile.x}, {tile.y})
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Details */}
      <div className="space-y-3">
        {def && (
          <p className="text-[11px] text-slate-300 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800">
            "{def.description}"
          </p>
        )}

        {/* Vital Utilities Indicators */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div
            className={`p-2 rounded-lg border ${
              tile.hasPower
                ? 'bg-sky-950/40 border-sky-600/60 text-sky-400'
                : 'bg-red-950/40 border-red-700/60 text-red-400'
            }`}
          >
            <Zap className="w-4 h-4 mx-auto mb-0.5" />
            <span className="text-[10px] font-bold block">{tile.hasPower ? 'Ligada' : 'Sem Luz'}</span>
          </div>

          <div
            className={`p-2 rounded-lg border ${
              tile.hasWater
                ? 'bg-blue-950/40 border-blue-600/60 text-blue-400'
                : 'bg-red-950/40 border-red-700/60 text-red-400'
            }`}
          >
            <Droplet className="w-4 h-4 mx-auto mb-0.5" />
            <span className="text-[10px] font-bold block">{tile.hasWater ? 'Encanada' : 'Seca'}</span>
          </div>

          <div
            className={`p-2 rounded-lg border ${
              tile.hasRoadAccess
                ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-400'
                : 'bg-amber-950/40 border-amber-700/60 text-amber-400'
            }`}
          >
            <Route className="w-4 h-4 mx-auto mb-0.5" />
            <span className="text-[10px] font-bold block">{tile.hasRoadAccess ? 'Com Via' : 'Isolado'}</span>
          </div>
        </div>

        {/* Population / Jobs */}
        {(tile.population > 0 || tile.jobs > 0) && (
          <div className="flex items-center justify-between p-2 bg-slate-800/80 rounded-lg border border-slate-700/60">
            {tile.population > 0 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>
                  Moradores: <strong className="text-white">{tile.population}</strong>
                </span>
              </div>
            )}
            {tile.jobs > 0 && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>
                  Empregos: <strong className="text-white">{tile.jobs}</strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Abandoned Warning */}
        {tile.abandoned && (
          <div className="p-2 bg-red-950/50 border border-red-700 rounded-lg text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="text-[10px]">
              Edifício abandonado! Falta de serviços essenciais ou alta poluição fez os ocupantes fugirem.
            </span>
          </div>
        )}

        {/* Stats Metrics Bars */}
        <div className="space-y-1.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Valor da Terra:</span>
            <span className="font-bold text-emerald-400">${tile.landValue} / 100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${tile.landValue}%` }} />
          </div>

          <div className="flex justify-between text-[10px] pt-1">
            <span className="text-slate-400">Índice de Poluição:</span>
            <span className={`font-bold ${tile.pollution > 40 ? 'text-red-400' : 'text-slate-300'}`}>
              {tile.pollution}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${tile.pollution}%` }} />
          </div>

          <div className="flex justify-between text-[10px] pt-1">
            <span className="text-slate-400">Criminalidade Local:</span>
            <span className={`font-bold ${tile.crime > 45 ? 'text-red-400' : 'text-slate-300'}`}>
              {tile.crime}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${tile.crime}%` }} />
          </div>
        </div>

        {/* Demolish Action */}
        <button
          onClick={() => {
            sounds.playDemolish();
            onDemolishTile(tile.x, tile.y);
            onClose();
          }}
          className="w-full py-2 bg-red-950/60 hover:bg-red-900 border border-red-700/80 hover:border-red-600 text-red-300 hover:text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Trash2 className="w-3.5 h-3.5" /> Demolir este Terreno ($15)
        </button>
      </div>
    </div>
  );
};
