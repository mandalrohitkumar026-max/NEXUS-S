import React, { useState, useEffect, useRef } from 'react';
import { SwarmSimulationEngine } from './simulation/simEngine';
import { Sidebar, NavTab } from './components/shell/Sidebar';
import { TopCommandBar } from './components/shell/TopCommandBar';
import { LiveOperationsView } from './components/operations/LiveOperationsView';
import { MissionOverviewPage } from './components/pages/MissionOverviewPage';
import { RobotsPage } from './components/pages/RobotsPage';
import { TargetsPage } from './components/pages/TargetsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { MissionHistoryPage } from './components/pages/MissionHistoryPage';
import { SwarmView } from './components/swarm/SwarmView';
import { CommunicationsView } from './components/communications/CommunicationsView';
import { Settings, X } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('operations');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>('R07');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [, setTick] = useState(0);

  // Persistent Simulation Engine Instance
  const simEngineRef = useRef<SwarmSimulationEngine | null>(null);

  if (!simEngineRef.current) {
    simEngineRef.current = new SwarmSimulationEngine();
  }

  const engine = simEngineRef.current;

  // Real-time animation loop for the simulation engine
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const loop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      if (engine.getIsRunning()) {
        engine.step(dt);
        setTick(t => t + 1);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [engine]);

  return (
    <div className="app-shell text-[var(--text-primary)] font-sans antialiased select-none">
      {/* --------------------------------------------------
          LEFT SIDEBAR (240px desktop, collapses at <=900px)
      -------------------------------------------------- */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        robotCount={engine.robots.length}
        targetsFound={engine.stats.targetsFound}
        totalTargets={engine.stats.totalTargets}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* --------------------------------------------------
          RIGHT MAIN OPERATIONAL CONTAINER
      -------------------------------------------------- */}
      <div className="main-content">
        {/* Top Command Bar */}
        <TopCommandBar
          stats={engine.stats}
          isRunning={engine.getIsRunning()}
          onTogglePlay={() => {
            engine.togglePlayPause();
            setTick(t => t + 1);
          }}
          onReset={() => {
            engine.restart();
            setTick(t => t + 1);
          }}
          robotCount={engine.robots.length}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-primary)]">
          {/* 1. Live Operations (Hero Primary Screen) */}
          {activeTab === 'operations' && (
            <LiveOperationsView
              robots={engine.robots}
              obstacles={engine.obstacles}
              targets={engine.targets}
              chargers={engine.chargers}
              commEdges={engine.commEdges}
              occupancyGrid={engine.occupancyGrid}
              gridCols={engine.gridCols}
              gridRows={engine.gridRows}
              config={engine.config}
              stats={engine.stats}
              logs={engine.logs}
              selectedRobotId={selectedRobotId}
              onSelectRobot={id => setSelectedRobotId(id)}
            />
          )}

          {/* 2. Mission Overview */}
          {activeTab === 'overview' && (
            <MissionOverviewPage
              stats={engine.stats}
              robotCount={engine.robots.length}
              onLaunchOperations={() => setActiveTab('operations')}
            />
          )}

          {/* 3. Swarm Fleet Overview */}
          {activeTab === 'swarm' && (
            <SwarmView
              robots={engine.robots}
              onSelectRobot={id => {
                setSelectedRobotId(id);
                setActiveTab('operations');
              }}
              onNavigateToMission={() => setActiveTab('operations')}
            />
          )}

          {/* 4. Robots Directory */}
          {activeTab === 'robots' && (
            <RobotsPage
              robots={engine.robots}
              onSelectRobot={id => {
                setSelectedRobotId(id);
                setActiveTab('operations');
              }}
              onNavigateToOperations={() => setActiveTab('operations')}
            />
          )}

          {/* 5. Targets Directory */}
          {activeTab === 'targets' && (
            <TargetsPage
              targets={engine.targets}
              robots={engine.robots}
              onSelectRobot={id => {
                setSelectedRobotId(id);
                setActiveTab('operations');
              }}
              onNavigateToOperations={() => setActiveTab('operations')}
            />
          )}

          {/* 6. Communications Mesh Network */}
          {activeTab === 'communications' && (
            <CommunicationsView
              robots={engine.robots}
              commEdges={engine.commEdges}
              stats={engine.stats}
              config={engine.config}
              onSelectRobot={id => {
                setSelectedRobotId(id);
                setActiveTab('operations');
              }}
            />
          )}

          {/* 7. Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsPage stats={engine.stats} />
          )}

          {/* 8. Mission History */}
          {activeTab === 'history' && (
            <MissionHistoryPage />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center space-x-2">
                <Settings className="w-4 h-4 text-[#2563EB]" />
                <span>NEXUS-S Platform Settings</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-md hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#334155] font-semibold">Communication Range (m)</label>
                <input
                  type="range"
                  min="80"
                  max="220"
                  step="10"
                  value={engine.config.commRadius}
                  onChange={e => {
                    engine.config.commRadius = Number(e.target.value);
                    setTick(t => t + 1);
                  }}
                  className="w-full accent-[#2563EB]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>80m</span>
                  <span className="text-[#2563EB] font-bold">{engine.config.commRadius}m</span>
                  <span>220m</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#334155] font-semibold">Battery Return Threshold</label>
                <input
                  type="range"
                  min="15"
                  max="35"
                  step="1"
                  value={engine.config.returnThreshold}
                  onChange={e => {
                    engine.config.returnThreshold = Number(e.target.value);
                    setTick(t => t + 1);
                  }}
                  className="w-full accent-[#2563EB]"
                />
                <div className="flex justify-between text-[10px] text-[#64748B]">
                  <span>15%</span>
                  <span className="text-[#16A34A] font-bold">{engine.config.returnThreshold}%</span>
                  <span>35%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
