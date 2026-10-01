export type RobotState =
  | 'EXPLORING'
  | 'SEARCHING'
  | 'TRACKING'
  | 'COMMUNICATING'
  | 'LOW_POWER'
  | 'RETURNING'
  | 'CHARGING'
  | 'LOST_LINK'
  | 'ASSISTING';

export interface LocalObservation {
  nearestObstacleDist: number; // in meters
  nearestObstacleAngle: number; // in radians relative to robot heading
  neighborCount: number;
  nearestNeighborDist: number;
  nearestNeighborId: string | null;
  unexploredDensity: number; // 0.0 to 1.0 (local 15m radius)
  targetSignalDetected: boolean;
  targetEstimatedDist: number | null;
  batteryLevel: number; // 0 to 100%
  distToCharger: number;
  commSignalStrength: number; // dBm or 0-100%
}

export interface LocalPolicyOutput {
  actionName: string;
  headingDelta: number; // rad
  targetSpeed: number; // m/s
  broadcastIntent: boolean;
  assignedRole: 'FRONTIER_SCOUT' | 'RELAY_NODE' | 'TARGET_TRACKER' | 'ENERGY_CONSERVATOR' | 'SEARCHER';
  actionProbabilities: { action: string; prob: number }[];
  policyEntropy: number;
  stateVector: number[]; // normalized [obs_dist, obs_ang, bat, n_count, n_dist, unexpl_x, unexpl_y, target_sig]
}

export interface TelemetryPoint {
  timestamp: number;
  battery: number;
  speed: number;
  distanceTraveled: number;
  commEventsCount: number;
  cpuLoad: number;
  temperature: number;
  memoryMb: number;
}

export interface Robot {
  id: string;
  index: number;
  x: number; // simulation coordinate (m or px)
  y: number;
  vx: number;
  vy: number;
  heading: number; // radians
  speed: number; // m/s
  battery: number; // %
  batteryCapacityMah: number;
  currentDrawMa: number;
  state: RobotState;
  role: 'FRONTIER_SCOUT' | 'RELAY_NODE' | 'TARGET_TRACKER' | 'ENERGY_CONSERVATOR' | 'SEARCHER';
  sensorRadius: number; // meters
  commRadius: number; // meters
  localObservation: LocalObservation;
  localPolicy: LocalPolicyOutput;
  trajectory: { x: number; y: number }[];
  telemetryHistory: TelemetryPoint[];
  hardwareStatus?: {
    ip: string;
    firmware: string;
    heartbeatMs: number;
    sensorHealth: 'OK' | 'DEGRADED' | 'FAULT';
    ros2Topic: string;
    isPhysical: boolean;
  };
}
