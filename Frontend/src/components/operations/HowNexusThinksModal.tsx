import React from 'react';
import { Eye, Calculator, Radio, Cpu, RefreshCw, X } from 'lucide-react';

interface HowNexusThinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowNexusThinksModal: React.FC<HowNexusThinksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'OBSERVE',
      desc: 'Robot detects its local surroundings using onboard LiDAR, proximity sensors, and internal battery telemetry.',
      icon: Eye,
      accent: 'text-[#2563EB]',
      border: 'border-[#BFDBFE]',
      bg: 'bg-[#EFF6FF]',
    },
    {
      num: '2',
      title: 'EVALUATE',
      desc: 'Robot evaluates nearby targets, remaining energy, distance to charging docks, and unexplored local terrain.',
      icon: Calculator,
      accent: 'text-[#0EA5A4]',
      border: 'border-[#CCFBF1]',
      bg: 'bg-[#F0FDFA]',
    },
    {
      num: '3',
      title: 'COMMUNICATE',
      desc: 'Robot exchanges relevant information (target coordinates, low battery alerts) with direct 1-hop nearby peers.',
      icon: Radio,
      accent: 'text-[#7C3AED]',
      border: 'border-[#DDD6FE]',
      bg: 'bg-[#F5F3FF]',
    },
    {
      num: '4',
      title: 'DECIDE',
      desc: 'Robot independently selects its next motion and communication action using local decentralized neural policy.',
      icon: Cpu,
      accent: 'text-[#16A34A]',
      border: 'border-[#BBF7D0]',
      bg: 'bg-[#F0FDF4]',
    },
    {
      num: '5',
      title: 'ADAPT',
      desc: 'The swarm continuously changes global behavior (forming relay chains, regrouping) as the mission unfolds.',
      icon: RefreshCw,
      accent: 'text-[#D97706]',
      border: 'border-[#FDE68A]',
      bg: 'bg-[#FFFBEB]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-3xl shadow-xl p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="text-[10px] font-semibold text-[#2563EB] uppercase tracking-wider">
              DEMONSTRATION &amp; ARCHITECTURE GUIDE
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
              HOW NEXUS-S THINKS
            </h2>
            <p className="text-xs text-[#64748B]">
              The 5-step decentralized decision loop executed independently on each autonomous agent
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Flow */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 flex items-start space-x-3.5"
              >
                <div className={`p-2 rounded-lg ${step.bg} border ${step.border} ${step.accent} shrink-0 shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#0F172A] tracking-wide">
                      {step.num}. {step.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs text-[#64748B]">
          <span>Decentralized POMDP &bull; Zero Central Controller Dependency</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold transition-colors shadow-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
