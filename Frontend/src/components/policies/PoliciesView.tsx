import React, { useState } from 'react';
import { GitFork, Network, Cpu, Sliders, Layers, BarChart3, CheckCircle2 } from 'lucide-react';
import { POLICY_COMPARISONS } from '../../data/researchData';

export const PoliciesView: React.FC = () => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('policy-mappo');

  const activePolicy = POLICY_COMPARISONS.find(p => p.id === selectedPolicyId) || POLICY_COMPARISONS[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              DECENTRALIZED POLICY INSPECTOR & ARCHITECTURE
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            Examine neural policy topologies, POMDP state representations, and execution action distributions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          {POLICY_COMPARISONS.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPolicyId(p.id)}
              className={`px-2.5 py-1 rounded border transition-colors ${
                selectedPolicyId === p.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                  : 'bg-[#141820] border-[#242b38] text-[#8b949e] hover:text-[#e6edf3]'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Deep Policy Architecture Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Neural Policy Network Architecture */}
        <div className="lg:col-span-2 bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2430] pb-2">
            <span className="font-bold text-[#e6edf3] flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>DECENTRALIZED ACTOR NETWORK TOPOLOGY</span>
            </span>
            <span className="text-[10px] text-amber-400">
              FRAMEWORK: PYTORCH // ONNX EXPORT
            </span>
          </div>

          <div className="bg-[#0d1015] p-3 rounded border border-[#1b202a] space-y-3">
            {/* Visual network representation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-[10px]">
              {/* Layer 1: Observation */}
              <div className="bg-[#141820] p-2.5 rounded border border-[#242b38] flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 font-bold block mb-1">LOCAL OBS</span>
                  <span className="text-[9px] text-[#8b949e] block">Dim: &reals;^9</span>
                </div>
                <div className="text-[8px] text-[#545d68] space-y-0.5 mt-2 text-left">
                  <div>&bull; d_obs, &theta;_obs</div>
                  <div>&bull; battery_ratio</div>
                  <div>&bull; n_peers, d_peer</div>
                  <div>&bull; &nabla;unexplored</div>
                  <div>&bull; d_charger</div>
                </div>
              </div>

              {/* Layer 2: Encoder & GRU */}
              <div className="bg-[#141820] p-2.5 rounded border border-[#242b38] flex flex-col justify-between">
                <div>
                  <span className="text-cyan-400 font-bold block mb-1">RECURRENT MEM</span>
                  <span className="text-[9px] text-[#8b949e] block">GRU Layer (128-d)</span>
                </div>
                <div className="text-[8px] text-[#545d68] space-y-0.5 mt-2 text-left">
                  <div>&bull; Hidden state h_t</div>
                  <div>&bull; Temporal POMDP tracking</div>
                  <div>&bull; Resolves blind spots</div>
                </div>
              </div>

              {/* Layer 3: MLP Dense */}
              <div className="bg-[#141820] p-2.5 rounded border border-[#242b38] flex flex-col justify-between">
                <div>
                  <span className="text-purple-400 font-bold block mb-1">DENSE MLP</span>
                  <span className="text-[9px] text-[#8b949e] block">2&times;128 LayerNorm</span>
                </div>
                <div className="text-[8px] text-[#545d68] space-y-0.5 mt-2 text-left">
                  <div>&bull; ReLU activation</div>
                  <div>&bull; Orthogonal init</div>
                  <div>&bull; Low inference latency</div>
                </div>
              </div>

              {/* Layer 4: Action Heads */}
              <div className="bg-[#141820] p-2.5 rounded border border-[#242b38] flex flex-col justify-between">
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">ACTION HEADS</span>
                  <span className="text-[9px] text-[#8b949e] block">&pi;(a|o) &bull; Beta Dist</span>
                </div>
                <div className="text-[8px] text-[#545d68] space-y-0.5 mt-2 text-left">
                  <div>&bull; &Delta;&theta; (continuous)</div>
                  <div>&bull; Velocity v (0–2 m/s)</div>
                  <div>&bull; Broadcast trigger</div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[#8b949e] leading-relaxed pt-2 border-t border-[#1b202a]">
              <strong className="text-[#cbd5e1]">Decentralized Execution Guarantee:</strong> While trained with MAPPO's centralized value function \(V(s_&#123;global&#125;)\) during offline simulation, the online deployed policy network \(\pi_i(a_i | o_i)\) executes exclusively on local robot sensor inputs. No inter-agent communication or global state is required for policy inference.
            </div>
          </div>
        </div>

        {/* Right: Policy Performance Card */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
          <div className="border-b border-[#1e2430] pb-2">
            <span className="font-bold text-[#e6edf3] block">{activePolicy.name}</span>
            <span className="text-[10px] text-[#8b949e]">{activePolicy.type}</span>
          </div>

          <div className="space-y-3 text-[11px]">
            <div>
              <div className="flex justify-between text-[#8b949e] mb-1">
                <span>Area Coverage Score</span>
                <span className="text-emerald-400 font-bold">{activePolicy.coverage}%</span>
              </div>
              <div className="w-full bg-[#141820] h-1.5 rounded overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${activePolicy.coverage}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#8b949e] mb-1">
                <span>Remaining Swarm Energy</span>
                <span className="text-amber-400 font-bold">{activePolicy.energyLeft}%</span>
              </div>
              <div className="w-full bg-[#141820] h-1.5 rounded overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${activePolicy.energyLeft}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#8b949e] mb-1">
                <span>Relay Mesh Stability</span>
                <span className="text-cyan-400 font-bold">{Math.round(activePolicy.relayStability * 100)}%</span>
              </div>
              <div className="w-full bg-[#141820] h-1.5 rounded overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${activePolicy.relayStability * 100}%` }}></div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1e2430] grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-[#141820] p-2 rounded border border-[#1e2430]">
                <span className="text-[#8b949e] block">SEARCH TIME</span>
                <span className="font-bold text-[#e6edf3]">{activePolicy.searchTimeSec}s</span>
              </div>
              <div className="bg-[#141820] p-2 rounded border border-[#1e2430]">
                <span className="text-[#8b949e] block">COLLISIONS</span>
                <span className="font-bold text-rose-400">{activePolicy.collisionsCount} events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Benchmark Matrix */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
        <div className="border-b border-[#1e2430] pb-2">
          <h3 className="font-bold text-[#e6edf3]">POLICY BENCHMARK MATRIX // 100 EPISODES EVALUATION</h3>
          <p className="text-[10px] text-[#8b949e]">Rigorous comparative statistics across standard robotic metrics</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-[#242b38] bg-[#141820] text-[#8b949e] uppercase text-[10px]">
                <th className="p-2.5">Policy Model</th>
                <th className="p-2.5">Architecture</th>
                <th className="p-2.5">Coverage (Mean &plusmn; &sigma;)</th>
                <th className="p-2.5">Energy Reserve</th>
                <th className="p-2.5">Comm Cost</th>
                <th className="p-2.5">Search Time</th>
                <th className="p-2.5">Survivors Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2430]">
              {POLICY_COMPARISONS.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPolicyId(p.id)}
                  className={`cursor-pointer transition-colors ${
                    p.id === selectedPolicyId ? 'bg-amber-500/10' : 'hover:bg-[#141820]'
                  }`}
                >
                  <td className="p-2.5 font-bold text-[#e6edf3] flex items-center space-x-2">
                    {p.id === selectedPolicyId && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    <span>{p.name}</span>
                  </td>
                  <td className="p-2.5 text-[#8b949e]">{p.type}</td>
                  <td className="p-2.5 font-bold text-emerald-400">{p.coverage}%</td>
                  <td className="p-2.5 text-amber-400 font-medium">{p.energyLeft}%</td>
                  <td className="p-2.5">{p.commCostRating}</td>
                  <td className="p-2.5 text-[#cbd5e1]">{p.searchTimeSec}s</td>
                  <td className="p-2.5 text-cyan-400 font-bold">{p.survivorsFound} / 3</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
