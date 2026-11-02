import React, { useState, useEffect, useCallback } from 'react';
import {
  Tile,
  ActiveTool,
  ViewOverlay,
  BuildingId,
} from '../../types';
import { BUILDINGS_CATALOG } from '../../simulation/buildingData';
import { generateStarterCity, MAP_SIZE } from '../../simulation/mapGenerator';
import { IsometricCanvas } from '../IsometricCanvas';
import { PrefeitoCityState } from '../../types/textGame';
import { sounds } from '../../audio/soundManager';
import {
  Building2,
  Home,
  Briefcase,
  Factory,
  Route,
  Trees,
  HeartPulse,
  GraduationCap,
  Shield,
  FlameKindling,
  Sun,
  Moon,
  Droplet,
  Zap,
  Shovel,
  Search,
  Layers,
  X,
} from 'lucide-react';

interface SimCityMapViewProps {
  cityState: PrefeitoCityState;
  onUpdateState: (newState: PrefeitoCityState) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onOpenLegislationModal?: () => void;
}

const LOCAL_GRID_STORAGE_KEY = 'simcity_grid_prefeito_v2';

export const SimCityMapView: React.FC<SimCityMapViewProps> = ({
  cityState,
  onUpdateState,
  onShowToast,
}) => {
  // Grid State
  const [grid, setGrid] = useState<Tile[][]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_GRID_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === MAP_SIZE) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading saved SimCity grid:', e);
      }
    }
    return generateStarterCity(MAP_SIZE);
  });

  // Selected tool key from our user-friendly UI
  const [selectedToolKey, setSelectedToolKey] = useState<string>('query');
  const [viewOverlay, setViewOverlay] = useState<ViewOverlay>('none');
  const [isNight, setIsNight] = useState<boolean>(false);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  // Convert selected tool key into IsometricCanvas ActiveTool object
  const activeTool: ActiveTool = React.useMemo(() => {
    if (selectedToolKey === 'query') return { type: 'select' };
    if (selectedToolKey === 'bulldoze') return { type: 'bulldoze' };
    if (selectedToolKey === 'road') return { type: 'road' };
    if (selectedToolKey === 'residential') return { type: 'zone_residential' };
    if (selectedToolKey === 'commercial') return { type: 'zone_commercial' };
    if (selectedToolKey === 'industrial') return { type: 'zone_industrial' };
    if (selectedToolKey === 'power_line') return { type: 'power_line' };
    if (selectedToolKey === 'water_pipe') return { type: 'water_pipe' };
    return { type: 'building', buildingId: selectedToolKey as BuildingId };
  }, [selectedToolKey]);

  // Synchronize grid population & high-tech upgrades when cityState grows
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_GRID_STORAGE_KEY, JSON.stringify(grid));
    } catch (e) {
      console.warn('Could not persist SimCity grid:', e);
    }
  }, [grid]);

  // Handle single tile click/build
  const handleTileClick = useCallback(
    (x: number, y: number) => {
      if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) return;

      const tile = grid[y][x];

      // Query / Inspection
      if (selectedToolKey === 'query') {
        setSelectedTile(tile);
        sounds.playClick();
        return;
      }

      // Bulldoze / Demolish
      if (selectedToolKey === 'bulldoze') {
        if (!tile.buildingId && tile.zone === 'none') return;

        const demolishCost = 15;
        if (cityState.treasury < demolishCost) {
          sounds.playAlert();
          onShowToast('Tesouro insuficiente para demolição (R$ 15).', 'error');
          return;
        }

        sounds.playBulldozer();
        setGrid((prev) => {
          const updated = prev.map((row) => row.map((t) => ({ ...t })));
          updated[y][x].buildingId = null;
          updated[y][x].zone = 'none';
          updated[y][x].buildingLevel = 0;
          updated[y][x].population = 0;
          updated[y][x].jobs = 0;
          updated[y][x].onFire = false;
          updated[y][x].abandoned = false;
          return updated;
        });

        const updatedState = {
          ...cityState,
          treasury: cityState.treasury - demolishCost,
        };
        onUpdateState(updatedState);
        setSelectedTile(null);
        return;
      }

      // Check if water
      if (tile.terrain === 'water' || tile.terrain === 'deep_water') {
        if (selectedToolKey !== 'water_pump') {
          sounds.playAlert();
          onShowToast('Não é possível construir sobre corpos d\'água diretamente.', 'info');
          return;
        }
      }

      // Road
      if (selectedToolKey === 'road') {
        const roadCost = 10;
        if (cityState.treasury < roadCost) {
          sounds.playAlert();
          onShowToast('Tesouro insuficiente para pavimentação (R$ 10).', 'error');
          return;
        }

        sounds.playBuild();
        setGrid((prev) => {
          const updated = prev.map((row) => row.map((t) => ({ ...t })));
          const target = updated[y][x];
          target.buildingId = 'road';
          target.terrain = 'grass';
          target.hasRoadAccess = true;
          return updated;
        });

        const updatedState = {
          ...cityState,
          treasury: cityState.treasury - roadCost,
          infrastructureIndex: Math.min(100, cityState.infrastructureIndex + 1),
        };
        onUpdateState(updatedState);
        onShowToast('Estrada pavimentada construída! (-R$ 10)', 'success');
        return;
      }

      // Zones
      if (selectedToolKey === 'residential' || selectedToolKey === 'commercial' || selectedToolKey === 'industrial') {
        const zoneCost = 25;
        if (cityState.treasury < zoneCost) {
          sounds.playAlert();
          onShowToast(`Tesouro insuficiente para zoneamento (R$ ${zoneCost}).`, 'error');
          return;
        }

        sounds.playBuild();
        setGrid((prev) => {
          const updated = prev.map((row) => row.map((t) => ({ ...t })));
          const target = updated[y][x];
          target.zone = selectedToolKey;
          target.terrain = 'grass';
          target.hasRoadAccess = true;
          target.hasPower = true;
          target.hasWater = true;

          // Auto spawn starter building
          if (selectedToolKey === 'residential') {
            target.buildingId = 'res_low_1';
            target.buildingLevel = 1;
            target.population = 18;
          } else if (selectedToolKey === 'commercial') {
            target.buildingId = 'com_low_1';
            target.buildingLevel = 1;
            target.jobs = 12;
          } else {
            target.buildingId = 'ind_low_1';
            target.buildingLevel = 1;
            target.jobs = 16;
            target.pollution = 25;
          }
          return updated;
        });

        const popAdd = selectedToolKey === 'residential' ? 18 : 0;
        const jobsAdd = selectedToolKey === 'commercial' ? 12 : selectedToolKey === 'industrial' ? 16 : 0;

        const updatedState = {
          ...cityState,
          treasury: cityState.treasury - zoneCost,
          population: cityState.population + popAdd,
          jobs: cityState.jobs + jobsAdd,
        };
        onUpdateState(updatedState);
        onShowToast(`Zona ${selectedToolKey.toUpperCase()} demarcada! (+${popAdd || jobsAdd} ${popAdd ? 'habitantes' : 'empregos'})`, 'success');
        return;
      }

      // Buildings & Infrastructure
      const bDef = BUILDINGS_CATALOG[selectedToolKey as BuildingId];
      if (bDef) {
        const cost = bDef.cost;
        if (cityState.treasury < cost) {
          sounds.playAlert();
          onShowToast(`Tesouro insuficiente para construir ${bDef.name} (R$ ${cost.toLocaleString()}).`, 'error');
          return;
        }

        sounds.playBuild();
        setGrid((prev) => {
          const updated = prev.map((row) => row.map((t) => ({ ...t })));
          const target = updated[y][x];
          target.buildingId = selectedToolKey as BuildingId;
          target.buildingLevel = 1;
          target.terrain = 'grass';
          target.hasRoadAccess = true;
          target.hasPower = true;
          target.hasWater = true;
          return updated;
        });

        // Compute index boosts
        let healthBoost = 0;
        let eduBoost = 0;
        let secBoost = 0;
        let envBoost = 0;
        let infraBoost = 0;

        if (selectedToolKey === 'hospital') healthBoost = 4;
        if (selectedToolKey === 'elementary_school' || selectedToolKey === 'high_school') eduBoost = 4;
        if (selectedToolKey === 'police_station') secBoost = 4;
        if (selectedToolKey === 'fire_station') secBoost = 2;
        if (selectedToolKey === 'small_park' || selectedToolKey === 'large_park' || selectedToolKey === 'fountain_plaza') envBoost = 3;
        if (selectedToolKey === 'road' || selectedToolKey === 'power_line' || selectedToolKey === 'solar_plant' || selectedToolKey === 'wind_turbine') infraBoost = 2;

        const updatedState: PrefeitoCityState = {
          ...cityState,
          treasury: cityState.treasury - cost,
          healthIndex: Math.min(100, cityState.healthIndex + healthBoost),
          educationIndex: Math.min(100, cityState.educationIndex + eduBoost),
          securityIndex: Math.min(100, cityState.securityIndex + secBoost),
          environmentalIndex: Math.min(100, (cityState.environmentalIndex || 70) + envBoost),
          infrastructureIndex: Math.min(100, cityState.infrastructureIndex + infraBoost),
          approvalRating: Math.min(100, cityState.approvalRating + 1),
          gazetteFeed: [
            {
              id: `b_${Date.now()}`,
              title: `🏗️ Prefeitura conclui obra de ${bDef.name}!`,
              source: 'Diário Oficial',
              type: 'noticia',
              dateStr: `${cityState.day || 15} de ${cityState.monthName || 'Setembro'} de ${cityState.year || 2026}`,
              body: `Foi entregue e inaugurada mais uma unidade de ${bDef.name} na malha urbana da cidade. O investimento totalizou R$ ${cost.toLocaleString()} com benefícios diretos aos bairros vizinhos.`,
              timestamp: Date.now(),
            },
            ...cityState.gazetteFeed,
          ],
        };

        onUpdateState(updatedState);
        onShowToast(`🏗️ ${bDef.name} construído com sucesso! (-R$ ${cost.toLocaleString()})`, 'success');
      }
    },
    [cityState, grid, onShowToast, onUpdateState, selectedToolKey]
  );

  // Batch action for drag placement (roads, zones, demolition)
  const handleBatchAction = useCallback(
    (tiles: { x: number; y: number }[], toolObj: ActiveTool) => {
      if (tiles.length === 0) return;

      const toolType = toolObj.type;
      const isRoad = toolType === 'road';
      const isBulldoze = toolType === 'bulldoze';
      const isZoneRes = toolType === 'zone_residential';
      const isZoneCom = toolType === 'zone_commercial';
      const isZoneInd = toolType === 'zone_industrial';

      if (isRoad || isBulldoze || isZoneRes || isZoneCom || isZoneInd) {
        const unitCost = isRoad ? 10 : isBulldoze ? 15 : 25;
        const totalCost = unitCost * tiles.length;

        if (cityState.treasury < totalCost) {
          sounds.playAlert();
          onShowToast(`Tesouro insuficiente para ${tiles.length} obras (R$ ${totalCost.toLocaleString()}).`, 'error');
          return;
        }

        if (isBulldoze) {
          sounds.playBulldozer();
        } else {
          sounds.playBuild();
        }

        setGrid((prev) => {
          const updated = prev.map((row) => row.map((t) => ({ ...t })));
          tiles.forEach(({ x, y }) => {
            if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
              const target = updated[y][x];
              if (target.terrain !== 'water' && target.terrain !== 'deep_water') {
                if (isBulldoze) {
                  target.buildingId = null;
                  target.zone = 'none';
                  target.buildingLevel = 0;
                  target.population = 0;
                  target.jobs = 0;
                } else if (isRoad) {
                  target.buildingId = 'road';
                  target.terrain = 'grass';
                  target.hasRoadAccess = true;
                } else {
                  const zType = isZoneRes ? 'residential' : isZoneCom ? 'commercial' : 'industrial';
                  target.zone = zType;
                  target.terrain = 'grass';
                  target.hasRoadAccess = true;
                  target.hasPower = true;
                  target.hasWater = true;
                  if (isZoneRes) {
                    target.buildingId = 'res_low_1';
                    target.population = 14;
                  } else if (isZoneCom) {
                    target.buildingId = 'com_low_1';
                    target.jobs = 10;
                  } else {
                    target.buildingId = 'ind_low_1';
                    target.jobs = 12;
                  }
                }
              }
            }
          });
          return updated;
        });

        const updatedState = {
          ...cityState,
          treasury: cityState.treasury - totalCost,
        };
        onUpdateState(updatedState);
        onShowToast(`Pavimentação/Zoneamento contínuo em ${tiles.length} quadras concluído!`, 'success');
      }
    },
    [cityState, onShowToast, onUpdateState]
  );

  // Tools catalog configuration
  const toolsList = [
    { id: 'query', label: 'Inspecionar', icon: Search, cost: 'Grátis' },
    { id: 'residential', label: 'Residencial', icon: Home, cost: 'R$ 25' },
    { id: 'commercial', label: 'Comercial', icon: Briefcase, cost: 'R$ 25' },
    { id: 'industrial', label: 'Industrial', icon: Factory, cost: 'R$ 25' },
    { id: 'road', label: 'Estrada', icon: Route, cost: 'R$ 10' },
    { id: 'small_park', label: 'Praça/Parque', icon: Trees, cost: 'R$ 120' },
    { id: 'elementary_school', label: 'Escola', icon: GraduationCap, cost: 'R$ 500' },
    { id: 'hospital', label: 'Hospital', icon: HeartPulse, cost: 'R$ 1.400' },
    { id: 'police_station', label: 'Delegacia', icon: Shield, cost: 'R$ 650' },
    { id: 'fire_station', label: 'Bombeiros', icon: FlameKindling, cost: 'R$ 650' },
    { id: 'solar_plant', label: 'Solar/Eólica', icon: Zap, cost: 'R$ 1.500' },
    { id: 'water_tower', label: 'Caixa d\'Água', icon: Droplet, cost: 'R$ 350' },
    { id: 'bulldoze', label: 'Demolir', icon: Shovel, cost: 'R$ 15' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top SimCity City Dashboard Ribbon */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* City identity & Real-time pop */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md border border-amber-400/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                  {cityState.cityName} • SimCity 2.5D
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  {cityState.population.toLocaleString()} Habitantes
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prefeito: <strong className="text-amber-300">{cityState.mayorName}</strong> •{' '}
                {cityState.jobs.toLocaleString()} Empregos • Aprovação: <strong className="text-emerald-400">{cityState.approvalRating}%</strong>
              </p>
            </div>
          </div>

          {/* Quick Controls: Overlays & Day/Night */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Overlay Selector */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 px-1 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Camada:
              </span>
              {[
                { id: 'none', label: 'Normal' },
                { id: 'zones', label: 'Zonas RCI' },
                { id: 'traffic', label: 'Trânsito' },
                { id: 'police', label: 'Segurança' },
                { id: 'landValue', label: 'Valor do Solo' },
                { id: 'pollution', label: 'Poluição' },
              ].map((ov) => (
                <button
                  key={ov.id}
                  onClick={() => {
                    setViewOverlay(ov.id as ViewOverlay);
                    sounds.playClick();
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    viewOverlay === ov.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {ov.label}
                </button>
              ))}
            </div>

            {/* Day / Night Toggle */}
            <button
              onClick={() => {
                setIsNight((prev) => !prev);
                sounds.playClick();
              }}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isNight
                  ? 'bg-indigo-950/80 text-yellow-300 border-indigo-700/60'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
              title="Alternar Modo Noturno / Diurno (luzes acesas nas janelas e faróis de carros)"
            >
              {isNight ? <Moon className="w-4 h-4 text-indigo-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isNight ? 'Noite' : 'Dia'}</span>
            </button>
          </div>
        </div>

        {/* Indices Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Tesouro Livre</span>
            <span className="text-sm font-black text-emerald-400 tabular-nums">
              R$ {cityState.treasury.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Balanço / Ciclo</span>
            <span className={`text-sm font-black tabular-nums ${cityState.netMonthly >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {cityState.netMonthly >= 0 ? '+' : ''}R$ {cityState.netMonthly.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Saúde Pública</span>
            <span className="text-sm font-bold text-rose-400 tabular-nums">
              {cityState.healthIndex}%
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Educação</span>
            <span className="text-sm font-bold text-sky-400 tabular-nums">
              {cityState.educationIndex}%
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Segurança</span>
            <span className="text-sm font-bold text-indigo-400 tabular-nums">
              {cityState.securityIndex}%
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Mobilidade/Trânsito</span>
            <span className="text-sm font-bold text-amber-400 tabular-nums">
              {cityState.transitIndex || 74}%
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">COHAB & Empresas</span>
            <span className="text-sm font-bold text-purple-300 tabular-nums">
              {cityState.infrastructureWorks?.cohabHousingProjects || 0} COHAB • {(cityState.installedCompanies || []).length} Emp.
            </span>
          </div>
        </div>
      </div>

      {/* Main Isometric Canvas Arena */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl h-[560px] md:h-[640px]">
        <IsometricCanvas
          grid={grid}
          activeTool={activeTool}
          viewOverlay={viewOverlay}
          isNight={isNight}
          onTileClick={handleTileClick}
          onTilesBatchAction={handleBatchAction}
          selectedTile={selectedTile}
          onSelectTile={setSelectedTile}
          treasury={cityState.treasury}
        />

        {/* Floating Building / Zone Inspector Card when tile selected */}
        {selectedTile && (
          <div className="absolute top-4 left-4 z-30 bg-slate-900/95 border border-slate-700/80 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-sm w-full animate-in fade-in slide-in-from-top-2 text-xs text-slate-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block">
                  Inspecionar Terreno ({selectedTile.x}, {selectedTile.y})
                </span>
                <h4 className="text-sm font-black text-white">
                  {selectedTile.buildingId
                    ? BUILDINGS_CATALOG[selectedTile.buildingId]?.name || selectedTile.buildingId
                    : selectedTile.zone !== 'none'
                    ? `Zona ${selectedTile.zone.toUpperCase()}`
                    : `Terreno Natural (${selectedTile.terrain})`}
                </h4>
              </div>
              <button
                onClick={() => setSelectedTile(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">População / Moradores</span>
                <strong className="text-emerald-400 font-bold tabular-nums">
                  {selectedTile.population > 0 ? `${selectedTile.population} hab.` : '—'}
                </strong>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Postos de Trabalho</span>
                <strong className="text-sky-400 font-bold tabular-nums">
                  {selectedTile.jobs > 0 ? `${selectedTile.jobs} empregos` : '—'}
                </strong>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Valor do Solo</span>
                <strong className="text-amber-400 font-bold tabular-nums">
                  {selectedTile.landValue}/100
                </strong>
              </div>
              <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Índice de Crime</span>
                <strong className={`${selectedTile.crime > 40 ? 'text-rose-400' : 'text-emerald-400'} font-bold tabular-nums`}>
                  {selectedTile.crime}/100
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800/80 pt-2">
              <span className="flex items-center gap-1">
                <Zap className={`w-3.5 h-3.5 ${selectedTile.hasPower ? 'text-yellow-400' : 'text-slate-500'}`} />
                {selectedTile.hasPower ? 'Com Energia' : 'Sem Energia'}
              </span>
              <span className="flex items-center gap-1">
                <Droplet className={`w-3.5 h-3.5 ${selectedTile.hasWater ? 'text-sky-400' : 'text-slate-500'}`} />
                {selectedTile.hasWater ? 'Com Água' : 'Sem Água'}
              </span>
              <span className="flex items-center gap-1">
                <Route className={`w-3.5 h-3.5 ${selectedTile.hasRoadAccess ? 'text-emerald-400' : 'text-slate-500'}`} />
                {selectedTile.hasRoadAccess ? 'Acesso Viário' : 'Isolado'}
              </span>
            </div>
          </div>
        )}

        {/* SimCity Construction Ribbon (Docked at Bottom of Canvas) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-slate-700/80 p-2 rounded-2xl shadow-2xl backdrop-blur-md max-w-4xl w-[96%] flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 flex-shrink-0">
            {toolsList.map((tool) => {
              const Icon = tool.icon;
              const isSelected = selectedToolKey === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setSelectedToolKey(tool.id);
                    sounds.playClick();
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 min-w-[58px] ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`${tool.label} (${tool.cost})`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] leading-tight truncate">{tool.label}</span>
                  <span className={`text-[9px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {tool.cost}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
