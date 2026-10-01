import React from 'react';
import { Robot } from '../../types/robot';
import { Battery, Activity, Cpu, Wifi, MapPin, Gauge, Shield, Zap } from 'lucide-react';

interface RobotTelemetryInspectorProps {
  robot: Robot | null;
  onSelectNeighbor?: (id: string) => void;
}

export const RobotTelemetryInspector: React.FC<RobotTelemetryInspectorProps> = ({
  robot,
  onSelectNeighbor,
}) => {
  if (!robot) {
    return (
      <div className="p-4 bg-[#101318] border border-[#242b38] rounded text-center text-xs font-mono text-[#8b949e]">
        Select a robot node on the canvas to view real-time engineering telemetry.
      </div>
    );
  }

  // Mini radar display coordinates
  const radarSize = 100;
  const radarRadius = radarSize / 2;

  // Relative obstacle dot
  const obsDistNorm = Math.min(1, robot.localObservation.nearestObstacleDist / robot.sensorRadius);
  const obsAngle = robot.localObservation.nearestObstacleAngle;
  const obsRadarX = radarRadius + Math.cos(obsAngle - Math.PI / 2) * (obsDistNorm * (radarRadius - 10));
  const obsRadarY = radarRadius + Math.sin(obsAngle - Math.PI / 2) * (obsDistNorm * (radarRadius - 10));

  return (
    <div className="bg-[#101318] border border-[#242b38] rounded flex flex-col text-xs font-mono select-none overflow-hidden">
      {/* Title */}
      <div className="bg-[#141820] px-3 py-2 border-b border-[#242b38] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-[#e6edf3]">ROBOT TELEMETRY // {robot.id}</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            robot.state === 'CHARGING'
              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/50'
              : robot.state === 'RETURNING'
              ? 'bg-orange-950/60 text-orange-400 border border-orange-700/50'
              : robot.state === 'TRACKING'
              ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-700/50'
              : robot.state === 'LOW_POWER'
              ? 'bg-rose-950/60 text-rose-400 border border-rose-700/50'
              : 'bg-[#1b212c] text-[#cbd5e1] border border-[#2e3748]'
          }`}
        >
          {robot.state}
        </span>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto max-h-[460px]">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="bg-[#141820] p-2 rounded border border-[#1e2430]">
            <span className="text-[#8b949e] flex items-center space-x-1 mb-0.5">
              <MapPin className="w-3 h-3" />
              <span>COORDINATES</span>
            </span>
            <span className="text-[#e6edf3] font-bold">
              X: {Math.round(robot.x)}m &bull; Y: {Math.round(robot.y)}m
            </span>
            <span className="text-[#545d68] text-[9px] block">
              &theta;: {Math.round(robot.heading * 57.3)}&deg; &bull; v: {robot.speed.toFixed(2)} m/s
            </span>
          </div>

          <div className="bg-[#141820] p-2 rounded border border-[#1e2430]">
            <span className="text-[#8b949e] flex items-center space-x-1 mb-0.5">
              <Battery className="w-3 h-3 text-amber-400" />
              <span>POWER / BATTERY</span>
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`font-bold ${robot.battery < 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {robot.battery.toFixed(1)}%
              </span>
              <span className="text-[#545d68] text-[9px]">
                ({Math.round((robot.battery / 100) * robot.batteryCapacityMah)} mAh)
              </span>
            </div>
            <span className="text-[#545d68] text-[9px] block">
              Draw: {Math.round(robot.currentDrawMa)} mA &bull; 15.2V
            </span>
          </div>
        </div>

        {/* Local 360 Perception Radar */}
        <div className="bg-[#0d1015] p-2.5 rounded border border-[#242b38] flex items-center space-x-3">
          <div className="relative w-[100px] h-[100px] bg-[#0a0c10] border border-[#242b38] rounded-full flex items-center justify-center shrink-0">
            {/* Range rings */}
            <div className="absolute w-[80px] h-[80px] rounded-full border border-[#1a212d] border-dashed"></div>
            <div className="absolute w-[45px] h-[45px] rounded-full border border-[#1a212d]"></div>
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-[#1a212d]"></div>
            <div className="absolute h-full w-[1px] bg-[#1a212d]"></div>

            {/* Self center */}
            <div className="absolute w-2 h-2 rounded-full bg-amber-400"></div>

            {/* Obstacle marker */}
            {robot.localObservation.nearestObstacleDist < robot.sensorRadius && (
              <div
                className="absolute w-2.5 h-2.5 bg-rose-500 rounded-sm border border-rose-300"
                style={{ left: `${obsRadarX - 5}px`, top: `${obsRadarY - 5}px` }}
                title={`Obstacle ${robot.localObservation.nearestObstacleDist}m`}
              ></div>
            )}
          </div>

          <div className="text-[10px] space-y-1">
            <span className="text-amber-400 font-bold block">LOCAL RADAR PERCEPTION</span>
            <p className="text-[#8b949e] leading-tight text-[9px]">
              Decentralized FOV (R={robot.sensorRadius}m). Autonomous agents cannot access global map data.
            </p>
            <div className="text-[9px] text-[#cbd5e1] space-y-0.5 pt-1">
              <div>&bull; Obstacle: <span className="text-rose-400">{robot.localObservation.nearestObstacleDist}m</span></div>
              <div>&bull; Closest peer: <span className="text-cyan-400">{robot.localObservation.nearestNeighborDist || 'none'}m</span></div>
            </div>
          </div>
        </div>

        {/* Hardware Status & ROS 2 Bridge */}
        <div className="bg-[#141820] p-2 rounded border border-[#1e2430] text-[10px] space-y-1">
          <div className="text-[#8b949e] font-semibold flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Wifi className="w-3 h-3 text-cyan-400" />
              <span>ROBOT OS (ROS 2 DDS NODE)</span>
            </span>
            <span className="text-emerald-400 text-[9px]">SYNCED</span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[9px] text-[#cbd5e1]">
            <div><span className="text-[#545d68]">IP:</span> {robot.hardwareStatus?.ip}</div>
            <div><span className="text-[#545d68]">HEARTBEAT:</span> {robot.hardwareStatus?.heartbeatMs} ms</div>
            <div className="col-span-2">
              <span className="text-[#545d68]">TOPIC:</span> <code className="text-amber-400">{robot.hardwareStatus?.ros2Topic}</code>
            </div>
            <div><span className="text-[#545d68]">FIRMWARE:</span> {robot.hardwareStatus?.firmware}</div>
            <div><span className="text-[#545d68]">HEALTH:</span> <span className="text-emerald-400">NOMINAL</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
