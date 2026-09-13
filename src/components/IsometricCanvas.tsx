import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Tile, ActiveTool, ViewOverlay, Car } from '../types';
import { BUILDINGS_CATALOG } from '../simulation/buildingData';
import { sounds } from '../audio/soundManager';
import {
  Hand,
  Hammer,
  Plus,
  Minus,
  Maximize2,
  Crosshair,
  Shovel,
  MousePointer,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
} from 'lucide-react';

interface IsometricCanvasProps {
  grid: Tile[][];
  activeTool: ActiveTool;
  viewOverlay: ViewOverlay;
  isNight: boolean;
  onTileClick: (x: number, y: number, isDrag?: boolean) => void;
  onTilesBatchAction: (tiles: { x: number; y: number }[], tool: ActiveTool) => void;
  selectedTile: Tile | null;
  onSelectTile: (tile: Tile | null) => void;
  treasury: number;
  multiplayer?: {
    myRole?: string;
    partnerRole?: string;
    partnerName?: string;
    partnerCursor?: { x: number; y: number };
  };
  onBroadcastCursor?: (x: number, y: number) => void;
}

const TILE_BASE_W = 64;
const TILE_BASE_H = 32;

interface Cloud {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
}

export const IsometricCanvas: React.FC<IsometricCanvasProps> = ({
  grid,
  activeTool,
  viewOverlay,
  isNight,
  onTileClick,
  onTilesBatchAction,
  selectedTile,
  onSelectTile,
  multiplayer,
  onBroadcastCursor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera state
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1.0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Mobile Touch Mode: 'pan' (safe navigation) vs 'build' (place buildings on tap)
  const [touchMode, setTouchMode] = useState<'pan' | 'build'>('build');
  const [showDpad, setShowDpad] = useState(true);

  // Hover & Drag selection state
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);
  const [dragStartTile, setDragStartTile] = useState<{ x: number; y: number } | null>(null);
  const [dragEndTile, setDragEndTile] = useState<{ x: number; y: number } | null>(null);

  // Animated elements (cars, smoke, turbines, water, clouds)
  const animFrameRef = useRef<number>(0);
  const turbineAngleRef = useRef<number>(0);
  const waterTimeRef = useRef<number>(0);
  const carsRef = useRef<Car[]>([]);
  const smokeParticlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[]
  >([]);
  const cloudsRef = useRef<Cloud[]>([
    { x: -100, y: 80, speed: 0.25, size: 90, opacity: 0.35 },
    { x: 300, y: 220, speed: 0.18, size: 120, opacity: 0.4 },
    { x: 700, y: 140, speed: 0.22, size: 80, opacity: 0.3 },
  ]);

  // Touch tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number; moved: boolean } | null>(null);
  const pinchDistRef = useRef<number | null>(null);

  const mapSize = grid.length;

  // Initialize camera position to center map
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setCamera({
        x: clientWidth / 2,
        y: Math.max(90, clientHeight / 4),
        zoom: window.innerWidth < 640 ? 0.85 : 1.05,
      });
    }
  }, []);

  // Initialize and update cars driving on roads
  useEffect(() => {
    const roads: { x: number; y: number }[] = [];
    for (let y = 0; y < mapSize; y++) {
      for (let x = 0; x < mapSize; x++) {
        if (grid[y][x].buildingId === 'road') {
          roads.push({ x, y });
        }
      }
    }

    if (roads.length >= 2 && carsRef.current.length < Math.min(20, Math.max(4, Math.floor(roads.length / 2)))) {
      const carTypes = [
        { color: '#ef4444', speed: 0.024 }, // red sports
        { color: '#eab308', speed: 0.02 },  // yellow taxi
        { color: '#3b82f6', speed: 0.018 }, // blue sedan
        { color: '#ffffff', speed: 0.02 },  // white compact
        { color: '#10b981', speed: 0.016 }, // green van
        { color: '#8b5cf6', speed: 0.022 }, // purple car
      ];
      const newCars: Car[] = [];
      const count = Math.min(18, Math.max(3, Math.floor(roads.length / 3)));
      for (let i = 0; i < count; i++) {
        const startRoad = roads[Math.floor(Math.random() * roads.length)];
        const model = carTypes[Math.floor(Math.random() * carTypes.length)];
        newCars.push({
          id: 'car_' + Math.random(),
          x: startRoad.x,
          y: startRoad.y,
          targetX: startRoad.x,
          targetY: startRoad.y,
          progress: 0,
          speed: model.speed + Math.random() * 0.006,
          color: model.color,
        });
      }
      carsRef.current = newCars;
    }
  }, [grid, mapSize]);

  // Coordinate Conversion Helpers
  const gridToScreen = useCallback(
    (gx: number, gy: number, zoom: number, camX: number, camY: number) => {
      const tw = TILE_BASE_W * zoom;
      const th = TILE_BASE_H * zoom;
      return {
        x: (gx - gy) * (tw / 2) + camX,
        y: (gx + gy) * (th / 2) + camY,
      };
    },
    []
  );

  const screenToGrid = useCallback(
    (sx: number, sy: number, zoom: number, camX: number, camY: number) => {
      const tw = TILE_BASE_W * zoom;
      const th = TILE_BASE_H * zoom;
      const relX = sx - camX;
      const relY = sy - camY;

      const gx = Math.floor((relY / (th / 2) + relX / (tw / 2)) / 2);
      const gy = Math.floor((relY / (th / 2) - relX / (tw / 2)) / 2);
      return { x: gx, y: gy };
    },
    []
  );

  // Compute bounding box tiles for drag-to-build
  const getSelectedTilesArea = useCallback(
    (start: { x: number; y: number }, end: { x: number; y: number }) => {
      const tiles: { x: number; y: number }[] = [];
      const minX = Math.max(0, Math.min(start.x, end.x));
      const maxX = Math.min(mapSize - 1, Math.max(start.x, end.x));
      const minY = Math.max(0, Math.min(start.y, end.y));
      const maxY = Math.min(mapSize - 1, Math.max(start.y, end.y));

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          tiles.push({ x, y });
        }
      }
      return tiles;
    },
    [mapSize]
  );

  // High-DPI Canvas Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        canvasRef.current.width = w * dpr;
        canvasRef.current.height = h * dpr;
        canvasRef.current.style.width = `${w}px`;
        canvasRef.current.style.height = `${h}px`;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main High-Quality Render Loop
  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Sky Background with subtle atmospheric gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isNight) {
        skyGrad.addColorStop(0, '#060a12');
        skyGrad.addColorStop(0.5, '#0b1329');
        skyGrad.addColorStop(1, '#0f172a');
      } else {
        skyGrad.addColorStop(0, '#bae6fd');
        skyGrad.addColorStop(0.4, '#e0f2fe');
        skyGrad.addColorStop(1, '#f1f5f9');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Animation timers
      waterTimeRef.current += 0.03;
      turbineAngleRef.current += 0.05;

      // Update Smoke Particles
      if (Math.random() < 0.35) {
        for (let y = 0; y < mapSize; y++) {
          for (let x = 0; x < mapSize; x++) {
            const tile = grid[y][x];
            if (
              tile.onFire ||
              tile.buildingId === 'coal_plant' ||
              tile.buildingId === 'ind_med_1' ||
              tile.buildingId === 'ind_high_1'
            ) {
              if (Math.random() < 0.3) {
                const sPos = gridToScreen(x, y, camera.zoom, camera.x, camera.y);
                smokeParticlesRef.current.push({
                  x: sPos.x + (Math.random() - 0.5) * 6 * camera.zoom,
                  y: sPos.y - (tile.onFire ? 15 : 32) * camera.zoom,
                  vx: (Math.random() - 0.5) * 0.35 + 0.15,
                  vy: -(0.6 + Math.random() * 0.5),
                  life: 0,
                  maxLife: 45 + Math.random() * 30,
                  size: 3 + Math.random() * 4,
                });
              }
            }
          }
        }
      }

      // Update Clouds
      for (const cloud of cloudsRef.current) {
        cloud.x += cloud.speed;
        if (cloud.x > width + 200) {
          cloud.x = -250;
          cloud.y = 40 + Math.random() * (height * 0.6);
        }
      }

      // Draw Tiles in Isometric Painter's Order (back to front)
      const tw = TILE_BASE_W * camera.zoom;
      const th = TILE_BASE_H * camera.zoom;

      let selectedAreaTiles: { x: number; y: number }[] = [];
      if (dragStartTile && dragEndTile) {
        selectedAreaTiles = getSelectedTilesArea(dragStartTile, dragEndTile);
      }

      // 1. Draw 3D Ground Diorama Base Edge for map boundary
      drawMapBasePlinth(ctx, mapSize, tw, th, camera.x, camera.y, isNight);

      // 2. Loop through all tiles in painter's order
      for (let sum = 0; sum <= 2 * (mapSize - 1); sum++) {
        for (let x = 0; x < mapSize; x++) {
          const y = sum - x;
          if (y < 0 || y >= mapSize) continue;

          const tile = grid[y][x];
          const pos = gridToScreen(x, y, camera.zoom, camera.x, camera.y);

          // Culling check: skip offscreen tiles
          if (
            pos.x < -tw * 3 ||
            pos.x > width + tw * 3 ||
            pos.y < -th * 4 ||
            pos.y > height + th * 4
          ) {
            continue;
          }

          // A. Draw Isometric Ground Tile
          drawTileTerrain(ctx, tile, pos.x, pos.y, tw, th, isNight, waterTimeRef.current, x, y);

          // B. Draw Cast Shadow on ground if building or tree present
          if (tile.buildingId && tile.buildingId !== 'road' && tile.buildingId !== 'rubble') {
            drawBuildingShadow(ctx, tile, pos.x, pos.y, tw, th, camera.zoom);
          } else if (tile.terrain === 'forest' && !tile.buildingId) {
            drawForestShadow(ctx, pos.x, pos.y, tw, th, camera.zoom);
          }

          // C. Forest Trees
          if (tile.terrain === 'forest' && !tile.buildingId && tile.zone === 'none') {
            drawTreeCluster(ctx, pos.x, pos.y + th / 2, camera.zoom, isNight, x, y);
          }

          // D. Buildings & Infrastructure
          if (tile.buildingId) {
            drawBuilding(
              ctx,
              tile,
              pos.x,
              pos.y,
              camera.zoom,
              isNight,
              grid,
              mapSize,
              turbineAngleRef.current
            );
          } else if (tile.zone !== 'none') {
            // Empty zone marker
            drawEmptyZoneMarker(ctx, tile.zone, pos.x, pos.y, tw, th, isNight);
          }

          // E. Status Badges (No Power / No Water / Abandoned)
          if (
            tile.buildingId &&
            tile.buildingId !== 'road' &&
            tile.buildingId !== 'rubble' &&
            tile.buildingId !== 'fire'
          ) {
            if (tile.abandoned) {
              drawBadge(ctx, '🏚️', pos.x, pos.y - 32 * camera.zoom, camera.zoom, '#475569');
            } else if (!tile.hasPower) {
              drawBadge(ctx, '⚡', pos.x - 10 * camera.zoom, pos.y - 30 * camera.zoom, camera.zoom, '#ef4444');
            } else if (!tile.hasWater) {
              drawBadge(ctx, '💧', pos.x + 10 * camera.zoom, pos.y - 30 * camera.zoom, camera.zoom, '#0284c7');
            }
          }

          // F. Overlays
          if (viewOverlay !== 'none') {
            drawOverlayTile(ctx, tile, viewOverlay, pos.x, pos.y, tw, th);
          }

          // G. Hover & Selection Highlight
          const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;
          const isSelected = selectedTile && selectedTile.x === x && selectedTile.y === y;
          const isInDragArea = selectedAreaTiles.some((t) => t.x === x && t.y === y);

          if (isHovered || isSelected || isInDragArea) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(pos.x + tw / 2, pos.y + th / 2);
            ctx.lineTo(pos.x, pos.y + th);
            ctx.lineTo(pos.x - tw / 2, pos.y + th / 2);
            ctx.closePath();

            if (activeTool.type === 'bulldoze') {
              ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
              ctx.strokeStyle = '#ef4444';
            } else if (isSelected) {
              ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
              ctx.strokeStyle = '#facc15';
            } else if (isInDragArea) {
              ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
              ctx.strokeStyle = '#38bdf8';
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
              ctx.strokeStyle = '#ffffff';
            }
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
          }
        }
      }

      // 3. Draw Tiny Animated Cars on Roads
      drawCars(ctx, carsRef.current, grid, mapSize, camera.zoom, camera.x, camera.y, isNight);

      // 4. Draw Smoke & Fire Particles
      ctx.save();
      for (let i = smokeParticlesRef.current.length - 1; i >= 0; i--) {
        const p = smokeParticlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.09;

        const alpha = Math.max(0, 1 - p.life / p.maxLife) * (isNight ? 0.4 : 0.55);
        ctx.fillStyle = isNight ? `rgba(148, 163, 184, ${alpha})` : `rgba(80, 95, 115, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * camera.zoom, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          smokeParticlesRef.current.splice(i, 1);
        }
      }
      ctx.restore();

      // 5. Draw Drifting Fluffy Clouds & Soft Cloud Shadows
      drawClouds(ctx, cloudsRef.current, width, height, isNight);

      // 6. Night Atmosphere Tint
      if (isNight) {
        ctx.save();
        ctx.fillStyle = 'rgba(8, 14, 38, 0.38)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 7. Multiplayer Regional Border & Partner Mayor Cursor
      if (multiplayer) {
        ctx.save();
        const midY = Math.floor(mapSize / 2);

        // Draw Regional Boundary Line between North & South District
        ctx.beginPath();
        for (let x = 0; x < mapSize; x++) {
          const pt = gridToScreen(x, midY, camera.zoom, camera.x, camera.y);
          if (x === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)'; // Amber gold dashed boundary
        ctx.lineWidth = 2.5 * camera.zoom;
        ctx.setLineDash([8 * camera.zoom, 6 * camera.zoom]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Boundary Badge
        const badgePt = gridToScreen(Math.floor(mapSize / 2), midY, camera.zoom, camera.x, camera.y);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        const bW = 140 * camera.zoom;
        const bH = 22 * camera.zoom;
        ctx.beginPath();
        ctx.roundRect(badgePt.x - bW / 2, badgePt.y - bH / 2, bW, bH, 6 * camera.zoom);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = `bold ${Math.max(10, 11 * camera.zoom)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏛️ Fronteira Regional', badgePt.x, badgePt.y);

        // Partner Mayor Live Cursor Pin
        if (multiplayer.partnerCursor) {
          const pPt = gridToScreen(
            multiplayer.partnerCursor.x,
            multiplayer.partnerCursor.y,
            camera.zoom,
            camera.x,
            camera.y
          );
          const pColor = multiplayer.partnerRole === 'mayor_north' ? '#3b82f6' : '#10b981';
          const pName =
            multiplayer.partnerName ||
            (multiplayer.partnerRole === 'mayor_north' ? 'Prefeito Norte' : 'Prefeito Sul');

          // Pulsing halo
          const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
          ctx.beginPath();
          ctx.arc(
            pPt.x,
            pPt.y + (TILE_BASE_H * camera.zoom) / 2,
            (16 + pulse * 8) * camera.zoom,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `${pColor}33`;
          ctx.fill();

          // Marker Pin
          ctx.beginPath();
          ctx.arc(
            pPt.x,
            pPt.y + (TILE_BASE_H * camera.zoom) / 2 - 14 * camera.zoom,
            7 * camera.zoom,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = pColor;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2 * camera.zoom;
          ctx.stroke();

          // Mayor Name Tag
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = pColor;
          ctx.lineWidth = 1;
          const tagW = 110 * camera.zoom;
          const tagH = 20 * camera.zoom;
          ctx.beginPath();
          ctx.roundRect(pPt.x - tagW / 2, pPt.y - 38 * camera.zoom, tagW, tagH, 5 * camera.zoom);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(9, 10 * camera.zoom)}px system-ui, sans-serif`;
          ctx.fillText(`👤 ${pName}`, pPt.x, pPt.y - 28 * camera.zoom);
        }

        ctx.restore();
      }

      ctx.restore(); // restore dpr scale

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    grid,
    camera,
    activeTool,
    viewOverlay,
    isNight,
    hoveredTile,
    selectedTile,
    dragStartTile,
    dragEndTile,
    mapSize,
    gridToScreen,
    getSelectedTilesArea,
    multiplayer,
  ]);

  // Touch Event Handlers (Fluid 1-finger Panning, 2-finger Pinch Zoom & Tap to Build)
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      touchStartRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        lastX: touch.clientX,
        lastY: touch.clientY,
        time: Date.now(),
        isPanning: false,
      };

      // If already in Pan mode or active tool is pan, immediately activate panning
      if (touchMode === 'pan' || activeTool.type === 'pan') {
        setIsPanning(true);
        setPanStart({ x: touch.clientX - camera.x, y: touch.clientY - camera.y });
      }
    } else if (e.touches.length === 2) {
      // 2 fingers = Pinch to zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinchDistRef.current = dist;
      setIsPanning(false);
      setDragStartTile(null);
      setDragEndTile(null);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent native mobile rubber-banding / browser scrolling

    if (e.touches.length === 1 && touchStartRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.lastX;
      const dy = touch.clientY - touchStartRef.current.lastY;
      const totalDist = Math.hypot(
        touch.clientX - touchStartRef.current.startX,
        touch.clientY - touchStartRef.current.startY
      );

      // Any motion greater than 5px activates instant fluid camera dragging
      if (totalDist > 5 || touchMode === 'pan' || activeTool.type === 'pan') {
        touchStartRef.current.isPanning = true;
        setCamera((prev) => ({
          ...prev,
          x: prev.x + dx,
          y: prev.y + dy,
        }));
        touchStartRef.current.lastX = touch.clientX;
        touchStartRef.current.lastY = touch.clientY;
      }
    } else if (e.touches.length === 2 && pinchDistRef.current !== null) {
      // Pinch to zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const newDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = newDist / pinchDistRef.current;
      pinchDistRef.current = newDist;

      setCamera((prev) => {
        const nextZoom = Math.max(0.4, Math.min(2.4, prev.zoom * ratio));
        return {
          ...prev,
          zoom: nextZoom,
        };
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (pinchDistRef.current !== null) {
      pinchDistRef.current = null;
      return;
    }

    if (isPanning) {
      setIsPanning(false);
    }

    // Tap detection: released without dragging (under 6px movement)
    if (touchStartRef.current && !touchStartRef.current.isPanning) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const sx = touchStartRef.current.startX - rect.left;
        const sy = touchStartRef.current.startY - rect.top;
        const gPos = screenToGrid(sx, sy, camera.zoom, camera.x, camera.y);

        if (gPos.x >= 0 && gPos.x < mapSize && gPos.y >= 0 && gPos.y < mapSize) {
          // Subtle mobile haptic feedback
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(14);
          }

          if (activeTool.type === 'select' || touchMode === 'pan') {
            sounds.playClick();
            onSelectTile(grid[gPos.y][gPos.x]);
          } else {
            onTileClick(gPos.x, gPos.y, false);
          }

          // Broadcast cursor to partner mayor in multiplayer
          onBroadcastCursor?.(gPos.x, gPos.y);
        }
      }
    }

    touchStartRef.current = null;
    setDragStartTile(null);
    setDragEndTile(null);
  };

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      e.button === 1 ||
      e.button === 2 ||
      activeTool.type === 'pan' ||
      e.shiftKey ||
      e.altKey ||
      touchMode === 'pan'
    ) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - camera.x, y: e.clientY - camera.y });
      return;
    }

    if (e.button === 0) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const gPos = screenToGrid(sx, sy, camera.zoom, camera.x, camera.y);

      if (gPos.x >= 0 && gPos.x < mapSize && gPos.y >= 0 && gPos.y < mapSize) {
        if (activeTool.type === 'select') {
          sounds.playClick();
          onSelectTile(grid[gPos.y][gPos.x]);
        } else {
          setDragStartTile(gPos);
          setDragEndTile(gPos);
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (isPanning) {
      setCamera((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
      return;
    }

    const gPos = screenToGrid(sx, sy, camera.zoom, camera.x, camera.y);
    if (gPos.x >= 0 && gPos.x < mapSize && gPos.y >= 0 && gPos.y < mapSize) {
      setHoveredTile(gPos);
      if (dragStartTile) {
        setDragEndTile(gPos);
      }
    } else {
      setHoveredTile(null);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (dragStartTile && dragEndTile) {
      const tiles = getSelectedTilesArea(dragStartTile, dragEndTile);
      if (tiles.length === 1) {
        onTileClick(tiles[0].x, tiles[0].y, false);
      } else if (tiles.length > 1) {
        onTilesBatchAction(tiles, activeTool);
      }
      setDragStartTile(null);
      setDragEndTile(null);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setCamera((prev) => {
      const newZoom = Math.max(0.4, Math.min(2.4, prev.zoom * zoomFactor));
      return {
        ...prev,
        zoom: newZoom,
      };
    });
  };

  // Center camera on city
  const handleCenterCity = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setCamera({
        x: clientWidth / 2,
        y: Math.max(90, clientHeight / 4),
        zoom: window.innerWidth < 640 ? 0.85 : 1.05,
      });
      sounds.playClick();
    }
  };

  // Toggle Fullscreen for native mobile gaming feel
  const handleToggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      id="city-viewport-container"
      className="relative w-full h-full overflow-hidden select-none bg-slate-950 touch-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        id="city-isometric-canvas"
        className="w-full h-full block cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* MOBILE CONTROLLER HUD (Thumb-friendly floating controls) */}
      <div
        id="mobile-touch-hud"
        className="absolute bottom-5 right-3 z-20 flex flex-col items-end gap-2 pointer-events-auto"
      >
        {/* Quick D-Pad Navigation Buttons for effortless 1-touch mobile panning */}
        {showDpad && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md grid grid-cols-3 gap-1 w-28">
            <div />
            <button
              id="dpad-up"
              title="Mover para Cima"
              onClick={() => {
                sounds.playClick();
                setCamera((prev) => ({ ...prev, y: prev.y + 110 }));
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center text-slate-200"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div />

            <button
              id="dpad-left"
              title="Mover para Esquerda"
              onClick={() => {
                sounds.playClick();
                setCamera((prev) => ({ ...prev, x: prev.x + 110 }));
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center text-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="dpad-center"
              title="Centralizar Câmera na Cidade"
              onClick={handleCenterCity}
              className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-400 flex items-center justify-center text-white"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              id="dpad-right"
              title="Mover para Direita"
              onClick={() => {
                sounds.playClick();
                setCamera((prev) => ({ ...prev, x: prev.x - 110 }));
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center text-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div />
            <button
              id="dpad-down"
              title="Mover para Baixo"
              onClick={() => {
                sounds.playClick();
                setCamera((prev) => ({ ...prev, y: prev.y - 110 }));
              }}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-blue-600 flex items-center justify-center text-slate-200"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            <div />
          </div>
        )}

        {/* Touch Mode Switcher: Pan vs Build */}
        <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-2xl backdrop-blur-md">
          <button
            id="btn-mode-pan"
            title="Modo Mover: Arraste com 1 dedo para navegar livremente"
            onClick={() => {
              setTouchMode('pan');
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              touchMode === 'pan'
                ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Hand className="w-4 h-4" />
            <span className="text-[11px]">Navegar</span>
          </button>
          <button
            id="btn-mode-build"
            title="Modo Construir: Toque no mapa para posicionar construções"
            onClick={() => {
              setTouchMode('build');
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              touchMode === 'build'
                ? 'bg-emerald-500 text-slate-950 shadow-lg scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span className="text-[11px]">Construir</span>
          </button>
        </div>

        {/* Camera Navigation Stack */}
        <div className="flex flex-col bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-2xl backdrop-blur-md gap-1">
          <button
            id="btn-zoom-in"
            title="Aproximar Câmera"
            onClick={() => {
              sounds.playClick();
              setCamera((prev) => ({ ...prev, zoom: Math.min(2.4, prev.zoom * 1.2) }));
            }}
            className="w-9 h-9 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:bg-slate-700 rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            id="btn-zoom-out"
            title="Afastar Câmera"
            onClick={() => {
              sounds.playClick();
              setCamera((prev) => ({ ...prev, zoom: Math.max(0.4, prev.zoom * 0.82) }));
            }}
            className="w-9 h-9 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:bg-slate-700 rounded-xl transition-all"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            id="btn-toggle-dpad"
            title="Alternar Setas de Navegação na Tela"
            onClick={() => setShowDpad(!showDpad)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
              showDpad ? 'text-blue-400 bg-blue-950/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            id="btn-fullscreen-toggle"
            title="Modo Tela Cheia (Imersão Android)"
            onClick={handleToggleFullscreen}
            className="w-9 h-9 flex items-center justify-center text-slate-200 hover:text-white hover:bg-slate-800 active:bg-slate-700 rounded-xl transition-all"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Mini Tooltip on Hover / Selected */}
      {hoveredTile && grid[hoveredTile.y] && grid[hoveredTile.y][hoveredTile.x] && (
        <div className="absolute bottom-5 left-4 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 shadow-2xl flex items-center gap-2.5 max-w-[280px]">
          <span className="font-mono text-slate-400 text-[10px]">
            [{hoveredTile.x},{hoveredTile.y}]
          </span>
          <span className="font-semibold text-amber-300 truncate">
            {grid[hoveredTile.y][hoveredTile.x].buildingId
              ? BUILDINGS_CATALOG[grid[hoveredTile.y][hoveredTile.x].buildingId!]?.name
              : grid[hoveredTile.y][hoveredTile.x].zone !== 'none'
              ? `Zona ${grid[hoveredTile.y][hoveredTile.x].zone.toUpperCase()}`
              : grid[hoveredTile.y][hoveredTile.x].terrain.toUpperCase()}
          </span>
          {grid[hoveredTile.y][hoveredTile.x].population > 0 && (
            <span className="text-emerald-400 font-medium">
              👥 {grid[hoveredTile.y][hoveredTile.x].population}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// RENDERING HELPER FUNCTIONS
// ==========================================

// Draw 3D Base Plinth (Diorama table slab under the map)
function drawMapBasePlinth(
  ctx: CanvasRenderingContext2D,
  mapSize: number,
  tw: number,
  th: number,
  camX: number,
  camY: number,
  isNight: boolean
) {
  const plinthH = 14;
  const topScreen = {
    x: camX,
    y: camY,
  };
  const rightScreen = {
    x: (mapSize) * (tw / 2) + camX,
    y: (mapSize) * (th / 2) + camY,
  };
  const bottomScreen = {
    x: camX,
    y: 2 * mapSize * (th / 2) + camY,
  };
  const leftScreen = {
    x: -(mapSize) * (tw / 2) + camX,
    y: (mapSize) * (th / 2) + camY,
  };

  // Left vertical cliff face
  ctx.beginPath();
  ctx.moveTo(leftScreen.x, leftScreen.y);
  ctx.lineTo(bottomScreen.x, bottomScreen.y);
  ctx.lineTo(bottomScreen.x, bottomScreen.y + plinthH);
  ctx.lineTo(leftScreen.x, leftScreen.y + plinthH);
  ctx.closePath();
  ctx.fillStyle = isNight ? '#09101d' : '#334155';
  ctx.fill();

  // Right vertical cliff face
  ctx.beginPath();
  ctx.moveTo(bottomScreen.x, bottomScreen.y);
  ctx.lineTo(rightScreen.x, rightScreen.y);
  ctx.lineTo(rightScreen.x, rightScreen.y + plinthH);
  ctx.lineTo(bottomScreen.x, bottomScreen.y + plinthH);
  ctx.closePath();
  ctx.fillStyle = isNight ? '#0d1527' : '#1e293b';
  ctx.fill();
}

// Draw Isometric Ground Tile with rich textures & shorelines
function drawTileTerrain(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  px: number,
  py: number,
  tw: number,
  th: number,
  isNight: boolean,
  waterTime: number,
  gx: number,
  gy: number
) {
  // Ground Diamond
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px + tw / 2, py + th / 2);
  ctx.lineTo(px, py + th);
  ctx.lineTo(px - tw / 2, py + th / 2);
  ctx.closePath();

  let fill = '#22c55e';

  if (tile.terrain === 'water') {
    // Shimmering animated water
    const waterGrad = ctx.createLinearGradient(px - tw / 2, py, px + tw / 2, py + th);
    if (isNight) {
      waterGrad.addColorStop(0, '#1e3a8a');
      waterGrad.addColorStop(1, '#172554');
    } else {
      waterGrad.addColorStop(0, '#38bdf8');
      waterGrad.addColorStop(1, '#0284c7');
    }
    fill = waterGrad as unknown as string;
  } else if (tile.terrain === 'deep_water') {
    fill = isNight ? '#0f172a' : '#0369a1';
  } else if (tile.terrain === 'sand') {
    fill = isNight ? '#78716c' : '#fde047';
  } else if (tile.terrain === 'forest') {
    fill = isNight ? '#14532d' : '#15803d';
  } else {
    // Rich Grass variations
    const hash = (gx * 19 + gy * 37) % 5;
    if (isNight) {
      fill = hash === 0 ? '#064e3b' : hash === 1 ? '#065f46' : hash === 2 ? '#047857' : '#022c22';
    } else {
      fill = hash === 0 ? '#3cd070' : hash === 1 ? '#22c55e' : hash === 2 ? '#16a34a' : '#4ade80';
    }
  }

  // Zone underlay colors
  if (tile.zone === 'residential') {
    fill = isNight ? '#064e3b' : '#86efac';
  } else if (tile.zone === 'commercial') {
    fill = isNight ? '#1e3a8a' : '#93c5fd';
  } else if (tile.zone === 'industrial') {
    fill = isNight ? '#713f12' : '#fef08a';
  }

  ctx.fillStyle = fill;
  ctx.fill();

  // Subtle isometric tile border
  ctx.strokeStyle = isNight ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Water waves and foam sparkles
  if (tile.terrain === 'water' || tile.terrain === 'deep_water') {
    ctx.save();
    ctx.fillStyle = isNight ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)';
    const wave = Math.sin(waterTime * 2 + gx * 1.5 + gy * 1.5) * 2;
    ctx.fillRect(px - 10, py + th / 2 + wave, 14, 1.5);
    ctx.fillRect(px + 4, py + th / 2 - wave, 8, 1);
    ctx.restore();
  }
}

// Draw Soft Cast Shadow under buildings
function drawBuildingShadow(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number
) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  // Projected isometric shadow to the right
  ctx.ellipse(
    px + 8 * zoom,
    py + th / 2 + 4 * zoom,
    18 * zoom,
    8 * zoom,
    0.4,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

// Forest Tree Cluster Cast Shadow
function drawForestShadow(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number
) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.ellipse(px + 4 * zoom, py + th / 2 + 3 * zoom, 16 * zoom, 7 * zoom, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Draw 3D Isometric Tree Clusters in forests
function drawTreeCluster(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  zoom: number,
  isNight: boolean,
  gx: number,
  gy: number
) {
  const hash = (gx * 13 + gy * 29) % 3;
  // 3 little isometric trees per forest tile
  drawSingleTree(ctx, baseX - 10 * zoom, baseY - 2 * zoom, zoom * 0.9, isNight, hash === 0);
  drawSingleTree(ctx, baseX + 8 * zoom, baseY + 4 * zoom, zoom * 0.85, isNight, hash === 1);
  drawSingleTree(ctx, baseX, baseY + 2 * zoom, zoom * 1.1, isNight, hash === 2);
}

function drawSingleTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zoom: number,
  isNight: boolean,
  isPine: boolean
) {
  const trunkH = 7 * zoom;
  // Trunk
  ctx.fillStyle = isNight ? '#451a03' : '#78350f';
  ctx.fillRect(x - 1.5 * zoom, y - trunkH, 3 * zoom, trunkH);

  if (isPine) {
    // Conifer Pine Tree
    const topY = y - trunkH;
    ctx.fillStyle = isNight ? '#064e3b' : '#14532d';
    // Tier 1
    ctx.beginPath();
    ctx.moveTo(x, topY - 14 * zoom);
    ctx.lineTo(x + 7 * zoom, topY - 5 * zoom);
    ctx.lineTo(x - 7 * zoom, topY - 5 * zoom);
    ctx.closePath();
    ctx.fill();
    // Tier 2
    ctx.fillStyle = isNight ? '#047857' : '#15803d';
    ctx.beginPath();
    ctx.moveTo(x, topY - 8 * zoom);
    ctx.lineTo(x + 9 * zoom, topY);
    ctx.lineTo(x - 9 * zoom, topY);
    ctx.closePath();
    ctx.fill();
  } else {
    // Round Lush Oak Tree
    const crownR = 7 * zoom;
    const cy = y - trunkH - crownR * 0.7;

    // Darker underside
    ctx.beginPath();
    ctx.arc(x, cy, crownR, 0, Math.PI * 2);
    ctx.fillStyle = isNight ? '#064e3b' : '#15803d';
    ctx.fill();

    // Highlight top leaf cluster
    ctx.beginPath();
    ctx.arc(x + 2 * zoom, cy - 3 * zoom, crownR * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = isNight ? '#047857' : '#22c55e';
    ctx.fill();
  }
}

// Draw Empty Zone Marker
function drawEmptyZoneMarker(
  ctx: CanvasRenderingContext2D,
  zone: string,
  px: number,
  py: number,
  tw: number,
  th: number,
  isNight: boolean
) {
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle =
    zone === 'residential'
      ? '#22c55e'
      : zone === 'commercial'
      ? '#38bdf8'
      : '#facc15';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, py + 4);
  ctx.lineTo(px + tw / 2 - 6, py + th / 2);
  ctx.lineTo(px, py + th - 4);
  ctx.lineTo(px - tw / 2 + 6, py + th / 2);
  ctx.closePath();
  ctx.stroke();

  // Zone Letter in Center
  ctx.fillStyle =
    zone === 'residential'
      ? '#16a34a'
      : zone === 'commercial'
      ? '#0284c7'
      : '#ca8a04';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(zone[0].toUpperCase(), px, py + th / 2);
  ctx.restore();
}

// Main Building Router with Superior Visual Quality
function drawBuilding(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  px: number,
  py: number,
  zoom: number,
  isNight: boolean,
  grid: Tile[][],
  mapSize: number,
  turbineAngle: number
) {
  const bId = tile.buildingId;
  if (!bId) return;

  const tw = TILE_BASE_W * zoom;
  const th = TILE_BASE_H * zoom;

  // 1. High-Detail Connected Roads with Sidewalks and Crosswalks
  if (bId === 'road') {
    drawDetailedRoad(ctx, tile.x, tile.y, px, py, tw, th, grid, mapSize, isNight, zoom);
    return;
  }

  // 2. Power Lines with wooden poles & wires
  if (bId === 'power_line') {
    drawPowerLine(ctx, px, py, tw, th, zoom, isNight);
    return;
  }

  // 3. Water Pipe
  if (bId === 'water_pipe') {
    drawWaterPipe(ctx, px, py, tw, th, zoom);
    return;
  }

  // 4. Fire & Rubble
  if (bId === 'fire' || tile.onFire) {
    drawFire(ctx, px, py, tw, th, zoom);
    return;
  }
  if (bId === 'rubble') {
    drawRubble(ctx, px, py, tw, th, zoom, isNight);
    return;
  }

  // 5. Clean Wind Turbine
  if (bId === 'wind_turbine') {
    drawWindTurbine(ctx, px, py, zoom, isNight, turbineAngle);
    return;
  }

  // 6. Civic & Utilities
  if (bId === 'coal_plant') {
    drawCoalPlant(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'solar_plant') {
    drawSolarPlant(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'nuclear_plant') {
    drawNuclearPlant(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'water_tower') {
    drawWaterTower(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'water_pump') {
    drawWaterPump(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'police_station') {
    drawPoliceStation(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'fire_station') {
    drawFireStation(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'hospital') {
    drawHospital(ctx, px, py, tw, th, zoom, isNight);
    return;
  }
  if (bId === 'elementary_school' || bId === 'high_school') {
    drawSchool(ctx, px, py, tw, th, zoom, isNight, bId === 'high_school');
    return;
  }
  if (bId === 'small_park' || bId === 'large_park' || bId === 'fountain_plaza') {
    drawPark(ctx, px, py, tw, th, zoom, isNight, bId);
    return;
  }
  if (bId === 'sports_stadium') {
    drawStadium(ctx, px, py, tw, th, zoom, isNight);
    return;
  }

  // 7. Zone Developments (Pitched houses, modern skyscrapers, brick factories)
  drawZoneBuilding(ctx, bId, tile, px, py, tw, th, zoom, isNight);
}

// Detailed Connected Road Drawing with Asphalt, Sidewalks, Streetlamps
function drawDetailedRoad(
  ctx: CanvasRenderingContext2D,
  gx: number,
  gy: number,
  px: number,
  py: number,
  tw: number,
  th: number,
  grid: Tile[][],
  mapSize: number,
  isNight: boolean,
  zoom: number
) {
  // Concrete Sidewalk Bed
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px + tw / 2, py + th / 2);
  ctx.lineTo(px, py + th);
  ctx.lineTo(px - tw / 2, py + th / 2);
  ctx.closePath();
  ctx.fillStyle = isNight ? '#1e293b' : '#94a3b8';
  ctx.fill();

  // Dark Asphalt Road Surface
  const margin = 5 * zoom;
  ctx.beginPath();
  ctx.moveTo(px, py + margin * 0.5);
  ctx.lineTo(px + tw / 2 - margin, py + th / 2);
  ctx.lineTo(px, py + th - margin * 0.5);
  ctx.lineTo(px - tw / 2 + margin, py + th / 2);
  ctx.closePath();
  ctx.fillStyle = isNight ? '#0f172a' : '#334155';
  ctx.fill();

  // Road connections
  const north = gy > 0 && grid[gy - 1][gx].buildingId === 'road';
  const south = gy < mapSize - 1 && grid[gy + 1][gx].buildingId === 'road';
  const east = gx < mapSize - 1 && grid[gy][gx + 1].buildingId === 'road';
  const west = gx > 0 && grid[gy][gx - 1].buildingId === 'road';

  ctx.strokeStyle = '#facc15'; // yellow center line
  ctx.lineWidth = 1.5 * zoom;
  ctx.setLineDash([4 * zoom, 3 * zoom]);
  ctx.beginPath();

  const cx = px;
  const cy = py + th / 2;

  if (north) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(px + tw / 4, py + th / 4);
  }
  if (south) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(px - tw / 4, py + (3 * th) / 4);
  }
  if (east) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(px + tw / 4, py + (3 * th) / 4);
  }
  if (west) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(px - tw / 4, py + th / 4);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Corner Streetlamp at Night
  if (isNight) {
    const lampX = px + tw / 2 - 8 * zoom;
    const lampY = py + th / 2 - 4 * zoom;
    // Glow circle
    const lampGrad = ctx.createRadialGradient(lampX, lampY, 1, lampX, lampY, 14 * zoom);
    lampGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    lampGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 14 * zoom, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Power Lines with realistic wood poles
function drawPowerLine(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  const poleH = 28 * zoom;
  // Wooden Pole
  ctx.strokeStyle = isNight ? '#78350f' : '#92400e';
  ctx.lineWidth = 2.5 * zoom;
  ctx.beginPath();
  ctx.moveTo(px, py + th / 2);
  ctx.lineTo(px, py + th / 2 - poleH);
  ctx.stroke();

  // Crossarm
  ctx.strokeStyle = isNight ? '#451a03' : '#78350f';
  ctx.lineWidth = 2 * zoom;
  ctx.beginPath();
  ctx.moveTo(px - 10 * zoom, py + th / 2 - poleH + 4 * zoom);
  ctx.lineTo(px + 10 * zoom, py + th / 2 - poleH + 4 * zoom);
  ctx.stroke();

  // Electric Spark
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - poleH, 2.5 * zoom, 0, Math.PI * 2);
  ctx.fill();
}

function drawWaterPipe(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number
) {
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4 * zoom;
  ctx.beginPath();
  ctx.moveTo(px - tw / 4, py + th / 2);
  ctx.lineTo(px + tw / 4, py + th / 2);
  ctx.stroke();
}

// Animated Wind Turbine
function drawWindTurbine(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  zoom: number,
  isNight: boolean,
  angle: number
) {
  const towerH = 46 * zoom;
  const hubY = py + 16 * zoom - towerH;

  // Sleek tapered tower
  ctx.strokeStyle = isNight ? '#cbd5e1' : '#f8fafc';
  ctx.lineWidth = 3.5 * zoom;
  ctx.beginPath();
  ctx.moveTo(px, py + 16 * zoom);
  ctx.lineTo(px, hubY);
  ctx.stroke();

  // Rotor Blades
  ctx.save();
  ctx.translate(px, hubY);
  ctx.strokeStyle = isNight ? '#e2e8f0' : '#ffffff';
  ctx.lineWidth = 2 * zoom;

  for (let i = 0; i < 3; i++) {
    const a = angle + (i * Math.PI * 2) / 3;
    const bladeLen = 20 * zoom;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * bladeLen, Math.sin(a) * bladeLen);
    ctx.stroke();
  }

  // Red beacon
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5 * zoom, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Coal Power Plant with Banded Chimneys & Volumetric Vapors
function drawCoalPlant(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  const h = 32 * zoom;
  drawIsoBox(ctx, px - 6 * zoom, py + th / 2, 28 * zoom, 28 * zoom, h, isNight ? '#334155' : '#475569', isNight);

  // Twin Industrial Chimneys with Warning Bands
  const chimH = 50 * zoom;
  for (const ox of [-10, 10]) {
    const cx = px + ox * zoom;
    const cy = py - chimH + 16 * zoom;
    ctx.fillStyle = isNight ? '#1e293b' : '#334155';
    ctx.fillRect(cx - 3 * zoom, cy, 6 * zoom, chimH);

    // Red & White warning stripes on top
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 3.5 * zoom, cy, 7 * zoom, 3 * zoom);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 3.5 * zoom, cy + 3 * zoom, 7 * zoom, 3 * zoom);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx - 3.5 * zoom, cy + 6 * zoom, 7 * zoom, 3 * zoom);
  }
}

// Photovoltaic Solar Farm
function drawSolarPlant(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const spx = px + dx * 11 * zoom;
      const spy = py + th / 2 + dy * 7 * zoom;
      ctx.fillStyle = isNight ? '#0f172a' : '#1e3a8a';
      ctx.beginPath();
      ctx.ellipse(spx, spy, 8 * zoom, 4 * zoom, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

// Nuclear Plant with Iconic Cooling Towers
function drawNuclearPlant(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  // Main reactor containment dome
  const domeH = 42 * zoom;
  drawIsoBox(ctx, px, py + th / 2, 34 * zoom, 34 * zoom, domeH, isNight ? '#475569' : '#e2e8f0', isNight);

  // Hyperbolic Dome top
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - domeH, 15 * zoom, Math.PI, 0);
  ctx.fillStyle = isNight ? '#64748b' : '#cbd5e1';
  ctx.fill();

  // Radiation Warning Crest
  ctx.fillStyle = '#facc15';
  ctx.font = `bold ${11 * zoom}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('☢', px, py + th / 2 - domeH + 9 * zoom);
}

function drawWaterTower(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  const legH = 28 * zoom;
  const tankR = 14 * zoom;

  // Cross-braced Steel legs
  ctx.strokeStyle = isNight ? '#475569' : '#94a3b8';
  ctx.lineWidth = 2 * zoom;
  ctx.beginPath();
  ctx.moveTo(px - 11 * zoom, py + th / 2);
  ctx.lineTo(px, py + th / 2 - legH);
  ctx.moveTo(px + 11 * zoom, py + th / 2);
  ctx.lineTo(px, py + th / 2 - legH);
  // Cross brace
  ctx.moveTo(px - 10 * zoom, py + th / 2 - legH * 0.5);
  ctx.lineTo(px + 10 * zoom, py + th / 2 - legH * 0.5);
  ctx.stroke();

  // Spherical Water Tank with highlight
  const tankGrad = ctx.createRadialGradient(
    px - 4 * zoom,
    py + th / 2 - legH - tankR * 0.8,
    2 * zoom,
    px,
    py + th / 2 - legH - tankR * 0.7,
    tankR
  );
  if (isNight) {
    tankGrad.addColorStop(0, '#38bdf8');
    tankGrad.addColorStop(1, '#0c4a6e');
  } else {
    tankGrad.addColorStop(0, '#7dd3fc');
    tankGrad.addColorStop(1, '#0284c7');
  }

  ctx.beginPath();
  ctx.arc(px, py + th / 2 - legH - tankR * 0.7, tankR, 0, Math.PI * 2);
  ctx.fillStyle = tankGrad;
  ctx.fill();
  ctx.strokeStyle = '#0369a1';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawWaterPump(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  drawIsoBox(ctx, px, py + th / 2, 24 * zoom, 24 * zoom, 18 * zoom, '#0284c7', isNight);
  // Pipe entering ground
  ctx.strokeStyle = '#075985';
  ctx.lineWidth = 4 * zoom;
  ctx.beginPath();
  ctx.moveTo(px, py + th / 2);
  ctx.lineTo(px + 14 * zoom, py + th / 2 + 8 * zoom);
  ctx.stroke();
}

// Police Station with Flashing Sirens & Helipad
function drawPoliceStation(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  const h = 30 * zoom;
  drawIsoBox(ctx, px, py + th / 2, 30 * zoom, 30 * zoom, h, isNight ? '#1e3a8a' : '#2563eb', isNight);

  // Flashing Beacon
  const flash = Math.sin(Date.now() / 150) > 0;
  ctx.fillStyle = flash ? '#ef4444' : '#38bdf8';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - h - 3 * zoom, 3.5 * zoom, 0, Math.PI * 2);
  ctx.fill();

  // Roof badge
  ctx.font = `${12 * zoom}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🚔', px, py + th / 2 - h * 0.35);
}

// Fire Station with Red Bay Doors
function drawFireStation(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  const h = 28 * zoom;
  drawIsoBox(ctx, px, py + th / 2, 30 * zoom, 30 * zoom, h, isNight ? '#991b1b' : '#dc2626', isNight);

  // Flashing red siren
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - h - 3 * zoom, 3 * zoom, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `${12 * zoom}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🚒', px, py + th / 2 - h * 0.35);
}

// Hospital with Medical Cross and Helipad
function drawHospital(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  const h = 40 * zoom;
  drawIsoBox(ctx, px, py + th / 2, 34 * zoom, 34 * zoom, h, isNight ? '#cbd5e1' : '#f8fafc', isNight);

  // Bright Red Medical Cross on roof
  const ry = py + th / 2 - h;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px - 3.5 * zoom, ry - 10 * zoom, 7 * zoom, 20 * zoom);
  ctx.fillRect(px - 10 * zoom, ry - 3.5 * zoom, 20 * zoom, 7 * zoom);
}

// School with Clock Tower
function drawSchool(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean,
  isHigh: boolean
) {
  const h = (isHigh ? 38 : 26) * zoom;
  drawIsoBox(ctx, px, py + th / 2, 32 * zoom, 32 * zoom, h, isNight ? '#7c2d12' : '#9a3412', isNight);

  // Clock Tower
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - h - 6 * zoom, 3.5 * zoom, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Beautiful Parks with animated water fountain & pathways
function drawPark(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean,
  parkType: string
) {
  // Fountain Basin
  if (parkType === 'fountain_plaza' || parkType === 'large_park') {
    ctx.beginPath();
    ctx.arc(px, py + th / 2, 9 * zoom, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2 * zoom;
    ctx.stroke();

    // Animated water spray
    const sprayWave = Math.sin(Date.now() / 200) * 1.5;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.arc(px, py + th / 2 - 4 * zoom + sprayWave, 3.5 * zoom, 0, Math.PI * 2);
    ctx.fill();
  }

  // Flanking trees
  drawSingleTree(ctx, px - 13 * zoom, py + th / 2 - 3 * zoom, zoom * 0.9, isNight, false);
  drawSingleTree(ctx, px + 13 * zoom, py + th / 2 + 3 * zoom, zoom * 0.9, isNight, false);
}

// Sports Stadium with Green Soccer Pitch & Floodlights
function drawStadium(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  // Grandstand Outer Rim
  ctx.beginPath();
  ctx.ellipse(px, py + th / 2, 26 * zoom, 15 * zoom, 0, 0, Math.PI * 2);
  ctx.fillStyle = isNight ? '#334155' : '#e2e8f0';
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Soccer Turf
  ctx.beginPath();
  ctx.ellipse(px, py + th / 2, 15 * zoom, 9 * zoom, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#16a34a';
  ctx.fill();

  // Field markings
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px, py + th / 2 - 8 * zoom);
  ctx.lineTo(px, py + th / 2 + 8 * zoom);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px, py + th / 2, 3 * zoom, 0, Math.PI * 2);
  ctx.stroke();
}

// Residential, Commercial & Industrial Architectural Buildings
function drawZoneBuilding(
  ctx: CanvasRenderingContext2D,
  bId: string,
  tile: Tile,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  let h = 18 * zoom;
  let color = '#ffffff';
  let isPitchedRoof = false;

  if (tile.zone === 'residential') {
    if (bId === 'res_low_1') {
      h = 16 * zoom;
      color = isNight ? '#78350f' : '#b45309';
      isPitchedRoof = true;
    } else if (bId === 'res_low_2') {
      h = 24 * zoom;
      color = isNight ? '#991b1b' : '#dc2626';
      isPitchedRoof = true;
    } else if (bId === 'res_med_1') {
      h = 44 * zoom;
      color = isNight ? '#334155' : '#64748b';
    } else if (bId === 'res_med_2') {
      h = 58 * zoom;
      color = isNight ? '#1e293b' : '#475569';
    } else if (bId === 'res_high_1' || bId === 'res_high_2') {
      h = 84 * zoom;
      color = isNight ? '#0f172a' : '#0284c7'; // Modern glass skyscraper
    }
  } else if (tile.zone === 'commercial') {
    if (bId === 'com_low_1' || bId === 'com_low_2') {
      h = 20 * zoom;
      color = isNight ? '#1e3a8a' : '#2563eb';
    } else if (bId === 'com_med_1') {
      h = 50 * zoom;
      color = isNight ? '#1e40af' : '#3b82f6';
    } else if (bId === 'com_high_1') {
      h = 92 * zoom;
      color = isNight ? '#172554' : '#1d4ed8'; // Financial Tower
    }
  } else if (tile.zone === 'industrial') {
    if (bId === 'ind_low_1') {
      h = 18 * zoom;
      color = isNight ? '#713f12' : '#854d0e';
    } else if (bId === 'ind_med_1') {
      h = 34 * zoom;
      color = isNight ? '#374151' : '#4b5563';
    } else if (bId === 'ind_high_1') {
      h = 52 * zoom;
      color = isNight ? '#1f2937' : '#374151';
    } else if (bId === 'ind_high_tech') {
      h = 46 * zoom;
      color = isNight ? '#0f766e' : '#06b6d4';
    }
  }

  const bw = 24 * zoom;
  const bd = 24 * zoom;

  if (isPitchedRoof) {
    // 3D House with Pitched Gable Terracotta Roof
    drawIsoHouseWithPitchedRoof(ctx, px, py + th / 2, bw, bd, h, color, isNight, zoom);
  } else {
    // Modern Isometric Prism
    drawIsoBox(ctx, px, py + th / 2, bw, bd, h, color, isNight);

    // Illuminated Windows Grid at Night
    if (isNight && h > 20 * zoom && !tile.abandoned) {
      ctx.fillStyle = '#fef08a';
      const floors = Math.floor(h / (9 * zoom));
      for (let f = 1; f < floors; f++) {
        const wy = py + th / 2 - f * 8.5 * zoom;
        // Left face windows
        ctx.fillRect(px - 9 * zoom, wy, 2.5 * zoom, 3 * zoom);
        ctx.fillRect(px - 4 * zoom, wy + 2 * zoom, 2.5 * zoom, 3 * zoom);
        // Right face windows
        ctx.fillRect(px + 4 * zoom, wy + 2 * zoom, 2.5 * zoom, 3 * zoom);
        ctx.fillRect(px + 9 * zoom, wy, 2.5 * zoom, 3 * zoom);
      }
    }

    // Tall Skyscraper Antenna Spire with Aircraft Warning Beacon
    if (h > 72 * zoom) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2 * zoom;
      ctx.beginPath();
      ctx.moveTo(px, py + th / 2 - h);
      ctx.lineTo(px, py + th / 2 - h - 16 * zoom);
      ctx.stroke();

      // Blinking red beacon
      const beaconGlow = Math.sin(Date.now() / 300) > 0;
      ctx.fillStyle = beaconGlow ? '#ef4444' : '#7f1d1d';
      ctx.beginPath();
      ctx.arc(px, py + th / 2 - h - 16 * zoom, 2.5 * zoom, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Pitched Roof Suburban / Brazilian Style House
function drawIsoHouseWithPitchedRoof(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  width: number,
  depth: number,
  wallH: number,
  roofColor: string,
  isNight: boolean,
  zoom: number
) {
  const hw = width / 2;
  const hd = depth / 4;
  const wallColor = isNight ? '#cbd5e1' : '#f8fafc';

  // Base Walls (Left & Right)
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX - hw, baseY - hd);
  ctx.lineTo(baseX - hw, baseY - hd - wallH);
  ctx.lineTo(baseX, baseY - wallH);
  ctx.closePath();
  ctx.fillStyle = shadeColor(wallColor, isNight ? -35 : -20);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX + hw, baseY - hd);
  ctx.lineTo(baseX + hw, baseY - hd - wallH);
  ctx.lineTo(baseX, baseY - wallH);
  ctx.closePath();
  ctx.fillStyle = shadeColor(wallColor, isNight ? -20 : -5);
  ctx.fill();

  // Pitched Roof Ridge
  const roofRidgeH = wallH + 10 * zoom;

  // Front triangular gable
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - wallH);
  ctx.lineTo(baseX - hw, baseY - hd - wallH);
  ctx.lineTo(baseX, baseY - 2 * hd - roofRidgeH);
  ctx.closePath();
  ctx.fillStyle = shadeColor(roofColor, isNight ? -30 : -15);
  ctx.fill();

  // Right sloping roof face
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - wallH);
  ctx.lineTo(baseX + hw, baseY - hd - wallH);
  ctx.lineTo(baseX, baseY - 2 * hd - roofRidgeH);
  ctx.closePath();
  ctx.fillStyle = shadeColor(roofColor, isNight ? -10 : 15);
  ctx.fill();

  // Small Chimney
  const chimX = baseX - 3 * zoom;
  const chimY = baseY - roofRidgeH - 2 * zoom;
  ctx.fillStyle = '#78350f';
  ctx.fillRect(chimX, chimY, 3 * zoom, 6 * zoom);
}

// 3D Isometric Prisms (Left face, Right face, Roof face)
function drawIsoBox(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  baseY: number,
  width: number,
  depth: number,
  height: number,
  color: string,
  isNight: boolean
) {
  const hw = width / 2;
  const hd = depth / 4;

  // Left Face (Shadowed)
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX - hw, baseY - hd);
  ctx.lineTo(baseX - hw, baseY - hd - height);
  ctx.lineTo(baseX, baseY - height);
  ctx.closePath();
  ctx.fillStyle = shadeColor(color, isNight ? -45 : -25);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.stroke();

  // Right Face (Medium Light)
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(baseX + hw, baseY - hd);
  ctx.lineTo(baseX + hw, baseY - hd - height);
  ctx.lineTo(baseX, baseY - height);
  ctx.closePath();
  ctx.fillStyle = shadeColor(color, isNight ? -25 : -10);
  ctx.fill();
  ctx.stroke();

  // Roof Face (Brightest Light)
  ctx.beginPath();
  ctx.moveTo(baseX, baseY - height);
  ctx.lineTo(baseX - hw, baseY - hd - height);
  ctx.lineTo(baseX, baseY - 2 * hd - height);
  ctx.lineTo(baseX + hw, baseY - hd - height);
  ctx.closePath();
  ctx.fillStyle = shadeColor(color, isNight ? 0 : 15);
  ctx.fill();
  ctx.stroke();
}

function drawFire(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number
) {
  const flicker = Math.sin(Date.now() / 80) * 3 * zoom;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - 8 * zoom, (10 + flicker) * zoom, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - 6 * zoom, 7 * zoom, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(px, py + th / 2 - 4 * zoom, 4 * zoom, 0, Math.PI * 2);
  ctx.fill();
}

function drawRubble(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tw: number,
  th: number,
  zoom: number,
  isNight: boolean
) {
  ctx.fillStyle = isNight ? '#1e293b' : '#475569';
  for (let i = 0; i < 5; i++) {
    const rx = px + ((i % 3) - 1) * 7 * zoom;
    const ry = py + th / 2 + (Math.floor(i / 3) - 0.5) * 4 * zoom;
    ctx.fillRect(rx, ry, 6 * zoom, 4 * zoom);
  }
}

// Status Badges (Power, Water, Abandoned)
function drawBadge(
  ctx: CanvasRenderingContext2D,
  icon: string,
  x: number,
  y: number,
  zoom: number,
  bgColor = '#1e293b'
) {
  const r = 9 * zoom;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = `${10 * zoom}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, x, y + 1);
}

// Data Overlays
function drawOverlayTile(
  ctx: CanvasRenderingContext2D,
  tile: Tile,
  overlay: ViewOverlay,
  px: number,
  py: number,
  tw: number,
  th: number
) {
  let overlayColor = 'transparent';

  if (overlay === 'power') {
    overlayColor = tile.hasPower ? 'rgba(56, 189, 248, 0.45)' : 'rgba(239, 68, 68, 0.55)';
  } else if (overlay === 'water') {
    overlayColor = tile.hasWater ? 'rgba(59, 130, 246, 0.45)' : 'rgba(239, 68, 68, 0.55)';
  } else if (overlay === 'pollution') {
    const alpha = (tile.pollution / 100) * 0.7;
    overlayColor = `rgba(168, 85, 247, ${alpha})`;
  } else if (overlay === 'landValue') {
    const r = Math.round(255 * (1 - tile.landValue / 100));
    const g = Math.round(255 * (tile.landValue / 100));
    overlayColor = `rgba(${r}, ${g}, 50, 0.45)`;
  } else if (overlay === 'police') {
    const safe = 1 - tile.crime / 100;
    overlayColor = `rgba(59, 130, 246, ${safe * 0.5})`;
  } else if (overlay === 'fire') {
    const risk = tile.fireRisk / 100;
    overlayColor = `rgba(239, 68, 68, ${risk * 0.5})`;
  }

  if (overlayColor !== 'transparent') {
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + tw / 2, py + th / 2);
    ctx.lineTo(px, py + th);
    ctx.lineTo(px - tw / 2, py + th / 2);
    ctx.closePath();
    ctx.fillStyle = overlayColor;
    ctx.fill();
  }
}

// Vehicles simulation with headlights
function drawCars(
  ctx: CanvasRenderingContext2D,
  cars: Car[],
  grid: Tile[][],
  mapSize: number,
  zoom: number,
  camX: number,
  camY: number,
  isNight: boolean
) {
  const tw = TILE_BASE_W * zoom;
  const th = TILE_BASE_H * zoom;

  for (const car of cars) {
    car.progress += car.speed;
    if (car.progress >= 1) {
      car.progress = 0;
      car.x = car.targetX;
      car.y = car.targetY;

      const neighbors = [
        { x: car.x + 1, y: car.y },
        { x: car.x - 1, y: car.y },
        { x: car.x, y: car.y + 1 },
        { x: car.x, y: car.y - 1 },
      ].filter(
        (n) =>
          n.x >= 0 &&
          n.x < mapSize &&
          n.y >= 0 &&
          n.y < mapSize &&
          grid[n.y][n.x].buildingId === 'road'
      );

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        car.targetX = next.x;
        car.targetY = next.y;
      }
    }

    const curX = car.x + (car.targetX - car.x) * car.progress;
    const curY = car.y + (car.targetY - car.y) * car.progress;

    const sx = (curX - curY) * (tw / 2) + camX;
    const sy = (curX + curY) * (th / 2) + camY + th / 2;

    // Miniature car body
    ctx.fillStyle = car.color;
    ctx.fillRect(sx - 3.5 * zoom, sy - 2.5 * zoom, 7 * zoom, 5 * zoom);

    // Windshield
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx - 1.5 * zoom, sy - 2 * zoom, 3 * zoom, 4 * zoom);

    // Headlight beams at night
    if (isNight) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      ctx.beginPath();
      ctx.arc(sx, sy, 9 * zoom, 0, Math.PI);
      ctx.fill();
    }
  }
}

// Drifting Fluffy Clouds & Soft Shadows
function drawClouds(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  width: number,
  height: number,
  isNight: boolean
) {
  for (const cloud of clouds) {
    // Soft Ground Shadow
    ctx.fillStyle = isNight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(15, 23, 42, 0.12)';
    ctx.beginPath();
    ctx.ellipse(cloud.x + 40, cloud.y + 120, cloud.size * 0.9, cloud.size * 0.45, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // White Cloud Puff
    ctx.fillStyle = isNight ? `rgba(148, 163, 184, ${cloud.opacity * 0.7})` : `rgba(255, 255, 255, ${cloud.opacity})`;
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.size * 0.35, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.size * 0.3, cloud.y - 10, cloud.size * 0.4, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.size * 0.6, cloud.y, cloud.size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

function shadeColor(color: string, percent: number): string {
  if (!color.startsWith('#')) return color;
  const num = parseInt(color.slice(1), 16);
  let r = (num >> 16) + Math.round((255 * percent) / 100);
  let g = ((num >> 8) & 0x00ff) + Math.round((255 * percent) / 100);
  let b = (num & 0x0000ff) + Math.round((255 * percent) / 100);
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `rgb(${r},${g},${b})`;
}
