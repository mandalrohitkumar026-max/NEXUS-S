import React, { useState } from 'react';
import { Robot } from '../../types/robot';
import { SimulationStats } from '../../types/simulation';
import { explainRobotDecision } from '../../simulation/plainEnglish';
import { Check } from 'lucide-react';

interface SwarmIntelligencePanelProps {
  robots: Robot[];
  stats: SimulationStats;
  selectedRobotId: string | null;
  onSelectRobot: (id: string) => void;
}

export const SwarmIntelligencePanel: React.FC<SwarmIntelligencePanelProps> = ({
  robots,
  stats,
  selectedRobotId,
  onSelectRobot,
}) => {
  const [activeTab, setActiveTab] = useState<'swarm' | 'inspector'>('swarm');

  const selectedRobot = robots.find(r => r.id === selectedRobotId) || robots[0] || null;
  const explanation = selectedRobot ? explainRobotDecision(selectedRobot, robots) : null;

  // Neighbors of selected robot
  const neighborIds = selectedRobot
    ? robots
        .filter(r => r.id !== selectedRobot.id && Math.hypot(r.x - selectedRobot.x, r.y - selectedRobot.y) <= selectedRobot.commRadius)
        .map(r => r.id)
    : [];

  const coveragePercent = Math.min(100, Math.round(stats.areaCoveragePercent));
  const energyPercent = Math.round(stats.avgBatteryPercent);
  const commHealth = stats.commConnectedPercent;

  return (
    <div className="card p-4 flex flex-col space-y-4 select-none flex-1 min-h-[460px] bg-white border border-[#E2E8F0]">
      {/* Panel Header */}
      <div className="panel-header">
        <div>
          <span className="panel-header-subtitle text-[#64748B]">
            EXPLAINABLE AI // DECENTRALIZED
          </span>
          <h3 className="panel-header-title text-[#0F172A]">
            SWARM INTELLIGENCE
          </h3>
          <span className="text-[11px] text-[#2563EB] font-semibold">
            {robots.length} ACTIVE AGENTS
          </span>
        </div>

        {/* Tab Toggle: Swarm Overview vs Selected Inspector */}
        <div className="tab-pill-container">
          <button
            onClick={() => setActiveTab('swarm')}
            className={`tab-pill ${activeTab === 'swarm' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
          >
            Swarm
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`tab-pill flex items-center space-x-1 ${activeTab === 'inspector' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
          >
            <span>Inspector</span>
            {selectedRobot && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#2563EB] font-bold">
                {selectedRobot.id}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'swarm' ? (
        /* SWARM OVERVIEW MODE */
        <div className="space-y-4 flex-1 flex flex-col justify-between overflow-y-auto pr-1">
          {/* Metrics Matrix */}
          <div className="space-y-2.5">
            {/* Search Coverage */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#475569]">SEARCH COVERAGE</span>
                <span className="font-bold text-[#2563EB] font-mono text-sm">{coveragePercent}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${coveragePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Grid for Targets, Comms, Energy */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">TARGETS</span>
                <span className="text-sm font-bold text-[#D97706] font-mono block mt-0.5">
                  {stats.targetsFound} <span className="text-xs text-[#64748B] font-normal">/ {stats.totalTargets}</span>
                </span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">Found</span>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">COMMS</span>
                <span className="text-sm font-bold text-[#2563EB] font-mono block mt-0.5">{commHealth}%</span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">Mesh Health</span>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">ENERGY</span>
                <span className="text-sm font-bold text-[#16A34A] font-mono block mt-0.5">{energyPercent}%</span>
                <span className="text-[10px] text-[#64748B] block mt-0.5">Fleet Battery</span>
              </div>
            </div>
          </div>

          {/* Section 7: CURRENT SWARM BEHAVIOR */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
              CURRENT SWARM BEHAVIOR
            </span>
            <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
              &ldquo;Agents are redistributing across unexplored sectors while maintaining communication coverage.&rdquo;
            </p>
          </div>

          {/* Section 7: WHY ARE THEY MOVING? */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                WHY ARE THEY MOVING?
              </span>
              {selectedRobot && (
                <span className="text-xs font-bold text-[#2563EB] font-mono">
                  {selectedRobot.id} &rarr; {selectedRobot.x < 480 ? 'Sector B' : 'Sector D'}
                </span>
              )}
            </div>

            <div className="text-xs space-y-1.5 pt-1">
              <ul className="space-y-1.5 text-xs text-[#334155]">
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Sector B is unexplored</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>{selectedRobot?.id || 'R07'} has sufficient battery ({Math.round(selectedRobot?.battery || 82)}%)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Nearby agents already cover Sector A</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Communication is available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Section 10: ROBOT STATUS (INSPECTOR MODE) */
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 text-xs">
          {selectedRobot && explanation ? (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                  <span className="text-sm font-bold text-[#0F172A] tracking-wide">
                    ROBOT {selectedRobot.id}
                  </span>
                </div>
                <span
                  className={`badge ${
                    selectedRobot.state === 'CHARGING'
                      ? 'badge-success'
                      : selectedRobot.state === 'RETURNING'
                      ? 'badge-warning'
                      : selectedRobot.state === 'TRACKING'
                      ? 'badge-primary'
                      : 'badge-muted'
                  }`}
                >
                  {selectedRobot.state}
                </span>
              </div>

              {/* Data Rows */}
              <div className="space-y-2.5 text-xs">
                {/* Status */}
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] font-medium">STATUS</span>
                  <span className="font-bold text-[#0F172A] uppercase">{selectedRobot.state}</span>
                </div>

                {/* Battery */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#64748B] font-medium">BATTERY</span>
                    <span className={`font-mono font-bold ${selectedRobot.battery < 25 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                      {Math.round(selectedRobot.battery)}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className={`h-full rounded-full ${selectedRobot.battery < 25 ? 'bg-[#DC2626]' : 'bg-[#16A34A]'}`}
                      style={{ width: `${selectedRobot.battery}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Task */}
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] font-medium">CURRENT TASK</span>
                  <span className="font-semibold text-[#0F172A]">{explanation.taskText}</span>
                </div>

                {/* Speed */}
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] font-medium">SPEED</span>
                  <span className="font-bold text-[#0F172A] font-mono">{selectedRobot.speed.toFixed(1)} m/s</span>
                </div>

                {/* Communication */}
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B] font-medium">COMMUNICATION</span>
                  <span className="font-bold text-[#2563EB] flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                    <span>CONNECTED</span>
                  </span>
                </div>

                {/* Neighbors */}
                <div>
                  <span className="text-[#64748B] font-medium block mb-1">NEIGHBORS</span>
                  <div className="flex flex-wrap gap-1">
                    {neighborIds.length > 0 ? (
                      neighborIds.map(nid => (
                        <button
                          key={nid}
                          onClick={() => onSelectRobot(nid)}
                          className="px-2 py-0.5 rounded bg-white text-[#2563EB] font-bold border border-[#E2E8F0] hover:bg-[#EFF6FF] transition-colors"
                        >
                          {nid}
                        </button>
                      ))
                    ) : (
                      <span className="text-[#94A3B8] italic">No direct peer in 1-hop range</span>
                    )}
                  </div>
                </div>

                {/* Current Decision */}
                <div className="pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium block mb-1">CURRENT DECISION</span>
                  <p className="text-[#0F172A] font-medium leading-relaxed bg-white p-2.5 rounded border border-[#E2E8F0]">
                    {selectedRobot.localPolicy.actionName.replace(/_/g, ' ')}
                  </p>
                </div>

                {/* Decision Confidence */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[#64748B] font-medium">DECISION CONFIDENCE</span>
                  <span className="font-bold text-[#16A34A] font-mono text-sm">{explanation.confidencePercent}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-[#64748B]">
              Select a robot on the map to inspect its real-time telemetry and decision state.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
