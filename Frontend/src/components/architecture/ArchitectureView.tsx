import React from 'react';
import { Layers, ArrowDown, ArrowUpDown, Cpu, Server, Wifi, Radio, Shield, GitBranch } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              NEXUS-S SYSTEM ARCHITECTURE & DECENTRALIZED SPECIFICATION
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            Formal Dec-POMDP multi-agent software layers, ROS 2 hardware bridge, and local policy interface
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[10px]">
          <span className="px-2 py-1 rounded bg-[#141820] border border-[#242b38] text-amber-400">
            SPECIFICATION v2.4-RELEASE
          </span>
        </div>
      </div>

      {/* Primary Stack Flowchart */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-6 flex flex-col items-center space-y-3">
        {/* Layer 1: Mission Interface */}
        <div className="w-full max-w-xl bg-[#141820] border border-amber-500/40 rounded p-3 text-center">
          <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">
            LAYER 1: RESEARCH & MISSION CONTROL INTERFACE
          </span>
          <p className="text-[11px] text-[#cbd5e1] mt-0.5">
            React / TypeScript / Canvas Telemetry &bull; Interactive Ablation Lab &bull; Real-time Dec-POMDP State Inspector
          </p>
        </div>

        <ArrowDown className="w-4 h-4 text-amber-400/80" />

        {/* Layer 2: Simulation Engine */}
        <div className="w-full max-w-xl bg-[#141820] border border-cyan-500/40 rounded p-3 text-center">
          <span className="text-[10px] text-cyan-400 font-bold block uppercase tracking-wider">
            LAYER 2: ASYNCHRONOUS SIMULATION ENGINE
          </span>
          <p className="text-[11px] text-[#cbd5e1] mt-0.5">
            60 Hz Physics Integrator &bull; Obstacle Potential Fields &bull; Radio Attenuation (\(\alpha=2.8\)) &bull; Dynamic Ad-Hoc Mesh Spanning
          </p>
        </div>

        <ArrowDown className="w-4 h-4 text-cyan-400/80" />

        {/* Layer 3: Multi-Agent Environment */}
        <div className="w-full max-w-xl bg-[#141820] border border-[#242b38] rounded p-3 text-center">
          <span className="text-[10px] text-purple-400 font-bold block uppercase tracking-wider">
            LAYER 3: MULTI-AGENT ENVIRONMENT (Dec-POMDP)
          </span>
          <p className="text-[11px] text-[#cbd5e1] mt-0.5">
            Fog-of-War Occupancy Grid &bull; Survivor Probability Density &bull; Inductive Power Harvesting Base Docks
          </p>
        </div>

        <ArrowDown className="w-4 h-4 text-purple-400/80" />

        {/* Layer 4: Decentralized Policy Network */}
        <div className="w-full max-w-xl bg-[#141820] border border-emerald-500/40 rounded p-3 text-center">
          <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
            LAYER 4: DECENTRALIZED POLICY ENGINE (&pi;_i)
          </span>
          <p className="text-[11px] text-[#cbd5e1] mt-0.5">
            Onboard ONNX Model Inference &bull; State Vector \(s_i \in \mathbb&#123;R&#125;^9\) &bull; Independent Action Execution &bull; Zero Central Master
          </p>
        </div>

        <ArrowDown className="w-4 h-4 text-emerald-400/80" />

        {/* Layer 5: Autonomous Robot Agents x N */}
        <div className="w-full max-w-xl bg-[#141820] border border-rose-500/40 rounded p-3 text-center">
          <span className="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">
            LAYER 5: AUTONOMOUS ROBOT FLEET (AGENT NODES 1 ... N)
          </span>
          <p className="text-[11px] text-[#cbd5e1] mt-0.5">
            Local Lidar Perception &bull; Battery State of Charge (SOC) &bull; Differential Drive Motion &bull; Peer Telemetry Gossip
          </p>
        </div>

        <ArrowUpDown className="w-4 h-4 text-[#8b949e]" />

        {/* Hardware DDS Bridge */}
        <div className="w-full max-w-xl bg-[#0d1015] border border-dashed border-[#384357] rounded p-3 text-center">
          <span className="text-[10px] text-[#8b949e] font-bold block uppercase tracking-wider">
            ROS 2 DDS HARDWARE INTERFACE (CYCLONEDDS / IEEE 802.11s)
          </span>
          <p className="text-[10px] text-[#545d68] mt-0.5">
            Seamless drop-in bridge to physical TurtleBot 4 rover fleet without modifying policy logic
          </p>
        </div>
      </div>

      {/* Formal Dec-POMDP Mathematical Formulation */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-2 text-[#cbd5e1]">
        <div className="border-b border-[#1e2430] pb-2 font-bold text-[#e6edf3]">
          FORMAL MATHEMATICAL FORMULATION: DECENTRALIZED POMDP
        </div>
        <p className="text-[11px] leading-relaxed">
          The swarm mission is modeled as a tuple \(\mathcal&#123;M&#125; = \langle \mathcal&#123;I&#125;, \mathcal&#123;S&#125;, &#123;\mathcal&#123;A&#125;_i&#125;, \mathcal&#123;T&#125;, \mathcal&#123;R&#125;, &#123;\Omega_i&#125;, \mathcal&#123;O&#125;, \gamma \rangle\):
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] pt-1">
          <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430] space-y-1">
            <div>&bull; <strong className="text-amber-400">\(\mathcal&#123;I&#125; = &#123;1, \dots, N&#125;\)</strong>: Swarm agents (N = 12 nodes)</div>
            <div>&bull; <strong className="text-cyan-400">\(\Omega_i\)</strong>: Local observation space limited to distance \(R_&#123;sensor&#125; \le 75m\)</div>
            <div>&bull; <strong className="text-emerald-400">\(\mathcal&#123;A&#125;_i\)</strong>: Action space \((\Delta\theta, v, b_&#123;comm&#125;)\) where \(v \in [0, 2.0] m/s\)</div>
          </div>
          <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430] space-y-1">
            <div>&bull; <strong className="text-purple-400">\(\mathcal&#123;R&#125;\)</strong>: Cooperative reward encouraging frontier coverage &minus; collision penalty &minus; comm cost</div>
            <div>&bull; <strong className="text-rose-400">\(\gamma = 0.99\)</strong>: Temporal discount factor with battery exhaustion terminal state</div>
          </div>
        </div>
      </div>
    </div>
  );
};
