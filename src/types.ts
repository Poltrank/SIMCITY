export type TerrainType = 'grass' | 'water' | 'deep_water' | 'sand' | 'forest';

export type ZoneType = 'none' | 'residential' | 'commercial' | 'industrial';

export type BuildingCategory = 
  | 'transport'
  | 'zone'
  | 'power'
  | 'water'
  | 'emergency'
  | 'education_health'
  | 'parks'
  | 'special';

export type BuildingId =
  | 'road'
  | 'power_line'
  | 'water_pipe'
  // Power
  | 'wind_turbine'
  | 'coal_plant'
  | 'solar_plant'
  | 'nuclear_plant'
  // Water
  | 'water_tower'
  | 'water_pump'
  // Emergency & Public
  | 'police_station'
  | 'fire_station'
  | 'hospital'
  | 'elementary_school'
  | 'high_school'
  // Parks
  | 'small_park'
  | 'large_park'
  | 'fountain_plaza'
  | 'sports_stadium'
  // Zone buildings (spawned automatically by simulation)
  | 'res_low_1'
  | 'res_low_2'
  | 'res_med_1'
  | 'res_med_2'
  | 'res_high_1'
  | 'res_high_2'
  | 'com_low_1'
  | 'com_low_2'
  | 'com_med_1'
  | 'com_high_1'
  | 'ind_low_1'
  | 'ind_med_1'
  | 'ind_high_1'
  | 'ind_high_tech'
  // Special
  | 'rubble'
  | 'fire';

export interface Tile {
  x: number;
  y: number;
  terrain: TerrainType;
  elevation: number;
  zone: ZoneType;
  buildingId: BuildingId | null;
  buildingLevel: number; // 0 to 4
  buildingProgress: number; // 0 to 100 before upgrading
  hasRoadAccess: boolean;
  hasPower: boolean;
  hasWater: boolean;
  population: number;
  jobs: number;
  pollution: number; // 0 to 100
  crime: number; // 0 to 100
  landValue: number; // 0 to 100
  fireRisk: number; // 0 to 100
  onFire: boolean;
  abandoned: boolean;
  abandonedMonths: number;
  constructionStep?: number;
}

export interface BuildingDef {
  id: BuildingId;
  name: string;
  category: BuildingCategory;
  cost: number;
  monthlyUpkeep: number;
  powerProduced?: number;
  powerConsumed?: number;
  waterProduced?: number;
  waterConsumed?: number;
  pollutionProduced?: number;
  radiusEffect?: number; // Effect radius in tiles
  policeCoverage?: number;
  fireCoverage?: number;
  healthCoverage?: number;
  educationCoverage?: number;
  parkEffect?: number;
  description: string;
  iconName: string;
  size: number; // 1 means 1x1, 2 means 2x2, etc.
}

export interface CityBudget {
  treasury: number;
  taxRateResidential: number; // e.g. 9 (%)
  taxRateCommercial: number;
  taxRateIndustrial: number;
  roadBudgetPercent: number; // 0 - 100%
  policeBudgetPercent: number;
  fireBudgetPercent: number;
  healthBudgetPercent: number;
  educationBudgetPercent: number;
  lastMonthIncome: {
    residentialTax: number;
    commercialTax: number;
    industrialTax: number;
    total: number;
  };
  lastMonthExpenses: {
    roads: number;
    police: number;
    fire: number;
    health: number;
    education: number;
    utilities: number;
    total: number;
  };
}

export interface CityStats {
  population: number;
  jobs: number;
  employed: number;
  commercialCapacity: number;
  industrialCapacity: number;
  approvalRating: number; // 0 - 100%
  totalPowerCapacity: number;
  totalPowerConsumed: number;
  totalWaterCapacity: number;
  totalWaterConsumed: number;
  averagePollution: number;
  averageCrime: number;
  averageHealth: number;
  averageEducation: number;
  averageLandValue: number;
  demandR: number; // -100 to 100
  demandC: number;
  demandI: number;
}

export interface CityDate {
  day: number;
  month: number; // 1 to 12
  year: number;
}

export type ViewOverlay = 
  | 'none'
  | 'power'
  | 'water'
  | 'pollution'
  | 'landValue'
  | 'traffic'
  | 'police'
  | 'fire'
  | 'zones';

export type ToolType =
  | 'select'
  | 'bulldoze'
  | 'road'
  | 'zone_residential'
  | 'zone_commercial'
  | 'zone_industrial'
  | 'power_line'
  | 'water_pipe'
  | 'building'
  | 'pan';

export interface ActiveTool {
  type: ToolType;
  buildingId?: BuildingId;
}

export interface AdvisorFeedback {
  advisor: 'finance' | 'utilities' | 'safety' | 'health_environment' | 'transport';
  name: string;
  avatar: string;
  status: 'good' | 'warning' | 'critical';
  message: string;
  recommendation: string;
}

export interface NewsItem {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'alert' | 'funny';
  timestamp: number;
}

export interface Car {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  color: string;
}

export interface Disaster {
  id: string;
  type: 'fire' | 'meteor' | 'tornado' | 'blackout';
  name: string;
  x: number;
  y: number;
  radius: number;
  durationTicks: number;
  elapsedTicks: number;
  active: boolean;
}
