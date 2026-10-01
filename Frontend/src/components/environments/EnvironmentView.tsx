import React from 'react';
import { Obstacle, Target, ChargingStation, SimulationStats, SimulationConfig } from '../../types/simulation';
import { Map, ShieldAlert, Zap, Layers, Compass, Crosshair, Target as TargetIcon } from 'lucide-react';

interface EnvironmentViewProps {
  obstacles: Obstacle[];
  targets: Target[];
  chargers: ChargingStation[];
  stats: SimulationStats;
  config: SimulationConfig;
}

export const EnvironmentView: React.FC<EnvironmentViewProps> = ({
  obstacles,
  targets,
  chargers,
  stats,
  config,
}) => {
  const totalArenaM2 = config.worldWidth * config.worldHeight;
  const obstacleM2 = obstacles.reduce((sum, o) => sum + o.width * o.height, 0);
  const obstaclePercent = Math.round((obstacleM2 / totalArenaM2) * 100);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Map className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              ENVIRONMENT TOPOGRAPHY & OCCUPANCY GRID
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            Urban search arena &bull; Dimensions: {config.worldWidth}m &times; {config.worldHeight}m &bull; Non-convex polygonal obstacles
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="px-2 py-1 rounded bg-[#141820] border border-[#242b38] text-[#cbd5e1]">
            GRID RESOLUTION: <strong className="text-amber-400">{config.gridResolution}m/cell</strong>
          </span>
          <span className="px-2 py-1 rounded bg-[#141820] border border-[#242b38] text-[#cbd5e1]">
            OBSTACLE DENSITY: <strong className="text-rose-400">{obstaclePercent}%</strong>
          </span>
        </div>
      </div>

      {/* Spatial Statistics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">TOTAL SEARCH ARENA</span>
          <span className="text-lg font-bold text-[#e6edf3]">614,400 m&sup2;</span>
          <span className="text-[9px] text-[#545d68] block">960m &times; 640m coordinate bounds</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">EXPLORED AREA FRACTION</span>
          <span className="text-lg font-bold text-emerald-400">{stats.areaCoveragePercent}%</span>
          <span className="text-[9px] text-[#545d68] block">{stats.totalExploredM2} m&sup2; mapped</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">UNEXPLORED FOG-OF-WAR</span>
          <span className="text-lg font-bold text-amber-400">{stats.unexploredPercent}%</span>
          <span className="text-[9px] text-[#545d68] block">High entropy target zone</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">LOCALIZED SURVIVORS</span>
          <span className="text-lg font-bold text-cyan-400">
            {stats.targetsFound} / {stats.totalTargets} TARGETS
          </span>
          <span className="text-[9px] text-[#545d68] block">Confidence &ge; 90% threshold</span>
        </div>
      </div>

      {/* Obstacles & Hazards Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Obstacles Card */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#1e2430] pb-2 mb-3">
            <span className="font-bold text-[#e6edf3] flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>COLLISION OBSTACLES & STRUCTURES ({obstacles.length})</span>
            </span>
            <span className="text-[10px] text-[#8b949e]">RADIO ATTENUATION: &alpha; = 3.2</span>
          </div>

          <div className="space-y-2 flex-1">
            {obstacles.map(obs => (
              <div
                key={obs.id}
                className="bg-[#141820] p-2.5 rounded border border-[#1e2430] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#cbd5e1] block">{obs.label}</span>
                  <span className="text-[9px] text-[#545d68]">
                    ID: {obs.id} &bull; Type: {obs.type.toUpperCase()}
                  </span>
                </div>
                <div className="text-right text-[10px]">
                  <span className="text-amber-400 font-bold block">
                    {obs.width}m &times; {obs.height}m
                  </span>
                  <span className="text-[#8b949e] text-[9px]">
                    At ({obs.x}m, {obs.y}m)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Targets & Charging Stations */}
        <div className="space-y-4">
          {/* Targets */}
          <div className="bg-[#101318] border border-[#242b38] rounded p-3">
            <div className="flex items-center justify-between border-b border-[#1e2430] pb-2 mb-3">
              <span className="font-bold text-[#e6edf3] flex items-center space-x-1.5">
                <TargetIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>MISSION OBJECTIVES & SURVIVOR SIGNALS ({targets.length})</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {targets.filter(t => t.detected).length} DETECTED
              </span>
            </div>

            <div className="space-y-2">
              {targets.map(t => (
                <div
                  key={t.id}
                  className="bg-[#141820] p-2.5 rounded border border-[#1e2430] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#e6edf3]">{t.id}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                          t.confirmed
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : t.detected
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                            : 'bg-[#1b212c] text-[#545d68] border border-[#2e3748]'
                        }`}
                      >
                        {t.confirmed ? 'CONFIRMED' : t.detected ? 'TRACKING' : 'UNDISCOVERED'}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#545d68]">
                      Coords: ({t.x}m, {t.y}m) &bull; Detected by: {t.detectedBy || 'none'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-cyan-400 font-bold text-xs block">
                      {Math.round(t.confidence * 100)}%
                    </span>
                    <span className="text-[8px] text-[#8b949e]">CONFIDENCE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charging Stations */}
          <div className="bg-[#101318] border border-[#242b38] rounded p-3">
            <div className="flex items-center justify-between border-b border-[#1e2430] pb-2 mb-3">
              <span className="font-bold text-[#e6edf3] flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>INDUCTIVE BASE CHARGERS ({chargers.length})</span>
              </span>
              <span className="text-[10px] text-[#8b949e]">RAPID DOCKING</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {chargers.map(chg => (
                <div key={chg.id} className="bg-[#141820] p-2.5 rounded border border-[#1e2430]">
                  <span className="font-bold text-emerald-400 block">{chg.id}</span>
                  <span className="text-[9px] text-[#8b949e] block">Radius: {chg.radius}m &bull; Coords: ({chg.x}, {chg.y})</span>
                  <div className="mt-1 flex justify-between text-[9px] text-[#cbd5e1]">
                    <span>Capacity:</span>
                    <span className="font-bold text-[#e6edf3]">{chg.capacity} docks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
