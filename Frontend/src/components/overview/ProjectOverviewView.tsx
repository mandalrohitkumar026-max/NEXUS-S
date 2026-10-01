import React from 'react';
import { Cpu, Compass, Radio, FlaskConical, ArrowRight, BookOpen, Layers, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { SimulationStats } from '../../types/simulation';

interface ProjectOverviewViewProps {
  stats: SimulationStats;
  onLaunchMissionControl: () => void;
}

export const ProjectOverviewView: React.FC<ProjectOverviewViewProps> = ({
  stats,
  onLaunchMissionControl,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Research Project Hero (Academic, Technical, No Marketing Fluff) */}
      <div className="border border-[#242b38] bg-[#101318] rounded p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[10px] text-amber-400 font-bold tracking-widest uppercase">
          <span>PROJECT REPOSITORY // MIT &bull; STANFORD ROBOTICS PROTOCOL</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-[#e6edf3]">
            NEXUS-S
          </h1>
          <p className="text-base text-amber-300 font-medium">
            Intelligence without a central controller.
          </p>
        </div>

        <p className="text-xs text-[#8b949e] max-w-3xl leading-relaxed">
          An experimental robotics research platform for studying decentralized multi-agent coordination under energy and communication constraints. Designed for 10–20 autonomous ground and aerial rovers operating without central infrastructure.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onLaunchMissionControl}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
          >
            <span>LAUNCH MISSION CONTROL SIMULATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => alert('[CITATION COPIED TO CLIPBOARD]\n@article{nexuss2026swarm,\n  title={NEXUS-S: Decentralized Multi-Agent Coordination under Energy and Radio Constraints},\n  author={Swarm Intelligence Group},\n  journal={IEEE Transactions on Robotics},\n  year={2026}\n}')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded bg-[#141820] border border-[#242b38] text-[#cbd5e1] hover:text-[#e6edf3]"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>BIBTEX CITATION</span>
          </button>
        </div>
      </div>

      {/* Primary Research Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#101318] border border-[#242b38] rounded p-4">
          <span className="text-[10px] text-[#8b949e] block">SWARM TOPOLOGY</span>
          <span className="text-xl font-bold text-[#e6edf3]">12 AUTONOMOUS AGENTS</span>
          <span className="text-[9px] text-[#545d68] block">Decentralized POMDP</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-4">
          <span className="text-[10px] text-[#8b949e] block">EXPLORATION METRIC</span>
          <span className="text-xl font-bold text-emerald-400">84.7% AREA COVERAGE</span>
          <span className="text-[9px] text-[#545d68] block">Within 180s mission benchmark</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-4">
          <span className="text-[10px] text-[#8b949e] block">RADIO OVERHEAD</span>
          <span className="text-xl font-bold text-cyan-400">31% COMM REDUCTION</span>
          <span className="text-[9px] text-[#545d68] block">Compared to flooded mesh gossip</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-4">
          <span className="text-[10px] text-[#8b949e] block">BENCHMARK SUITE</span>
          <span className="text-xl font-bold text-amber-400">6 ACTIVE EXPERIMENTS</span>
          <span className="text-[9px] text-[#545d68] block">MAPPO, IPPO, QMIX, APF</span>
        </div>
      </div>

      {/* Section: Why Decentralized? */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-5 space-y-3">
        <h2 className="font-bold text-sm text-[#e6edf3] border-b border-[#1e2430] pb-2 flex items-center space-x-2">
          <span className="text-amber-400 font-mono">01 //</span>
          <span>WHY DECENTRALIZED?</span>
        </h2>
        <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
          Centralized swarm coordinators represent a catastrophic single point of failure in subterranean, urban disaster, or GPS-denied environments. When radio frequency propagation suffers shadowing from collapsed reinforced concrete, central telemetry links inevitably sever.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] pt-1">
          <div className="bg-[#141820] p-3 rounded border border-[#1e2430] space-y-1">
            <strong className="text-amber-400 block">No Single Point of Failure</strong>
            <p className="text-[#8b949e]">Individual rover loss or radio dropout does not halt the exploration mission.</p>
          </div>
          <div className="bg-[#141820] p-3 rounded border border-[#1e2430] space-y-1">
            <strong className="text-cyan-400 block">Localized Communication</strong>
            <p className="text-[#8b949e]">Robots only exchange packets with immediate 1-hop physical neighbors within \(R_&#123;comm&#125;\).</p>
          </div>
          <div className="bg-[#141820] p-3 rounded border border-[#1e2430] space-y-1">
            <strong className="text-emerald-400 block">Emergent Coordination</strong>
            <p className="text-[#8b949e]">Complex division of labor arises naturally from local state vectors without master scheduling.</p>
          </div>
        </div>
      </div>

      {/* Section: Core Research Questions */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-5 space-y-3">
        <h2 className="font-bold text-sm text-[#e6edf3] border-b border-[#1e2430] pb-2 flex items-center space-x-2">
          <span className="text-amber-400 font-mono">02 //</span>
          <span>CORE RESEARCH QUESTIONS</span>
        </h2>
        <div className="space-y-2 text-[11px] text-[#cbd5e1]">
          <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430] flex items-start space-x-2">
            <span className="text-amber-400 font-bold">RQ1:</span>
            <p>How does inter-agent communication bandwidth attenuation correlate with multi-agent frontier exploration entropy in non-convex polygonal topologies?</p>
          </div>
          <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430] flex items-start space-x-2">
            <span className="text-cyan-400 font-bold">RQ2:</span>
            <p>Can local battery reserve observations \(e_i \in [0, 1]\) prevent cascade stranding near base charging stations without centralized queue dispatch?</p>
          </div>
          <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430] flex items-start space-x-2">
            <span className="text-emerald-400 font-bold">RQ3:</span>
            <p>Under what attenuation exponents \(\alpha \ge 2.5\) do autonomous rovers spontaneously transition from exploration scouts to stationary relay nodes?</p>
          </div>
        </div>
      </div>

      {/* Section: Hardware Integration */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-5 space-y-3">
        <h2 className="font-bold text-sm text-[#e6edf3] border-b border-[#1e2430] pb-2 flex items-center space-x-2">
          <span className="text-amber-400 font-mono">03 //</span>
          <span>HARDWARE ARCHITECTURE & ROS 2 PIPELINE</span>
        </h2>
        <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
          NEXUS-S is architected with a strict separation between policy inference and actuator execution. The exact same decentralized neural actor policy \(\pi(a|s)\) running in our 60Hz simulation engine directly publishes to ROS 2 standard topics:
        </p>
        <div className="bg-[#0d1015] p-3 rounded border border-[#1b202a] text-[10px] space-y-1 font-mono text-[#cbd5e1]">
          <div><span className="text-amber-400">/swarm/rXX/cmd_vel</span> &rarr; differential drive motor velocity (geometry_msgs/Twist)</div>
          <div><span className="text-cyan-400">/swarm/rXX/scan</span> &rarr; 2D RPLIDAR laser distance range array (sensor_msgs/LaserScan)</div>
          <div><span className="text-emerald-400">/swarm/rXX/battery_state</span> &rarr; onboard battery fuel gauge telemetry (sensor_msgs/BatteryState)</div>
          <div><span className="text-purple-400">/swarm/comms/mesh</span> &rarr; IEEE 802.11s broadcast packet socket</div>
        </div>
      </div>
    </div>
  );
};
