import React from 'react';
import { SimulationStats } from '../../types/simulation';
import { Shield, ArrowRight } from 'lucide-react';

interface MissionOverviewPageProps {
  stats: SimulationStats;
  robotCount: number;
  onLaunchOperations: () => void;
}

export const MissionOverviewPage: React.FC<MissionOverviewPageProps> = ({
  stats,
  robotCount,
  onLaunchOperations,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-y-auto p-6 space-y-6 select-none">
      {/* Executive Operational Briefing Banner */}
      <div className="card p-6 space-y-4 bg-white border border-[#E2E8F0]">
        <div className="flex items-center space-x-2 text-xs text-[#2563EB] font-semibold tracking-wider uppercase">
          <Shield className="w-4 h-4" />
          <span>MISSION DIRECTIVE &bull; SEARCH &amp; RESCUE // ZONE A</span>
        </div>

        <div className="space-y-1.5 max-w-3xl">
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            NEXUS-S Autonomous Swarm Deployment
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed font-normal">
            Autonomous multi-agent reconnaissance in GPS-denied and communication-constrained terrain. 12 robotic units operate via decentralized peer-to-peer consensus without a single point of failure or central controller.
          </p>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onLaunchOperations}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <span>Launch Live Swarm Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="card p-4 space-y-1 bg-white border border-[#E2E8F0]">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold block">DEPLOYED FLEET</span>
          <span className="text-2xl font-bold text-[#0F172A] font-mono">{robotCount} / {robotCount}</span>
          <span className="text-[11px] text-[#16A34A] font-medium">100% Active</span>
        </div>

        <div className="card p-4 space-y-1 bg-white border border-[#E2E8F0]">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold block">AREA SEARCHED</span>
          <span className="text-2xl font-bold text-[#2563EB] font-mono">{Math.round(stats.areaCoveragePercent)}%</span>
          <span className="text-[11px] text-[#64748B]">{stats.totalExploredM2} m&sup2; mapped</span>
        </div>

        <div className="card p-4 space-y-1 bg-white border border-[#E2E8F0]">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold block">FLEET ENERGY</span>
          <span className="text-2xl font-bold text-[#16A34A] font-mono">{Math.round(stats.avgBatteryPercent)}%</span>
          <span className="text-[11px] text-[#64748B]">22% reserve margin</span>
        </div>

        <div className="card p-4 space-y-1 bg-white border border-[#E2E8F0]">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold block">TARGETS VERIFIED</span>
          <span className="text-2xl font-bold text-[#0F172A] font-mono">{stats.targetsFound} / {stats.totalTargets}</span>
          <span className="text-[11px] text-[#16A34A] font-medium">Coordinates locked</span>
        </div>
      </div>

      {/* Swarm Coordination Principles */}
      <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
        <h3 className="text-sm font-bold text-[#0F172A] tracking-tight border-b border-[#E2E8F0] pb-2">
          DECENTRALIZED SWARM PRINCIPLES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#475569]">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-1.5">
            <strong className="text-[#2563EB] block font-semibold text-xs">1. Local Decision Independence</strong>
            <p className="text-[#475569] leading-relaxed text-[11px]">
              Each robot runs its own neural policy on local sensors. Losing radio contact with the base station does not disrupt individual robot task execution.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-1.5">
            <strong className="text-[#16A34A] block font-semibold text-xs">2. Autonomous Recharging Hysteresis</strong>
            <p className="text-[#475569] leading-relaxed text-[11px]">
              When battery levels drop to 22%, agents independently navigate to inductive docks, recharge to 95%, and resume exploration without supervisor intervention.
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-1.5">
            <strong className="text-[#7C3AED] block font-semibold text-xs">3. Spontaneous Relay Chaining</strong>
            <p className="text-[#475569] leading-relaxed text-[11px]">
              In non-line-of-sight rubble corridors, intermediate robots autonomously position themselves to act as relay bridges between frontier scouts and the base.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
