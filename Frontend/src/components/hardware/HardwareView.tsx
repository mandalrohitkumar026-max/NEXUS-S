import React, { useState } from 'react';
import { Server, Wifi, Cpu, Battery, ShieldAlert, CheckCircle2, AlertTriangle, Radio, RefreshCw, Power } from 'lucide-react';
import { HARDWARE_FLEET_DATA } from '../../data/researchData';
import { HardwareRobotNode } from '../../types/experiment';

interface HardwareViewProps {
  isHardwareMode: boolean;
  onToggleHardwareMode: (val: boolean) => void;
}

export const HardwareView: React.FC<HardwareViewProps> = ({
  isHardwareMode,
  onToggleHardwareMode,
}) => {
  const [fleet, setFleet] = useState<HardwareRobotNode[]>(HARDWARE_FLEET_DATA);
  const [selectedRoverId, setSelectedRoverId] = useState<string>('R-01');

  const activeRover = fleet.find(r => r.id === selectedRoverId) || fleet[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-y-auto font-mono text-xs select-none p-4 space-y-4">
      {/* Header */}
      <div className="bg-[#101318] border border-[#242b38] rounded p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-sm text-[#e6edf3]">
              PHYSICAL HARDWARE FLEET MANAGEMENT // ROS 2 DDS BRIDGE
            </h2>
          </div>
          <p className="text-[10px] text-[#8b949e]">
            TurtleBot 4 / Custom Micro-Rover Swarm &bull; CycloneDDS Middleware &bull; IEEE 802.11s Ad-Hoc Mesh
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Hardware Toggle */}
          <div className="flex items-center space-x-2 bg-[#141820] border border-[#242b38] rounded px-3 py-1.5 text-[11px]">
            <span className="text-[#8b949e]">ACTIVE STACK:</span>
            <button
              onClick={() => onToggleHardwareMode(!isHardwareMode)}
              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                isHardwareMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isHardwareMode ? 'PHYSICAL HARDWARE' : 'SIMULATION SIL'}
            </button>
          </div>

          <button
            onClick={() => alert('ROS 2 Discovery daemon re-polled: 12 physical nodes responding.')}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-[#141820] border border-[#242b38] text-[#cbd5e1] hover:text-[#e6edf3]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>PING FLEET</span>
          </button>
        </div>
      </div>

      {/* Fleet Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">ROS 2 DDS DOMAIN</span>
          <span className="text-base font-bold text-[#e6edf3]">DOMAIN ID: 42</span>
          <span className="text-[9px] text-emerald-400 block">FastRTPS / CycloneDDS</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">PHYSICAL ROVERS ONLINE</span>
          <span className="text-base font-bold text-emerald-400">
            {fleet.filter(r => r.status === 'ONLINE').length} / {fleet.length} UNITS
          </span>
          <span className="text-[9px] text-[#545d68] block">2 docking on inductive pads</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">WIRELESS MESH PROTOCOL</span>
          <span className="text-base font-bold text-cyan-400">802.11s (Channel 36)</span>
          <span className="text-[9px] text-[#545d68] block">B.A.T.M.A.N.-adv routing</span>
        </div>

        <div className="bg-[#101318] border border-[#242b38] rounded p-3">
          <span className="text-[10px] text-[#8b949e] block">SAFETY INTERLOCK</span>
          <span className="text-base font-bold text-emerald-400">ARMED / READY</span>
          <span className="text-[9px] text-[#545d68] block">Heartbeat timeout: 250ms</span>
        </div>
      </div>

      {/* Main Table + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fleet Table */}
        <div className="lg:col-span-2 bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
          <div className="border-b border-[#1e2430] pb-2 flex items-center justify-between">
            <h3 className="font-bold text-[#e6edf3]">ROVER FLEET TELEMETRY MATRIX</h3>
            <span className="text-[10px] text-[#8b949e]">SELECT ROVER TO INSPECT SENSORS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[#242b38] bg-[#141820] text-[#8b949e] uppercase text-[10px]">
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Hardware IP</th>
                  <th className="p-2.5">Battery</th>
                  <th className="p-2.5">Bus Voltage</th>
                  <th className="p-2.5">Heartbeat</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Firmware</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2430]">
                {fleet.map(rover => (
                  <tr
                    key={rover.id}
                    onClick={() => setSelectedRoverId(rover.id)}
                    className={`cursor-pointer transition-colors ${
                      rover.id === selectedRoverId ? 'bg-cyan-950/30' : 'hover:bg-[#141820]'
                    }`}
                  >
                    <td className="p-2.5 font-bold text-[#e6edf3]">{rover.id}</td>
                    <td className="p-2.5 font-mono text-[#cbd5e1]">{rover.ip}</td>
                    <td className="p-2.5 font-bold">
                      <span className={rover.battery < 25 ? 'text-rose-400' : 'text-emerald-400'}>
                        {rover.battery}%
                      </span>
                    </td>
                    <td className="p-2.5 text-[#8b949e]">{rover.voltage}V</td>
                    <td className="p-2.5 text-[#8b949e]">{rover.lastHeartbeatMsAgo}ms ago</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          rover.status === 'ONLINE'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : rover.status === 'LOW_BATTERY'
                            ? 'bg-orange-950/60 text-orange-400 border border-orange-800/40'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {rover.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-[10px] text-[#545d68]">{rover.firmwareVersion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Rover Hardware Sensor Suite */}
        <div className="bg-[#101318] border border-[#242b38] rounded p-4 space-y-3">
          <div className="border-b border-[#1e2430] pb-2">
            <span className="font-bold text-[#e6edf3] block">{activeRover.name} // {activeRover.id}</span>
            <span className="text-[10px] text-[#8b949e]">MAC: {activeRover.mac}</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <span className="text-[10px] text-[#8b949e] font-bold block uppercase">
              Onboard Sensor Diagnostics
            </span>

            <div className="bg-[#141820] p-2 rounded border border-[#1e2430] flex justify-between items-center">
              <span>2D LiDAR (RPLIDAR S2)</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                activeRover.sensors.lidar2d === 'HEALTHY' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
              }`}>
                {activeRover.sensors.lidar2d}
              </span>
            </div>

            <div className="bg-[#141820] p-2 rounded border border-[#1e2430] flex justify-between items-center">
              <span>9-DOF IMU (BNO055)</span>
              <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded text-[9px]">
                {activeRover.sensors.imu}
              </span>
            </div>

            <div className="bg-[#141820] p-2 rounded border border-[#1e2430] flex justify-between items-center">
              <span>UWB Anchor Beacon</span>
              <span className="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded text-[9px]">
                {activeRover.sensors.uwbBeacon}
              </span>
            </div>

            <div className="bg-[#141820] p-2 rounded border border-[#1e2430] flex justify-between items-center">
              <span>Quadrature Wheel Encoders</span>
              <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded text-[9px]">
                {activeRover.sensors.wheelEncoders}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e2430] space-y-1.5 text-[10px]">
            <span className="text-[#8b949e] font-bold block">ROS 2 DDS PUBLISHER TOPICS</span>
            <div className="bg-[#0d1015] p-2 rounded border border-[#1b202a] space-y-1 text-[#cbd5e1] font-mono text-[9px]">
              <div>&bull; <code className="text-amber-400">{activeRover.ros2Namespace}/cmd_vel</code> (geometry_msgs/Twist)</div>
              <div>&bull; <code className="text-cyan-400">{activeRover.ros2Namespace}/odom</code> (nav_msgs/Odometry)</div>
              <div>&bull; <code className="text-emerald-400">{activeRover.ros2Namespace}/scan</code> (sensor_msgs/LaserScan)</div>
              <div>&bull; <code className="text-purple-400">{activeRover.ros2Namespace}/battery_state</code> (sensor_msgs/BatteryState)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
