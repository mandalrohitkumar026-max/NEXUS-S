import React from 'react';
import { Play, Pause, Square, Check, Circle, AlertCircle } from 'lucide-react';
import { SimulationStats } from '../../types/simulation';

interface MissionControlPanelProps {
  stats: SimulationStats;
  isRunning: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const MissionControlPanel: React.FC<MissionControlPanelProps> = ({
  stats,
  isRunning,
  onTogglePlay,
  onReset,
}) => {
  // Format elapsed time as mm:ss
  const minutes = Math.floor(stats.elapsedSeconds / 60);
  const seconds = stats.elapsedSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.min(100, Math.round(stats.areaCoveragePercent));

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-5 flex flex-col space-y-5 select-none shadow-sm">
      {/* Section Title */}
      <div className="border-b border-gray-800 pb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Column 1
        </h2>
        <h3 className="text-base font-bold text-white tracking-tight">
          MISSION CONTROL
        </h3>
      </div>

      {/* Primary Mission Info Cards */}
      <div className="space-y-3">
        <div className="bg-[#161c28] border border-gray-800/80 rounded-lg p-3">
          <span className="text-xs font-medium text-gray-400 block mb-0.5">Mission</span>
          <span className="text-sm font-semibold text-white">Search & Rescue</span>
        </div>

        <div className="bg-[#161c28] border border-gray-800/80 rounded-lg p-3">
          <span className="text-xs font-medium text-gray-400 block mb-0.5">Area</span>
          <span className="text-sm font-semibold text-white">Unknown Zone A</span>
        </div>

        <div className="bg-[#161c28] border border-gray-800/80 rounded-lg p-3">
          <span className="text-xs font-medium text-gray-400 block mb-0.5">Objective</span>
          <p className="text-xs text-gray-200 leading-relaxed font-normal">
            Locate targets while minimizing energy use.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-[#161c28] border border-gray-800/80 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Progress</span>
            <span className="text-lg font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Time Elapsed Card */}
        <div className="bg-[#161c28] border border-gray-800/80 rounded-lg p-3 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">Time Elapsed</span>
          <span className="text-sm font-mono font-bold text-white">{formattedTime}</span>
        </div>
      </div>

      {/* Mission Controls */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
          Controls
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
              isRunning
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Mission</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/80 text-xs font-semibold transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      </div>

      {/* Mission Objectives Checklist */}
      <div className="pt-2 border-t border-gray-800 space-y-2.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
          MISSION OBJECTIVES
        </span>

        <div className="space-y-2 text-xs">
          {/* Objective 1 */}
          <div className="flex items-center space-x-2 text-gray-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="font-medium">Explore assigned area</span>
          </div>

          {/* Objective 2 */}
          <div className="flex items-center space-x-2 text-gray-200">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="font-medium">Maintain communication</span>
          </div>

          {/* Objective 3 */}
          <div className="flex items-center space-x-2 text-gray-200">
            <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <span className="font-medium">Locate targets</span>
            <span className="text-[11px] text-gray-400 font-normal">
              ({stats.targetsFound}/{stats.totalTargets} found)
            </span>
          </div>

          {/* Objective 4 */}
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
              <Circle className="w-2 h-2 text-transparent" />
            </div>
            <span className="font-normal">Complete mission</span>
          </div>
        </div>
      </div>
    </div>
  );
};
