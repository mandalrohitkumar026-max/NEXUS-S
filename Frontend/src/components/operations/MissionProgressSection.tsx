import React from 'react';
import { SimulationStats } from '../../types/simulation';
import { ArrowRight, Eye, Cpu, Radio, Users } from 'lucide-react';

interface MissionProgressSectionProps {
  stats: SimulationStats;
}

export const MissionProgressSection: React.FC<MissionProgressSectionProps> = ({ stats }) => {
  // Format time
  const hours = Math.floor(stats.elapsedSeconds / 3600);
  const minutes = Math.floor((stats.elapsedSeconds % 3600) / 60);
  const seconds = stats.elapsedSeconds % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const coveragePercent = Math.min(100, Math.round(stats.areaCoveragePercent));
  const energyPercent = Math.round(stats.avgBatteryPercent);
  const areaExploredPercent = Math.min(100, Math.round((stats.totalExploredM2 / (960 * 640)) * 100));

  return (
    <div className="card p-5 flex flex-col space-y-4 select-none flex-1 min-h-[260px] bg-white border border-[#E2E8F0]">
      {/* 8. MISSION PROGRESS */}
      <div>
        <div className="panel-header mb-3">
          <div>
            <span className="panel-header-subtitle text-[#64748B]">
              KEY BENCHMARKS
            </span>
            <h3 className="panel-header-title text-[#0F172A]">
              MISSION PROGRESS
            </h3>
          </div>
          <span className="text-xl font-bold text-[#2563EB] font-mono">
            {coveragePercent}%
          </span>
        </div>

        {/* Clean visual metric indicators with progress bars */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Search Coverage</span>
            <span className="text-sm font-bold text-[#2563EB] font-mono block">{coveragePercent}%</span>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${coveragePercent}%` }}></div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Targets Located</span>
            <span className="text-sm font-bold text-[#D97706] font-mono block">
              {stats.targetsFound} / {stats.totalTargets}
            </span>
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${(stats.targetsFound / Math.max(1, stats.totalTargets)) * 100}%`,
                  backgroundColor: '#D97706',
                }}
              ></div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Area Explored</span>
            <span className="text-sm font-bold text-[#0F172A] font-mono block">{areaExploredPercent}%</span>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${areaExploredPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Energy Remaining</span>
            <span className={`text-sm font-bold font-mono block ${energyPercent < 25 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
              {energyPercent}%
            </span>
            <div className="progress-track">
              <div
                className="progress-bar"
                style={{
                  width: `${energyPercent}%`,
                  backgroundColor: energyPercent < 25 ? '#DC2626' : '#16A34A',
                }}
              ></div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 col-span-2 sm:col-span-1 space-y-1.5">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">Mission Clock</span>
            <span className="text-sm font-bold text-[#0F172A] font-mono block">{timeStr}</span>
            <div className="text-[10px] text-[#64748B] font-medium">Real-time sync</div>
          </div>
        </div>
      </div>

      {/* 11. DECENTRALIZED COORDINATION */}
      <div className="pt-2 border-t border-[#E2E8F0] flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            DECENTRALIZED COORDINATION // ZERO CENTRAL CONTROLLER
          </span>
          <span className="text-[11px] text-[#2563EB] font-medium">
            Collective Emergent Intelligence
          </span>
        </div>

        {/* 4-Step Premium Light Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Step 1 */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-center relative flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#475569] shadow-xs">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#0F172A] block">Robot Observation</span>
            <span className="text-[11px] text-[#64748B]">Local sensor radius (75m)</span>
            <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold z-10">&rarr;</div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-center relative flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-xs">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#2563EB] block">Local Decision</span>
            <span className="text-[11px] text-[#64748B]">Independent neural policy</span>
            <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold z-10">&rarr;</div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F8FAFC] border border-[#BFDBFE] rounded-lg p-3 text-center relative flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] shadow-xs">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#2563EB] block">Peer Communication</span>
            <span className="text-[11px] text-[#64748B]">1-hop ad-hoc gossip mesh</span>
            <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] font-bold z-10">&rarr;</div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#F8FAFC] border border-[#BBF7D0] rounded-lg p-3 text-center flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shadow-xs">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#16A34A] block">Swarm Behavior</span>
            <span className="text-[11px] text-[#64748B]">Collective search &amp; coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
