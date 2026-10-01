import { Robot } from '../types/robot';

export interface SwarmDecisionExplanation {
  robotId: string;
  statusText: string;
  taskText: string;
  decisionHeadline: string;
  reasons: string[];
  confidencePercent: number;
}

export function getSectorName(x: number, y: number): string {
  if (x < 480 && y < 320) return 'Sector A (North-West)';
  if (x >= 480 && y < 320) return 'Sector B (North-East)';
  if (x < 480 && y >= 320) return 'Sector C (South-West)';
  return 'Sector D (South-East)';
}

export function explainRobotDecision(robot: Robot, allRobots: Robot[]): SwarmDecisionExplanation {
  const currentSector = getSectorName(robot.x, robot.y);
  const targetSector = robot.x < 480 ? 'Sector B' : 'Sector D';
  const bat = Math.round(robot.battery);
  const peers = robot.localObservation.neighborCount;
  const nearbyPeer = robot.localObservation.nearestNeighborId;

  // 1. Returning to base / Charging
  if (robot.state === 'CHARGING') {
    return {
      robotId: robot.id,
      statusText: 'Charging at base',
      taskText: 'Recharging battery to 95%',
      decisionHeadline: `“I am stationary at the base charging station because:`,
      reasons: [
        `my battery is actively fast-charging (${bat}%)`,
        `I will resume field exploration once battery reaches 95%`,
        `other swarm members are actively covering perimeter sectors`,
      ],
      confidencePercent: 98,
    };
  }

  if (robot.state === 'RETURNING') {
    return {
      robotId: robot.id,
      statusText: 'Returning to charger',
      taskText: 'Navigate to base dock',
      decisionHeadline: `“I am returning to the charging dock because:`,
      reasons: [
        `my battery dropped low (${bat}% ≤ 22% reserve limit)`,
        `nearest charging pad is ${Math.round(robot.localObservation.distToCharger)} meters away`,
        `returning now prevents getting stranded in unexplored terrain`,
      ],
      confidencePercent: 94,
    };
  }

  // 2. Tracking / Assisting with target
  if (robot.state === 'TRACKING' || robot.state === 'ASSISTING') {
    return {
      robotId: robot.id,
      statusText: 'Moving to target',
      taskText: 'Confirm survivor location',
      decisionHeadline: `“I am moving to inspect a detected target because:`,
      reasons: [
        `a potential survivor signal was detected nearby`,
        `my battery is sufficient (${bat}%) for inspection and confirmation`,
        `I am the closest available robot to establish visual contact`,
      ],
      confidencePercent: 92,
    };
  }

  // 3. Low Power
  if (robot.state === 'LOW_POWER') {
    return {
      robotId: robot.id,
      statusText: 'Low energy conservation',
      taskText: 'Conserve battery',
      decisionHeadline: `“I am throttling motor speeds because:`,
      reasons: [
        `my battery is critically low (${bat}%)`,
        `reducing actuator draw preserves sensor and radio telemetry`,
        `broadcasting my location to peer robots for support`,
      ],
      confidencePercent: 89,
    };
  }

  // 4. Searching / Exploring
  return {
    robotId: robot.id,
    statusText: 'Searching',
    taskText: `Explore ${targetSector}`,
    decisionHeadline: `“I am moving toward ${targetSector} because:`,
    reasons: [
      `this area has not yet been fully explored`,
      `my battery is healthy (${bat}%)`,
      nearbyPeer
        ? `robot ${nearbyPeer} is already covering ${currentSector}`
        : `maintaining distance from peer robots covers more ground faster`,
    ],
    confidencePercent: 87,
  };
}
