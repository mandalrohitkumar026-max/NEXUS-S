import React from 'react';
import { Robot } from '../../types/robot';
import { ArrowDown, Radio, Eye, Battery, Compass, Layers, ShieldCheck, Zap } from 'lucide-react';

interface LocalDecisionPanelProps {
  robot: Robot | null;
}

export const LocalDecisionPanel: React.FC<LocalDecisionPanelProps> = ({ robot }) => {
  if (!robot) {
    return (
      <div className="p-4 bg-[#101318] border border-[#242b38] rounded text-center text-xs font-mono text-[#8b949e]">
        <div className="text-amber-500 mb-1 font-bold">NO ROBOT SELECTED</div>
        <p className="text-[11px] text-[#6b7280]">
          Click any swarm node on the map to inspect its real-time decentralized decision pipeline.
        </p>
      </div>
    );
  }

  const obs = robot.localObservation;
  const pol = robot.localPolicy;

  return (
    <div className="bg-[#101318] border border-[#242b38] rounded flex flex-col text-xs font-mono select-none overflow-hidden">
      {/* Header */}
      <div className="bg-[#141820] px-3 py-2 border-b border-[#242b38] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-bold text-[#e6edf3] tracking-wide">
            LOCAL DECISION PIPELINE // {robot.id}
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded border border-[#2e3748] bg-[#0c0e12] text-amber-400">
          DECENTRALIZED
        </span>
      </div>

      <div className="p-3 space-y-2.5 overflow-y-auto max-h-[460px]">
        {/* Step 1: Raw Local Sensors */}
        <div className="border border-[#242b38] rounded bg-[#0d1015] p-2.5">
          <div className="text-[10px] text-[#8b949e] font-semibold tracking-wider uppercase mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1 text-amber-400/90">
              <Eye className="w-3 h-3" />
              <span>1. LOCAL SENSOR OBSERVATIONS</span>
            </span>
            <span className="text-[9px] text-[#545d68]">R_s = {robot.sensorRadius}m</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">Obstacle Distance</span>
              <span className="text-[#e6edf3] font-bold">{obs.nearestObstacleDist} m</span>
              <span className="text-[#545d68] text-[9px] block">rel angle: {obs.nearestObstacleAngle} rad</span>
            </div>

            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">Local Neighbors</span>
              <span className="text-cyan-400 font-bold">{obs.neighborCount} nodes</span>
              <span className="text-[#545d68] text-[9px] block">
                {obs.nearestNeighborDist ? `${obs.nearestNeighborDist}m (${obs.nearestNeighborId})` : 'isolated'}
              </span>
            </div>

            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">Battery Voltage/SOC</span>
              <span className={`${obs.batteryLevel < 25 ? 'text-rose-400' : 'text-emerald-400'} font-bold`}>
                {obs.batteryLevel}%
              </span>
              <span className="text-[#545d68] text-[9px] block">to base: {obs.distToCharger}m</span>
            </div>

            <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">Unexplored Density</span>
              <span className="text-amber-300 font-bold">
                {Math.round(obs.unexploredDensity * 100)}%
              </span>
              <span className="text-[#545d68] text-[9px] block">target: {obs.targetSignalDetected ? 'CONFIRMED' : 'NONE'}</span>
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center text-[#545d68]">
          <ArrowDown className="w-3.5 h-3.5" />
        </div>

        {/* Step 2: State Vector Formulation */}
        <div className="border border-[#242b38] rounded bg-[#0d1015] p-2.5">
          <div className="text-[10px] text-[#8b949e] font-semibold tracking-wider uppercase mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1 text-cyan-400/90">
              <Layers className="w-3 h-3" />
              <span>2. STATE VECTOR s_t &isin; &reals;^9</span>
            </span>
            <span className="text-[9px] text-[#545d68]">NORMALIZED</span>
          </div>

          <div className="bg-[#141820] p-1.5 rounded border border-[#1e2430] text-[10px] space-y-1">
            <div className="flex flex-wrap gap-1">
              {pol.stateVector.map((val, idx) => (
                <span
                  key={idx}
                  className="px-1 py-0.5 rounded bg-[#1b212c] text-[#cbd5e1] border border-[#262f3f] text-[9px]"
                  title={`Feature #${idx}`}
                >
                  [{idx}]: <strong className="text-cyan-300">{val}</strong>
                </span>
              ))}
            </div>
            <div className="text-[9px] text-[#6b7280] pt-0.5">
              [d_obs, &theta;_obs, bat, n_cnt, d_nbr, &nabla;unexpl_x, bat_low, tgt_sig, d_chg]
            </div>
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center text-[#545d68]">
          <ArrowDown className="w-3.5 h-3.5" />
        </div>

        {/* Step 3: Policy Network Evaluation */}
        <div className="border border-[#242b38] rounded bg-[#0d1015] p-2.5">
          <div className="text-[10px] text-[#8b949e] font-semibold tracking-wider uppercase mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1 text-purple-400">
              <Zap className="w-3 h-3" />
              <span>3. POLICY &pi;(&bull;|s_t) &bull; MAPPO ACTOR</span>
            </span>
            <span className="text-[9px] text-purple-400/80">H(&pi;) = {pol.policyEntropy}</span>
          </div>

          <div className="space-y-1.5 bg-[#141820] p-2 rounded border border-[#1e2430]">
            {pol.actionProbabilities.map((ap, i) => (
              <div key={i} className="text-[10px]">
                <div className="flex justify-between text-[#8b949e] mb-0.5">
                  <span className={ap.action === pol.actionName ? 'text-amber-300 font-bold' : ''}>
                    {ap.action}
                  </span>
                  <span className="font-mono">{Math.round(ap.prob * 100)}%</span>
                </div>
                <div className="w-full bg-[#1b212c] h-1.5 rounded-sm overflow-hidden">
                  <div
                    className={`h-full ${
                      ap.action === pol.actionName ? 'bg-amber-400' : 'bg-[#3b4759]'
                    }`}
                    style={{ width: `${Math.round(ap.prob * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Down Arrow Connector */}
        <div className="flex justify-center text-[#545d68]">
          <ArrowDown className="w-3.5 h-3.5" />
        </div>

        {/* Step 4: Executed Action */}
        <div className="border border-amber-500/40 rounded bg-amber-950/15 p-2.5">
          <div className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Compass className="w-3 h-3" />
              <span>4. POLICY OUTPUT: EXECUTED ACTION</span>
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">
              SELECTED
            </span>
          </div>

          <div className="text-sm font-bold text-amber-300 tracking-wide my-1">
            &rarr; {pol.actionName}
          </div>

          <div className="grid grid-cols-3 gap-1 text-[9px] text-[#cbd5e1] mt-1 pt-1 border-t border-amber-500/20">
            <div>
              <span className="text-[#8b949e] block">SPEED:</span>
              <span className="font-bold text-[#e6edf3]">{pol.targetSpeed} m/s</span>
            </div>
            <div>
              <span className="text-[#8b949e] block">&Delta;HEADING:</span>
              <span className="font-bold text-[#e6edf3]">
                {pol.headingDelta > 0 ? `+${Math.round(pol.headingDelta * 57.3)}°` : `${Math.round(pol.headingDelta * 57.3)}°`}
              </span>
            </div>
            <div>
              <span className="text-[#8b949e] block">ROLE:</span>
              <span className="font-bold text-amber-400">{pol.assignedRole}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
