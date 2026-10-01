import React, { useState } from 'react';
import { Robot } from '../../types/robot';
import {
  Obstacle,
  Target,
  ChargingStation,
  SimulationConfig,
  TelemetryLogEntry,
  EmergentPattern,
  SimulationStats,
} from '../../types/simulation';
import { SimEdge } from '../../simulation/simEngine';
import { SwarmCanvas } from './SwarmCanvas';
import { LocalDecisionPanel } from './LocalDecisionPanel';
import { RobotTelemetryInspector } from './RobotTelemetryInspector';
import { TimelineEventStream } from './TimelineEventStream';
import { MissionConfigPanel } from './MissionConfigPanel';
import { Eye, Activity, Cpu, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';

interface MissionControlViewProps {
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
  emergentPatterns: EmergentPattern[];
  selectedRobotId: string | null;
  onSelectRobot: (id: string | null) => void;
  onUpdateConfig: (partial: Partial<SimulationConfig>) => void;
  onUpdateAblations: (partial: Partial<SimulationConfig['ablations']>) => void;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({
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
  emergentPatterns,
  selectedRobotId,
  onSelectRobot,
  onUpdateConfig,
  onUpdateAblations,
}) => {
  const [rightTab, setRightTab] = useState<'decision' | 'telemetry'>('decision');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0] || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0c10]">
      {/* Top Main Workspace: Left Config, Center Canvas, Right Decision Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Config Panel */}
        {showLeftPanel && (
          <MissionConfigPanel
            config={config}
            onUpdateConfig={onUpdateConfig}
            onUpdateAblations={onUpdateAblations}
            emergentPatterns={emergentPatterns}
          />
        )}

        {/* Toggle Left Button */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#141820] hover:bg-[#1e2430] border border-[#242b38] text-[#8b949e] p-0.5 rounded-r text-[10px] hidden md:block"
          title={showLeftPanel ? 'Collapse configuration' : 'Expand configuration'}
        >
          {showLeftPanel ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        {/* Center: Swarm Canvas (Map dominates) */}
        <div className="flex-1 relative flex flex-col h-full min-w-0">
          <SwarmCanvas
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

        {/* Toggle Right Button */}
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#141820] hover:bg-[#1e2430] border border-[#242b38] text-[#8b949e] p-0.5 rounded-l text-[10px] hidden md:block"
          title={showRightPanel ? 'Collapse right inspector' : 'Expand right inspector'}
        >
          {showRightPanel ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Right Panel: Local Decision Pipeline & Deep Robot Telemetry */}
        {showRightPanel && (
          <div className="w-84 md:w-96 bg-[#101318] border-l border-[#242b38] flex flex-col overflow-hidden shrink-0 z-10">
            {/* Sub-tabs for Right Panel */}
            <div className="flex border-b border-[#242b38] bg-[#0d1015] font-mono text-[10px]">
              <button
                onClick={() => setRightTab('decision')}
                className={`flex-1 py-1.5 px-2 flex items-center justify-center space-x-1 border-r border-[#242b38] transition-colors ${
                  rightTab === 'decision'
                    ? 'bg-[#141820] text-amber-300 font-bold border-t-2 border-t-amber-400'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>LOCAL DECISION</span>
              </button>
              <button
                onClick={() => setRightTab('telemetry')}
                className={`flex-1 py-1.5 px-2 flex items-center justify-center space-x-1 transition-colors ${
                  rightTab === 'telemetry'
                    ? 'bg-[#141820] text-cyan-300 font-bold border-t-2 border-t-cyan-400'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>TELEMETRY & RADAR</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {rightTab === 'decision' ? (
                <LocalDecisionPanel robot={selectedRobot} />
              ) : (
                <RobotTelemetryInspector
                  robot={selectedRobot}
                  onSelectNeighbor={id => onSelectRobot(id)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Timeline Scrubber + Terminal Event Stream */}
      <TimelineEventStream
        logs={logs}
        stats={stats}
        selectedRobotId={selectedRobotId}
        onSelectRobot={id => onSelectRobot(id)}
      />
    </div>
  );
};
