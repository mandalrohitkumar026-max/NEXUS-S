import { Obstacle, Target, ChargingStation, SimulationConfig } from '../types/simulation';

export const DEFAULT_OBSTACLES: Obstacle[] = [
  { id: 'obs-bldg-1', type: 'building', x: 220, y: 120, width: 140, height: 100, label: 'STRUCTURE_ALPHA' },
  { id: 'obs-bldg-2', type: 'building', x: 520, y: 80, width: 160, height: 120, label: 'FACILITY_BETA' },
  { id: 'obs-rubble-1', type: 'rubble', x: 380, y: 280, width: 130, height: 90, label: 'COLLAPSED_CORRIDOR' },
  { id: 'obs-bldg-3', type: 'building', x: 180, y: 380, width: 130, height: 140, label: 'HANGAR_GAMMA' },
  { id: 'obs-bldg-4', type: 'building', x: 680, y: 340, width: 170, height: 130, label: 'REACTOR_ANNEX' },
  { id: 'obs-hazard-1', type: 'hazard_zone', x: 440, y: 460, width: 150, height: 100, label: 'DEBRIS_FIELD_DELTA' },
  { id: 'obs-bldg-5', type: 'building', x: 800, y: 140, width: 90, height: 150, label: 'STORAGE_UNIT_E' },
];

export const DEFAULT_TARGETS: Target[] = [
  {
    id: 'SURVIVOR-ALPHA',
    type: 'survivor',
    x: 430,
    y: 160,
    detected: false,
    confidence: 0,
    confirmed: false,
    detectedBy: null,
    assignedRobots: [],
    firstDetectedTime: null,
  },
  {
    id: 'SURVIVOR-BETA',
    type: 'survivor',
    x: 760,
    y: 490,
    detected: false,
    confidence: 0,
    confirmed: false,
    detectedBy: null,
    assignedRobots: [],
    firstDetectedTime: null,
  },
  {
    id: 'BEACON-OMEGA',
    type: 'beacon',
    x: 240,
    y: 540,
    detected: false,
    confidence: 0,
    confirmed: false,
    detectedBy: null,
    assignedRobots: [],
    firstDetectedTime: null,
  },
];

export const DEFAULT_CHARGERS: ChargingStation[] = [
  { id: 'CHG-STATION-01', x: 90, y: 100, radius: 32, capacity: 4, currentOccupancy: 0 },
  { id: 'CHG-STATION-02', x: 90, y: 550, radius: 32, capacity: 4, currentOccupancy: 0 },
];

export const DEFAULT_CONFIG: SimulationConfig = {
  scenarioName: 'SEARCH & RESCUE // SCENARIO-042',
  scenarioId: 'SEARCH-RESCUE-042',
  algorithm: 'MAPPO',
  robotCount: 12,
  worldWidth: 960,
  worldHeight: 640,
  gridResolution: 20, // 48x32 exploration grid cells
  commRadius: 140,
  sensorRadius: 75,
  batteryCapacityMah: 3200,
  movementCostFactor: 0.018,
  commCostFactor: 0.005,
  returnThreshold: 22, // % battery trigger to return to base
  ablations: {
    noCommunication: false,
    noBatteryAwareness: false,
    noNeighborObservations: false,
    noVision: false,
    noCollisionAvoidance: false,
    noAdaptiveExploration: false,
  },
};
