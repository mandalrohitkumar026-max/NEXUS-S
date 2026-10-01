import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Robot } from '../../types/robot';
import { Obstacle, Target, ChargingStation, SimulationConfig } from '../../types/simulation';
import { SimEdge } from '../../simulation/simEngine';
import { ZoomIn, ZoomOut, Target as TargetIcon, Maximize2 } from 'lucide-react';

interface TacticalSwarmMapProps {
  robots: Robot[];
  obstacles: Obstacle[];
  targets: Target[];
  chargers: ChargingStation[];
  commEdges: SimEdge[];
  occupancyGrid: Uint8Array;
  gridCols: number;
  gridRows: number;
  config: SimulationConfig;
  selectedRobotId: string | null;
  onSelectRobot: (id: string) => void;
}

export const TacticalSwarmMap: React.FC<TacticalSwarmMapProps> = ({
  robots,
  obstacles,
  targets,
  chargers,
  commEdges,
  occupancyGrid,
  gridCols,
  gridRows,
  config,
  selectedRobotId,
  onSelectRobot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer toggles
  const [showTrails, setShowTrails] = useState(true);
  const [showComms, setShowComms] = useState(true);
  const [showSectors, setShowSectors] = useState(true);

  // Hover state
  const [hoveredRobot, setHoveredRobot] = useState<Robot | null>(null);

  // Map Drawing routine (Light Technical Map)
  const renderMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const baseScaleX = w / config.worldWidth;
    const baseScaleY = h / config.worldHeight;
    const scale = Math.min(baseScaleX, baseScaleY) * zoom;

    // Center offset to preserve aspect ratio
    const offsetX = (w - config.worldWidth * scale) / 2 + panOffset.x;
    const offsetY = (h - config.worldHeight * scale) / 2 + panOffset.y;

    const toScreenX = (worldX: number) => offsetX + worldX * scale;
    const toScreenY = (worldY: number) => offsetY + worldY * scale;

    // 1. Clear outer technical background (#F8FAFC)
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, w, h);

    // World arena background (#FFFFFF with subtle border #E2E8F0)
    const arenaX = toScreenX(0);
    const arenaY = toScreenY(0);
    const arenaW = config.worldWidth * scale;
    const arenaH = config.worldHeight * scale;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(arenaX, arenaY, arenaW, arenaH);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(arenaX, arenaY, arenaW, arenaH);

    // 2. Coordinate Grid (Very subtle #E2E8F0)
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
    ctx.lineWidth = 1;
    const gridStep = 80 * scale;
    for (let x = arenaX; x <= arenaX + arenaW; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, arenaY);
      ctx.lineTo(x, arenaY + arenaH);
      ctx.stroke();
    }
    for (let y = arenaY; y <= arenaY + arenaH; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(arenaX, y);
      ctx.lineTo(arenaX + arenaW, y);
      ctx.stroke();
    }

    // 3. Explored vs Unexplored Fog of War
    if (occupancyGrid) {
      const cellW = (config.worldWidth / gridCols) * scale;
      const cellH = (config.worldHeight / gridRows) * scale;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const idx = r * gridCols + c;
          const isExplored = occupancyGrid[idx] === 1;

          if (!isExplored) {
            // Unexplored: neutral light gray (#F1F5F9 with soft pattern)
            ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
            ctx.fillRect(arenaX + c * cellW, arenaY + r * cellH, cellW, cellH);
          } else {
            // Explored: very subtle blue tint
            ctx.fillStyle = 'rgba(37, 99, 235, 0.06)';
            ctx.fillRect(arenaX + c * cellW, arenaY + r * cellH, cellW, cellH);
          }
        }
      }
    }

    // 4. Clearly Defined Search Zones / Sectors
    if (showSectors) {
      const midX = toScreenX(config.worldWidth / 2);
      const midY = toScreenY(config.worldHeight / 2);

      // Sector dividing lines
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical divide
      ctx.beginPath();
      ctx.moveTo(midX, arenaY);
      ctx.lineTo(midX, arenaY + arenaH);
      ctx.stroke();

      // Horizontal divide
      ctx.beginPath();
      ctx.moveTo(arenaX, midY);
      ctx.lineTo(arenaX + arenaW, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sector Labels (Clean Slate)
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = '#64748B';

      ctx.textAlign = 'left';
      ctx.fillText('SECTOR A // NORTH-WEST', arenaX + 16, arenaY + 22);

      ctx.textAlign = 'right';
      ctx.fillText('SECTOR B // NORTH-EAST', arenaX + arenaW - 16, arenaY + 22);

      ctx.textAlign = 'left';
      ctx.fillText('SECTOR C // SOUTH-WEST', arenaX + 16, arenaY + arenaH - 14);

      ctx.textAlign = 'right';
      ctx.fillText('SECTOR D // SOUTH-EAST', arenaX + arenaW - 16, arenaY + arenaH - 14);
    }

    // 5. Charging Docks (Base Stations)
    chargers.forEach(chg => {
      const cx = toScreenX(chg.x);
      const cy = toScreenY(chg.y);
      const cr = chg.radius * scale;

      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(22, 163, 74, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(22, 163, 74, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(cx, cy, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#16A34A';
      ctx.fill();

      ctx.fillStyle = '#16A34A';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(chg.id.replace('CHG-', 'DOCK-'), cx, cy + cr + 14);
    });

    // 6. Obstacles & Buildings (White cards with light gray borders)
    obstacles.forEach(obs => {
      const ox = toScreenX(obs.x);
      const oy = toScreenY(obs.y);
      const ow = obs.width * scale;
      const oh = obs.height * scale;

      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(ox, oy, ow, oh, 6);
      ctx.fill();

      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (obs.label) {
        ctx.fillStyle = '#64748B';
        ctx.font = '500 10px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(obs.label.replace('_', ' '), ox + 8, oy + 16);
      }
    });

    // 7. Detected Targets (Orange/Amber markers)
    targets.forEach(tgt => {
      if (!tgt.detected) return;
      const tx = toScreenX(tgt.x);
      const ty = toScreenY(tgt.y);

      // Pulse ring
      const pulseR = (14 + (Date.now() % 1400) / 50) * scale;
      ctx.beginPath();
      ctx.arc(tx, ty, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = tgt.confirmed ? 'rgba(22, 163, 74, 0.4)' : 'rgba(217, 119, 6, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Diamond target icon
      const dSize = 7.5 * scale;
      ctx.beginPath();
      ctx.moveTo(tx, ty - dSize);
      ctx.lineTo(tx + dSize, ty);
      ctx.lineTo(tx, ty + dSize);
      ctx.lineTo(tx - dSize, ty);
      ctx.closePath();
      ctx.fillStyle = tgt.confirmed ? '#16A34A' : '#D97706';
      ctx.fill();

      // Target Label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tgt.confirmed ? `◆ ${tgt.id} (Confirmed)` : `◆ ${tgt.id}`, tx, ty - 12);
    });

    // 8. Robot Paths (Subtle movement trails)
    if (showTrails) {
      robots.forEach(r => {
        if (r.trajectory.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(toScreenX(r.trajectory[0].x), toScreenY(r.trajectory[0].y));
        for (let i = 1; i < r.trajectory.length; i++) {
          ctx.lineTo(toScreenX(r.trajectory[i].x), toScreenY(r.trajectory[i].y));
        }
        const isSelected = r.id === selectedRobotId;
        ctx.strokeStyle = isSelected ? 'rgba(37, 99, 235, 0.7)' : 'rgba(37, 99, 235, 0.2)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
      });
    }

    // 9. Communication Links (Thin blue/gray lines)
    if (showComms && !config.ablations.noCommunication) {
      commEdges.forEach(edge => {
        const r1 = robots.find(r => r.id === edge.from);
        const r2 = robots.find(r => r.id === edge.to);
        if (!r1 || !r2) return;

        const x1 = toScreenX(r1.x);
        const y1 = toScreenY(r1.y);
        const x2 = toScreenX(r2.x);
        const y2 = toScreenY(r2.y);

        const isHighlighted = selectedRobotId === r1.id || selectedRobotId === r2.id;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.8)';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      });
    }

    // 10. Autonomous Robots (Clean Blue Markers)
    robots.forEach(robot => {
      const rx = toScreenX(robot.x);
      const ry = toScreenY(robot.y);
      const isSelected = robot.id === selectedRobotId;

      // Selection Highlight Rings
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(rx, ry, 17 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rx, ry, 21 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Robot Node Body (Crisp white fill with colored border)
      ctx.beginPath();
      ctx.arc(rx, ry, 10 * scale, 0, Math.PI * 2);

      let nodeFill = '#FFFFFF';
      let nodeBorder = '#2563EB';

      if (robot.state === 'CHARGING') {
        nodeBorder = '#16A34A';
      } else if (robot.state === 'RETURNING') {
        nodeBorder = '#D97706';
      } else if (robot.state === 'TRACKING' || robot.state === 'ASSISTING') {
        nodeBorder = '#2563EB';
      } else if (robot.state === 'LOW_POWER') {
        nodeBorder = '#DC2626';
      }

      ctx.fillStyle = nodeFill;
      ctx.fill();
      ctx.strokeStyle = nodeBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Heading direction pip
      const noseDist = 11 * scale;
      const noseX = rx + Math.cos(robot.heading) * noseDist;
      const noseY = ry + Math.sin(robot.heading) * noseDist;
      ctx.beginPath();
      ctx.arc(noseX, noseY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = nodeBorder;
      ctx.fill();

      // Clearly readable ID
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(robot.id, rx, ry);
    });
  }, [
    robots,
    obstacles,
    targets,
    chargers,
    commEdges,
    occupancyGrid,
    gridCols,
    gridRows,
    config,
    selectedRobotId,
    zoom,
    panOffset,
    showTrails,
    showComms,
    showSectors,
  ]);

  // Animation Frame Loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderMap();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderMap]);

  // Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      renderMap();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderMap]);

  // Mouse Interaction: Drag to Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Hover detection
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const baseScale = Math.min(canvas.width / config.worldWidth, canvas.height / config.worldHeight) * zoom;
    const offsetX = (canvas.width - config.worldWidth * baseScale) / 2 + panOffset.x;
    const offsetY = (canvas.height - config.worldHeight * baseScale) / 2 + panOffset.y;

    const found = robots.find(r => {
      const rx = offsetX + r.x * baseScale;
      const ry = offsetY + r.y * baseScale;
      return Math.hypot(mouseX - rx, mouseY - ry) <= 16;
    });

    setHoveredRobot(found || null);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Click on map to select robot
  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const baseScale = Math.min(canvas.width / config.worldWidth, canvas.height / config.worldHeight) * zoom;
    const offsetX = (canvas.width - config.worldWidth * baseScale) / 2 + panOffset.x;
    const offsetY = (canvas.height - config.worldHeight * baseScale) / 2 + panOffset.y;

    const clickedRobot = robots.find(r => {
      const rx = offsetX + r.x * baseScale;
      const ry = offsetY + r.y * baseScale;
      return Math.hypot(mouseX - rx, mouseY - ry) <= 20;
    });

    if (clickedRobot) {
      onSelectRobot(clickedRobot.id);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.2));
  const handleZoomOut = () => setZoom(z => Math.max(0.6, z - 0.2));
  const handleResetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const handleCenterSwarm = () => {
    if (robots.length === 0) return;
    const avgX = robots.reduce((sum, r) => sum + r.x, 0) / robots.length;
    const avgY = robots.reduce((sum, r) => sum + r.y, 0) / robots.length;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const baseScale = Math.min(canvas.width / config.worldWidth, canvas.height / config.worldHeight) * zoom;
    setPanOffset({
      x: (config.worldWidth / 2 - avgX) * baseScale,
      y: (config.worldHeight / 2 - avgY) * baseScale,
    });
  };

  return (
    <div className="card p-4 flex flex-col space-y-3.5 select-none flex-1 min-h-[460px] relative bg-white border border-[#E2E8F0]">
      {/* Top Map Header & Controls */}
      <div className="panel-header">
        <div className="flex items-center space-x-3">
          <div>
            <span className="panel-header-subtitle">
              OPERATIONS MAP
            </span>
            <h3 className="panel-header-title flex items-center space-x-2">
              <span>LIVE SWARM MAP</span>
              <span className="text-xs font-normal text-[#2563EB] font-mono">
                [Zone A &bull; 960m &times; 640m]
              </span>
            </h3>
          </div>
        </div>

        {/* Section 6: Map Controls in top right (+, -, Center Swarm, Fit Mission) */}
        <div className="flex items-center space-x-1.5 bg-white border border-[#E2E8F0] rounded-lg p-1 text-xs shadow-sm">
          <button
            onClick={handleZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors font-bold text-sm"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors font-bold text-sm"
            title="Zoom Out"
          >
            −
          </button>
          <div className="h-4 w-[1px] bg-[#E2E8F0]"></div>
          <button
            onClick={handleCenterSwarm}
            className="px-2.5 py-1 rounded text-[#2563EB] hover:bg-[#EFF6FF] transition-colors font-medium text-[11px] flex items-center space-x-1"
            title="Center Swarm"
          >
            <span>⌖</span>
            <span>Center Swarm</span>
          </button>
          <button
            onClick={handleResetView}
            className="px-2.5 py-1 rounded text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors font-medium text-[11px] flex items-center space-x-1"
            title="Fit Mission"
          >
            <span>□</span>
            <span>Fit Mission</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[360px] rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setHoveredRobot(null);
          }}
          onClick={handleClick}
          className="w-full h-full block"
        />

        {/* Layer toggle buttons overlay in bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-lg p-1 text-[11px] shadow-sm">
          <button
            onClick={() => setShowSectors(!showSectors)}
            className={`tab-pill ${showSectors ? 'tab-pill-active' : 'tab-pill-inactive'}`}
          >
            Sectors
          </button>
          <button
            onClick={() => setShowComms(!showComms)}
            className={`tab-pill ${showComms ? 'tab-pill-active' : 'tab-pill-inactive'}`}
          >
            Comms
          </button>
          <button
            onClick={() => setShowTrails(!showTrails)}
            className={`tab-pill ${showTrails ? 'tab-pill-active' : 'tab-pill-inactive'}`}
          >
            Trails
          </button>
        </div>

        {/* Tactical Hover Tooltip */}
        {hoveredRobot && (
          <div className="absolute top-3 right-3 bg-white text-[#0F172A] border border-[#E2E8F0] px-3 py-2 rounded-lg text-xs font-medium pointer-events-none shadow-md">
            <div className="flex items-center space-x-2 font-bold text-[#2563EB] mb-0.5">
              <span>{hoveredRobot.id}</span>
              <span className="text-[#64748B] font-normal capitalize">({hoveredRobot.state.toLowerCase()})</span>
            </div>
            <div className="text-[11px] text-[#475569]">
              Battery: <strong className="text-[#16A34A]">{Math.round(hoveredRobot.battery)}%</strong> &bull; Speed: {hoveredRobot.speed.toFixed(1)} m/s
            </div>
          </div>
        )}
      </div>

      {/* Clean Legend Bottom Strip (Section 6 Requirement) */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1 text-xs text-[#475569] font-medium">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
            <span>Robot</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#D97706]"></span>
            <span>Target</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-4 h-0.5 bg-[#2563EB]"></span>
            <span>Communication</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#EFF6FF] border border-[#BFDBFE]"></span>
            <span>Explored</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F1F5F9] border border-[#E2E8F0]"></span>
            <span>Unexplored</span>
          </div>
        </div>

        <span className="text-[11px] text-[#64748B]">
          Click any robot node to inspect telemetry & decentralized decision
        </span>
      </div>
    </div>
  );
};
