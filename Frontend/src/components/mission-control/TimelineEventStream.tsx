import React, { useState } from 'react';
import { TelemetryLogEntry, SimulationStats } from '../../types/simulation';
import { Terminal, Clock, ShieldAlert, CheckCircle, Info, Filter, Zap, Radio } from 'lucide-react';

interface TimelineEventStreamProps {
  logs: TelemetryLogEntry[];
  stats: SimulationStats;
  selectedRobotId: string | null;
  onSelectRobot: (id: string) => void;
}

export const TimelineEventStream: React.FC<TimelineEventStreamProps> = ({
  logs,
  stats,
  selectedRobotId,
  onSelectRobot,
}) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'WARN' | 'SUCCESS'>('ALL');
  const [onlySelectedRobot, setOnlySelectedRobot] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
    if (onlySelectedRobot && selectedRobotId && log.robotId !== selectedRobotId) return false;
    return true;
  });

  // Calculate estimated survival time (seconds) based on avg battery and consumption rate
  const estMinutesRemaining = Math.round((stats.avgBatteryPercent / 2.2));
  const energyPerM2 = stats.totalExploredM2 > 0 ? (stats.totalEnergyJoules / stats.totalExploredM2).toFixed(1) : '38.4';

  return (
    <div className="bg-[#0d1015] border-t border-[#242b38] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#242b38] text-xs font-mono select-none h-44 shrink-0">
      {/* Left: Swarm Performance & Survival Metrics */}
      <div className="w-full md:w-80 p-2.5 bg-[#101318] flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#8b949e] border-b border-[#242b38] pb-1.5 mb-2">
            <span className="font-bold tracking-wider uppercase text-[#cbd5e1] flex items-center space-x-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>MISSION TELEMETRY STRIP</span>
            </span>
            <span className="text-amber-400">T+{stats.elapsedSeconds}s</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] text-[9px] block">EST. SWARM SURVIVAL</span>
              <span className="text-emerald-400 font-bold text-xs">{estMinutesRemaining}m 40s</span>
              <span className="text-[#545d68] text-[9px] block">rolling threshold: 22%</span>
            </div>

            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] text-[9px] block">ENERGY / AREA EXP.</span>
              <span className="text-amber-400 font-bold text-xs">{energyPerM2} J/m&sup2;</span>
              <span className="text-[#545d68] text-[9px] block">PPO target: &lt;45 J/m&sup2;</span>
            </div>

            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] text-[9px] block">ACTIVE MESH LINKS</span>
              <span className="text-cyan-400 font-bold text-xs">{stats.activeLinksCount} edges</span>
              <span className="text-[#545d68] text-[9px] block">Loss: {stats.packetLossPercent}%</span>
            </div>

            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] text-[9px] block">TARGET LOCALIZATION</span>
              <span className="text-[#e6edf3] font-bold text-xs">
                {stats.targetsFound} / {stats.totalTargets} FOUND
              </span>
              <span className="text-emerald-400 text-[9px] block">
                {stats.targetsFound > 0 ? 'COORDINATES LOCKED' : 'SEARCHING'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 pt-1 border-t border-[#1e2430]">
          <div className="flex justify-between text-[9px] text-[#8b949e] mb-1">
            <span>AREA COVERAGE EXPANSION</span>
            <span className="text-emerald-400 font-bold">{stats.areaCoveragePercent}%</span>
          </div>
          <div className="w-full bg-[#141820] h-1.5 rounded-sm overflow-hidden border border-[#242b38]">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${stats.areaCoveragePercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Right: Live Terminal Event Feed */}
      <div className="flex-1 flex flex-col bg-[#0a0c10] overflow-hidden">
        {/* Terminal Header & Filter */}
        <div className="bg-[#101318] px-3 py-1.5 border-b border-[#242b38] flex items-center justify-between text-[10px]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span className="font-bold text-[#e6edf3] tracking-wide">DECENTRALIZED TELEMETRY EVENT STREAM</span>
            <span className="text-[#545d68]">({filteredLogs.length} events logged)</span>
          </div>

          <div className="flex items-center space-x-2">
            {selectedRobotId && (
              <button
                onClick={() => setOnlySelectedRobot(!onlySelectedRobot)}
                className={`px-1.5 py-0.5 rounded text-[9px] border ${
                  onlySelectedRobot
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'text-[#8b949e] border-[#242b38]'
                }`}
              >
                FILTER: {selectedRobotId}
              </button>
            )}

            <div className="flex items-center space-x-1">
              {(['ALL', 'WARN', 'SUCCESS'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-1.5 py-0.5 rounded text-[9px] ${
                    filterLevel === lvl
                      ? 'bg-[#1b212c] text-[#e6edf3] border border-[#384357]'
                      : 'text-[#8b949e] hover:text-[#cbd5e1]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stream Entries */}
        <div className="flex-1 p-2 overflow-y-auto space-y-1 font-mono text-[10px]">
          {filteredLogs.length === 0 ? (
            <div className="text-[#545d68] italic py-2 text-center">No telemetry events match current filter.</div>
          ) : (
            filteredLogs.map(log => {
              let tagColor = 'text-cyan-400 border-cyan-800/40 bg-cyan-950/20';
              let icon = <Info className="w-2.5 h-2.5 text-cyan-400 shrink-0 inline" />;

              if (log.level === 'WARN') {
                tagColor = 'text-amber-400 border-amber-800/40 bg-amber-950/20';
                icon = <ShieldAlert className="w-2.5 h-2.5 text-amber-400 shrink-0 inline" />;
              } else if (log.level === 'SUCCESS') {
                tagColor = 'text-emerald-400 border-emerald-800/40 bg-emerald-950/20';
                icon = <CheckCircle className="w-2.5 h-2.5 text-emerald-400 shrink-0 inline" />;
              } else if (log.level === 'CRITICAL') {
                tagColor = 'text-rose-400 border-rose-800/40 bg-rose-950/20';
                icon = <ShieldAlert className="w-2.5 h-2.5 text-rose-400 shrink-0 inline" />;
              }

              return (
                <div
                  key={log.id}
                  className="flex items-baseline space-x-2 leading-relaxed hover:bg-[#12161f] px-1 py-0.5 rounded transition-colors"
                >
                  <span className="text-[#545d68] text-[9px] shrink-0 font-variant-numeric">{log.timestamp}</span>
                  <button
                    onClick={() => onSelectRobot(log.robotId)}
                    className="px-1 py-0.2 rounded border border-[#242b38] bg-[#141820] text-[#cbd5e1] hover:text-amber-400 shrink-0 text-[9px] font-bold"
                  >
                    {log.robotId}
                  </button>
                  <span className={`px-1 py-0.2 rounded border text-[8px] font-bold ${tagColor}`}>
                    {log.level}
                  </span>
                  <span className="text-[#e6edf3] break-all">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
