import React, { useState } from 'react';
import { History, CheckCircle2, Clock, Battery, Compass, Target, ArrowRight, X } from 'lucide-react';

interface PastMission {
  id: string;
  code: string;
  name: string;
  type: string;
  status: 'Completed' | 'Aborted' | 'Partial';
  duration: string;
  robots: number;
  targets: number;
  coverage: number;
  energyUsed: number;
  date: string;
  summary: string;
  keyLearnings: string;
}

export const MissionHistoryPage: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<PastMission | null>(null);

  const missions: PastMission[] = [
    {
      id: 'm-024',
      code: 'MISSION #024',
      name: 'Subterranean Sector Alpha Exploration',
      type: 'Search & Rescue',
      status: 'Completed',
      duration: '12m 42s',
      robots: 12,
      targets: 5,
      coverage: 94,
      energyUsed: 18,
      date: '2026-09-05',
      summary: '12 autonomous agents deployed to locate 5 survivor beacons in a collapsed tunnel environment. Decentralized relay chains successfully maintained connectivity across 3 radio dead-zones.',
      keyLearnings: 'Voronoi frontier self-partitioning reduced multi-agent overlap by 32% compared to baseline potential fields.',
    },
    {
      id: 'm-023',
      code: 'MISSION #023',
      name: 'Urban Disaster Rubble Sweep',
      type: 'Area Coverage',
      status: 'Completed',
      duration: '15m 10s',
      robots: 12,
      targets: 3,
      coverage: 89,
      energyUsed: 22,
      date: '2026-09-04',
      summary: 'High obstacle density test evaluating line-of-sight signal attenuation. All 3 hidden survivor beacons located and verified within 11 minutes.',
      keyLearnings: 'Agents autonomously adapted to radio shadow by having R03 and R08 act as static relay repeaters.',
    },
    {
      id: 'm-022',
      code: 'MISSION #022',
      name: 'Energy Stress & Recharging Benchmark',
      type: 'Energy-Aware Navigation',
      status: 'Completed',
      duration: '18m 34s',
      robots: 10,
      targets: 4,
      coverage: 91,
      energyUsed: 31,
      date: '2026-09-02',
      summary: 'Tested 22% battery return hysteresis. 4 agents returned to base docking pads, recharged to 95%, and re-entered the search perimeter with zero swarm stalls.',
      keyLearnings: 'Rolling shift recharging enables 24/7 continuous perimeter monitoring without swarm downtime.',
    },
    {
      id: 'm-021',
      code: 'MISSION #021',
      name: 'Communication Blackout Resilience Test',
      type: 'Communication-Constrained',
      status: 'Completed',
      duration: '14m 05s',
      robots: 12,
      targets: 2,
      coverage: 82,
      energyUsed: 19,
      date: '2026-08-30',
      summary: 'Simulated 50% packet drop and 80m restricted radio horizon. Swarm preserved coherent dispersion through local heuristic consensus.',
      keyLearnings: 'Decentralized POMDP policy gracefully degrades under severe packet loss without catastrophic cluster collision.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-y-auto p-6 space-y-5 select-none">
      {/* Page Header */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0]">
        <div>
          <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            MISSION ARCHIVES // REPRODUCIBLE SWARM TRIALS
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <History className="w-5 h-5 text-[#2563EB]" />
            <span>MISSION HISTORY</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Historical swarm deployment logs, duration benchmarks, and empirical research results
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[#0F172A]">
            ARCHIVED SESSIONS: <strong className="text-[#2563EB] font-bold">{missions.length}</strong>
          </div>
        </div>
      </div>

      {/* Mission History Cards */}
      <div className="space-y-3.5">
        {missions.map(mission => (
          <div
            key={mission.id}
            className="card p-5 space-y-3 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center space-x-3">
                <span className="badge badge-primary font-mono">
                  {mission.code}
                </span>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {mission.name}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#64748B]">{mission.date}</span>
                <span className="badge badge-success">
                  {mission.status}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] text-[#64748B] uppercase font-medium block">Duration</span>
                <span className="text-sm font-bold text-[#0F172A] font-mono">{mission.duration}</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] text-[#64748B] uppercase font-medium block">Coverage</span>
                <span className="text-sm font-bold text-[#2563EB] font-mono">{mission.coverage}%</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] text-[#64748B] uppercase font-medium block">Targets Located</span>
                <span className="text-sm font-bold text-[#D97706] font-mono">{mission.targets} Beacons</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                <span className="text-[10px] text-[#64748B] uppercase font-medium block">Energy Usage</span>
                <span className="text-sm font-bold text-[#16A34A] font-mono">{mission.energyUsed}%</span>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              {mission.summary}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMission(mission)}
                className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold transition-colors flex items-center space-x-1.5"
              >
                <span>Read Mission Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Mission Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="badge badge-primary font-mono text-[10px]">
                  {selectedMission.code}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1">
                  {selectedMission.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-md hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#475569]">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1">
                <span className="font-semibold text-[#0F172A] block">Operational Summary</span>
                <p className="leading-relaxed">{selectedMission.summary}</p>
              </div>

              <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-3 space-y-1">
                <span className="font-semibold text-[#2563EB] block">Scientific Takeaway</span>
                <p className="leading-relaxed text-[#1E3A8A]">{selectedMission.keyLearnings}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-sm"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
