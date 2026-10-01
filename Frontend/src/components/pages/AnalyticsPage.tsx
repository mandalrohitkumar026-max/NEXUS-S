import React from 'react';
import { SimulationStats } from '../../types/simulation';
import { BarChart2, TrendingUp, Zap, Radio, Activity, Compass, Target } from 'lucide-react';

interface AnalyticsPageProps {
  stats: SimulationStats;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ stats }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-y-auto p-6 space-y-5 select-none">
      {/* Page Header */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0]">
        <div>
          <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            SCIENTIFIC TELEMETRY &bull; MULTI-AGENT BENCHMARKS
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-[#2563EB]" />
            <span>OPERATIONAL ANALYTICS</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Empirical measurements of search coverage, energy efficiency, radio health, and robot utilization
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[#0F172A]">
            EFFICIENCY INDEX: <strong className="text-[#16A34A] font-bold">94.2%</strong>
          </div>
        </div>
      </div>

      {/* 6 Restrained Clean Light Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Search Coverage Over Time */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-[#2563EB]" />
              <span>Coverage Over Time</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#2563EB]">
              {Math.round(stats.areaCoveragePercent)}%
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
            <svg className="w-full h-36" viewBox="0 0 300 120">
              <line x1="20" y1="20" x2="290" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2="290" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="290" y2="100" stroke="#CBD5E1" />

              {/* Curve */}
              <path
                d="M 20 100 Q 80 50, 160 30 T 290 22"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="22" r="4" fill="#2563EB" />
            </svg>
            <div className="flex justify-between text-[10px] text-[#64748B] pt-1">
              <span>00:00</span>
              <span>05:00</span>
              <span>10:00</span>
              <span>15:00</span>
            </div>
          </div>
        </div>

        {/* 2. Energy Consumption */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-[#16A34A]" />
              <span>Energy Consumption</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#16A34A]">
              {Math.round(stats.avgBatteryPercent)}% SOC
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
            <svg className="w-full h-36" viewBox="0 0 300 120">
              <line x1="20" y1="20" x2="290" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2="290" y2="60" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2="290" y2="100" stroke="#CBD5E1" />

              {/* Depletion Curve with Hysteresis Rebound */}
              <path
                d="M 20 25 Q 110 50, 180 75 T 290 60"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="290" cy="60" r="4" fill="#16A34A" />
            </svg>
            <div className="flex justify-between text-[10px] text-[#64748B] pt-1">
              <span>100% Full</span>
              <span>75%</span>
              <span>50%</span>
              <span>22% Reserve</span>
            </div>
          </div>
        </div>

        {/* 3. Communication Health */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-[#2563EB]" />
              <span>Communication Health</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#2563EB]">
              {stats.commConnectedPercent}%
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
            <svg className="w-full h-36" viewBox="0 0 300 120">
              {[40, 75, 110, 145, 180, 215, 250, 280].map((x, i) => {
                const height = 65 + (i % 3) * 12;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={100 - height}
                    width="14"
                    height={height}
                    fill="#3B82F6"
                    opacity="0.85"
                    rx="3"
                  />
                );
              })}
              <line x1="20" y1="100" x2="290" y2="100" stroke="#CBD5E1" />
            </svg>
            <div className="flex justify-between text-[10px] text-[#64748B] pt-1">
              <span>Packet Rate: 142/min</span>
              <span>Packet Loss: 2.8%</span>
            </div>
          </div>
        </div>

        {/* 4. Robot Utilization */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-[#7C3AED]" />
              <span>Robot Utilization</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#7C3AED]">
              100% Active
            </span>
          </div>

          <div className="space-y-3 text-xs py-1">
            <div>
              <div className="flex justify-between text-[#475569] mb-1">
                <span>Frontier Search</span>
                <span className="font-semibold text-[#0F172A]">67% (8 Robots)</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#475569] mb-1">
                <span>Target Inspection</span>
                <span className="font-semibold text-[#0F172A]">17% (2 Robots)</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar progress-bar-success" style={{ width: '17%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#475569] mb-1">
                <span>Dock Recharging</span>
                <span className="font-semibold text-[#0F172A]">16% (2 Robots)</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar progress-bar-warning" style={{ width: '16%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Targets Detected */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1.5">
              <Target className="w-4 h-4 text-[#16A34A]" />
              <span>Targets Detected</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#16A34A]">
              {stats.targetsFound} / {stats.totalTargets}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Survivor Alpha</span>
              <span className="text-[#16A34A] font-bold font-mono">100% Confirmed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Survivor Beta</span>
              <span className="text-[#2563EB] font-bold font-mono">92% Locked</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#475569]">Beacon Omega</span>
              <span className="text-[#D97706] font-bold font-mono">65% Tracking</span>
            </div>
          </div>
        </div>

        {/* 6. Exploration Efficiency */}
        <div className="card p-5 space-y-3 bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-xs font-bold text-[#0F172A] flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <span>Exploration Efficiency</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#2563EB]">
              38.4 J/m&sup2;
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between text-[#475569]">
              <span className="text-[#64748B]">Explored Area:</span>
              <span className="font-bold text-[#0F172A] font-mono">{stats.totalExploredM2} m&sup2;</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span className="text-[#64748B]">Path Overlap Rate:</span>
              <span className="font-bold text-[#16A34A] font-mono">8.2% (Low)</span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span className="text-[#64748B]">Frontier Convergence:</span>
              <span className="font-bold text-[#2563EB] font-mono">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
