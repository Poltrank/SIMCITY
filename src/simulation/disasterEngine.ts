import { Disaster, Tile } from '../types';
import { sounds } from '../audio/soundManager';

export function createDisaster(type: Disaster['type'], mapSize: number): Disaster {
  sounds.playDisaster();
  const names: Record<Disaster['type'], string> = {
    fire: 'Incêndio Florestal & Urbano',
    meteor: 'Queda de Meteoro Devastador',
    tornado: 'Tornado F5 Catastrófico',
    blackout: 'Apagão Elétrico Geral',
  };

  const x = Math.floor(Math.random() * (mapSize - 10)) + 5;
  const y = Math.floor(Math.random() * (mapSize - 10)) + 5;

  return {
    id: 'disaster_' + Date.now(),
    type,
    name: names[type],
    x,
    y,
    radius: type === 'meteor' ? 3 : type === 'fire' ? 2 : 1,
    durationTicks: type === 'meteor' ? 10 : 35,
    elapsedTicks: 0,
    active: true,
  };
}

export function updateDisasters(
  disasters: Disaster[],
  grid: Tile[][],
  mapSize: number
): { updatedDisasters: Disaster[]; newsReports: string[] } {
  const newsReports: string[] = [];
  const updatedDisasters: Disaster[] = [];

  for (const disaster of disasters) {
    if (!disaster.active) continue;

    disaster.elapsedTicks++;

    if (disaster.type === 'fire') {
      // Fire spread logic
      if (disaster.elapsedTicks === 1) {
        // Ignite center
        if (grid[disaster.y] && grid[disaster.y][disaster.x]) {
          grid[disaster.y][disaster.x].onFire = true;
          grid[disaster.y][disaster.x].buildingId = 'fire';
          newsReports.push(`🚨 ALERTA: Foco de incêndio detectado em (${disaster.x}, ${disaster.y})!`);
        }
      }

      // Check spread every 3 ticks
      if (disaster.elapsedTicks % 3 === 0) {
        for (let y = 0; y < mapSize; y++) {
          for (let x = 0; x < mapSize; x++) {
            if (grid[y][x].onFire) {
              // 4 directions
              const neighbors = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 },
              ];

              for (const n of neighbors) {
                if (n.x >= 0 && n.x < mapSize && n.y >= 0 && n.y < mapSize) {
                  const target = grid[n.y][n.x];
                  if (
                    !target.onFire &&
                    target.terrain !== 'water' &&
                    target.terrain !== 'deep_water' &&
                    (target.buildingId !== null || target.terrain === 'forest')
                  ) {
                    // Spread chance depends on fire coverage
                    const spreadChance = target.fireRisk > 50 ? 0.35 : 0.15;
                    if (Math.random() < spreadChance) {
                      target.onFire = true;
                      target.buildingId = 'fire';
                    }
                  }
                }
              }

              // Chance of fire burning out into rubble
              if (Math.random() < 0.25) {
                grid[y][x].onFire = false;
                grid[y][x].buildingId = 'rubble';
                grid[y][x].population = 0;
                grid[y][x].jobs = 0;
              }
            }
          }
        }
      }
    } else if (disaster.type === 'meteor') {
      if (disaster.elapsedTicks === 1) {
        newsReports.push(`☄️ IMPACTO: Um meteoro colidiu violentamente nas coordenadas (${disaster.x}, ${disaster.y})!`);
        // Destroy buildings in radius
        for (let dy = -disaster.radius; dy <= disaster.radius; dy++) {
          for (let dx = -disaster.radius; dx <= disaster.radius; dx++) {
            const tx = disaster.x + dx;
            const ty = disaster.y + dy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (tx >= 0 && tx < mapSize && ty >= 0 && ty < mapSize && dist <= disaster.radius) {
              const tile = grid[ty][tx];
              if (tile.terrain !== 'water' && tile.terrain !== 'deep_water') {
                if (dist <= 1.2) {
                  tile.buildingId = 'rubble';
                  tile.terrain = 'sand'; // crater look
                } else {
                  tile.buildingId = 'fire';
                  tile.onFire = true;
                }
                tile.population = 0;
                tile.jobs = 0;
              }
            }
          }
        }
      }
    } else if (disaster.type === 'tornado') {
      // Moves randomly
      disaster.x += Math.floor(Math.random() * 3) - 1;
      disaster.y += Math.floor(Math.random() * 3) - 1;
      disaster.x = Math.max(1, Math.min(mapSize - 2, disaster.x));
      disaster.y = Math.max(1, Math.min(mapSize - 2, disaster.y));

      const tile = grid[disaster.y][disaster.x];
      if (tile.buildingId && tile.buildingId !== 'road') {
        tile.buildingId = 'rubble';
        tile.population = 0;
        tile.jobs = 0;
        newsReports.push(`🌪️ O tornado passou arrancando estruturas em (${disaster.x}, ${disaster.y})!`);
      }
    }

    if (disaster.elapsedTicks < disaster.durationTicks) {
      updatedDisasters.push(disaster);
    } else {
      newsReports.push(`✅ O evento de ${disaster.name} foi controlado ou cessou.`);
    }
  }

  return { updatedDisasters, newsReports };
}
