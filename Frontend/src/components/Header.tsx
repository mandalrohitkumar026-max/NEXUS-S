import React from 'react';
import { SimulationStats } from '../types/simulation';
import { Layers, ChevronDown } from 'lucide-react';

interface HeaderProps {
  stats: SimulationStats;
  robotCount: number;
  activeView: string;
  onSelectView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  robotCount,
  activeView,
  onSelectView,
}) => {
  return (
    <header className="border-b border-gray-800 bg-[#0f141c] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 select-none shrink-0 shadow-sm">
      {/* Brand Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-base shadow-inner">
          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="6" cy="6" r="2.5" fill="#f59e0b" fillOpacity="0.2" />
            <circle cx="18" cy="7" r="2.5" fill="#f59e0b" fillOpacity="0.2" />
            <circle cx="12" cy="18" r="2.5" fill="#f59e0b" fillOpacity="0.2" />
            <path d="M6 6L18 7M6 6L12 18M18 7L12 18" strokeDasharray="2 2" />
          </svg>
        </div>

        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-sans font-bold text-lg tracking-tight text-white">
              NEXUS-S
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-800/80 text-gray-300 border border-gray-700/60">
              Robotics Lab
            </span>
          </div>
          <p className="text-xs text-gray-400 font-normal">
            Decentralized Swarm Intelligence Platform
          </p>
        </div>
      </div>

      {/* Right Side Status Badges & Navigation Switcher */}
      <div className="flex items-center flex-wrap gap-3 sm:gap-5 text-xs">
        {/* System Status: ONLINE */}
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-gray-400 font-medium">System Status:</span>
          <span className="text-emerald-400 font-semibold">ONLINE</span>
        </div>

        {/* Robots: 12/12 */}
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span className="text-gray-400 font-medium">Robots:</span>
          <span className="text-white font-semibold">{robotCount}/{robotCount}</span>
        </div>

        {/* Mission Progress */}
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span className="text-gray-400 font-medium">Mission Progress:</span>
          <span className="text-blue-400 font-semibold">{Math.round(stats.areaCoveragePercent)}%</span>
        </div>

        {/* Energy */}
        <div className="flex items-center space-x-2 bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-gray-400 font-medium">Energy:</span>
          <span className="text-white font-semibold">{Math.round(stats.avgBatteryPercent)}%</span>
        </div>

        {/* Secondary View Switcher Menu */}
        <div className="relative">
          <select
            value={activeView}
            onChange={e => onSelectView(e.target.value)}
            className="bg-gray-800/90 text-gray-200 border border-gray-700/80 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer hover:bg-gray-750 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="dashboard">Mission Dashboard</option>
            <option value="swarm">Fleet Directory</option>
            <option value="experiments">Experiment Suite</option>
            <option value="policies">Policy Inspector</option>
            <option value="telemetry">Live Telemetry</option>
            <option value="communications">Mesh Network</option>
            <option value="analytics">Performance Analytics</option>
            <option value="research">Ablation Lab & Notebook</option>
            <option value="hardware">Hardware / ROS 2</option>
            <option value="architecture">System Architecture</option>
            <option value="landing">Project Overview</option>
          </select>
        </div>
      </div>
    </header>
  );
};
