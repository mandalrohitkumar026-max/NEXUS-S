export type RobotState =
  | 'EXPLORING'
  | 'TRACKING'
  | 'RETURNING'
  | 'CHARGING'
  | 'LOW_POWER'
  | 'ASSISTING'
  | 'IDLE';

export interface RobotObservation {
  visibleTargetIds: string[];
  neighborCount: number;
  nearestNeighborDist: number;
  nearestDockDist: number;
  inCommRange: boolean;
}

export interface RobotPolicyState {
  actionName: string;
  utilityScore: number;
  activeGoal: string;
}

export interface RobotTelemetry {
  id: string;
  x: number;
  y: number;
  heading: number;
  speed: number;
  battery: number;
  state: RobotState;
  role: string;
  commRadius: number;
  sensorRadius: number;
  localObservation: RobotObservation;
  localPolicy: RobotPolicyState;
}

export interface TargetInfo {
  id: string;
  x: number;
  y: number;
  type: string;
  detected: boolean;
  confirmed: boolean;
  detectedBy?: string;
  confidence: number;
}

export interface ChargingStation {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface SimEdge {
  from: string;
  to: string;
  distance: number;
  signalStrength: number;
}

export interface SimulationStats {
  elapsedSeconds: number;
  totalExploredM2: number;
  areaCoveragePercent: number;
  targetsFound: number;
  totalTargets: number;
  avgBatteryPercent: number;
  commConnectedPercent: number;
  activeRobotCount: number;
  messagesPerMin: number;
  packetLossPercent: number;
}

export interface SimulationConfig {
  worldWidth: number;
  worldHeight: number;
  robotCount: number;
  commRadius: number;
  sensorRadius: number;
  returnThreshold: number;
  maxSpeed: number;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  robotId: string;
  level: 'INFO' | 'WARN' | 'SUCCESS' | 'CRITICAL';
  message: string;
}
