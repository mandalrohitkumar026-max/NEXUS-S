import React from 'react';
import {
  Crosshair,
  Cpu,
  Map,
  FlaskConical,
  GitFork,
  Activity,
  Network,
  BarChart3,
  BookOpen,
  Server,
  Layers,
  FileText,
} from 'lucide-react';

export type TabKey =
  | 'mission'
  | 'swarm'
  | 'environment'
  | 'experiments'
  | 'policies'
  | 'telemetry'
  | 'communications'
  | 'analytics'
  | 'research'
  | 'hardware'
  | 'architecture'
  | 'landing';

interface NavigationProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  robotCount: number;
  anomalyCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  robotCount,
}) => {
  const navItems: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { key: 'mission', label: 'Mission Control', icon: Crosshair },
    { key: 'swarm', label: 'Swarm Fleet', icon: Cpu, badge: robotCount },
    { key: 'environment', label: 'Environment', icon: Map },
    { key: 'experiments', label: 'Experiments', icon: FlaskConical },
    { key: 'policies', label: 'Policies', icon: GitFork },
    { key: 'telemetry', label: 'Telemetry', icon: Activity },
    { key: 'communications', label: 'Communications', icon: Network },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'research', label: 'Research & Ablation', icon: BookOpen },
    { key: 'hardware', label: 'Hardware', icon: Server },
    { key: 'architecture', label: 'Architecture', icon: Layers },
    { key: 'landing', label: 'Lab Overview', icon: FileText },
  ];

  return (
    <nav className="bg-[#101318] border-b border-[#242b38] px-3 flex items-center overflow-x-auto select-none scrollbar-none text-xs">
      <div className="flex items-center space-x-1 py-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded font-mono text-[11px] whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#1a212d] text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#141820]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-[#8b949e]'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[9px] px-1 rounded ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-[#1b212c] text-[#8b949e]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
