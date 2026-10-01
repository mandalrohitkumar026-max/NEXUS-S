import React, { useState } from 'react';
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
import { TacticalSwarmMap } from './TacticalSwarmMap';
import { SwarmIntelligencePanel } from './SwarmIntelligencePanel';
import { LiveEventStream } from './LiveEventStream';
import { MissionProgressSection } from './MissionProgressSection';
import { HowNexusThinksModal } from './HowNexusThinksModal';
import { HelpCircle, Sparkles } from 'lucide-react';

interface LiveOperationsViewProps {
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
  selectedRobotId: string | null;
  onSelectRobot: (id: string) => void;
}

export const LiveOperationsView: React.FC<LiveOperationsViewProps> = ({
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
  selectedRobotId,
  onSelectRobot,
}) => {
  const [showHowItThinks, setShowHowItThinks] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--bg-primary)] overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* --------------------------------------------------
          PRIMARY OPERATIONS VIEW
          MAIN MAP (minmax 0, 1fr) | SWARM INTELLIGENCE (340px)
      -------------------------------------------------- */}
      <div className="operations-layout">
        {/* HERO: TACTICAL SWARM MAP */}
        <div className="flex flex-col min-w-0">
          <TacticalSwarmMap
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

        {/* RIGHT: SWARM INTELLIGENCE PANEL */}
        <div className="flex flex-col min-w-0">
          <SwarmIntelligencePanel
            robots={robots}
            stats={stats}
            selectedRobotId={selectedRobotId}
            onSelectRobot={onSelectRobot}
          />
        </div>
      </div>

      {/* --------------------------------------------------
          BOTTOM OPERATIONAL ROW
          LIVE EVENT STREAM (50%) | MISSION PROGRESS & COORDINATION (50%)
      -------------------------------------------------- */}
      <div className="operations-bottom-grid">
        {/* Live Event Stream */}
        <LiveEventStream
          logs={logs}
          onSelectRobot={onSelectRobot}
        />

        {/* Mission Progress & Decentralized Flow */}
        <MissionProgressSection
          stats={stats}
        />
      </div>

      {/* --------------------------------------------------
          FOOTER GUIDE LAUNCHER
      -------------------------------------------------- */}
      <div className="card p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="status-dot status-dot-accent"></span>
          <span className="text-[var(--text-secondary)] font-medium">
            Decentralized Architecture: Zero master server &bull; Peer-to-peer 802.11s consensus
          </span>
        </div>

        <button
          onClick={() => setShowHowItThinks(true)}
          className="btn btn-secondary text-[var(--accent-hover)] font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>How NEXUS-S Thinks</span>
        </button>
      </div>

      {/* How It Thinks Modal */}
      <HowNexusThinksModal
        isOpen={showHowItThinks}
        onClose={() => setShowHowItThinks(false)}
      />
    </div>
  );
};
