import {
  Tile,
  CityStats,
  CityBudget,
  CityDate,
  AdvisorFeedback,
  BuildingId,
} from '../types';
import { BUILDINGS_CATALOG } from './buildingData';

export function runSimulationTick(
  grid: Tile[][],
  stats: CityStats,
  budget: CityBudget,
  date: CityDate,
  mapSize: number
): {
  updatedGrid: Tile[][];
  updatedStats: CityStats;
  updatedBudget: CityBudget;
  updatedDate: CityDate;
  advisors: AdvisorFeedback[];
  newNews: string[];
  monthCompleted: boolean;
} {
  // Clone grid to avoid direct mutation
  const newGrid: Tile[][] = grid.map((row) => row.map((tile) => ({ ...tile })));
  const newNews: string[] = [];

  // Advance date
  let monthCompleted = false;
  const newDate = { ...date };
  newDate.day += 3;
  if (newDate.day > 30) {
    newDate.day = 1;
    newDate.month += 1;
    monthCompleted = true;
    if (newDate.month > 12) {
      newDate.month = 1;
      newDate.year += 1;
      newNews.push(`🎉 Feliz Ano Novo de ${newDate.year}! A prefeitura segue em pleno desenvolvimento!`);
    }
  }

  // 1. Calculate Power & Water Production
  let totalPowerCapacity = 0;
  let totalWaterCapacity = 0;
  const powerSources: { x: number; y: number; cap: number }[] = [];
  const waterSources: { x: number; y: number; cap: number; radius: number }[] = [];

  // List of emergency / civic buildings for radius checks
  const policeStations: { x: number; y: number; radius: number; coverage: number }[] = [];
  const fireStations: { x: number; y: number; radius: number; coverage: number }[] = [];
  const hospitals: { x: number; y: number; radius: number; coverage: number }[] = [];
  const schools: { x: number; y: number; radius: number; coverage: number }[] = [];
  const parks: { x: number; y: number; radius: number; effect: number }[] = [];
  const polluters: { x: number; y: number; radius: number; amount: number }[] = [];

  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      const tile = newGrid[y][x];
      if (!tile.buildingId) continue;

      const def = BUILDINGS_CATALOG[tile.buildingId];
      if (!def) continue;

      if (def.powerProduced && def.powerProduced > 0) {
        totalPowerCapacity += def.powerProduced;
        powerSources.push({ x, y, cap: def.powerProduced });
      }

      if (def.waterProduced && def.waterProduced > 0) {
        let produced = def.waterProduced;
        // Check if near water for water pump
        if (def.id === 'water_pump') {
          let hasAdjacentWater = false;
          const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
          ];
          for (const n of neighbors) {
            if (n.x >= 0 && n.x < mapSize && n.y >= 0 && n.y < mapSize) {
              if (newGrid[n.y][n.x].terrain === 'water' || newGrid[n.y][n.x].terrain === 'deep_water') {
                hasAdjacentWater = true;
                break;
              }
            }
          }
          if (hasAdjacentWater) {
            produced = Math.round(produced * 1.3);
          }
        }
        totalWaterCapacity += produced;
        waterSources.push({ x, y, cap: produced, radius: def.radiusEffect || 10 });
      }

      // Civic departments (scaled by budget funding!)
      if (def.policeCoverage) {
        const eff = (budget.policeBudgetPercent / 100);
        policeStations.push({ x, y, radius: Math.round((def.radiusEffect || 10) * eff), coverage: def.policeCoverage * eff });
      }
      if (def.fireCoverage) {
        const eff = (budget.fireBudgetPercent / 100);
        fireStations.push({ x, y, radius: Math.round((def.radiusEffect || 10) * eff), coverage: def.fireCoverage * eff });
      }
      if (def.healthCoverage) {
        const eff = (budget.healthBudgetPercent / 100);
        hospitals.push({ x, y, radius: Math.round((def.radiusEffect || 12) * eff), coverage: def.healthCoverage * eff });
      }
      if (def.educationCoverage) {
        const eff = (budget.educationBudgetPercent / 100);
        schools.push({ x, y, radius: Math.round((def.radiusEffect || 10) * eff), coverage: def.educationCoverage * eff });
      }
      if (def.parkEffect) {
        parks.push({ x, y, radius: def.radiusEffect || 8, effect: def.parkEffect });
      }
      if (def.pollutionProduced && def.pollutionProduced > 0) {
        polluters.push({ x, y, radius: def.radiusEffect || 8, amount: def.pollutionProduced });
      }
    }
  }

  // 2. Power Grid Distribution (BFS Flood Fill)
  // Buildings, power lines, and roads conduct electricity
  const powerVisited: boolean[][] = Array.from({ length: mapSize }, () => Array(mapSize).fill(false));
  const powerQueue: { x: number; y: number }[] = [];

  for (const src of powerSources) {
    powerQueue.push({ x: src.x, y: src.y });
    powerVisited[src.y][src.x] = true;
  }

  while (powerQueue.length > 0) {
    const cur = powerQueue.shift()!;
    const neighbors = [
      { x: cur.x + 1, y: cur.y },
      { x: cur.x - 1, y: cur.y },
      { x: cur.x, y: cur.y + 1 },
      { x: cur.x, y: cur.y - 1 },
    ];

    for (const n of neighbors) {
      if (n.x >= 0 && n.x < mapSize && n.y >= 0 && n.y < mapSize && !powerVisited[n.y][n.x]) {
        const targetTile = newGrid[n.y][n.x];
        const conducts =
          targetTile.buildingId !== null ||
          targetTile.zone !== 'none';

        if (conducts) {
          powerVisited[n.y][n.x] = true;
          powerQueue.push({ x: n.x, y: n.y });
        }
      }
    }
  }

  // 3. Water Distribution (Radius from Water Sources & Pipes)
  const waterCovered: boolean[][] = Array.from({ length: mapSize }, () => Array(mapSize).fill(false));
  for (const w of waterSources) {
    for (let dy = -w.radius; dy <= w.radius; dy++) {
      for (let dx = -w.radius; dx <= w.radius; dx++) {
        const tx = w.x + dx;
        const ty = w.y + dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (tx >= 0 && tx < mapSize && ty >= 0 && ty < mapSize && dist <= w.radius) {
          waterCovered[ty][tx] = true;
        }
      }
    }
  }

  // 4. Update Each Tile Stats & Determine Road Access
  let totalPowerConsumed = 0;
  let totalWaterConsumed = 0;
  let totalPopulation = 0;
  let totalJobs = 0;
  let totalPollution = 0;
  let totalCrime = 0;
  let totalHealth = 0;
  let totalEducation = 0;
  let totalLandValue = 0;
  let zonedTileCount = 0;

  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      const tile = newGrid[y][x];

      // Check road access (adjacent to a road)
      let roadAccess = false;
      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < mapSize && n.y >= 0 && n.y < mapSize) {
          if (newGrid[n.y][n.x].buildingId === 'road') {
            roadAccess = true;
            break;
          }
        }
      }
      tile.hasRoadAccess = roadAccess;

      // Assign power & water
      const hasGridConnection = powerVisited[y][x];
      tile.hasPower = hasGridConnection && totalPowerCapacity >= totalPowerConsumed;
      tile.hasWater = waterCovered[y][x] && totalWaterCapacity >= totalWaterConsumed;

      // Calculate localized service scores
      // Crime: base 35, reduced by police, increased by unemployment & high density
      let localPoliceEffect = 0;
      for (const pol of policeStations) {
        const dist = Math.sqrt((pol.x - x) ** 2 + (pol.y - y) ** 2);
        if (dist <= pol.radius) {
          localPoliceEffect += pol.coverage * (1 - dist / pol.radius);
        }
      }
      tile.crime = Math.max(5, Math.min(95, Math.round(35 - localPoliceEffect * 0.45)));

      // Fire risk: base 20, reduced by fire stations, increased by pollution and wood structures
      let localFireEffect = 0;
      for (const fs of fireStations) {
        const dist = Math.sqrt((fs.x - x) ** 2 + (fs.y - y) ** 2);
        if (dist <= fs.radius) {
          localFireEffect += fs.coverage * (1 - dist / fs.radius);
        }
      }
      tile.fireRisk = Math.max(5, Math.min(90, Math.round(25 - localFireEffect * 0.4)));

      // Health
      let localHealthEffect = 0;
      for (const hosp of hospitals) {
        const dist = Math.sqrt((hosp.x - x) ** 2 + (hosp.y - y) ** 2);
        if (dist <= hosp.radius) {
          localHealthEffect += hosp.coverage * (1 - dist / hosp.radius);
        }
      }

      // Education
      let localEduEffect = 0;
      for (const sc of schools) {
        const dist = Math.sqrt((sc.x - x) ** 2 + (sc.y - y) ** 2);
        if (dist <= sc.radius) {
          localEduEffect += sc.coverage * (1 - dist / sc.radius);
        }
      }

      // Pollution calculation
      let localPollution = 0;
      for (const pol of polluters) {
        const dist = Math.sqrt((pol.x - x) ** 2 + (pol.y - y) ** 2);
        if (dist <= pol.radius) {
          localPollution += pol.amount * (1 - dist / pol.radius);
        }
      }
      tile.pollution = Math.max(0, Math.min(100, Math.round(localPollution)));

      // Parks & Land Value
      let parkBonus = 0;
      for (const pk of parks) {
        const dist = Math.sqrt((pk.x - x) ** 2 + (pk.y - y) ** 2);
        if (dist <= pk.radius) {
          parkBonus += pk.effect * (1 - dist / pk.radius);
        }
      }
      // Water front bonus
      let waterBonus = 0;
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < mapSize && n.y >= 0 && n.y < mapSize) {
          if (newGrid[n.y][n.x].terrain === 'water' || newGrid[n.y][n.x].terrain === 'deep_water') {
            waterBonus += 15;
          }
        }
      }

      tile.landValue = Math.max(
        10,
        Math.min(
          100,
          Math.round(25 + parkBonus * 0.5 + waterBonus + localEduEffect * 0.2 + localHealthEffect * 0.2 - tile.pollution * 0.4 - tile.crime * 0.25)
        )
      );

      // Building consumption & tally
      if (tile.buildingId) {
        const def = BUILDINGS_CATALOG[tile.buildingId];
        if (def) {
          if (def.powerConsumed) totalPowerConsumed += def.powerConsumed;
          if (def.waterConsumed) totalWaterConsumed += def.waterConsumed;
        }
      }

      if (tile.population > 0) totalPopulation += tile.population;
      if (tile.jobs > 0) totalJobs += tile.jobs;

      if (tile.zone !== 'none' || tile.buildingId) {
        totalPollution += tile.pollution;
        totalCrime += tile.crime;
        totalHealth += 50 + localHealthEffect * 0.4 - tile.pollution * 0.3;
        totalEducation += 40 + localEduEffect * 0.5;
        totalLandValue += tile.landValue;
        zonedTileCount++;
      }
    }
  }

  // 5. RCI Demand Calculation
  // Demand scales from -100 to 100
  // R demand: driven by available jobs, low residential tax, high happiness
  const taxFactorR = (10 - budget.taxRateResidential) * 5; // e.g. 9% gives +5
  const jobRatio = totalPopulation > 0 ? totalJobs / Math.max(1, totalPopulation * 0.65) : 1.2;
  const demandR = Math.max(-100, Math.min(100, Math.round(taxFactorR + (jobRatio - 1) * 60 + 20)));

  // C demand: driven by population spending, low commercial tax
  const taxFactorC = (10 - budget.taxRateCommercial) * 5;
  const customerRatio = totalJobs > 0 ? (totalPopulation * 0.5) / Math.max(1, totalJobs * 0.4) : 1.0;
  const demandC = Math.max(-100, Math.min(100, Math.round(taxFactorC + (customerRatio - 1) * 45 + (totalPopulation > 50 ? 25 : 5))));

  // I demand: driven by available workers, trade, low tax
  const taxFactorI = (10 - budget.taxRateIndustrial) * 5;
  const workerSurplus = totalPopulation * 0.6 - totalJobs;
  const demandI = Math.max(-100, Math.min(100, Math.round(taxFactorI + (workerSurplus > 0 ? 30 : -20) + 15)));

  // 6. Zone Development & Progression (Every tick has a small chance for zones to construct/upgrade)
  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      const tile = newGrid[y][x];
      if (tile.zone === 'none') continue;

      // Abandonment check
      if (!tile.hasPower || !tile.hasWater || !tile.hasRoadAccess || tile.pollution > 75) {
        if (tile.buildingId && tile.buildingId !== 'rubble' && tile.buildingId !== 'fire') {
          tile.abandonedMonths += 1;
          if (tile.abandonedMonths > 2) {
            tile.abandoned = true;
            tile.population = Math.round(tile.population * 0.7);
            tile.jobs = Math.round(tile.jobs * 0.7);
          }
        }
      } else {
        tile.abandonedMonths = 0;
        tile.abandoned = false;
      }

      // Only develop if has Road + Power + Water
      const canGrow = tile.hasRoadAccess && tile.hasPower && tile.hasWater && !tile.abandoned && !tile.onFire;
      if (!canGrow) continue;

      // Residential Growth
      if (tile.zone === 'residential' && demandR > 0) {
        if (tile.buildingId === null) {
          // Chance to spawn level 1 house
          if (Math.random() < 0.25) {
            tile.buildingId = Math.random() < 0.5 ? 'res_low_1' : 'res_low_2';
            tile.buildingLevel = 1;
            tile.buildingProgress = 0;
            tile.population = 8 + Math.floor(Math.random() * 8);
          }
        } else if (tile.buildingLevel === 1 && tile.landValue >= 45 && demandR > 20) {
          tile.buildingProgress += 15;
          if (tile.buildingProgress >= 100) {
            tile.buildingId = Math.random() < 0.5 ? 'res_med_1' : 'res_med_2';
            tile.buildingLevel = 2;
            tile.buildingProgress = 0;
            tile.population = 28 + Math.floor(Math.random() * 16);
          }
        } else if (tile.buildingLevel === 2 && tile.landValue >= 70 && demandR > 40) {
          tile.buildingProgress += 10;
          if (tile.buildingProgress >= 100) {
            tile.buildingId = Math.random() < 0.5 ? 'res_high_1' : 'res_high_2';
            tile.buildingLevel = 3;
            tile.buildingProgress = 0;
            tile.population = 75 + Math.floor(Math.random() * 45);
          }
        }
      }

      // Commercial Growth
      if (tile.zone === 'commercial' && demandC > 0) {
        if (tile.buildingId === null) {
          if (Math.random() < 0.25) {
            tile.buildingId = Math.random() < 0.5 ? 'com_low_1' : 'com_low_2';
            tile.buildingLevel = 1;
            tile.buildingProgress = 0;
            tile.jobs = 10 + Math.floor(Math.random() * 8);
          }
        } else if (tile.buildingLevel === 1 && tile.landValue >= 45 && demandC > 20) {
          tile.buildingProgress += 15;
          if (tile.buildingProgress >= 100) {
            tile.buildingId = 'com_med_1';
            tile.buildingLevel = 2;
            tile.buildingProgress = 0;
            tile.jobs = 35 + Math.floor(Math.random() * 20);
          }
        } else if (tile.buildingLevel === 2 && tile.landValue >= 70 && demandC > 40) {
          tile.buildingProgress += 10;
          if (tile.buildingProgress >= 100) {
            tile.buildingId = 'com_high_1';
            tile.buildingLevel = 3;
            tile.buildingProgress = 0;
            tile.jobs = 85 + Math.floor(Math.random() * 45);
          }
        }
      }

      // Industrial Growth
      if (tile.zone === 'industrial' && demandI > 0) {
        if (tile.buildingId === null) {
          if (Math.random() < 0.25) {
            tile.buildingId = 'ind_low_1';
            tile.buildingLevel = 1;
            tile.buildingProgress = 0;
            tile.jobs = 14 + Math.floor(Math.random() * 8);
          }
        } else if (tile.buildingLevel === 1 && demandI > 20) {
          tile.buildingProgress += 15;
          if (tile.buildingProgress >= 100) {
            // If high education & high land value, spawn high-tech clean lab!
            if (tile.landValue > 60) {
              tile.buildingId = 'ind_high_tech';
              tile.buildingLevel = 3;
              tile.jobs = 50 + Math.floor(Math.random() * 20);
            } else {
              tile.buildingId = 'ind_med_1';
              tile.buildingLevel = 2;
              tile.jobs = 30 + Math.floor(Math.random() * 15);
            }
            tile.buildingProgress = 0;
          }
        } else if (tile.buildingLevel === 2 && demandI > 35) {
          tile.buildingProgress += 10;
          if (tile.buildingProgress >= 100) {
            tile.buildingId = 'ind_high_1';
            tile.buildingLevel = 3;
            tile.buildingProgress = 0;
            tile.jobs = 70 + Math.floor(Math.random() * 30);
          }
        }
      }
    }
  }

  // 7. Economy & Monthly Budget Calculation
  const newBudget = { ...budget };
  if (monthCompleted) {
    // Tax revenues
    const resTax = Math.round(totalPopulation * 3.2 * (budget.taxRateResidential / 9));
    const comTax = Math.round(totalJobs * 0.55 * 4.8 * (budget.taxRateCommercial / 9));
    const indTax = Math.round(totalJobs * 0.45 * 4.2 * (budget.taxRateIndustrial / 9));
    const totalIncome = resTax + comTax + indTax;

    // Upkeeps
    let roadUpkeep = 0;
    let policeUpkeep = 0;
    let fireUpkeep = 0;
    let healthUpkeep = 0;
    let eduUpkeep = 0;
    let utilUpkeep = 0;

    for (let y = 0; y < mapSize; y++) {
      for (let x = 0; x < mapSize; x++) {
        const bId = newGrid[y][x].buildingId;
        if (!bId) continue;
        const def = BUILDINGS_CATALOG[bId];
        if (!def) continue;

        if (bId === 'road') roadUpkeep += def.monthlyUpkeep;
        else if (bId === 'police_station') policeUpkeep += def.monthlyUpkeep;
        else if (bId === 'fire_station') fireUpkeep += def.monthlyUpkeep;
        else if (bId === 'hospital') healthUpkeep += def.monthlyUpkeep;
        else if (bId === 'elementary_school' || bId === 'high_school') eduUpkeep += def.monthlyUpkeep;
        else if (def.category === 'power' || def.category === 'water') utilUpkeep += def.monthlyUpkeep;
        else if (def.category === 'parks') utilUpkeep += def.monthlyUpkeep;
      }
    }

    roadUpkeep = Math.round(roadUpkeep * (budget.roadBudgetPercent / 100));
    policeUpkeep = Math.round(policeUpkeep * (budget.policeBudgetPercent / 100));
    fireUpkeep = Math.round(fireUpkeep * (budget.fireBudgetPercent / 100));
    healthUpkeep = Math.round(healthUpkeep * (budget.healthBudgetPercent / 100));
    eduUpkeep = Math.round(eduUpkeep * (budget.educationBudgetPercent / 100));

    const totalExpense = roadUpkeep + policeUpkeep + fireUpkeep + healthUpkeep + eduUpkeep + utilUpkeep;
    const netFlow = totalIncome - totalExpense;

    newBudget.treasury += netFlow;
    newBudget.lastMonthIncome = {
      residentialTax: resTax,
      commercialTax: comTax,
      industrialTax: indTax,
      total: totalIncome,
    };
    newBudget.lastMonthExpenses = {
      roads: roadUpkeep,
      police: policeUpkeep,
      fire: fireUpkeep,
      health: healthUpkeep,
      education: eduUpkeep,
      utilities: utilUpkeep,
      total: totalExpense,
    };

    if (netFlow >= 0) {
      newNews.push(`💰 Arrecadação de impostos: +$${netFlow.toLocaleString()} adicionados aos cofres públicos.`);
    } else {
      newNews.push(`⚠️ Déficit orçamentário: -$${Math.abs(netFlow).toLocaleString()} no fechamento do mês!`);
    }

    if (newBudget.treasury < 0) {
      newNews.push(`🚨 CRISE FISCAL: O tesouro da cidade está negativado em $${Math.abs(newBudget.treasury).toLocaleString()}!`);
    }
  }

  // 8. Overall City Stats & Mayor Approval Rating
  const avgPollution = zonedTileCount > 0 ? Math.round(totalPollution / zonedTileCount) : 0;
  const avgCrime = zonedTileCount > 0 ? Math.round(totalCrime / zonedTileCount) : 10;
  const avgHealth = zonedTileCount > 0 ? Math.round(Math.min(100, totalHealth / zonedTileCount)) : 75;
  const avgEducation = zonedTileCount > 0 ? Math.round(Math.min(100, totalEducation / zonedTileCount)) : 70;
  const avgLandValue = zonedTileCount > 0 ? Math.round(totalLandValue / zonedTileCount) : 30;

  // Approval Rating
  let approval = 75;
  approval -= (budget.taxRateResidential - 9) * 3;
  approval -= (budget.taxRateCommercial - 9) * 2;
  approval -= avgPollution * 0.3;
  approval -= avgCrime * 0.35;
  approval += (avgHealth - 60) * 0.25;
  approval += (avgEducation - 60) * 0.2;
  if (totalPowerCapacity < totalPowerConsumed) approval -= 25;
  if (totalWaterCapacity < totalWaterConsumed) approval -= 25;
  if (newBudget.treasury < 0) approval -= 20;
  approval = Math.max(10, Math.min(99, Math.round(approval)));

  const updatedStats: CityStats = {
    population: totalPopulation,
    jobs: totalJobs,
    employed: Math.min(totalPopulation, totalJobs),
    commercialCapacity: Math.round(totalJobs * 0.5),
    industrialCapacity: Math.round(totalJobs * 0.5),
    approvalRating: approval,
    totalPowerCapacity,
    totalPowerConsumed,
    totalWaterCapacity,
    totalWaterConsumed,
    averagePollution: avgPollution,
    averageCrime: avgCrime,
    averageHealth: avgHealth,
    averageEducation: avgEducation,
    averageLandValue: avgLandValue,
    demandR,
    demandC,
    demandI,
  };

  // 9. City Advisors
  const advisors: AdvisorFeedback[] = [
    {
      advisor: 'finance',
      name: 'Dr. Roberto Lemos',
      avatar: '💼',
      status: newBudget.treasury < 1000 ? 'critical' : newBudget.treasury < 5000 ? 'warning' : 'good',
      message:
        newBudget.treasury < 0
          ? 'Prefeito, estamos em falência técnica! Corte gastos com urgência ou eleve as alíquotas de impostos.'
          : newBudget.lastMonthIncome.total >= newBudget.lastMonthExpenses.total
          ? 'Nossas finanças estão sólidas e saudáveis. Continue expandindo as zonas comerciais e residenciais.'
          : 'Estamos operando com despesas superiores à arrecadação mensal.',
      recommendation:
        newBudget.treasury < 0
          ? 'Aumente os impostos residenciais e industriais em 2-3% no painel de Orçamento.'
          : 'Mantenha os impostos entre 7% e 9% para incentivar o crescimento sustentável.',
    },
    {
      advisor: 'utilities',
      name: 'Eng. Sofia Valente',
      avatar: '⚡',
      status:
        totalPowerCapacity < totalPowerConsumed || totalWaterCapacity < totalWaterConsumed
          ? 'critical'
          : totalPowerCapacity < totalPowerConsumed * 1.2
          ? 'warning'
          : 'good',
      message:
        totalPowerCapacity < totalPowerConsumed
          ? 'APAGÃO! A demanda elétrica ultrapassou a capacidade geradora de nossas usinas!'
          : totalWaterCapacity < totalWaterConsumed
          ? 'FALTA DE ÁGUA! As caixas d\'água estão secas e os cidadãos estão protestando.'
          : `Energia: ${totalPowerConsumed}/${totalPowerCapacity} MW | Água: ${totalWaterConsumed}/${totalWaterCapacity} kL. Redes operando dentro da margem de segurança.`,
      recommendation:
        totalPowerCapacity < totalPowerConsumed
          ? 'Construa uma nova Usina a Carvão ou mais Turbinas Eólicas imediatamente.'
          : totalWaterCapacity < totalWaterConsumed
          ? 'Instale uma Caixa d\'Água ou Estação de Bombeamento fluvial.'
          : 'Lembre-se de conectar novas áreas com estradas ou linhas de alta tensão.',
    },
    {
      advisor: 'safety',
      name: 'Comandante Mendes',
      avatar: '🚨',
      status: avgCrime > 55 ? 'critical' : avgCrime > 38 ? 'warning' : 'good',
      message:
        avgCrime > 50
          ? 'A criminalidade está alarmante nos distritos afastados das delegacias!'
          : 'A cobertura policial e de bombeiros está mantendo as ruas seguras.',
      recommendation:
        avgCrime > 40
          ? 'Construa uma Delegacia de Polícia central e verifique o orçamento policial.'
          : 'Garanta que cada bairro tenha pelo menos um posto de bombeiros próximo.',
    },
    {
      advisor: 'health_environment',
      name: 'Dra. Clara Silveira',
      avatar: '🌳',
      status: avgPollution > 50 || avgHealth < 50 ? 'warning' : 'good',
      message:
        avgPollution > 45
          ? 'A fumaça das indústrias está sufocando as áreas residenciais vizinhas.'
          : 'Os índices de saúde pública e qualidade de vida são excelentes.',
      recommendation:
        avgPollution > 40
          ? 'Isole as indústrias pesadas do centro urbano criando um cinturão de parques e árvores.'
          : 'Espalhe praças com fontes e parques municipais para elevar o valor da terra.',
    },
  ];

  return {
    updatedGrid: newGrid,
    updatedStats,
    updatedBudget: newBudget,
    updatedDate: newDate,
    advisors,
    newNews,
    monthCompleted,
  };
}
