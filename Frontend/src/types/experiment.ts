export interface PolicyComparisonData {
  id: string;
  name: string;
  type: string;
  coverage: number;
  energyLeft: number;
  commCostRating: 'Low' | 'Medium' | 'High';
  searchTimeSec: number;
  survivorsFound: number;
  relayStability: number;
  collisionsCount: number;
}

export interface AblationRunResult {
  condition: string;
  description: string;
  coveragePercent: number;
  energyPercent: number;
  targetsFound: number;
  survivalRate: number;
  commOverheadKb: number;
}

export interface ResearchNotebookEntry {
  id: string;
  hypothesisNumber: number;
  title: string;
  hypothesisText: string;
  experimentTag: string;
  configSummary: string;
  observedResult: string;
  conclusion: string;
  confidenceRating: 'HIGH' | 'MODERATE' | 'INCONCLUSIVE';
  date: string;
  author: string;
}

export interface HardwareRobotNode {
  id: string;
  name: string;
  mac: string;
  ip: string;
  battery: number;
  voltage: number;
  status: 'ONLINE' | 'OFFLINE' | 'LOW_BATTERY' | 'BUSY' | 'ESTOP';
  firmwareVersion: string;
  lastHeartbeatMsAgo: number;
  ros2Namespace: string;
  sensors: {
    lidar2d: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
    imu: 'CALIBRATED' | 'UNCALIBRATED';
    uwbBeacon: 'SYNCED' | 'SEARCHING';
    wheelEncoders: 'NOMINAL' | 'SLIP_DETECTED';
  };
}
