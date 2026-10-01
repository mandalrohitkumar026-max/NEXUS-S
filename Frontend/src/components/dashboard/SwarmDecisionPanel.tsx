import React from 'react';
import { Robot } from '../../types/robot';
import { explainRobotDecision } from '../../simulation/plainEnglish';
import { Sparkles, HelpCircle } from 'lucide-react';

interface SwarmDecisionPanelProps {
  robot: Robot | null;
  allRobots: Robot[];
}

export const SwarmDecisionPanel: React.FC<SwarmDecisionPanelProps> = ({
  robot,
  allRobots,
}) => {
  if (!robot) {
    return (
      <div className="bg-[#111620] border border-gray-800 rounded-xl p-5 flex items-center justify-center text-xs text-gray-400">
        Select a robot on the map to inspect its decision.
      </div>
    );
  }

  const explanation = explainRobotDecision(robot, allRobots);

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-5 flex flex-col space-y-3.5 select-none shadow-sm flex-1 min-h-[260px]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Bottom Right
          </h2>
          <h3 className="text-base font-bold text-white tracking-tight">
            HOW THE SWARM THINKS
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
          Decentralized Intelligence
        </span>
      </div>

      {/* Decision Card in Plain English */}
      <div className="bg-[#161c28] border border-gray-800/80 rounded-lg p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Decision Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {robot.id} DECISION
            </span>
            <span className="text-xs text-gray-400">
              Local Policy: Independent
            </span>
          </div>

          {/* Plain English Quote */}
          <p className="text-sm font-semibold text-white leading-relaxed italic">
            {explanation.decisionHeadline}
          </p>

          {/* Bulleted Reasons */}
          <ul className="space-y-1.5 pt-1 text-xs text-gray-200">
            {explanation.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decision Confidence Meter */}
        <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">
            Decision confidence:
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${explanation.confidencePercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {explanation.confidencePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
