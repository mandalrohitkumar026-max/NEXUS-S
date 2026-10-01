import React, { useState } from 'react';
import { Robot } from '../../types/robot';
import { explainRobotDecision, getSectorName } from '../../simulation/plainEnglish';
import { Bot, Search } from 'lucide-react';

interface RobotsPageProps {
  robots: Robot[];
  onSelectRobot: (id: string) => void;
  onNavigateToOperations: () => void;
}

export const RobotsPage: React.FC<RobotsPageProps> = ({
  robots,
  onSelectRobot,
  onNavigateToOperations,
}) => {
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRobots = robots.filter(r => {
    if (filterState !== 'ALL' && r.state !== filterState) return false;
    if (searchQuery && !r.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-y-auto p-6 space-y-5 select-none">
      {/* Page Header */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0]">
        <div>
          <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            FLEET INVENTORY &bull; 12 AUTONOMOUS AGENTS
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <Bot className="w-5 h-5 text-[#2563EB]" />
            <span>ROBOTS DIRECTORY</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time status, onboard telemetry, and decentralized decisions for all active agents
          </p>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search Robot (e.g. R07)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-2 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] font-medium"
          >
            <option value="ALL">All States ({robots.length})</option>
            <option value="EXPLORING">Searching / Exploring</option>
            <option value="TRACKING">Tracking Target</option>
            <option value="RETURNING">Returning to Charger</option>
            <option value="CHARGING">Charging at Dock</option>
            <option value="LOW_POWER">Low Power</option>
          </select>
        </div>
      </div>

      {/* Robots Table */}
      <div className="card overflow-hidden bg-white border border-[#E2E8F0]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Robot ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Current Task</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Signal</th>
                <th className="py-3 px-4">Last Decision</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredRobots.map(robot => {
                const explanation = explainRobotDecision(robot, robots);
                const sector = getSectorName(robot.x, robot.y).split(' ')[1] || 'Sector A';
                const coord = `${sector.charAt(0)}-${String(Math.floor(robot.x / 100)).padStart(2, '0')}`;
                const signalRating = robot.localObservation.neighborCount >= 2 ? 'Strong' : robot.localObservation.neighborCount === 1 ? 'Medium' : 'Weak';

                return (
                  <tr
                    key={robot.id}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    {/* Robot ID */}
                    <td className="py-3.5 px-4 font-bold text-[#0F172A] font-mono flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                      <span>{robot.id}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`badge ${
                          robot.state === 'CHARGING'
                            ? 'badge-success'
                            : robot.state === 'RETURNING'
                            ? 'badge-warning'
                            : robot.state === 'TRACKING'
                            ? 'badge-primary'
                            : robot.battery <= 22
                            ? 'badge-danger'
                            : 'badge-muted'
                        }`}
                      >
                        {robot.state === 'EXPLORING' ? 'Searching' : robot.state === 'TRACKING' ? 'Target' : robot.state}
                      </span>
                    </td>

                    {/* Battery */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-bold ${robot.battery <= 25 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                          {Math.round(robot.battery)}%
                        </span>
                        <div className="w-16 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${robot.battery <= 25 ? 'bg-[#DC2626]' : 'bg-[#16A34A]'}`}
                            style={{ width: `${robot.battery}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Task */}
                    <td className="py-3.5 px-4 text-[#0F172A] font-medium">
                      {explanation.taskText}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 font-mono text-[#475569]">
                      {sector} <span className="text-[#94A3B8] text-[11px]">({coord})</span>
                    </td>

                    {/* Signal */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          signalRating === 'Strong' ? 'text-[#16A34A]' : signalRating === 'Medium' ? 'text-[#2563EB]' : 'text-[#D97706]'
                        }`}
                      >
                        {signalRating}
                      </span>
                    </td>

                    {/* Last Decision */}
                    <td className="py-3.5 px-4 text-[#475569] max-w-xs truncate">
                      {robot.localPolicy.actionName.replace(/_/g, ' ')}
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectRobot(robot.id);
                          onNavigateToOperations();
                        }}
                        className="px-3 py-1 rounded-md bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
