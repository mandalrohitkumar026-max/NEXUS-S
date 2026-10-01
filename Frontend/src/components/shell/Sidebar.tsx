import React from 'react';
import {
  Compass,
  Crosshair,
  Cpu,
  Bot,
  Target,
  Radio,
  BarChart2,
  History,
  Settings,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'operations'
  | 'swarm'
  | 'robots'
  | 'targets'
  | 'communications'
  | 'analytics'
  | 'history';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  robotCount: number;
  targetsFound: number;
  totalTargets: number;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  robotCount,
  targetsFound,
  totalTargets,
  onOpenSettings,
}) => {
  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeClass?: string;
  }[] = [
    { id: 'overview', label: 'Mission Overview', icon: Compass },
    { id: 'operations', label: 'Live Operations', icon: Crosshair, badge: 'ACTIVE', badgeClass: 'badge-accent' },
    { id: 'swarm', label: 'Swarm Fleet', icon: Cpu, badge: robotCount, badgeClass: 'badge-muted' },
    { id: 'robots', label: 'Robots', icon: Bot },
    { id: 'targets', label: 'Targets', icon: Target, badge: `${targetsFound}/${totalTargets}`, badgeClass: 'badge-warning' },
    { id: 'communications', label: 'Communications', icon: Radio },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'history', label: 'Mission History', icon: History },
  ];

  return (
    <aside className="sidebar bg-white border-r border-[#E2E8F0]">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#E2E8F0] flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold text-sm shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="6" cy="6" r="2.5" fill="currentColor" fillOpacity="0.2" />
              <circle cx="18" cy="7" r="2.5" fill="currentColor" fillOpacity="0.2" />
              <circle cx="12" cy="18" r="2.5" fill="currentColor" fillOpacity="0.2" />
              <path d="M6 6L18 7M6 6L12 18M18 7L12 18" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="sidebar-expanded-only overflow-hidden">
            <h1 className="font-sans font-bold text-sm text-[#0F172A] tracking-wide flex items-center space-x-1.5">
              <span>NEXUS-S</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[#2563EB] font-semibold border border-[#E2E8F0]">
                OPS
              </span>
            </h1>
            <p className="text-[11px] text-[#64748B] font-medium tracking-tight truncate">
              Swarm Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-2.5 space-y-1">
          <div className="sidebar-expanded-only text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider px-3 py-1.5 mb-0.5">
            Operations
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border border-[#BFDBFE]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] border border-transparent'
                } sidebar-collapsed-center`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                  <span className="sidebar-expanded-only">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`sidebar-expanded-only badge ${item.badgeClass || 'badge-muted'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status & Settings */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
        {/* System Health Indicators */}
        <div className="sidebar-expanded-only bg-white border border-[#E2E8F0] rounded-lg p-2.5 text-xs space-y-2 shadow-sm">
          <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            System Telemetry
          </div>
          <div className="flex items-center justify-between text-[#475569] text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className="status-dot status-dot-active"></span>
              <span>DDS Bus</span>
            </span>
            <span className="text-[#16A34A] font-semibold font-mono">ONLINE</span>
          </div>

          <div className="flex items-center justify-between text-[#475569] text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className="status-dot status-dot-active"></span>
              <span>ROS 2 Bridge</span>
            </span>
            <span className="text-[#16A34A] font-semibold font-mono">READY</span>
          </div>

          <div className="flex items-center justify-between text-[#475569] text-[11px]">
            <span className="flex items-center space-x-1.5">
              <span className="status-dot status-dot-accent"></span>
              <span>Decentralized Core</span>
            </span>
            <span className="text-[#2563EB] font-semibold font-mono">60Hz</span>
          </div>
        </div>

        {/* Settings & Version */}
        <div className="flex items-center justify-between px-1">
          <span className="sidebar-expanded-only text-[11px] text-[#64748B] font-mono">
            v2.4.2 &bull; IEEE 802.11s
          </span>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-md hover:bg-white transition-colors border border-transparent hover:border-[#E2E8F0]"
            title="Platform Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
