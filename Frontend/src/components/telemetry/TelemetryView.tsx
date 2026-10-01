import React, { useState } from 'react';
import { Robot } from '../../types/robot';
import { Activity, Battery, Cpu, Download, Wifi, Search, Gauge, Thermometer } from 'lucide-react';

interface TelemetryViewProps {
  robots: Robot[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ robots }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string>(robots[0]?.id || 'R-01');
  const [metricTab, setMetricTab] = useState<'battery' | 'velocity' | 'cpu' | 'temperature'>('battery');

  const activeRobot = robots.find(r => r.id === selectedRobotId) || robots[0];

  // Helper to render SVG time-series chart
  const renderTimeSeries = () => {
    if (!activeRobot || activeRobot.telemetryHistory.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center text-[#545d68] text-xs">
          Accumulating time-series data packets (requires &ge; 2 telemetry samples)...
        </div>
      );
    }

    const history = activeRobot.telemetryHistory;
    const w = 600;
    const h = 180;
    const pad = 24;

    let getVal = (p: typeof history[0]) => p.battery;
    let maxVal = 100;
    let minVal = 0;
    let unit = '%';
    let strokeColor = '#10b981';

    if (metricTab === 'velocity') {
      getVal = p => p.speed;
      maxVal = 2.5;
      minVal = 0;
      unit = 'm/s';
      strokeColor = '#f59e0b';
    } else if (metricTab === 'cpu') {
      getVal = p => p.cpuLoad;
      maxVal = 100;
      minVal = 0;
      unit = '%';
      strokeColor = '#06b6d4';
    } else if (metricTab === 'temperature') {
      getVal = p => p.temperature;
      maxVal = 60;
      minVal = 25;
      unit = '°C';
      strokeColor = '#ef4444';
    }

    const points = history.map((pt, idx) => {
      const x = pad + (idx / (history.length - 1)) * (w - pad * 2);
      const val = getVal(pt);
      const y = h - pad - ((val - minVal) / (maxVal - minVal)) * (h - pad * 2);
      return { x, y, val, time: pt.timestamp };
    });

    const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

    return (
      <svg className="w-full h-48 block" viewBox={`0 0 ${w} ${h}`}>
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const y = h - pad - pct * (h - pad * 2);
          const labelVal = minVal + pct * (maxVal - minVal);
          return (
            <g key={i}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="rgba(36, 43, 56, 0.6)" strokeWidth="1" strokeDasharray="3 3" />
              <text x={pad - 4} y={y + 3} fill="#545d68" fontSize="8" textAnchor="end" fontFamily="monospace">
                {labelVal.toFixed(0)}{unit}
              </text>
            </g>
          );
        })}

        {/* Data line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />

        {/* Highlight points */}
        {points.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r="2.5" fill={strokeColor} />
        ))}
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              SCIENTIFIC TELEMETRY STREAM & ANALYZER
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            Real-time multi-agent sensor signals, power consumption curves, and thermal telemetry
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const rows = robots.map(r => `${r.id},${r.battery}%,${r.speed.toFixed(2)},${r.x},${r.y},${r.state}`).join('\n');
              const blob = new Blob([`RobotID,Battery,Speed,X,Y,State\n${rows}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `telemetry_snapshot_${Date.now()}.csv`;
              a.click();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#141820] border border-[#242b38] text-[#cbd5e1] hover:text-[#e6edf3]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT TELEMETRY CSV</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Robot Selector, Center Chart & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Swarm Robot Selector */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-3 space-y-2">
          <div className="border-b border-[#1e2430] pb-2 flex items-center justify-between text-[#8b949e] text-[10px]">
            <span>ROBOT AGENTS ({robots.length})</span>
            <span>BATTERY</span>
          </div>

          <div className="space-y-1 max-h-[380px] overflow-y-auto">
            {robots.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRobotId(r.id)}
                className={`w-full p-2 rounded flex items-center justify-between text-left transition-colors ${
                  r.id === selectedRobotId
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                    : 'bg-[#141820] border border-[#1e2430] text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                <div>
                  <span className="font-bold block text-[#e6edf3]">{r.id}</span>
                  <span className="text-[9px] text-[#545d68]">{r.role}</span>
                </div>
                <div className="text-right text-[10px]">
                  <span className={r.battery < 25 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}>
                    {r.battery.toFixed(0)}%
                  </span>
                  <span className="text-[8px] text-[#545d68] block">{r.speed.toFixed(1)} m/s</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Selected Robot Telemetry Chart */}
        <div className="lg:col-span-3 bg-[#101318] border border-[#242b38] rounded p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2430] pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-bold text-sm">{activeRobot.id}</span>
              <span className="text-[10px] text-[#8b949e]">TELEMETRY OSCILLOSCOPE</span>
              <span className="px-1.5 py-0.2 rounded bg-[#141820] text-emerald-400 border border-[#242b38] text-[9px]">
                LIVE STREAMING (50Hz)
              </span>
            </div>

            {/* Metric toggles */}
            <div className="flex border border-[#242b38] rounded bg-[#141820] p-0.5 text-[10px]">
              {(['battery', 'velocity', 'cpu', 'temperature'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setMetricTab(tab)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    metricTab === tab ? 'bg-[#1e2430] text-amber-300 font-bold' : 'text-[#8b949e]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Time series graphic */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded p-3">
            {renderTimeSeries()}
          </div>

          {/* Real-time Hardware Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
            <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">BATTERY CAPACITY</span>
              <span className="text-emerald-400 font-bold text-xs">{activeRobot.battery.toFixed(1)}%</span>
              <span className="text-[#545d68] text-[9px] block">3200 mAh LiFePO4</span>
            </div>

            <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">ACTUATOR SPEED</span>
              <span className="text-amber-400 font-bold text-xs">{activeRobot.speed.toFixed(2)} m/s</span>
              <span className="text-[#545d68] text-[9px] block">Heading: {Math.round(activeRobot.heading * 57.3)}&deg;</span>
            </div>

            <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">CURRENT DRAW</span>
              <span className="text-cyan-400 font-bold text-xs">{Math.round(activeRobot.currentDrawMa)} mA</span>
              <span className="text-[#545d68] text-[9px] block">15.2V bus voltage</span>
            </div>

            <div className="bg-[#141820] p-2.5 rounded border border-[#1e2430]">
              <span className="text-[#8b949e] block">LOCAL PEERS IN RANGE</span>
              <span className="text-[#e6edf3] font-bold text-xs">{activeRobot.localObservation.neighborCount} nodes</span>
              <span className="text-[#545d68] text-[9px] block">Mesh signal: {activeRobot.localObservation.commSignalStrength}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
