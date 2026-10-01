import React from 'react';
import { SimulationConfig, EmergentPattern } from '../../types/simulation';
import { Sliders, Sparkles, AlertCircle, Shield, Wifi, Battery, Eye } from 'lucide-react';

interface MissionConfigPanelProps {
  config: SimulationConfig;
  onUpdateConfig: (partial: Partial<SimulationConfig>) => void;
  onUpdateAblations: (partial: Partial<SimulationConfig['ablations']>) => void;
  emergentPatterns: EmergentPattern[];
}

export const MissionConfigPanel: React.FC<MissionConfigPanelProps> = ({
  config,
  onUpdateConfig,
  onUpdateAblations,
  emergentPatterns,
}) => {
  return (
    <div className="w-80 bg-[#101318] border-r border-[#242b38] flex flex-col text-xs font-mono select-none overflow-hidden shrink-0">
      {/* Panel Header */}
      <div className="bg-[#141820] px-3 py-2 border-b border-[#242b38] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-[#e6edf3]">MISSION & SWARM CONFIG</span>
        </div>
        <span className="text-[10px] text-[#8b949e]">SEARCH-042</span>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto flex-1">
        {/* Policy Algorithm Selection */}
        <div>
          <label className="text-[10px] text-[#8b949e] font-semibold uppercase block mb-1.5">
            Decentralized Policy Engine
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {(['MAPPO', 'IPPO', 'QMIX', 'RULE_BASED'] as const).map(algo => (
              <button
                key={algo}
                onClick={() => onUpdateConfig({ algorithm: algo })}
                className={`p-1.5 rounded border text-left transition-colors ${
                  config.algorithm === algo
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-[#141820] border-[#242b38] text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                <div>{algo}</div>
                <div className="text-[8px] text-[#545d68] font-normal">
                  {algo === 'MAPPO' ? 'Multi-Agent PPO' : algo === 'IPPO' ? 'Indep. PPO' : algo === 'QMIX' ? 'Value Factor' : 'Potential Field'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Swarm Physics Parameters */}
        <div className="space-y-2.5 pt-2 border-t border-[#1e2430]">
          <label className="text-[10px] text-[#8b949e] font-semibold uppercase block">
            Swarm Dynamics & Bounds
          </label>

          {/* Comm Horizon */}
          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>COMMUNICATION HORIZON</span>
              <span className="text-cyan-400 font-bold">{config.commRadius}m</span>
            </div>
            <input
              type="range"
              min="60"
              max="220"
              step="10"
              value={config.commRadius}
              onChange={e => onUpdateConfig({ commRadius: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Sensor Horizon */}
          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>LIDAR SENSOR RANGE</span>
              <span className="text-amber-400 font-bold">{config.sensorRadius}m</span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              step="5"
              value={config.sensorRadius}
              onChange={e => onUpdateConfig({ sensorRadius: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded cursor-pointer"
            />
          </div>

          {/* Return Threshold */}
          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>RETURN TO BASE THRESHOLD</span>
              <span className="text-rose-400 font-bold">{config.returnThreshold}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="2"
              value={config.returnThreshold}
              onChange={e => onUpdateConfig({ returnThreshold: Number(e.target.value) })}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Real-time Ablation Switches */}
        <div className="pt-2 border-t border-[#1e2430]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#8b949e] font-semibold uppercase">
              Ablation Controls (Stress Test)
            </span>
            <span className="text-[8px] px-1 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40">
              LIVE
            </span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <label className="flex items-center justify-between p-1.5 rounded bg-[#141820] border border-[#1e2430] cursor-pointer hover:bg-[#181d26]">
              <span className="flex items-center space-x-1.5 text-[#cbd5e1]">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span>Disable Peer Comms</span>
              </span>
              <input
                type="checkbox"
                checked={config.ablations.noCommunication}
                onChange={e => onUpdateAblations({ noCommunication: e.target.checked })}
                className="accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded bg-[#141820] border border-[#1e2430] cursor-pointer hover:bg-[#181d26]">
              <span className="flex items-center space-x-1.5 text-[#cbd5e1]">
                <Battery className="w-3 h-3 text-amber-400" />
                <span>Disable Battery Awareness</span>
              </span>
              <input
                type="checkbox"
                checked={config.ablations.noBatteryAwareness}
                onChange={e => onUpdateAblations({ noBatteryAwareness: e.target.checked })}
                className="accent-amber-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-1.5 rounded bg-[#141820] border border-[#1e2430] cursor-pointer hover:bg-[#181d26]">
              <span className="flex items-center space-x-1.5 text-[#cbd5e1]">
                <Shield className="w-3 h-3 text-rose-400" />
                <span>Disable Collision Avoidance</span>
              </span>
              <input
                type="checkbox"
                checked={config.ablations.noCollisionAvoidance}
                onChange={e => onUpdateAblations({ noCollisionAvoidance: e.target.checked })}
                className="accent-amber-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Emergent Swarm Behaviors Identified */}
        <div className="pt-2 border-t border-[#1e2430]">
          <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 font-semibold uppercase mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Emergent Behaviors Detected</span>
          </div>

          <div className="space-y-2">
            {emergentPatterns.map(pattern => (
              <div
                key={pattern.id}
                className="p-2 rounded border border-[#242b38] bg-[#0d1015] text-[10px] space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-[#e6edf3]">
                  <span>{pattern.name}</span>
                  <span className="text-emerald-400 font-mono text-[9px]">
                    {pattern.confidence}% CONF
                  </span>
                </div>
                <p className="text-[#8b949e] text-[9px] leading-relaxed">
                  {pattern.description}
                </p>
                <div className="text-[8px] text-[#545d68]">
                  Nodes: [{pattern.participatingRobots.join(', ')}]
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
