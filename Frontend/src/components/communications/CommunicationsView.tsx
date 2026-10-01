import React, { useState } from 'react';
import { Robot } from '../../types/robot';
import { SimEdge } from '../../simulation/simEngine';
import { SimulationStats, SimulationConfig } from '../../types/simulation';
import { Network, Radio, ArrowRightLeft } from 'lucide-react';

interface CommunicationsViewProps {
  robots: Robot[];
  commEdges: SimEdge[];
  stats: SimulationStats;
  config: SimulationConfig;
  onSelectRobot: (id: string) => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({
  robots,
  commEdges,
  stats,
  config,
  onSelectRobot,
}) => {
  const [selectedEdgeNode, setSelectedEdgeNode] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-y-auto text-xs select-none p-6 space-y-5">
      {/* Header */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-[#2563EB]" />
            <h2 className="font-bold text-base text-[#0F172A]">
              COMMUNICATION TOPOLOGY & AD-HOC MESH GRAPH
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Decentralized peer-to-peer radio frequency link evaluation &bull; Attenuation model: \(\alpha = 2.8\) &bull; Horizon: {config.commRadius}m
          </p>
        </div>

        <div className="flex items-center space-x-2.5 text-xs">
          <span className="badge badge-primary">
            CONNECTED: <strong>{stats.commConnectedPercent}%</strong>
          </span>
          <span className="badge badge-muted">
            ACTIVE EDGES: <strong className="text-[#2563EB]">{commEdges.length}</strong>
          </span>
        </div>
      </div>

      {/* Network Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="card p-4 bg-white border border-[#E2E8F0] space-y-1">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">RADIO HORIZON</span>
          <span className="text-xl font-bold text-[#2563EB] font-mono block">{config.commRadius} meters</span>
          <span className="text-[11px] text-[#64748B] block">Line-of-sight threshold</span>
        </div>

        <div className="card p-4 bg-white border border-[#E2E8F0] space-y-1">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">PACKET LOSS RATE</span>
          <span className="text-xl font-bold text-[#16A34A] font-mono block">{stats.packetLossPercent}%</span>
          <span className="text-[11px] text-[#64748B] block">BER &lt; 10^-5</span>
        </div>

        <div className="card p-4 bg-white border border-[#E2E8F0] space-y-1">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">MEAN LATENCY</span>
          <span className="text-xl font-bold text-[#0F172A] font-mono block">14.2 ms</span>
          <span className="text-[11px] text-[#64748B] block">Peer-to-peer 1-hop</span>
        </div>

        <div className="card p-4 bg-white border border-[#E2E8F0] space-y-1">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">THROUGHPUT</span>
          <span className="text-xl font-bold text-[#D97706] font-mono block">{stats.messagesPerMin} pkts/min</span>
          <span className="text-[11px] text-[#64748B] block">Telemetry broadcast</span>
        </div>

        <div className="card p-4 bg-white border border-[#E2E8F0] space-y-1">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">CONNECTED CLUSTERS</span>
          <span className="text-xl font-bold text-[#16A34A] font-mono block">
            {stats.commConnectedPercent >= 90 ? '1 (JOINED)' : '2 (PARTITIONED)'}
          </span>
          <span className="text-[11px] text-[#64748B] block">Ad-hoc spanning tree</span>
        </div>
      </div>

      {/* Visual Mesh Topology Canvas / Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topology Node Map */}
        <div className="lg:col-span-2 card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
            <span className="font-bold text-[#0F172A] flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-[#2563EB]" />
              <span>DYNAMIC SWARM ADJACENCY GRAPH</span>
            </span>
            <span className="text-[11px] text-[#64748B] font-mono">COORDINATE-MAPPED</span>
          </div>

          <div className="relative w-full h-80 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg overflow-hidden flex items-center justify-center">
            {/* SVG Mesh Visualizer */}
            <svg className="w-full h-full" viewBox="0 0 960 640">
              {/* Edges */}
              {commEdges.map((edge, idx) => {
                const r1 = robots.find(r => r.id === edge.from);
                const r2 = robots.find(r => r.id === edge.to);
                if (!r1 || !r2) return null;

                const isHighlight = selectedEdgeNode === edge.from || selectedEdgeNode === edge.to;

                return (
                  <line
                    key={idx}
                    x1={r1.x}
                    y1={r1.y}
                    x2={r2.x}
                    y2={r2.y}
                    stroke={isHighlight ? '#2563EB' : 'rgba(37, 99, 235, 0.25)'}
                    strokeWidth={isHighlight ? 2.5 : 1.2}
                    strokeDasharray={edge.signalStrength < 0.5 ? '4 4' : undefined}
                  />
                );
              })}

              {/* Nodes */}
              {robots.map(r => {
                const isSelected = selectedEdgeNode === r.id;
                return (
                  <g
                    key={r.id}
                    transform={`translate(${r.x}, ${r.y})`}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedEdgeNode(r.id);
                      onSelectRobot(r.id);
                    }}
                  >
                    {/* Comm radius circle if selected */}
                    {isSelected && (
                      <circle
                        r={config.commRadius}
                        fill="rgba(37, 99, 235, 0.05)"
                        stroke="#2563EB"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />
                    )}

                    <circle
                      r={isSelected ? 16 : 12}
                      fill="#FFFFFF"
                      stroke={isSelected ? '#2563EB' : '#94A3B8'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    <text
                      textAnchor="middle"
                      dy="3.5"
                      fill="#0F172A"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="Inter, sans-serif"
                    >
                      {r.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Link Matrix & Peer Details */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="border-b border-[#E2E8F0] pb-2.5">
            <h3 className="font-bold text-sm text-[#0F172A]">
              {selectedEdgeNode ? `ACTIVE PEER LINKS // ${selectedEdgeNode}` : 'ACTIVE RF EDGES'}
            </h3>
            <p className="text-[11px] text-[#64748B]">Click any node on the graph to filter its mesh connections</p>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {commEdges
              .filter(e => !selectedEdgeNode || e.from === selectedEdgeNode || e.to === selectedEdgeNode)
              .slice(0, 15)
              .map((edge, i) => (
                <div key={i} className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0] text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#0F172A]">
                    <span className="flex items-center space-x-1.5">
                      <span className="text-[#2563EB]">{edge.from}</span>
                      <ArrowRightLeft className="w-3 h-3 text-[#94A3B8]" />
                      <span className="text-[#2563EB]">{edge.to}</span>
                    </span>
                    <span className="text-[#16A34A] font-mono">{Math.round(edge.signalStrength * 100)}% RSSI</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#64748B]">
                    <span>Distance: {edge.distance}m</span>
                    <span>Est. Latency: {Math.round(8 + (1 - edge.signalStrength) * 15)}ms</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
