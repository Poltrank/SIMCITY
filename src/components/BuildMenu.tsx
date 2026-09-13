import React, { useState } from 'react';
import { ActiveTool, ViewOverlay, BuildingId } from '../types';
import { BUILDINGS_CATALOG, ZONE_COSTS } from '../simulation/buildingData';
import { sounds } from '../audio/soundManager';
import {
  MousePointer,
  Shovel,
  Route,
  Home,
  Store,
  Factory,
  Zap,
  Droplet,
  Shield,
  HeartPulse,
  Trees,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface BuildMenuProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  viewOverlay: ViewOverlay;
  onSelectOverlay: (overlay: ViewOverlay) => void;
  treasury: number;
}

type MenuCategory =
  | 'inspect'
  | 'bulldoze'
  | 'roads'
  | 'zones'
  | 'power'
  | 'water'
  | 'emergency'
  | 'education_health'
  | 'parks'
  | 'overlays';

export const BuildMenu: React.FC<BuildMenuProps> = ({
  activeTool,
  onSelectTool,
  viewOverlay,
  onSelectOverlay,
  treasury,
}) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('roads');
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return false; // Start collapsed on mobile so the map and top menus are fully visible
    }
    return true;
  });

  const selectTool = (tool: ActiveTool) => {
    sounds.playClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    onSelectTool(tool);
  };

  return (
    <div
      id="simcity-build-toolbar"
      className="fixed md:absolute bottom-11 md:bottom-auto md:top-16 left-2 md:left-4 right-2 md:right-auto z-20 flex flex-col max-w-full md:max-w-[350px] select-none"
    >
      {/* Category Tabs Header */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-t-xl p-1.5 shadow-2xl flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {/* Inspect */}
          <button
            id="tool-inspect"
            title="Inspecionar Terreno / Construção (Consulta)"
            onClick={() => {
              setActiveCategory('inspect');
              selectTool({ type: 'select' });
            }}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeTool.type === 'select'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MousePointer className="w-4 h-4" />
          </button>

          {/* Bulldozer */}
          <button
            id="tool-bulldoze"
            title="Trator Demolidor (Demolir Construção ou Limpar Terreno: $15)"
            onClick={() => {
              setActiveCategory('bulldoze');
              selectTool({ type: 'bulldoze' });
            }}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeTool.type === 'bulldoze'
                ? 'bg-red-500 text-white font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shovel className="w-4 h-4" />
          </button>

          {/* Roads */}
          <button
            id="cat-roads"
            title="Estradas Pavimentadas"
            onClick={() => {
              setActiveCategory('roads');
              selectTool({ type: 'road', buildingId: 'road' });
            }}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'roads'
                ? 'bg-slate-700 text-amber-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Route className="w-4 h-4" />
          </button>

          {/* Zones */}
          <button
            id="cat-zones"
            title="Zoneamento Urbano (Residencial, Comercial, Industrial)"
            onClick={() => setActiveCategory('zones')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'zones'
                ? 'bg-slate-700 text-emerald-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Power */}
          <button
            id="cat-power"
            title="Rede Elétrica e Usinas de Energia"
            onClick={() => setActiveCategory('power')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'power'
                ? 'bg-slate-700 text-amber-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Water */}
          <button
            id="cat-water"
            title="Abastecimento de Água e Caixas d'Água"
            onClick={() => setActiveCategory('water')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'water'
                ? 'bg-slate-700 text-blue-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Droplet className="w-4 h-4" />
          </button>

          {/* Emergency / Safety */}
          <button
            id="cat-emergency"
            title="Segurança Pública (Polícia e Bombeiros)"
            onClick={() => setActiveCategory('emergency')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'emergency'
                ? 'bg-slate-700 text-red-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Health & Education */}
          <button
            id="cat-health-edu"
            title="Saúde e Educação Municipal"
            onClick={() => setActiveCategory('education_health')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'education_health'
                ? 'bg-slate-700 text-pink-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
          </button>

          {/* Parks & Leisure */}
          <button
            id="cat-parks"
            title="Parques, Praças e Estádio"
            onClick={() => setActiveCategory('parks')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'parks'
                ? 'bg-slate-700 text-emerald-400 font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trees className="w-4 h-4" />
          </button>

          {/* Map Overlays */}
          <button
            id="cat-overlays"
            title="Camadas de Informação e Mapas Temáticos"
            onClick={() => setActiveCategory('overlays')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center p-2 rounded-lg transition-all ${
              activeCategory === 'overlays'
                ? 'bg-purple-600 text-white font-bold shadow-md scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Toggle Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-slate-400 hover:text-white rounded-lg active:bg-slate-800"
          title={isExpanded ? 'Recolher Menu' : 'Expandir Menu'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Sub-Items Panel */}
      {isExpanded && (
        <div className="bg-slate-900/95 backdrop-blur-md border-x border-b border-slate-700/80 rounded-b-xl p-3 shadow-2xl space-y-2 text-xs max-h-[40vh] md:max-h-[60vh] overflow-y-auto scrollbar-none">
          {/* 1. ROADS */}
          {activeCategory === 'roads' && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Transporte & Vias
              </span>
              <button
                onClick={() => selectTool({ type: 'road', buildingId: 'road' })}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                  activeTool.buildingId === 'road'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <span className="block font-bold">Estrada Pavimentada</span>
                    <span className="text-[10px] text-slate-400">Permite veículos e conecta zonas</span>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-xs">$10</span>
              </button>
              <p className="text-[10px] text-slate-400 italic">
                Dica: Clique e arraste para traçar avenidas ou quarteirões inteiros de uma vez!
              </p>
            </div>
          )}

          {/* 2. ZONING */}
          {activeCategory === 'zones' && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Zoneamento Urbano
              </span>

              {/* Residential */}
              <button
                onClick={() => selectTool({ type: 'zone_residential' })}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                  activeTool.type === 'zone_residential'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <span className="block font-bold">Zona Residencial (R)</span>
                    <span className="text-[10px] text-slate-400">Casas, condomínios e arranha-céus</span>
                  </div>
                </div>
                <span className="font-bold text-emerald-400 text-xs">${ZONE_COSTS.residential}</span>
              </button>

              {/* Commercial */}
              <button
                onClick={() => selectTool({ type: 'zone_commercial' })}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                  activeTool.type === 'zone_commercial'
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300 font-semibold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-blue-400" />
                  <div className="text-left">
                    <span className="block font-bold">Zona Comercial (C)</span>
                    <span className="text-[10px] text-slate-400">Comércio, escritórios e serviços</span>
                  </div>
                </div>
                <span className="font-bold text-blue-400 text-xs">${ZONE_COSTS.commercial}</span>
              </button>

              {/* Industrial */}
              <button
                onClick={() => selectTool({ type: 'zone_industrial' })}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
                  activeTool.type === 'zone_industrial'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <span className="block font-bold">Zona Industrial (I)</span>
                    <span className="text-[10px] text-slate-400">Fábricas, galpões e manufatura</span>
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-xs">${ZONE_COSTS.industrial}</span>
              </button>
            </div>
          )}

          {/* 3. POWER */}
          {activeCategory === 'power' && (
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Energia & Linhas
              </span>
              <BuildItemButton
                id="power_line"
                name="Linha de Transmissão"
                desc="Conduz eletricidade através do relevo"
                cost={5}
                active={activeTool.buildingId === 'power_line'}
                onClick={() => selectTool({ type: 'power_line', buildingId: 'power_line' })}
              />
              <BuildItemButton
                id="wind_turbine"
                name="Turbina Eólica"
                desc="Energia limpa (+75 MW), 0 poluição"
                cost={500}
                active={activeTool.buildingId === 'wind_turbine'}
                onClick={() => selectTool({ type: 'building', buildingId: 'wind_turbine' })}
              />
              <BuildItemButton
                id="solar_plant"
                name="Parque de Energia Solar"
                desc="Painéis solares (+220 MW), limpo"
                cost={1500}
                active={activeTool.buildingId === 'solar_plant'}
                onClick={() => selectTool({ type: 'building', buildingId: 'solar_plant' })}
              />
              <BuildItemButton
                id="coal_plant"
                name="Usina a Carvão"
                desc="Alta potência (+500 MW), polui o ar"
                cost={2500}
                active={activeTool.buildingId === 'coal_plant'}
                onClick={() => selectTool({ type: 'building', buildingId: 'coal_plant' })}
              />
              <BuildItemButton
                id="nuclear_plant"
                name="Usina Nuclear"
                desc="Gigawatts para metrópoles (+2000 MW)"
                cost={8000}
                active={activeTool.buildingId === 'nuclear_plant'}
                onClick={() => selectTool({ type: 'building', buildingId: 'nuclear_plant' })}
              />
            </div>
          )}

          {/* 4. WATER */}
          {activeCategory === 'water' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Distribuição de Água
              </span>
              <BuildItemButton
                id="water_pipe"
                name="Tubulação Subterrânea"
                desc="Liga áreas secas à rede aquífera"
                cost={5}
                active={activeTool.buildingId === 'water_pipe'}
                onClick={() => selectTool({ type: 'water_pipe', buildingId: 'water_pipe' })}
              />
              <BuildItemButton
                id="water_tower"
                name="Caixa d'Água Elevada"
                desc="Abastece bairros residenciais (+150 kL)"
                cost={350}
                active={activeTool.buildingId === 'water_tower'}
                onClick={() => selectTool({ type: 'building', buildingId: 'water_tower' })}
              />
              <BuildItemButton
                id="water_pump"
                name="Estação de Bombeamento"
                desc="Bônus perto de rios (+600 kL)"
                cost={1100}
                active={activeTool.buildingId === 'water_pump'}
                onClick={() => selectTool({ type: 'building', buildingId: 'water_pump' })}
              />
            </div>
          )}

          {/* 5. EMERGENCY */}
          {activeCategory === 'emergency' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Segurança e Emergência
              </span>
              <BuildItemButton
                id="police_station"
                name="Delegacia de Polícia"
                desc="Combate o crime e traz ordem pública"
                cost={650}
                active={activeTool.buildingId === 'police_station'}
                onClick={() => selectTool({ type: 'building', buildingId: 'police_station' })}
              />
              <BuildItemButton
                id="fire_station"
                name="Corpo de Bombeiros"
                desc="Extingue incêndios e previne sinistros"
                cost={650}
                active={activeTool.buildingId === 'fire_station'}
                onClick={() => selectTool({ type: 'building', buildingId: 'fire_station' })}
              />
            </div>
          )}

          {/* 6. HEALTH & EDUCATION */}
          {activeCategory === 'education_health' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Saúde & Ensino
              </span>
              <BuildItemButton
                id="elementary_school"
                name="Escola Municipal"
                desc="Alfabetização e ensino primário"
                cost={500}
                active={activeTool.buildingId === 'elementary_school'}
                onClick={() => selectTool({ type: 'building', buildingId: 'elementary_school' })}
              />
              <BuildItemButton
                id="high_school"
                name="Colégio Técnico"
                desc="Forma mão-de-obra para indústrias limpas"
                cost={1100}
                active={activeTool.buildingId === 'high_school'}
                onClick={() => selectTool({ type: 'building', buildingId: 'high_school' })}
              />
              <BuildItemButton
                id="hospital"
                name="Hospital Geral"
                desc="Cura enfermidades e eleva a saúde"
                cost={1400}
                active={activeTool.buildingId === 'hospital'}
                onClick={() => selectTool({ type: 'building', buildingId: 'hospital' })}
              />
            </div>
          )}

          {/* 7. PARKS & LEISURE */}
          {activeCategory === 'parks' && (
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Lazer & Parques
              </span>
              <BuildItemButton
                id="small_park"
                name="Praça de Bairro"
                desc="Área verde que valoriza o quarteirão"
                cost={120}
                active={activeTool.buildingId === 'small_park'}
                onClick={() => selectTool({ type: 'building', buildingId: 'small_park' })}
              />
              <BuildItemButton
                id="fountain_plaza"
                name="Praça com Chafariz"
                desc="Ponto turístico central charmoso"
                cost={300}
                active={activeTool.buildingId === 'fountain_plaza'}
                onClick={() => selectTool({ type: 'building', buildingId: 'fountain_plaza' })}
              />
              <BuildItemButton
                id="large_park"
                name="Parque Municipal"
                desc="Grande pulmão verde urbano"
                cost={500}
                active={activeTool.buildingId === 'large_park'}
                onClick={() => selectTool({ type: 'building', buildingId: 'large_park' })}
              />
              <BuildItemButton
                id="sports_stadium"
                name="Estádio Poliesportivo"
                desc="Grandes jogos e enorme satisfação"
                cost={3500}
                active={activeTool.buildingId === 'sports_stadium'}
                onClick={() => selectTool({ type: 'building', buildingId: 'sports_stadium' })}
              />
            </div>
          )}

          {/* 8. OVERLAYS / CAMADAS */}
          {activeCategory === 'overlays' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Camadas Temáticas
              </span>
              {[
                { id: 'none', label: 'Visão Normal 3D' },
                { id: 'power', label: '⚡ Rede Elétrica' },
                { id: 'water', label: '💧 Rede de Água' },
                { id: 'pollution', label: '🏭 Mapa de Poluição' },
                { id: 'landValue', label: '💰 Valor dos Terrenos' },
                { id: 'police', label: '👮 Cobertura Policial' },
                { id: 'fire', label: '🚒 Risco de Incêndio' },
              ].map((ov) => (
                <button
                  key={ov.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectOverlay(ov.id as ViewOverlay);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition-all ${
                    viewOverlay === ov.id
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200 font-bold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {ov.label}
                </button>
              ))}
            </div>
          )}

          {/* Bulldozer Info */}
          {activeCategory === 'bulldoze' && (
            <div className="p-2 bg-red-950/40 border border-red-800/60 rounded-lg text-red-200">
              <span className="font-bold block mb-1">🚜 Trator Demolidor Ativo</span>
              <p className="text-[11px] text-slate-300">
                Clique ou arraste sobre construções, zonas ou escombros para demolir ($15 por quadrado).
              </p>
            </div>
          )}

          {/* Inspect Info */}
          {activeCategory === 'inspect' && (
            <div className="p-2 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200">
              <span className="font-bold block mb-1">🔍 Modo Consulta</span>
              <p className="text-[11px] text-slate-300">
                Clique em qualquer lote ou prédio para ver nível, moradores, poluição, crimes e valor do terreno.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface BuildItemButtonProps {
  id: string;
  name: string;
  desc: string;
  cost: number;
  active: boolean;
  onClick: () => void;
}

const BuildItemButton: React.FC<BuildItemButtonProps> = ({
  name,
  desc,
  cost,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
        active
          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
      }`}
    >
      <div className="text-left">
        <span className="block font-bold leading-tight">{name}</span>
        <span className="text-[10px] text-slate-400 block leading-tight">{desc}</span>
      </div>
      <span className="font-bold text-amber-400 text-xs ml-2">${cost}</span>
    </button>
  );
};
