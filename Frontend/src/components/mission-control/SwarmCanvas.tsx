import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Robot } from '../../types/robot';
import { Obstacle, Target, ChargingStation, SimulationConfig } from '../../types/simulation';
import { SimEdge } from '../../simulation/simEngine';
import { Eye, EyeOff, Radio, Compass, Layers, Maximize2, Shield } from 'lucide-react';

interface SwarmCanvasProps {
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
  onSelectRobot: (id: string | null) => void;
}

export const SwarmCanvas: React.FC<SwarmCanvasProps> = ({
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

  // Overlay toggles
  const [showComms, setShowComms] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showFog, setShowFog] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Canvas interaction
  const [hoveredRobotId, setHoveredRobotId] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Packet animation pulse counter
  const animFrameRef = useRef<number>(0);

  // Canvas drawing routine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const scaleX = w / config.worldWidth;
    const scaleY = h / config.worldHeight;

    // Clear background (deep robotics graphite)
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(0, 0, w, h);

    // 1. Engineering Coordinate Grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(36, 43, 56, 0.45)';
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

      // Coordinate tick marks
      ctx.fillStyle = 'rgba(139, 148, 158, 0.35)';
      ctx.font = '9px "JetBrains Mono", monospace';
      for (let x = 60; x < config.worldWidth; x += 120) {
        ctx.fillText(`${x}m`, x * scaleX + 4, 12);
      }
      for (let y = 60; y < config.worldHeight; y += 120) {
        ctx.fillText(`${y}m`, 4, y * scaleY - 4);
      }
    }

    // 2. Fog of War / Exploration Layer
    if (showFog && occupancyGrid) {
      const cellW = (config.worldWidth / gridCols) * scaleX;
      const cellH = (config.worldHeight / gridRows) * scaleY;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const idx = r * gridCols + c;
          const isExplored = occupancyGrid[idx] === 1;

          if (!isExplored) {
            // Unexplored: dense dark tech overlay with subtle diagonal hatch
            ctx.fillStyle = 'rgba(7, 9, 13, 0.88)';
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);

            // Tech grid dot for unexplored area
            if (c % 2 === 0 && r % 2 === 0) {
              ctx.fillStyle = 'rgba(56, 68, 88, 0.3)';
              ctx.fillRect(c * cellW + cellW * 0.5 - 1, r * cellH + cellH * 0.5 - 1, 2, 2);
            }
          } else {
            // Explored: subtle transparent tint
            ctx.fillStyle = 'rgba(217, 119, 6, 0.025)';
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
          }
        }
      }
    }

    // 3. Charging Stations
    chargers.forEach(chg => {
      const cx = chg.x * scaleX;
      const cy = chg.y * scaleY;
      const cr = chg.radius * scaleX;

      // Base ring
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.07)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner pad
      ctx.beginPath();
      ctx.arc(cx, cy, cr * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.stroke();

      // Label
      ctx.fillStyle = '#10b981';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(chg.id, cx - 35, cy + cr + 14);
      ctx.fillStyle = 'rgba(139, 148, 158, 0.7)';
      ctx.fillText('POWER HARVEST', cx - 35, cy + cr + 24);
    });

    // 4. Obstacles
    obstacles.forEach(obs => {
      const ox = obs.x * scaleX;
      const oy = obs.y * scaleY;
      const ow = obs.width * scaleX;
      const oh = obs.height * scaleY;

      // Body fill
      ctx.fillStyle = '#12161f';
      ctx.fillRect(ox, oy, ow, oh);

      // Engineering diagonal hatching
      ctx.strokeStyle = 'rgba(46, 56, 73, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let offset = -oh; offset < ow; offset += 14) {
        ctx.moveTo(Math.max(ox, ox + offset), Math.max(oy, oy - offset));
        ctx.lineTo(Math.min(ox + ow, ox + offset + oh), Math.min(oy + oh, oy));
      }
      ctx.stroke();

      // Border
      ctx.strokeStyle = obs.type === 'hazard_zone' ? 'rgba(239, 68, 68, 0.5)' : '#2e3748';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox, oy, ow, oh);

      // Label badge
      if (obs.label) {
        ctx.fillStyle = '#181d26';
        ctx.fillRect(ox + 4, oy + 4, obs.label.length * 6 + 8, 14);
        ctx.fillStyle = '#8b949e';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(obs.label, ox + 8, oy + 14);
      }
    });

    // 5. Targets / Survivors
    targets.forEach(tgt => {
      const tx = tgt.x * scaleX;
      const ty = tgt.y * scaleY;

      if (tgt.detected) {
        // Ping circle
        const pingRadius = (20 + (Date.now() % 1500) / 40) * scaleX;
        ctx.beginPath();
        ctx.arc(tx, ty, pingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = tgt.confirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Target center
        ctx.beginPath();
        ctx.arc(tx, ty, 6 * scaleX, 0, Math.PI * 2);
        ctx.fillStyle = tgt.confirmed ? '#10b981' : '#f59e0b';
        ctx.fill();

        // Crosshairs
        ctx.strokeStyle = tgt.confirmed ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx - 12, ty);
        ctx.lineTo(tx + 12, ty);
        ctx.moveTo(tx, ty - 12);
        ctx.lineTo(tx, ty + 12);
        ctx.stroke();

        // Info tag
        ctx.fillStyle = '#10141b';
        ctx.strokeStyle = tgt.confirmed ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 1;
        ctx.fillRect(tx + 12, ty - 18, 95, 26);
        ctx.strokeRect(tx + 12, ty - 18, 95, 26);

        ctx.fillStyle = tgt.confirmed ? '#10b981' : '#f59e0b';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText(tgt.id, tx + 16, ty - 7);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(`CONF: ${Math.round(tgt.confidence * 100)}% [${tgt.assignedRobots.join(',')}]`, tx + 16, ty + 4);
      }
    });

    // 6. Trajectory Trails
    if (showTrails) {
      robots.forEach(r => {
        if (r.trajectory.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(r.trajectory[0].x * scaleX, r.trajectory[0].y * scaleY);
        for (let i = 1; i < r.trajectory.length; i++) {
          ctx.lineTo(r.trajectory[i].x * scaleX, r.trajectory[i].y * scaleY);
        }
        ctx.strokeStyle = r.id === selectedRobotId ? 'rgba(245, 158, 11, 0.45)' : 'rgba(78, 92, 114, 0.25)';
        ctx.lineWidth = r.id === selectedRobotId ? 2 : 1;
        ctx.stroke();
      });
    }

    // 7. Communication Network Links
    if (showComms && !config.ablations.noCommunication) {
      commEdges.forEach(edge => {
        const r1 = robots.find(r => r.id === edge.from);
        const r2 = robots.find(r => r.id === edge.to);
        if (!r1 || !r2) return;

        const x1 = r1.x * scaleX;
        const y1 = r1.y * scaleY;
        const x2 = r2.x * scaleX;
        const y2 = r2.y * scaleY;

        const isRelatedToSelected = selectedRobotId === r1.id || selectedRobotId === r2.id;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (isRelatedToSelected) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([3, 3]);
        } else {
          ctx.strokeStyle = `rgba(180, 115, 20, ${0.15 + edge.signalStrength * 0.25})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 4]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated packet dot
        const t = (Date.now() / 1200 + (r1.index * 0.3)) % 1;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        ctx.beginPath();
        ctx.arc(px, py, isRelatedToSelected ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isRelatedToSelected ? '#06b6d4' : 'rgba(245, 158, 11, 0.6)';
        ctx.fill();
      });
    }

    // 8. Robots
    robots.forEach(robot => {
      const rx = robot.x * scaleX;
      const ry = robot.y * scaleY;
      const isSelected = robot.id === selectedRobotId;
      const isHovered = robot.id === hoveredRobotId;

      // Sensor Range Circle
      if (showSensors && (isSelected || isHovered)) {
        const sr = robot.sensorRadius * scaleX;
        ctx.beginPath();
        ctx.arc(rx, ry, sr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 119, 6, 0.04)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Forward lidar sweep cone
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        const coneAngle = 0.5; // ~30 deg
        ctx.arc(rx, ry, sr, robot.heading - coneAngle, robot.heading + coneAngle);
        ctx.closePath();
        ctx.fillStyle = 'rgba(217, 119, 6, 0.08)';
        ctx.fill();
      }

      // Robot Chassis / Node
      ctx.save();
      ctx.translate(rx, ry);

      // Selected ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(0, 0, 16 * scaleX, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Corner crosshair brackets
        const bSize = 20 * scaleX;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 1.2;
        // top-left
        ctx.beginPath();
        ctx.moveTo(-bSize, -bSize + 6);
        ctx.lineTo(-bSize, -bSize);
        ctx.lineTo(-bSize + 6, -bSize);
        ctx.stroke();
        // top-right
        ctx.beginPath();
        ctx.moveTo(bSize - 6, -bSize);
        ctx.lineTo(bSize, -bSize);
        ctx.lineTo(bSize, -bSize + 6);
        ctx.stroke();
        // bottom-left
        ctx.beginPath();
        ctx.moveTo(-bSize, bSize - 6);
        ctx.lineTo(-bSize, bSize);
        ctx.lineTo(-bSize + 6, bSize);
        ctx.stroke();
        // bottom-right
        ctx.beginPath();
        ctx.moveTo(bSize - 6, bSize);
        ctx.lineTo(bSize, bSize);
        ctx.lineTo(bSize, bSize - 6);
        ctx.stroke();
      }

      // Rotate to heading
      ctx.rotate(robot.heading);

      // State colors
      let nodeColor = '#e6edf3';
      if (robot.state === 'CHARGING') nodeColor = '#10b981';
      else if (robot.state === 'RETURNING') nodeColor = '#f97316';
      else if (robot.state === 'TRACKING' || robot.state === 'ASSISTING') nodeColor = '#06b6d4';
      else if (robot.state === 'LOW_POWER') nodeColor = '#ef4444';
      else if (robot.state === 'COMMUNICATING' || robot.role === 'RELAY_NODE') nodeColor = '#a855f7';
      else if (robot.state === 'SEARCHING') nodeColor = '#eab308';

      // Chassis triangle
      const size = 9 * scaleX;
      ctx.beginPath();
      ctx.moveTo(size * 1.3, 0); // Nose
      ctx.lineTo(-size * 0.9, -size * 0.8);
      ctx.lineTo(-size * 0.5, 0);
      ctx.lineTo(-size * 0.9, size * 0.8);
      ctx.closePath();

      ctx.fillStyle = '#141820';
      ctx.fill();
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Heading probe dot
      ctx.beginPath();
      ctx.arc(size * 1.3, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      ctx.restore();

      // Robot ID label and mini battery indicator
      ctx.fillStyle = isSelected ? '#f59e0b' : '#cbd5e1';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(robot.id, rx + 10, ry - 6);

      // Mini Battery Bar
      const barW = 20 * scaleX;
      const barH = 3 * scaleY;
      ctx.fillStyle = '#10141b';
      ctx.fillRect(rx + 10, ry + 2, barW, barH);
      ctx.fillStyle = robot.battery < 25 ? '#ef4444' : robot.battery < 50 ? '#f59e0b' : '#10b981';
      ctx.fillRect(rx + 10, ry + 2, barW * (robot.battery / 100), barH);
      ctx.strokeStyle = '#2e3748';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(rx + 10, ry + 2, barW, barH);
    });

    // 9. Coordinate HUD at bottom right
    ctx.fillStyle = 'rgba(16, 20, 27, 0.85)';
    ctx.fillRect(w - 190, h - 26, 185, 22);
    ctx.strokeStyle = '#242b38';
    ctx.strokeRect(w - 190, h - 26, 185, 22);
    ctx.fillStyle = '#8b949e';
    ctx.font = '9px "JetBrains Mono", monospace';
    const cX = cursorPos ? Math.round(cursorPos.x) : 0;
    const cY = cursorPos ? Math.round(cursorPos.y) : 0;
    ctx.fillText(`COORD [${cX}m, ${cY}m] | SCALE 1:1`, w - 182, h - 12);
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
    hoveredRobotId,
    cursorPos,
    showComms,
    showSensors,
    showTrails,
    showFog,
    showGrid,
  ]);

  // Animation frame loop
  useEffect(() => {
    const loop = () => {
      renderCanvas();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [renderCanvas]);

  // Handle Canvas Resizing
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      renderCanvas();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [renderCanvas]);

  // Mouse Interaction: Select & Hover
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (config.worldWidth / canvas.width);
    const clickY = (e.clientY - rect.top) * (config.worldHeight / canvas.height);
    setCursorPos({ x: clickX, y: clickY });

    let found: string | null = null;
    for (const r of robots) {
      const dist = Math.hypot(r.x - clickX, r.y - clickY);
      if (dist <= 18) {
        found = r.id;
        break;
      }
    }
    setHoveredRobotId(found);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (config.worldWidth / canvas.width);
    const clickY = (e.clientY - rect.top) * (config.worldHeight / canvas.height);

    let clickedId: string | null = null;
    for (const r of robots) {
      const dist = Math.hypot(r.x - clickX, r.y - clickY);
      if (dist <= 22) {
        clickedId = r.id;
        break;
      }
    }
    onSelectRobot(clickedId);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0c10] select-none overflow-hidden flex flex-col">
      {/* Top Map Toolbar Overlays */}
      <div className="absolute top-2 left-3 z-10 flex items-center space-x-1.5 bg-[#101318]/90 backdrop-blur-sm border border-[#242b38] rounded p-1 text-[11px] font-mono text-[#8b949e]">
        <span className="text-[#cbd5e1] font-medium px-1.5 border-r border-[#242b38]">
          ARENA: 960m &times; 640m
        </span>

        <button
          onClick={() => setShowComms(!showComms)}
          className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-colors ${
            showComms ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/50' : 'hover:text-[#e6edf3]'
          }`}
          title="Toggle Swarm Communication Mesh"
        >
          <Radio className="w-3 h-3" />
          <span>COMMS</span>
        </button>

        <button
          onClick={() => setShowSensors(!showSensors)}
          className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-colors ${
            showSensors ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50' : 'hover:text-[#e6edf3]'
          }`}
          title="Toggle Lidar/Vision Sensor Radii"
        >
          <Compass className="w-3 h-3" />
          <span>SENSORS</span>
        </button>

        <button
          onClick={() => setShowFog(!showFog)}
          className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-colors ${
            showFog ? 'bg-[#1a212d] text-[#e6edf3] border border-[#384357]' : 'hover:text-[#e6edf3]'
          }`}
          title="Toggle Unexplored Fog-of-War Layer"
        >
          <Layers className="w-3 h-3" />
          <span>FOG</span>
        </button>

        <button
          onClick={() => setShowTrails(!showTrails)}
          className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-colors ${
            showTrails ? 'bg-[#1a212d] text-[#e6edf3] border border-[#384357]' : 'hover:text-[#e6edf3]'
          }`}
          title="Toggle Trajectory History Trails"
        >
          <span>TRAILS</span>
        </button>
      </div>

      {/* State Legend Top-Right */}
      <div className="absolute top-2 right-3 z-10 hidden md:flex items-center space-x-2 bg-[#101318]/90 backdrop-blur-sm border border-[#242b38] rounded px-2.5 py-1 text-[10px] font-mono">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#cbd5e1]"></span>
          <span className="text-[#8b949e]">EXPLORE</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span>
          <span className="text-[#8b949e]">TRACK/ASSIST</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span className="text-[#8b949e]">CHARGE</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#f97316]"></span>
          <span className="text-[#8b949e]">RETURN</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
          <span className="text-[#8b949e]">RELAY</span>
        </div>
      </div>

      {/* Main Canvas Element */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />
    </div>
  );
};
