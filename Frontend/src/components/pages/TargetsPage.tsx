import React from 'react';
import { Target } from '../../types/simulation';
import { Robot } from '../../types/robot';
import { Target as TargetIcon, MapPin } from 'lucide-react';

interface TargetsPageProps {
  targets: Target[];
  robots: Robot[];
  onSelectRobot: (id: string) => void;
  onNavigateToOperations: () => void;
}

export const TargetsPage: React.FC<TargetsPageProps> = ({
  targets,
  robots,
  onSelectRobot,
  onNavigateToOperations,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F6F8FB] overflow-y-auto p-6 space-y-5 select-none">
      {/* Page Header */}
      <div className="card p-5 flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0]">
        <div>
          <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            MISSION OBJECTIVES // SURVIVOR LOCALIZATION
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center space-x-2">
            <TargetIcon className="w-5 h-5 text-[#D97706]" />
            <span>TARGETS DIRECTORY</span>
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time localization confidence, discovering agent telemetry, and verification state
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2 text-[#0F172A]">
            CONFIRMED: <strong className="text-[#16A34A] font-bold">{targets.filter(t => t.confirmed).length}</strong> / {targets.length}
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {targets.map(target => {
          const isDetected = target.detected;
          const isConfirmed = target.confirmed;

          return (
            <div
              key={target.id}
              className="card p-5 space-y-4 bg-white border border-[#E2E8F0] flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isConfirmed ? 'bg-[#16A34A]' : isDetected ? 'bg-[#D97706]' : 'bg-[#94A3B8]'
                      }`}
                    ></span>
                    <span className="font-bold text-sm text-[#0F172A]">
                      {target.id}
                    </span>
                  </div>

                  <span
                    className={`badge ${
                      isConfirmed
                        ? 'badge-success'
                        : isDetected
                        ? 'badge-warning'
                        : 'badge-muted'
                    }`}
                  >
                    {isConfirmed ? 'CONFIRMED' : isDetected ? 'DETECTED' : 'UNDISCOVERED'}
                  </span>
                </div>

                {/* Target Information */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#475569]">
                    <span className="text-[#64748B]">Target Type:</span>
                    <span className="font-semibold text-[#0F172A] capitalize">{target.type}</span>
                  </div>

                  <div className="flex justify-between text-[#475569]">
                    <span className="text-[#64748B]">Coordinates:</span>
                    <span className="font-mono font-semibold text-[#0F172A]">
                      ({Math.round(target.x)}m, {Math.round(target.y)}m)
                    </span>
                  </div>

                  <div className="flex justify-between text-[#475569]">
                    <span className="text-[#64748B]">Detecting Agent:</span>
                    <span className="font-bold text-[#2563EB] font-mono">
                      {target.detectedBy ? target.detectedBy.replace('-', '') : 'None'}
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#64748B]">Localization Confidence:</span>
                      <span className={`font-bold font-mono ${isConfirmed ? 'text-[#16A34A]' : 'text-[#D97706]'}`}>
                        {Math.round(target.confidence * 100)}%
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isConfirmed ? 'bg-[#16A34A]' : 'bg-[#D97706]'
                        }`}
                        style={{ width: `${Math.round(target.confidence * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* View on Map Button */}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    if (target.detectedBy) onSelectRobot(target.detectedBy.replace('-', ''));
                    onNavigateToOperations();
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Location On Map</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
