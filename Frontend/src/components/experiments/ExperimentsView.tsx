import React, { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, Sliders, Cpu, Gauge, Clock, ShieldCheck, Download } from 'lucide-react';
import { POLICY_COMPARISONS } from '../../data/researchData';

export const ExperimentsView: React.FC = () => {
  const [terrain, setTerrain] = useState<'URBAN_RUBBLE' | 'COLLAPSED_GRID' | 'CAVE_NETWORK'>('URBAN_RUBBLE');
  const [obstacleDensity, setObstacleDensity] = useState(25);
  const [robotCount, setRobotCount] = useState(12);
  const [batteryCap, setBatteryCap] = useState(3200);
  const [commRange, setCommRange] = useState(140);
  const [sensorRange, setSensorRange] = useState(75);
  const [algorithm, setAlgorithm] = useState<'MAPPO' | 'IPPO' | 'QMIX' | 'RULE_BASED'>('MAPPO');
  const [commBudget, setCommBudget] = useState(150); // messages/min
  const [maxTime, setMaxTime] = useState(300); // sec
  const [objective, setObjective] = useState<'COVERAGE' | 'ENERGY' | 'SEARCH_TIME' | 'MULTI_OBJECTIVE'>('MULTI_OBJECTIVE');

  // Execution state
  const [isRunningExp, setIsRunningExp] = useState(false);
  const [expProgress, setExpProgress] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState(POLICY_COMPARISONS);
  const [lastExpResult, setLastExpResult] = useState<string | null>(null);

  const handleRunExperiment = () => {
    setIsRunningExp(true);
    setExpProgress(5);
    setLastExpResult(null);

    const interval = setInterval(() => {
      setExpProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningExp(false);
          const newExp = {
            id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: `${algorithm} [${terrain}]`,
            type: `${robotCount} Agents, Comm=${commRange}m`,
            coverage: Math.round(85 + Math.random() * 8.5 * 10) / 10,
            energyLeft: Math.round(65 + Math.random() * 12 * 10) / 10,
            commCostRating: commRange > 150 ? 'High' as const : 'Medium' as const,
            searchTimeSec: Math.round(110 + Math.random() * 30),
            survivorsFound: 3,
            relayStability: 0.91,
            collisionsCount: Math.floor(Math.random() * 3),
          };
          setCompletedExperiments(curr => [newExp, ...curr]);
          setLastExpResult(`Trial successfully concluded. Coverage: ${newExp.coverage}%, Energy: ${newExp.energyLeft}%, Search: ${newExp.searchTimeSec}s.`);
          return 100;
        }
        return prev + 15;
      });
    }, 280);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              SCIENTIFIC EXPERIMENT BUILDER & RUNNER
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            Configure parameterized multi-agent coordination trials under communication and energy bounds
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunExperiment}
            disabled={isRunningExp}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded font-bold transition-colors ${
              isRunningExp
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningExp ? `RUNNING TRIAL (${expProgress}%)` : 'RUN EXPERIMENT'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar if running */}
      {isRunningExp && (
        <div className="bg-[#101318] border border-amber-500/40 rounded p-3 space-y-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-amber-300 font-bold">
              EXECUTING MONTE-CARLO SIMULATION TRIAL...
            </span>
            <span className="text-amber-400">{expProgress}%</span>
          </div>
          <div className="w-full bg-[#141820] h-2 rounded overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${expProgress}%` }}
            ></div>
          </div>
          <div className="text-[9px] text-[#8b949e]">
            Simulating {robotCount} decentralized nodes on {terrain} (Obstacle density: {obstacleDensity}%)
          </div>
        </div>
      )}

      {lastExpResult && (
        <div className="bg-emerald-950/25 border border-emerald-500/40 rounded p-3 flex items-center space-x-2 text-emerald-300 text-[11px]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{lastExpResult}</span>
        </div>
      )}

      {/* Experiment Configuration Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Environment Config */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-3 space-y-3">
          <div className="border-b border-[#1e2430] pb-1.5 font-bold text-[#e6edf3] flex items-center space-x-1.5">
            <span className="text-amber-400">1.</span>
            <span>ENVIRONMENT</span>
          </div>

          <div>
            <label className="text-[10px] text-[#8b949e] block mb-1">Terrain Morphology</label>
            <select
              value={terrain}
              onChange={e => setTerrain(e.target.value as any)}
              className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
            >
              <option value="URBAN_RUBBLE">Urban Rubble (Collapsed)</option>
              <option value="COLLAPSED_GRID">Industrial Facility Grid</option>
              <option value="CAVE_NETWORK">Subterranean Cave Network</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>Obstacle Density</span>
              <span className="text-amber-400">{obstacleDensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={obstacleDensity}
              onChange={e => setObstacleDensity(Number(e.target.value))}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded"
            />
          </div>

          <div>
            <span className="text-[10px] text-[#8b949e] block">Arena Geometry</span>
            <span className="text-[#cbd5e1] font-bold">960m &times; 640m (2D Planar)</span>
          </div>
        </div>

        {/* 2. Swarm Hardware & Scale */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-3 space-y-3">
          <div className="border-b border-[#1e2430] pb-1.5 font-bold text-[#e6edf3] flex items-center space-x-1.5">
            <span className="text-amber-400">2.</span>
            <span>SWARM HARDWARE</span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>Swarm Node Count</span>
              <span className="text-amber-400 font-bold">{robotCount} robots</span>
            </div>
            <input
              type="range"
              min="6"
              max="20"
              step="2"
              value={robotCount}
              onChange={e => setRobotCount(Number(e.target.value))}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>Battery Capacity</span>
              <span className="text-emerald-400">{batteryCap} mAh</span>
            </div>
            <input
              type="range"
              min="2000"
              max="5000"
              step="200"
              value={batteryCap}
              onChange={e => setBatteryCap(Number(e.target.value))}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>Comm Range / Horizon</span>
              <span className="text-cyan-400">{commRange}m</span>
            </div>
            <input
              type="range"
              min="80"
              max="220"
              step="10"
              value={commRange}
              onChange={e => setCommRange(Number(e.target.value))}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded"
            />
          </div>
        </div>

        {/* 3. Decentralized Policy Algorithm */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-3 space-y-3">
          <div className="border-b border-[#1e2430] pb-1.5 font-bold text-[#e6edf3] flex items-center space-x-1.5">
            <span className="text-amber-400">3.</span>
            <span>POLICY ALGORITHM</span>
          </div>

          <div>
            <label className="text-[10px] text-[#8b949e] block mb-1">Multi-Agent RL Model</label>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value as any)}
              className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
            >
              <option value="MAPPO">MAPPO (Decentralized Actor)</option>
              <option value="IPPO">IPPO (Independent PPO)</option>
              <option value="QMIX">QMIX (Value-Factorization)</option>
              <option value="RULE_BASED">Rule-Based Potential Field</option>
            </select>
          </div>

          <div className="text-[9px] text-[#8b949e] bg-[#141820] p-2 rounded border border-[#1e2430] leading-relaxed">
            {algorithm === 'MAPPO' && 'Multi-Agent PPO trains with centralized critic for global value guidance but executes strictly decentralized actor policies on local robot observations.'}
            {algorithm === 'IPPO' && 'Purely decentralized independent PPO. High scalability, but prone to non-stationarity under communication blackouts.'}
            {algorithm === 'QMIX' && 'Monotonic joint value factorization network. Strong coordination capability with discrete action distributions.'}
            {algorithm === 'RULE_BASED' && 'Deterministic artificial potential fields + frontier gradient heuristic. Zero training required, serves as scientific baseline.'}
          </div>
        </div>

        {/* 4. Constraints & Objectives */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-3 space-y-3">
          <div className="border-b border-[#1e2430] pb-1.5 font-bold text-[#e6edf3] flex items-center space-x-1.5">
            <span className="text-amber-400">4.</span>
            <span>CONSTRAINTS & REWARD</span>
          </div>

          <div>
            <label className="text-[10px] text-[#8b949e] block mb-1">Optimization Objective</label>
            <select
              value={objective}
              onChange={e => setObjective(e.target.value as any)}
              className="w-full bg-[#141820] border border-[#242b38] rounded p-1.5 text-[#e6edf3]"
            >
              <option value="MULTI_OBJECTIVE">Multi-Objective Pareto</option>
              <option value="COVERAGE">Max Area Coverage</option>
              <option value="SEARCH_TIME">Min Search Time</option>
              <option value="ENERGY">Max Energy Efficiency</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-[#cbd5e1] mb-1">
              <span>Max Mission Timeout</span>
              <span className="text-[#e6edf3]">{maxTime}s</span>
            </div>
            <input
              type="range"
              min="120"
              max="600"
              step="30"
              value={maxTime}
              onChange={e => setMaxTime(Number(e.target.value))}
              className="w-full accent-amber-500 bg-[#141820] h-1.5 rounded"
            />
          </div>
        </div>
      </div>

      {/* Completed Experiment Runs Log Table */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#1e2430] pb-2">
          <div>
            <h3 className="font-bold text-[#e6edf3]">EXPERIMENT RESULTS LOG & COMPARISON</h3>
            <p className="text-[10px] text-[#8b949e]">Empirical evaluation across baseline algorithms and parameters</p>
          </div>
          <button
            onClick={() => {
              const csv = completedExperiments.map(e => `${e.name},${e.coverage}%,${e.energyLeft}%,${e.searchTimeSec}s,${e.commCostRating}`).join('\n');
              const blob = new Blob([`Policy,Coverage,Energy,SearchTime,CommCost\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'nexus_s_experiments.csv';
              a.click();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#141820] border border-[#242b38] text-[#cbd5e1] hover:text-[#e6edf3] text-[10px]"
          >
            <Download className="w-3 h-3" />
            <span>EXPORT CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-[#242b38] bg-[#141820] text-[#8b949e] uppercase text-[10px]">
                <th className="p-2.5">Trial ID</th>
                <th className="p-2.5">Algorithm & Config</th>
                <th className="p-2.5">Coverage</th>
                <th className="p-2.5">Energy Reserve</th>
                <th className="p-2.5">Search Time</th>
                <th className="p-2.5">Comm Overhead</th>
                <th className="p-2.5">Collisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2430]">
              {completedExperiments.map(exp => (
                <tr key={exp.id} className="hover:bg-[#141820] transition-colors">
                  <td className="p-2.5 font-bold text-amber-400">{exp.id}</td>
                  <td className="p-2.5 text-[#e6edf3] font-medium">{exp.name}</td>
                  <td className="p-2.5 font-bold text-emerald-400">{exp.coverage}%</td>
                  <td className="p-2.5 text-[#cbd5e1]">{exp.energyLeft}%</td>
                  <td className="p-2.5 text-[#cbd5e1]">{exp.searchTimeSec}s</td>
                  <td className="p-2.5">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                      exp.commCostRating === 'Low' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                    }`}>
                      {exp.commCostRating}
                    </span>
                  </td>
                  <td className="p-2.5 text-[#8b949e]">{exp.collisionsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
