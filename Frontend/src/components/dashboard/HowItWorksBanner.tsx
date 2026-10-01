import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Compass, Radio, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

export const HowItWorksBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    {
      step: '1. EXPLORE',
      description: 'Robots search different areas.',
      icon: Compass,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      step: '2. SHARE',
      description: 'Robots communicate useful discoveries.',
      icon: Radio,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
    {
      step: '3. DECIDE',
      description: 'Each robot chooses its own next action.',
      icon: Cpu,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      step: '4. ADAPT',
      description: 'The swarm changes its strategy as conditions change.',
      icon: RefreshCw,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      step: '5. COMPLETE',
      description: 'The swarm reaches the mission objective efficiently.',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-5 select-none shadow-sm space-y-3">
      {/* Header with expand/collapse toggle */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            DEMONSTRATION GUIDE
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">
            HOW NEXUS-S WORKS
          </h3>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-800 transition-colors"
        >
          <span>{isExpanded ? 'Hide Guide' : 'Show Guide'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 5-Step Process */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#161c28] border border-gray-800/80 rounded-lg p-3.5 flex flex-col justify-between space-y-2 relative"
              >
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${item.bg} border ${item.border} ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {item.step}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Arrow connector for large screens */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-gray-600 font-bold z-10">
                    &rarr;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
