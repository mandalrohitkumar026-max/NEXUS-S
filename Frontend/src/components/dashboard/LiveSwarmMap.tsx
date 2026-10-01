import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Robot } from '../../types/robot';
import { Obstacle, Target, ChargingStation, SimulationConfig } from '../../types/simulation';
import { SimEdge } from '../../simulation/simEngine';

interface LiveSwarmMapProps {
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

export const LiveSwarmMap: React.FC<LiveSwarmMapProps> = ({
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
  const [hoveredRobot, setHoveredRobot] = useState<Robot | null>(null);

  // High performance Canvas drawing
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const scaleX = w / config.worldWidth;
    const scaleY = h / config.worldHeight;

    // 1. Clear with clean dark charcoal
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, w, h);

    // 2. Soft background coordinate grid (subtle, clean)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 60 * scaleX;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Explored vs Unexplored Fog of War
    if (occupancyGrid) {
      const cellW = (config.worldWidth / gridCols) * scaleX;
      const cellH = (config.worldHeight / gridRows) * scaleY;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const idx = r * gridCols + c;
          const isExplored = occupancyGrid[idx] === 1;

          if (!isExplored) {
            // Unexplored: darker veil
            ctx.fillStyle = 'rgba(8, 11, 18, 0.85)';
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
          } else {
            // Explored: clean subtle tint
            ctx.fillStyle = 'rgba(245, 158, 11, 0.025)';
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
          }
        }
      }
    }

    // 4. Charging Docks
    chargers.forEach(chg => {
      const cx = chg.x * scaleX;
      const cy = chg.y * scaleY;
      const cr = chg.radius * scaleX;

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center pad
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      // Label
      ctx.fillStyle = '#10b981';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Charging Dock', cx, cy + cr + 14);
    });

    // 5. Obstacles / Buildings
    obstacles.forEach(obs => {
      const ox = obs.x * scaleX;
      const oy = obs.y * scaleY;
      const ow = obs.width * scaleX;
      const oh = obs.height * scaleY;

      ctx.fillStyle = '#131924';
      ctx.beginPath();
      ctx.roundRect(ox, oy, ow, oh, 4);
      ctx.fill();

      ctx.strokeStyle = 'rgba(75, 85, 99, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Clean label
      if (obs.label) {
        ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
        ctx.font = '500 9px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(obs.label.replace('_', ' '), ox + 6, oy + 14);
      }
    });

    // 6. Detected Targets
    targets.forEach(tgt => {
      if (!tgt.detected) return;
      const tx = tgt.x * scaleX;
      const ty = tgt.y * scaleY;

      // Pulsing detection ring
      const pulseR = (18 + (Date.now() % 1400) / 45) * scaleX;
      ctx.beginPath();
      ctx.arc(tx, ty, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = tgt.confirmed ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Target pin dot
      ctx.beginPath();
      ctx.arc(tx, ty, 6 * scaleX, 0, Math.PI * 2);
      ctx.fillStyle = tgt.confirmed ? '#10b981' : '#f59e0b';
      ctx.fill();

      // Target Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tgt.confirmed ? 'Survivor (Confirmed)' : 'Target Detected', tx, ty - 12);
    });

    // 7. Movement Paths (Clean subtle trails)
    robots.forEach(r => {
      if (r.trajectory.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(r.trajectory[0].x * scaleX, r.trajectory[0].y * scaleY);
      for (let i = 1; i < r.trajectory.length; i++) {
        ctx.lineTo(r.trajectory[i].x * scaleX, r.trajectory[i].y * scaleY);
      }
      ctx.strokeStyle = r.id === selectedRobotId ? 'rgba(245, 158, 11, 0.6)' : 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = r.id === selectedRobotId ? 2 : 1;
      ctx.stroke();
    });

    // 8. Communication Links
    commEdges.forEach(edge => {
      const r1 = robots.find(r => r.id === edge.from);
      const r2 = robots.find(r => r.id === edge.to);
      if (!r1 || !r2) return;

      const isSelectedLink = selectedRobotId === r1.id || selectedRobotId === r2.id;

      ctx.beginPath();
      ctx.moveTo(r1.x * scaleX, r1.y * scaleY);
      ctx.lineTo(r2.x * scaleX, r2.y * scaleY);

      if (isSelectedLink) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    });

    // 9. Robots (Large, clear, readable)
    robots.forEach(robot => {
      const rx = robot.x * scaleX;
      const ry = robot.y * scaleY;
      const isSelected = robot.id === selectedRobotId;
      const isHovered = hoveredRobot?.id === robot.id;

      // Selection Highlight Ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(rx, ry, 18 * scaleX, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rx, ry, 22 * scaleX, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Robot Node Body
      ctx.beginPath();
      ctx.arc(rx, ry, 11 * scaleX, 0, Math.PI * 2);

      // Color code by state
      let nodeFill = '#1e293b';
      let nodeBorder = '#f59e0b';

      if (robot.state === 'CHARGING') {
        nodeBorder = '#10b981';
      } else if (robot.state === 'RETURNING') {
        nodeBorder = '#f97316';
      } else if (robot.state === 'TRACKING' || robot.state === 'ASSISTING') {
        nodeBorder = '#38bdf8';
      } else if (robot.state === 'LOW_POWER') {
        nodeBorder = '#ef4444';
      }

      ctx.fillStyle = nodeFill;
      ctx.fill();
      ctx.strokeStyle = nodeBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Heading indicator direction dot
      const dirDist = 11 * scaleX;
      const noseX = rx + Math.cos(robot.heading) * dirDist;
      const noseY = ry + Math.sin(robot.heading) * dirDist;
      ctx.beginPath();
      ctx.arc(noseX, noseY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Robot ID text - bold, clean, highly visible!
      ctx.fillStyle = '#ffffff';
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
    hoveredRobot,
  ]);

  // Animation Loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      drawMap();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [drawMap]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawMap();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawMap]);

  // Mouse Interaction: Click to Select, Hover for Tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (config.worldWidth / canvas.width);
    const clickY = (e.clientY - rect.top) * (config.worldHeight / canvas.height);

    let found: Robot | null = null;
    for (const r of robots) {
      const dist = Math.hypot(r.x - clickX, r.y - clickY);
      if (dist <= 20) {
        found = r;
        break;
      }
    }
    setHoveredRobot(found);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (config.worldWidth / canvas.width);
    const clickY = (e.clientY - rect.top) * (config.worldHeight / canvas.height);

    for (const r of robots) {
      const dist = Math.hypot(r.x - clickX, r.y - clickY);
      if (dist <= 24) {
        onSelectRobot(r.id);
        return;
      }
    }
  };

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-5 flex flex-col space-y-4 select-none shadow-sm flex-1 min-h-[460px]">
      {/* Map Header and Clean Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Column 2
          </h2>
          <h3 className="text-base font-bold text-white tracking-tight">
            LIVE SWARM MAP
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center flex-wrap gap-3.5 text-xs text-gray-300 font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Robot</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Target</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-400/40"></span>
            <span>Explored</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-900 border border-gray-700"></span>
            <span>Unexplored</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-sky-400"></span>
            <span>Communication</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[360px] rounded-lg overflow-hidden bg-[#0b0f17] border border-gray-800/80 cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredRobot(null)}
          onClick={handleClick}
          className="w-full h-full block"
        />

        {/* Hover Tooltip */}
        {hoveredRobot && (
          <div className="absolute top-3 left-3 bg-gray-900/95 text-white border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium pointer-events-none shadow-lg">
            <span className="font-bold text-amber-400 mr-1.5">{hoveredRobot.id}</span>
            <span className="text-gray-300 mr-2 capitalize">{hoveredRobot.state.toLowerCase()}</span>
            <span className="text-emerald-400 font-semibold">Battery {Math.round(hoveredRobot.battery)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
