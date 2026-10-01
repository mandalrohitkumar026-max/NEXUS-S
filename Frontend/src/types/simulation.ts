export interface Obstacle {
  id: string;
  type: 'building' | 'rubble' | 'hazard_zone';
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
}

export interface Target {
  id: string;
  type: 'survivor' | 'beacon' | 'hazard_source';
  x: number;
  y: number;
  detected: boolean;
  confidence: number; // 0.0 to 1.0
  confirmed: boolean;
  detectedBy: string | null;
  assignedRobots: string[];
  firstDetectedTime: number | null;
}

export interface ChargingStation {
  id: string;
  x: number;
  y: number;
  radius: number;
  capacity: number;
  currentOccupancy: number;
}

export interface AblationSettings {
  noCommunication: boolean;
  noBatteryAwareness: boolean;
  noNeighborObservations: boolean;
  noVision: boolean;
  noCollisionAvoidance: boolean;
  noAdaptiveExploration: boolean;
}

export interface SimulationConfig {
  scenarioName: string;
  scenarioId: string;
  algorithm: 'MAPPO' | 'IPPO' | 'QMIX' | 'RULE_BASED' | 'CUSTOM';
  robotCount: number;
  worldWidth: number;
  worldHeight: number;
  gridResolution: number; // cell size in world units
  commRadius: number;
  sensorRadius: number;
  batteryCapacityMah: number;
  movementCostFactor: number;
  commCostFactor: number;
  returnThreshold: number;
  ablations: AblationSettings;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  simTimeSeconds: number;
  robotId: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
}

export interface EmergentPattern {
  id: string;
  name: string;
  type: 'ROLE_SPECIALIZATION' | 'DYNAMIC_RELAY' | 'FRONTIER_FORMATION' | 'CLUSTER_EVASION' | 'AREA_PARTITIONING';
  confidence: number; // 0-100%
  description: string;
  participatingRobots: string[];
  detectedAt: number;
  active: boolean;
}

export interface SimulationStats {
  elapsedSeconds: number;
  areaCoveragePercent: number;
  unexploredPercent: number;
  totalExploredM2: number;
  avgBatteryPercent: number;
  totalEnergyJoules: number;
  targetsFound: number;
  totalTargets: number;
  commConnectedPercent: number;
  activeLinksCount: number;
  messagesPerMin: number;
  packetLossPercent: number;
  relayNodesCount: number;
}
