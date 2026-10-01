import React, { useState } from 'react';
import { Robot } from '../../types/robot';
import { Cpu, Battery, Activity, Wifi, Compass, Shield } from 'lucide-react';

interface SwarmViewProps {
  robots: Robot[];
  onSelectRobot: (id: string) => void;
  onNavigateToMission: () => void;
}

export const SwarmView: React.FC<SwarmViewProps> = ({
  robots,
  onSelectRobot,
  onNavigateToMission,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterState, setFilterState] = useState<string>('ALL');

  const filteredRobots = robots.filter(r => {
    if (filterState === 'ALL') return true;
    return r.state === filterState;
  });

  const stateCounts: Record<string, number> = {};
  robots.forEach(r => {
    stateCounts[r.state] = (stateCounts[r.state] || 0) + 1;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-hidden text-xs select-none">
      {/* Top Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-[#2563EB]" />
            <h2 className="font-bold text-base text-[#0F172A]">
              DECENTRALIZED SWARM FLEET // 12 AUTONOMOUS NODES
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Independent decision-making agents &bull; Zero central controller &bull; Peer-to-peer 802.11s mesh
          </p>
        </div>

        {/* Filters and View toggles */}
        <div className="flex items-center space-x-2.5 text-xs">
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[#0F172A] font-medium"
          >
            <option value="ALL">ALL STATES ({robots.length})</option>
            <option value="EXPLORING">EXPLORING ({stateCounts['EXPLORING'] || 0})</option>
            <option value="TRACKING">TRACKING ({stateCounts['TRACKING'] || 0})</option>
            <option value="CHARGING">CHARGING ({stateCounts['CHARGING'] || 0})</option>
            <option value="RETURNING">RETURNING ({stateCounts['RETURNING'] || 0})</option>
            <option value="LOW_POWER">LOW POWER ({stateCounts['LOW_POWER'] || 0})</option>
          </select>

          <div className="tab-pill-container">
            <button
              onClick={() => setViewMode('grid')}
              className={`tab-pill ${viewMode === 'grid' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
            >
              GRID
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`tab-pill ${viewMode === 'table' ? 'tab-pill-active' : 'tab-pill-inactive'}`}
            >
              TABLE
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table View */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRobots.map(r => {
              const isLowBat = r.battery <= 25;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelectRobot(r.id);
                    onNavigateToMission();
                  }}
                  className="card p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3 group hover:border-[#CBD5E1] bg-white border border-[#E2E8F0]"
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                      <span className="font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] font-mono">
                        {r.id}
                      </span>
                    </div>
                    <span
                      className={`badge ${
                        r.state === 'CHARGING'
                          ? 'badge-success'
                          : r.state === 'RETURNING'
                          ? 'badge-warning'
                          : r.state === 'TRACKING'
                          ? 'badge-primary'
                          : isLowBat
                          ? 'badge-danger'
                          : 'badge-muted'
                      }`}
                    >
                      {r.state}
                    </span>
                  </div>

                  {/* Telemetry info */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#475569]">
                      <span>Role:</span>
                      <span className="font-semibold text-[#0F172A]">{r.role.replace('_', ' ')}</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1 text-[#475569]">
                        <span>Battery:</span>
                        <span className={`font-mono font-bold ${isLowBat ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                          {Math.round(r.battery)}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className={`h-full rounded-full ${isLowBat ? 'bg-[#DC2626]' : 'bg-[#16A34A]'}`}
                          style={{ width: `${r.battery}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[#475569]">
                      <span>Speed:</span>
                      <span className="font-mono text-[#0F172A]">{r.speed.toFixed(1)} m/s</span>
                    </div>

                    <div className="flex justify-between items-center text-[#475569]">
                      <span>Neighbors:</span>
                      <span className="font-mono text-[#2563EB] font-bold">{r.localObservation.neighborCount}</span>
                    </div>
                  </div>

                  {/* Footer hint */}
                  <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#64748B] flex justify-between items-center">
                    <span>Inspect Node</span>
                    <span className="text-[#2563EB] group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card overflow-hidden bg-white border border-[#E2E8F0]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Node ID</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Battery</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Heading</th>
                  <th className="py-3 px-4">Neighbors</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredRobots.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => {
                      onSelectRobot(r.id);
                      onNavigateToMission();
                    }}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#0F172A] font-mono">{r.id}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`badge ${
                          r.state === 'CHARGING'
                            ? 'badge-success'
                            : r.state === 'RETURNING'
                            ? 'badge-warning'
                            : r.state === 'TRACKING'
                            ? 'badge-primary'
                            : 'badge-muted'
                        }`}
                      >
                        {r.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569]">{r.role.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#16A34A]">{Math.round(r.battery)}%</td>
                    <td className="py-3.5 px-4 font-mono text-[#475569]">{r.speed.toFixed(1)} m/s</td>
                    <td className="py-3.5 px-4 font-mono text-[#475569]">{(r.heading * (180 / Math.PI)).toFixed(0)}&deg;</td>
                    <td className="py-3.5 px-4 font-mono text-[#2563EB] font-bold">{r.localObservation.neighborCount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[#2563EB] font-semibold text-xs">&rarr;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
