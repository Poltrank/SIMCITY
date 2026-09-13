import { Tile, TerrainType } from '../types';

export const MAP_SIZE = 36; // 36x36 grid is fast, responsive, and expansive

export function createEmptyGrid(size = MAP_SIZE): Tile[][] {
  const grid: Tile[][] = [];
  for (let y = 0; y < size; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        terrain: 'grass',
        elevation: 0,
        zone: 'none',
        buildingId: null,
        buildingLevel: 0,
        buildingProgress: 0,
        hasRoadAccess: false,
        hasPower: false,
        hasWater: false,
        population: 0,
        jobs: 0,
        pollution: 0,
        crime: 0,
        landValue: 30,
        fireRisk: 10,
        onFire: false,
        abandoned: false,
        abandonedMonths: 0,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function generateProceduralTerrain(size = MAP_SIZE): Tile[][] {
  const grid = createEmptyGrid(size);

  // Generate a winding river through the map
  let riverX = Math.floor(size * 0.45) + Math.floor(Math.random() * 4);
  const riverWidth = 3;

  for (let y = 0; y < size; y++) {
    // Slight meander
    const offset = Math.round(Math.sin(y / 4.5) * 2.8 + Math.cos(y / 7) * 1.5);
    const curCenter = Math.max(riverWidth + 1, Math.min(size - riverWidth - 2, riverX + offset));

    for (let dx = -riverWidth; dx <= riverWidth; dx++) {
      const rx = curCenter + dx;
      if (rx >= 0 && rx < size) {
        if (Math.abs(dx) <= 1) {
          grid[y][rx].terrain = 'deep_water';
        } else if (Math.abs(dx) <= 2) {
          grid[y][rx].terrain = 'water';
        } else {
          grid[y][rx].terrain = 'sand';
        }
      }
    }
  }

  // Scatter pleasant forests/trees
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x].terrain === 'grass') {
        const noise = Math.sin(x * 0.3) * Math.cos(y * 0.3) + Math.sin(x * 0.7 + y * 0.5) * 0.5;
        if (noise > 0.45) {
          grid[y][x].terrain = 'forest';
          grid[y][x].landValue = 45; // Nature boosts land value
        }
      }
    }
  }

  return grid;
}

/**
 * Generates a vibrant, partially developed starter city
 * so the user can immediately experience SimCity gameplay!
 */
export function generateStarterCity(size = MAP_SIZE): Tile[][] {
  const grid = generateProceduralTerrain(size);

  // Helper to safely place building
  const place = (x: number, y: number, bId: any, lvl = 1) => {
    if (x >= 0 && x < size && y >= 0 && y < size && grid[y][x].terrain !== 'water' && grid[y][x].terrain !== 'deep_water') {
      grid[y][x].buildingId = bId;
      grid[y][x].buildingLevel = lvl;
      grid[y][x].terrain = 'grass';
      grid[y][x].hasPower = true;
      grid[y][x].hasWater = true;
      grid[y][x].hasRoadAccess = true;
    }
  };

  const zone = (x: number, y: number, zType: any) => {
    if (x >= 0 && x < size && y >= 0 && y < size && grid[y][x].terrain !== 'water' && grid[y][x].terrain !== 'deep_water') {
      grid[y][x].zone = zType;
      grid[y][x].terrain = 'grass';
    }
  };

  // Build a road network on the western side of the river
  const startX = 6;
  const startY = 10;

  // Horizontal roads
  for (let x = startX; x <= startX + 16; x++) {
    place(x, startY, 'road');
    place(x, startY + 6, 'road');
    place(x, startY + 12, 'road');
  }
  // Vertical roads
  for (let y = startY; y <= startY + 12; y++) {
    place(startX, y, 'road');
    place(startX + 8, y, 'road');
    place(startX + 16, y, 'road');
  }

  // Utilities in the north
  place(startX + 1, startY - 3, 'wind_turbine');
  place(startX + 3, startY - 3, 'wind_turbine');
  place(startX + 5, startY - 3, 'wind_turbine');
  place(startX + 1, startY - 1, 'power_line');
  place(startX + 3, startY - 1, 'power_line');
  place(startX + 5, startY - 1, 'power_line');
  place(startX + 5, startY, 'road'); // Connects

  // Water tower
  place(startX + 7, startY - 3, 'water_tower');
  place(startX + 7, startY - 1, 'road');

  // Emergency & civic services
  place(startX + 8, startY + 6, 'road');
  place(startX + 7, startY + 6, 'police_station');
  place(startX + 9, startY + 6, 'fire_station');
  place(startX + 4, startY + 6, 'elementary_school');
  place(startX + 12, startY + 6, 'small_park');

  // Residential Neighborhood (Block 1)
  for (let y = startY + 1; y <= startY + 5; y++) {
    for (let x = startX + 1; x <= startX + 3; x++) {
      zone(x, y, 'residential');
      place(x, y, y % 2 === 0 ? 'res_low_2' : 'res_low_1', 1);
      grid[y][x].population = 14 + (x + y) * 2;
    }
    for (let x = startX + 5; x <= startX + 7; x++) {
      zone(x, y, 'residential');
      place(x, y, 'res_med_1', 2);
      grid[y][x].population = 38 + (x + y);
    }
  }

  // Commercial District (Block 2)
  for (let y = startY + 1; y <= startY + 5; y++) {
    for (let x = startX + 9; x <= startX + 15; x++) {
      zone(x, y, 'commercial');
      if (x % 2 === 0) {
        place(x, y, 'com_low_1', 1);
        grid[y][x].jobs = 12;
      } else {
        place(x, y, 'com_low_2', 1);
        grid[y][x].jobs = 18;
      }
    }
  }

  // Industrial Zone in the south (away from residential)
  for (let y = startY + 7; y <= startY + 11; y++) {
    for (let x = startX + 1; x <= startX + 7; x++) {
      zone(x, y, 'residential');
      place(x, y, 'res_low_1', 1);
      grid[y][x].population = 16;
    }
    for (let x = startX + 9; x <= startX + 15; x++) {
      zone(x, y, 'industrial');
      place(x, y, x % 2 === 0 ? 'ind_low_1' : 'ind_med_1', 1);
      grid[y][x].jobs = 25;
      grid[y][x].pollution = 18;
    }
  }

  return grid;
}
