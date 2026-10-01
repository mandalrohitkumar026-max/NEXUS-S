import React, { useState } from 'react';
import { TelemetryLogEntry } from '../../types/simulation';

interface LiveEventStreamProps {
  logs: TelemetryLogEntry[];
  onSelectRobot: (id: string) => void;
}

export const LiveEventStream: React.FC<LiveEventStreamProps> = ({
  logs,
  onSelectRobot,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ROBOTS' | 'TARGETS' | 'SYSTEM'>('ALL');

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    if (filter === 'ROBOTS') return log.robotId.startsWith('R') || log.robotId.startsWith('r');
    if (filter === 'TARGETS') return log.message.toLowerCase().includes('target') || log.message.toLowerCase().includes('survivor');
    if (filter === 'SYSTEM') return log.robotId === 'SYSTEM' || log.robotId === 'SWARM';
    return true;
  });

  return (
    <div className="card p-5 flex flex-col space-y-3 select-none flex-1 min-h-[260px] bg-white border border-[#E2E8F0]">
      {/* Header and Filter Tabs */}
      <div className="panel-header">
        <div>
          <span className="panel-header-subtitle text-[#64748B]">
            MISSION TIMELINE
          </span>
          <h3 className="panel-header-title text-[#0F172A] flex items-center space-x-2">
            <span>LIVE EVENT STREAM</span>
            <span className="text-xs font-normal text-[#64748B] font-mono">
              ({filteredLogs.length})
            </span>
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="tab-pill-container">
          {(['ALL', 'ROBOTS', 'TARGETS', 'SYSTEM'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`tab-pill ${filter === tab ? 'tab-pill-active' : 'tab-pill-inactive'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Vertical Timeline (White/Light Background, No Terminal Styling) */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[220px]">
        {filteredLogs.length === 0 ? (
          <div className="text-xs text-[#64748B] text-center py-6">
            No events match the selected filter.
          </div>
        ) : (
          filteredLogs.slice(0, 20).map(log => {
            const time = log.timestamp.split('.')[0] || log.timestamp;
            const isRobot = log.robotId.startsWith('R');
            const cleanId = log.robotId.replace('-', '');

            let indicatorBg = 'bg-[#2563EB]';

            if (log.level === 'SUCCESS' || log.message.includes('target') || log.message.includes('survivor')) {
              indicatorBg = 'bg-[#16A34A]';
            } else if (log.level === 'WARN' || log.message.includes('low')) {
              indicatorBg = 'bg-[#D97706]';
            } else if (log.level === 'CRITICAL') {
              indicatorBg = 'bg-[#DC2626]';
            }

            return (
              <div
                key={log.id}
                className="event-row bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              >
                {/* 1. Timestamp (Mono) */}
                <span className="event-time">
                  {time}
                </span>

                {/* 2. Color indicator */}
                <span className={`event-indicator ${indicatorBg}`}></span>

                {/* 3. Event message with optional Robot tag */}
                <div className="event-content">
                  {isRobot && (
                    <button
                      onClick={() => onSelectRobot(cleanId)}
                      className="badge badge-accent hover:bg-[#DBEAFE] transition-colors shrink-0 font-mono"
                    >
                      {cleanId}
                    </button>
                  )}
                  <span className="event-message text-[#0F172A]">
                    {log.message.replace(/R-/g, 'R')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
