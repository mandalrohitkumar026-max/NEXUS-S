import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Bell, CheckCircle, AlertTriangle } from 'lucide-react';
import { SimulationStats } from '../../types/simulation';

interface TopCommandBarProps {
  stats: SimulationStats;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  robotCount: number;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  stats,
  isRunning,
  onTogglePlay,
  onReset,
  robotCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Format elapsed seconds as hh:mm:ss
  const hours = Math.floor(stats.elapsedSeconds / 3600);
  const minutes = Math.floor((stats.elapsedSeconds % 3600) / 60);
  const seconds = stats.elapsedSeconds % 60;
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.min(100, Math.round(stats.areaCoveragePercent));
  const energyPercent = Math.round(stats.avgBatteryPercent);

  return (
    <header className="top-command-bar bg-white border-b border-[#E2E8F0] px-6">
      {/* Left: Mission Title & Status */}
      <div className="flex items-center space-x-6">
        <div>
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            LIVE OPERATIONS
          </span>
          <div className="text-sm font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <span>SEARCH & RESCUE</span>
            <span className="text-[11px] text-[#64748B] font-medium">
              // Zone A
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-6 w-[1px] bg-[#E2E8F0]"></div>

        {/* Status badge: ● Autonomous Active */}
        <div>
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-0.5">
            STATUS
          </span>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            <span>{isRunning ? 'Autonomous Active' : 'Mission Paused'}</span>
          </div>
        </div>
      </div>

      {/* Center: Mission Time & Fast Controls */}
      <div className="flex items-center space-x-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-1.5 shadow-sm">
        <div className="text-right">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Mission Time
          </span>
          <div className="text-sm font-mono font-bold text-[#0F172A] tracking-wider">
            {timeStr}
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center space-x-1 pl-2 border-l border-[#E2E8F0]">
          <button
            onClick={onTogglePlay}
            className={`p-1.5 rounded-md text-xs font-semibold transition-colors ${
              isRunning
                ? 'bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7] border border-[#FDE68A]'
                : 'bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] border border-[#BBF7D0]'
            }`}
            title={isRunning ? 'Pause swarm simulation' : 'Start/Resume simulation'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          <button
            onClick={onReset}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:border-[#E2E8F0] border border-transparent transition-colors"
            title="Reset mission simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Fleet Health Metrics & Notification Bell */}
      <div className="flex items-center space-x-5">
        {/* Agents Metric */}
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Agents
          </span>
          <div className="text-sm font-mono font-bold text-[#0F172A]">
            {robotCount} <span className="text-[#64748B] text-xs font-normal">/ {robotCount}</span>
          </div>
        </div>

        {/* Energy Metric */}
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Energy
          </span>
          <div className={`text-sm font-mono font-bold ${energyPercent < 25 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {energyPercent}%
          </div>
        </div>

        {/* Coverage Metric */}
        <div className="text-right">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
            Coverage
          </span>
          <div className="text-sm font-mono font-bold text-[#2563EB]">
            {progressPercent}%
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors relative shadow-sm"
            title="Mission Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]"></span>
          </button>

          {/* Notification Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 bg-white border border-[#E2E8F0] rounded-xl p-3 space-y-2 z-50 text-xs shadow-lg">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="font-bold text-[#0F172A]">Mission Alerts</span>
                <span className="badge badge-accent">2 Active</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]">
                  <div className="flex items-center space-x-1.5 font-bold text-[#16A34A] mb-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Target Alpha Localized</span>
                  </div>
                  <p className="text-[11px] text-[#475569]">R03 locked coordinates in Sector B (confidence 94%).</p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]">
                  <div className="flex items-center space-x-1.5 font-bold text-[#D97706] mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>R12 Low Battery Advisory</span>
                  </div>
                  <p className="text-[11px] text-[#475569]">Automatic return-to-dock routing engaged at 19% charge.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
