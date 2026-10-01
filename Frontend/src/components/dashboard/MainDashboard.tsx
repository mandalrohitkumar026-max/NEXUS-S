import React from 'react';
import { Robot } from '../../types/robot';
import {
  Obstacle,
  Target,
  ChargingStation,
  SimulationConfig,
  TelemetryLogEntry,
  SimulationStats,
} from '../../types/simulation';
import { SimEdge } from '../../simulation/simEngine';
import { MissionControlPanel } from './MissionControlPanel';
import { LiveSwarmMap } from './LiveSwarmMap';
import { SwarmStatusPanel } from './SwarmStatusPanel';
import { SwarmActivityPanel } from './SwarmActivityPanel';
import { SwarmDecisionPanel } from './SwarmDecisionPanel';
import { HowItWorksBanner } from './HowItWorksBanner';

interface MainDashboardProps {
  robots: Robot[];
  obstacles: Obstacle[];
  targets: Target[];
  chargers: ChargingStation[];
  commEdges: SimEdge[];
  occupancyGrid: Uint8Array;
  gridCols: number;
  gridRows: number;
  config: SimulationConfig;
  stats: SimulationStats;
  logs: TelemetryLogEntry[];
  isRunning: boolean;
  selectedRobotId: string | null;
  onSelectRobot: (id: string) => void;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  robots,
  obstacles,
  targets,
  chargers,
  commEdges,
  occupancyGrid,
  gridCols,
  gridRows,
  config,
  stats,
  logs,
  isRunning,
  selectedRobotId,
  onSelectRobot,
  onTogglePlay,
  onReset,
}) => {
  const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0] || null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* --------------------------------------------------
          MAIN 3-COLUMN DASHBOARD
          Column 1: Mission Control
          Column 2: Live Swarm Map (Dominant)
          Column 3: Swarm Status
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1 — MISSION CONTROL */}
        <div className="lg:col-span-3 flex flex-col">
          <MissionControlPanel
            stats={stats}
            isRunning={isRunning}
            onTogglePlay={onTogglePlay}
            onReset={onReset}
          />
        </div>

        {/* Column 2 — LIVE SWARM MAP (Dominant) */}
        <div className="lg:col-span-6 flex flex-col">
          <LiveSwarmMap
            robots={robots}
            obstacles={obstacles}
            targets={targets}
            chargers={chargers}
            commEdges={commEdges}
            occupancyGrid={occupancyGrid}
            gridCols={gridCols}
            gridRows={gridRows}
            config={config}
            selectedRobotId={selectedRobotId || (robots[0] ? robots[0].id : null)}
            onSelectRobot={onSelectRobot}
          />
        </div>

        {/* Column 3 — SWARM STATUS */}
        <div className="lg:col-span-3 flex flex-col">
          <SwarmStatusPanel
            robots={robots}
            selectedRobotId={selectedRobotId}
            onSelectRobot={onSelectRobot}
          />
        </div>
      </div>

      {/* --------------------------------------------------
          BOTTOM SECTION — TWO CLEAN PANELS
          Left: Swarm Activity (Human readable events)
          Right: How The Swarm Thinks (Plain English decisions)
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Swarm Activity */}
        <SwarmActivityPanel
          logs={logs}
          onSelectRobot={onSelectRobot}
        />

        {/* Right: How The Swarm Thinks */}
        <SwarmDecisionPanel
          robot={selectedRobot}
          allRobots={robots}
        />
      </div>

      {/* --------------------------------------------------
          "HOW NEXUS-S WORKS" 5-STEP SECTION
      -------------------------------------------------- */}
      <HowItWorksBanner />
    </div>
  );
};
