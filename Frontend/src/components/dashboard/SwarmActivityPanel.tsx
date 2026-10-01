import React from 'react';
import { TelemetryLogEntry } from '../../types/simulation';
import { Activity } from 'lucide-react';

interface SwarmActivityPanelProps {
  logs: TelemetryLogEntry[];
  onSelectRobot: (id: string) => void;
}

export const SwarmActivityPanel: React.FC<SwarmActivityPanelProps> = ({
  logs,
  onSelectRobot,
}) => {
  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-5 flex flex-col space-y-3.5 select-none shadow-sm flex-1 min-h-[260px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Bottom Left
          </h2>
          <h3 className="text-base font-bold text-white tracking-tight">
            SWARM ACTIVITY
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Live events
        </span>
      </div>

      {/* Human-readable event feed */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[220px]">
        {logs.slice(0, 15).map(log => {
          // Normalize robot ID e.g. R-07 to R07
          const cleanRobotId = log.robotId.replace('-', '');
          // Formatted timestamp hh:mm:ss
          const time = log.timestamp.split('.')[0] || log.timestamp;

          return (
            <div
              key={log.id}
              className="flex items-baseline space-x-3 text-xs leading-relaxed hover:bg-gray-800/40 p-1.5 rounded-lg transition-colors"
            >
              <span className="font-mono text-gray-400 text-[11px] shrink-0 font-medium">
                {time}
              </span>

              {log.robotId !== 'SYSTEM' && log.robotId !== 'SWARM' && (
                <button
                  onClick={() => onSelectRobot(cleanRobotId)}
                  className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 shrink-0"
                >
                  {cleanRobotId}
                </button>
              )}

              <span className="text-gray-200 font-medium">
                {log.message.replace('R-', 'R')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
