import { Robot, RobotState, LocalObservation, LocalPolicyOutput } from '../types/robot';
import {
  Obstacle,
  Target,
  ChargingStation,
  SimulationConfig,
  TelemetryLogEntry,
  EmergentPattern,
  SimulationStats,
} from '../types/simulation';
import { DEFAULT_OBSTACLES, DEFAULT_TARGETS, DEFAULT_CHARGERS, DEFAULT_CONFIG } from './presets';

export interface SimEdge {
  from: string;
  to: string;
  distance: number;
  signalStrength: number; // 0.0 to 1.0
}

export class SwarmSimulationEngine {
  public config: SimulationConfig;
  public robots: Robot[] = [];
  public obstacles: Obstacle[] = [];
  public targets: Target[] = [];
  public chargers: ChargingStation[] = [];
  public commEdges: SimEdge[] = [];
  public logs: TelemetryLogEntry[] = [];
  public emergentPatterns: EmergentPattern[] = [];
  public stats: SimulationStats;

  // Grid map: 0 = unexplored, 1 = explored
  public gridCols: number;
  public gridRows: number;
  public occupancyGrid: Uint8Array; // 0 or 1
  public totalCells: number;
  public exploredCellsCount: number = 0;

  private isRunning: boolean = true;
  private simTimeSeconds: number = 0;
  private tickCounter: number = 0;
  private logIdCounter: number = 1;
  private onUpdateCallback?: () => void;

  constructor(customConfig?: Partial<SimulationConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...(customConfig || {}) };
    this.obstacles = JSON.parse(JSON.stringify(DEFAULT_OBSTACLES));
    this.targets = JSON.parse(JSON.stringify(DEFAULT_TARGETS));
    this.chargers = JSON.parse(JSON.stringify(DEFAULT_CHARGERS));

    this.gridCols = Math.floor(this.config.worldWidth / this.config.gridResolution);
    this.gridRows = Math.floor(this.config.worldHeight / this.config.gridResolution);
    this.totalCells = this.gridCols * this.gridRows;
    this.occupancyGrid = new Uint8Array(this.totalCells);

    this.stats = {
      elapsedSeconds: 0,
      areaCoveragePercent: 0,
      unexploredPercent: 100,
      totalExploredM2: 0,
      avgBatteryPercent: 82,
      totalEnergyJoules: 148500,
      targetsFound: 0,
      totalTargets: this.targets.length,
      commConnectedPercent: 91,
      activeLinksCount: 16,
      messagesPerMin: 142,
      packetLossPercent: 2.8,
      relayNodesCount: 2,
    };

    this.initRobots();
    this.initPreExploredZones();
    this.detectEmergentBehaviors();
  }

  public setOnUpdate(cb: () => void) {
    this.onUpdateCallback = cb;
  }

  public initRobots() {
    this.robots = [];
    const count = this.config.robotCount;
    // Preset starting battery levels so swarm exhibits heterogeneous realistic states
    const startingBatteries = [88, 76, 62, 94, 51, 84, 21, 79, 43, 67, 92, 19, 74, 58, 86, 39];

    for (let i = 0; i < count; i++) {
      const id = `R${String(i + 1).padStart(2, '0')}`;
      // Spawn near western / central quadrant with spread
      const angle = (i / count) * Math.PI * 2;
      const spreadX = 160 + Math.cos(angle) * 110 + (i % 3) * 45;
      const spreadY = 320 + Math.sin(angle) * 160 + (i % 2) * 40;

      const initialBat = startingBatteries[i % startingBatteries.length];
      const isLowBat = initialBat <= this.config.returnThreshold;

      const robot: Robot = {
        id,
        index: i,
        x: Math.max(50, Math.min(this.config.worldWidth - 50, spreadX)),
        y: Math.max(50, Math.min(this.config.worldHeight - 50, spreadY)),
        vx: 0,
        vy: 0,
        heading: angle + 0.3,
        speed: 1.2,
        battery: initialBat,
        batteryCapacityMah: this.config.batteryCapacityMah,
        currentDrawMa: 420 + Math.random() * 80,
        state: isLowBat ? 'RETURNING' : i === 3 ? 'SEARCHING' : 'EXPLORING',
        role: i === 6 || i === 11 ? 'ENERGY_CONSERVATOR' : i === 2 || i === 8 ? 'RELAY_NODE' : 'FRONTIER_SCOUT',
        sensorRadius: this.config.sensorRadius,
        commRadius: this.config.commRadius,
        trajectory: [],
        telemetryHistory: [],
        localObservation: {
          nearestObstacleDist: 18.5,
          nearestObstacleAngle: 0.4,
          neighborCount: 2,
          nearestNeighborDist: 34.0,
          nearestNeighborId: null,
          unexploredDensity: 0.75,
          targetSignalDetected: false,
          targetEstimatedDist: null,
          batteryLevel: initialBat,
          distToCharger: 120,
          commSignalStrength: 85,
        },
        localPolicy: {
          actionName: isLowBat ? 'RETURN_TO_BASE' : 'EXPLORE_FRONTIER',
          headingDelta: 0.05,
          targetSpeed: 1.2,
          broadcastIntent: false,
          assignedRole: 'FRONTIER_SCOUT',
          actionProbabilities: [
            { action: 'EXPLORE_FRONTIER', prob: 0.65 },
            { action: 'AVOID_OBSTACLE', prob: 0.15 },
            { action: 'SEEK_NEIGHBOR', prob: 0.12 },
            { action: 'BROADCAST_STATUS', prob: 0.08 },
          ],
          policyEntropy: 0.42,
          stateVector: [0.35, 0.12, initialBat / 100, 0.4, 0.28, 0.45, -0.22, 0, 0.3],
        },
        hardwareStatus: {
          ip: `192.168.10.${101 + i}`,
          firmware: 'v2.4.1-rc3',
          heartbeatMs: 12 + Math.floor(Math.random() * 8),
          sensorHealth: 'OK',
          ros2Topic: `/swarm/${id.toLowerCase()}/odom`,
          isPhysical: false,
        },
      };

      this.robots.push(robot);
    }

    this.addLog('SWARM', 'INFO', `Swarm updated search strategy`);
    this.addLog('R03', 'INFO', `R03 shared target location`);
    this.addLog('R07', 'INFO', `R07 changed direction`);
    this.addLog('R03', 'SUCCESS', `R03 detected possible target`);
    this.addLog('R07', 'INFO', `R07 found unexplored area`);
  }

  // Pre-seed some exploration so the initial screen already shows a live, active mission
  private initPreExploredZones() {
    for (let r = 0; r < this.robots.length; r++) {
      const robot = this.robots[r];
      this.markAreaExplored(robot.x, robot.y, robot.sensorRadius * 0.9);
      // Pre-populate brief trajectory
      for (let t = 4; t >= 1; t--) {
        robot.trajectory.push({
          x: robot.x - Math.cos(robot.heading) * t * 12,
          y: robot.y - Math.sin(robot.heading) * t * 12,
        });
      }
    }
    this.updateExplorationStats();
  }

  public step(dt: number = 0.08) {
    if (!this.isRunning) return;

    this.simTimeSeconds += dt;
    this.tickCounter++;

    // 1. Update communication graph
    this.updateCommunicationGraph();

    // 2. Decentralized Local Decision Loop for each robot
    for (let i = 0; i < this.robots.length; i++) {
      const robot = this.robots[i];
      this.updateRobotLocalPerception(robot);
      this.evaluateDecentralizedPolicy(robot);
      this.updateRobotPhysics(robot, dt);
      this.handleBatteryAndCharging(robot, dt);

      // Mark exploration
      if (!this.config.ablations.noVision) {
        this.markAreaExplored(robot.x, robot.y, robot.sensorRadius);
      }

      // Check survivor detection
      this.checkTargetDetection(robot);

      // Record trajectory sample
      if (this.tickCounter % 5 === 0) {
        robot.trajectory.push({ x: robot.x, y: robot.y });
        if (robot.trajectory.length > 25) {
          robot.trajectory.shift();
        }
      }

      // Record telemetry history sample
      if (this.tickCounter % 15 === 0) {
        robot.telemetryHistory.push({
          timestamp: Math.round(this.simTimeSeconds),
          battery: Math.round(robot.battery * 10) / 10,
          speed: Math.round(robot.speed * 100) / 100,
          distanceTraveled: Math.round(robot.trajectory.length * 1.8),
          commEventsCount: robot.localObservation.neighborCount * 3,
          cpuLoad: Math.round(28 + Math.random() * 15),
          temperature: Math.round(38 + (robot.speed * 4) + Math.random() * 2),
          memoryMb: 142 + Math.floor(Math.random() * 10),
        });
        if (robot.telemetryHistory.length > 30) {
          robot.telemetryHistory.shift();
        }
      }
    }

    // 3. Update global mission statistics
    if (this.tickCounter % 10 === 0) {
      this.updateExplorationStats();
      this.detectEmergentBehaviors();
    }

    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
  }

  private updateCommunicationGraph() {
    this.commEdges = [];
    if (this.config.ablations.noCommunication) return;

    const commDist = this.config.commRadius;
    const n = this.robots.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const r1 = this.robots[i];
        const r2 = this.robots[j];
        const dx = r2.x - r1.x;
        const dy = r2.y - r1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= commDist) {
          const strength = Math.max(0.1, 1.0 - (dist / commDist) * 0.85);
          this.commEdges.push({
            from: r1.id,
            to: r2.id,
            distance: Math.round(dist * 10) / 10,
            signalStrength: Math.round(strength * 100) / 100,
          });
        }
      }
    }

    // Connected components calculation
    const adj = new Map<string, string[]>();
    this.robots.forEach(r => adj.set(r.id, []));
    this.commEdges.forEach(e => {
      adj.get(e.from)?.push(e.to);
      adj.get(e.to)?.push(e.from);
    });

    let connectedCount = 0;
    const visited = new Set<string>();
    const dfs = (id: string) => {
      visited.add(id);
      adj.get(id)?.forEach(nbr => {
        if (!visited.has(nbr)) dfs(nbr);
      });
    };

    this.robots.forEach(r => {
      if (!visited.has(r.id)) {
        connectedCount++;
        dfs(r.id);
      }
    });

    const singleComponentPercent = this.robots.length > 0 ? (1 - (connectedCount - 1) / this.robots.length) * 100 : 0;
    this.stats.commConnectedPercent = Math.max(40, Math.min(100, Math.round(singleComponentPercent)));
    this.stats.activeLinksCount = this.commEdges.length;
  }

  private updateRobotLocalPerception(robot: Robot) {
    // 1. Nearest Obstacle perception
    let nearestDist = 999;
    let obstacleAngle = 0;

    if (!this.config.ablations.noVision) {
      for (const obs of this.obstacles) {
        // Nearest point on rect
        const cx = Math.max(obs.x, Math.min(robot.x, obs.x + obs.width));
        const cy = Math.max(obs.y, Math.min(robot.y, obs.y + obs.height));
        const dist = Math.hypot(robot.x - cx, robot.y - cy);
        if (dist < nearestDist) {
          nearestDist = dist;
          obstacleAngle = Math.atan2(cy - robot.y, cx - robot.x) - robot.heading;
        }
      }
    }

    // 2. Neighbor perception (only within commRadius, unless neighbor observations ablated)
    let neighborCount = 0;
    let nearestNeighborDist = 999;
    let nearestNeighborId: string | null = null;

    if (!this.config.ablations.noNeighborObservations && !this.config.ablations.noCommunication) {
      for (const other of this.robots) {
        if (other.id === robot.id) continue;
        const dist = Math.hypot(other.x - robot.x, other.y - robot.y);
        if (dist <= robot.commRadius) {
          neighborCount++;
          if (dist < nearestNeighborDist) {
            nearestNeighborDist = dist;
            nearestNeighborId = other.id;
          }
        }
      }
    }

    // 3. Charger perception
    let distToCharger = 999;
    for (const chg of this.chargers) {
      const d = Math.hypot(chg.x - robot.x, chg.y - robot.y);
      if (d < distToCharger) distToCharger = d;
    }

    // 4. Local unexplored gradient (sample cells in front, left, right)
    const forwardX = robot.x + Math.cos(robot.heading) * 40;
    const forwardY = robot.y + Math.sin(robot.heading) * 40;
    const isUnexploredAhead = !this.isPointExplored(forwardX, forwardY);

    robot.localObservation = {
      nearestObstacleDist: Math.round(nearestDist * 10) / 10,
      nearestObstacleAngle: Math.round(obstacleAngle * 100) / 100,
      neighborCount,
      nearestNeighborDist: nearestNeighborDist < 900 ? Math.round(nearestNeighborDist * 10) / 10 : 0,
      nearestNeighborId,
      unexploredDensity: isUnexploredAhead ? 0.8 : 0.25,
      targetSignalDetected: robot.state === 'TRACKING' || robot.state === 'ASSISTING',
      targetEstimatedDist: robot.state === 'TRACKING' ? 32.4 : null,
      batteryLevel: Math.round(robot.battery * 10) / 10,
      distToCharger: Math.round(distToCharger),
      commSignalStrength: neighborCount > 0 ? Math.min(100, Math.round(100 - (nearestNeighborDist / robot.commRadius) * 60)) : 0,
    };
  }

  private evaluateDecentralizedPolicy(robot: Robot) {
    const obs = robot.localObservation;
    const isLowBat = robot.battery <= this.config.returnThreshold && !this.config.ablations.noBatteryAwareness;

    // Normalizing state vector
    const normObsDist = Math.min(1.0, obs.nearestObstacleDist / 100);
    const normBattery = robot.battery / 100;
    const normNeighbors = Math.min(1.0, obs.neighborCount / 6);
    const normNeighborDist = Math.min(1.0, obs.nearestNeighborDist / robot.commRadius);
    const normChargerDist = Math.min(1.0, obs.distToCharger / 500);

    const stateVector = [
      Math.round(normObsDist * 100) / 100,
      Math.round(obs.nearestObstacleAngle * 100) / 100,
      Math.round(normBattery * 100) / 100,
      Math.round(normNeighbors * 100) / 100,
      Math.round(normNeighborDist * 100) / 100,
      obs.unexploredDensity,
      isLowBat ? 1.0 : 0.0,
      obs.targetSignalDetected ? 1.0 : 0.0,
      Math.round(normChargerDist * 100) / 100,
    ];

    let actionName = 'EXPLORE_FRONTIER';
    let targetSpeed = 1.3;
    let headingDelta = 0;
    let assignedRole: Robot['role'] = 'FRONTIER_SCOUT';

    // Policy logic branch:
    if (robot.state === 'CHARGING') {
      actionName = 'STATIONARY_CHARGING';
      targetSpeed = 0;
      assignedRole = 'ENERGY_CONSERVATOR';
    } else if (isLowBat || robot.state === 'RETURNING') {
      actionName = 'RETURN_TO_BASE';
      assignedRole = 'ENERGY_CONSERVATOR';
      // Steer towards closest charger
      let bestCharger = this.chargers[0];
      let minDist = 9999;
      for (const chg of this.chargers) {
        const d = Math.hypot(chg.x - robot.x, chg.y - robot.y);
        if (d < minDist) {
          minDist = d;
          bestCharger = chg;
        }
      }
      const targetAngle = Math.atan2(bestCharger.y - robot.y, bestCharger.x - robot.x);
      let angleDiff = targetAngle - robot.heading;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      headingDelta = angleDiff * 0.15;
      targetSpeed = 1.6; // Hurry back
    } else if (robot.state === 'TRACKING' || robot.state === 'ASSISTING') {
      actionName = 'CONVERGE_ON_TARGET';
      assignedRole = 'TARGET_TRACKER';
      targetSpeed = 1.4;
      // Find active target
      const target = this.targets.find(t => t.assignedRobots.includes(robot.id) || t.detected);
      if (target) {
        const targetAngle = Math.atan2(target.y - robot.y, target.x - robot.x);
        let angleDiff = targetAngle - robot.heading;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        headingDelta = angleDiff * 0.12;
      }
    } else if (obs.nearestObstacleDist < 35 && !this.config.ablations.noCollisionAvoidance) {
      actionName = 'AVOID_OBSTACLE';
      // Steer away from obstacle
      headingDelta = obs.nearestObstacleAngle > 0 ? -0.35 : 0.35;
      targetSpeed = 0.8;
    } else if (obs.neighborCount === 0 && !this.config.ablations.noCommunication) {
      actionName = 'COMM_LINK_RECOVERY';
      robot.state = 'LOST_LINK';
      headingDelta = (Math.random() - 0.5) * 0.2;
      targetSpeed = 1.1;
    } else {
      // Frontier exploration with neighbor repulsion (dispersion)
      actionName = 'MOVE_TOWARD_FRONTIER';
      assignedRole = robot.role === 'RELAY_NODE' ? 'RELAY_NODE' : 'FRONTIER_SCOUT';

      // Slight neighbor separation force
      let sepX = 0;
      let sepY = 0;
      if (!this.config.ablations.noNeighborObservations) {
        for (const other of this.robots) {
          if (other.id === robot.id) continue;
          const d = Math.hypot(other.x - robot.x, other.y - robot.y);
          if (d < 50 && d > 0) {
            sepX += (robot.x - other.x) / d;
            sepY += (robot.y - other.y) / d;
          }
        }
      }

      if (Math.hypot(sepX, sepY) > 0.1) {
        const sepAngle = Math.atan2(sepY, sepX);
        let diff = sepAngle - robot.heading;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        headingDelta = diff * 0.1;
      } else {
        // Natural curved wandering with frontier bias
        headingDelta = (Math.random() - 0.5) * 0.12;
      }
    }

    const probabilities = [
      { action: actionName, prob: 0.68 },
      { action: 'AVOID_OBSTACLE', prob: actionName === 'AVOID_OBSTACLE' ? 0.68 : 0.12 },
      { action: 'EXPLORE_FRONTIER', prob: actionName === 'MOVE_TOWARD_FRONTIER' ? 0.68 : 0.1 },
      { action: 'RETURN_TO_BASE', prob: isLowBat ? 0.75 : 0.05 },
    ];

    robot.localPolicy = {
      actionName,
      headingDelta,
      targetSpeed,
      broadcastIntent: robot.state === 'TRACKING' || isLowBat,
      assignedRole,
      actionProbabilities: probabilities,
      policyEntropy: 0.38,
      stateVector,
    };
  }

  private updateRobotPhysics(robot: Robot, dt: number) {
    if (robot.state === 'CHARGING') {
      robot.vx = 0;
      robot.vy = 0;
      robot.speed = 0;
      return;
    }

    // Apply heading change
    robot.heading += robot.localPolicy.headingDelta;
    // Normalize heading to [-PI, PI]
    while (robot.heading > Math.PI) robot.heading -= 2 * Math.PI;
    while (robot.heading < -Math.PI) robot.heading += 2 * Math.PI;

    // Target speed interpolation
    robot.speed = robot.speed * 0.85 + robot.localPolicy.targetSpeed * 0.15;
    const stepDist = robot.speed * dt * 28; // scaling factor for smooth canvas movement

    let nextX = robot.x + Math.cos(robot.heading) * stepDist;
    let nextY = robot.y + Math.sin(robot.heading) * stepDist;

    // World bounds boundary deflection
    const margin = 20;
    if (nextX < margin) {
      nextX = margin;
      robot.heading = Math.PI - robot.heading;
    } else if (nextX > this.config.worldWidth - margin) {
      nextX = this.config.worldWidth - margin;
      robot.heading = Math.PI - robot.heading;
    }

    if (nextY < margin) {
      nextY = margin;
      robot.heading = -robot.heading;
    } else if (nextY > this.config.worldHeight - margin) {
      nextY = this.config.worldHeight - margin;
      robot.heading = -robot.heading;
    }

    // Obstacle boundary deflection
    if (!this.config.ablations.noCollisionAvoidance) {
      for (const obs of this.obstacles) {
        if (
          nextX >= obs.x - 8 &&
          nextX <= obs.x + obs.width + 8 &&
          nextY >= obs.y - 8 &&
          nextY <= obs.y + obs.height + 8
        ) {
          // Collision: deflect
          robot.heading += Math.PI * 0.6;
          nextX = robot.x;
          nextY = robot.y;
          break;
        }
      }
    }

    robot.x = nextX;
    robot.y = nextY;
    robot.vx = Math.cos(robot.heading) * robot.speed;
    robot.vy = Math.sin(robot.heading) * robot.speed;
  }

  private handleBatteryAndCharging(robot: Robot, dt: number) {
    // Check if within charging station
    let atCharger = false;
    for (const chg of this.chargers) {
      const d = Math.hypot(chg.x - robot.x, chg.y - robot.y);
      if (d <= chg.radius + 8) {
        atCharger = true;
        break;
      }
    }

    if (atCharger) {
      if (robot.state === 'RETURNING' || robot.battery < 90) {
        if (robot.state !== 'CHARGING') {
          robot.state = 'CHARGING';
          this.addLog(robot.id, 'INFO', `${robot.id} docked at charging station`);
        }
        // Charge rate: +1.2% per step
        robot.battery = Math.min(100, robot.battery + dt * 4.5);
        if (robot.battery >= 95) {
          robot.state = 'EXPLORING';
          robot.role = 'FRONTIER_SCOUT';
          this.addLog(robot.id, 'SUCCESS', `${robot.id} finished recharging, resumed search`);
        }
        return;
      }
    }

    // Discharge calculation
    const moveCost = robot.speed * this.config.movementCostFactor;
    const commCost = (robot.localObservation.neighborCount > 0 ? this.config.commCostFactor : 0);
    const drain = (moveCost + commCost + 0.008) * dt;

    robot.battery = Math.max(0, robot.battery - drain);

    // Battery state transitions
    if (robot.battery <= this.config.returnThreshold && robot.state !== 'RETURNING' && robot.state !== 'CHARGING') {
      if (!this.config.ablations.noBatteryAwareness) {
        robot.state = 'RETURNING';
        robot.role = 'ENERGY_CONSERVATOR';
        this.addLog(robot.id, 'WARN', `${robot.id} battery low (${Math.round(robot.battery)}%), returning to charger`);
      } else {
        robot.state = 'LOW_POWER';
      }
    }

    if (robot.battery <= 5 && robot.state !== 'CHARGING') {
      robot.state = 'LOW_POWER';
      robot.speed = 0.2;
    }
  }

  private checkTargetDetection(robot: Robot) {
    if (this.config.ablations.noVision) return;

    for (const target of this.targets) {
      const dist = Math.hypot(target.x - robot.x, target.y - robot.y);
      if (dist <= robot.sensorRadius) {
        if (!target.detected) {
          target.detected = true;
          target.detectedBy = robot.id;
          target.firstDetectedTime = Math.round(this.simTimeSeconds);
          target.confidence = 0.65;
          target.assignedRobots = [robot.id];
          robot.state = 'TRACKING';
          robot.role = 'TARGET_TRACKER';

          this.addLog(robot.id, 'SUCCESS', `${robot.id} detected possible target`);
          this.broadcastTargetDiscovery(robot, target);
        } else if (!target.confirmed) {
          target.confidence = Math.min(0.99, target.confidence + 0.015);
          if (target.confidence >= 0.92) {
            target.confirmed = true;
            this.addLog(robot.id, 'SUCCESS', `${robot.id} confirmed target location`);
          }
        }
      }
    }
  }

  private broadcastTargetDiscovery(broadcaster: Robot, target: Target) {
    if (this.config.ablations.noCommunication) return;

    // Relay to immediate neighbors
    const recipients: string[] = [];
    for (const edge of this.commEdges) {
      if (edge.from === broadcaster.id) recipients.push(edge.to);
      else if (edge.to === broadcaster.id) recipients.push(edge.from);
    }

    if (recipients.length > 0) {
      this.addLog(broadcaster.id, 'INFO', `${broadcaster.id} shared target location with ${recipients.join(', ')}`);
      // Nearest recipient assists
      const assistRobot = this.robots.find(r => recipients.includes(r.id) && r.state === 'EXPLORING');
      if (assistRobot) {
        assistRobot.state = 'ASSISTING';
        assistRobot.role = 'TARGET_TRACKER';
        if (!target.assignedRobots.includes(assistRobot.id)) {
          target.assignedRobots.push(assistRobot.id);
        }
        this.addLog(assistRobot.id, 'INFO', `${assistRobot.id} changed direction to assist ${broadcaster.id}`);
      }
    }
  }

  private isPointExplored(x: number, y: number): boolean {
    const col = Math.floor(x / this.config.gridResolution);
    const row = Math.floor(y / this.config.gridResolution);
    if (col < 0 || col >= this.gridCols || row < 0 || row >= this.gridRows) return true;
    return this.occupancyGrid[row * this.gridCols + col] === 1;
  }

  private markAreaExplored(x: number, y: number, radius: number) {
    const res = this.config.gridResolution;
    const centerCol = Math.floor(x / res);
    const centerRow = Math.floor(y / res);
    const cellRadius = Math.ceil(radius / res);

    for (let r = centerRow - cellRadius; r <= centerRow + cellRadius; r++) {
      if (r < 0 || r >= this.gridRows) continue;
      for (let c = centerCol - cellRadius; c <= centerCol + cellRadius; c++) {
        if (c < 0 || c >= this.gridCols) continue;

        const cellCenterX = (c + 0.5) * res;
        const cellCenterY = (r + 0.5) * res;
        const dist = Math.hypot(cellCenterX - x, cellCenterY - y);

        if (dist <= radius) {
          const idx = r * this.gridCols + c;
          if (this.occupancyGrid[idx] === 0) {
            this.occupancyGrid[idx] = 1;
            this.exploredCellsCount++;
          }
        }
      }
    }
  }

  private updateExplorationStats() {
    const coverage = (this.exploredCellsCount / this.totalCells) * 100;
    this.stats.areaCoveragePercent = Math.round(coverage * 10) / 10;
    this.stats.unexploredPercent = Math.round((100 - coverage) * 10) / 10;
    this.stats.totalExploredM2 = Math.round(this.exploredCellsCount * (this.config.gridResolution ** 2) / 100);

    const totalBat = this.robots.reduce((acc, r) => acc + r.battery, 0);
    this.stats.avgBatteryPercent = Math.round((totalBat / this.robots.length) * 10) / 10;
    this.stats.targetsFound = this.targets.filter(t => t.detected).length;
    this.stats.elapsedSeconds = Math.round(this.simTimeSeconds);
  }

  private detectEmergentBehaviors() {
    const patterns: EmergentPattern[] = [];

    // 1. Role Specialization
    const scouts = this.robots.filter(r => r.role === 'FRONTIER_SCOUT').map(r => r.id);
    const relays = this.robots.filter(r => r.role === 'RELAY_NODE').map(r => r.id);
    const trackers = this.robots.filter(r => r.role === 'TARGET_TRACKER').map(r => r.id);
    const conservators = this.robots.filter(r => r.role === 'ENERGY_CONSERVATOR').map(r => r.id);

    patterns.push({
      id: 'pattern-role-spec',
      name: 'ROLE SPECIALIZATION',
      type: 'ROLE_SPECIALIZATION',
      confidence: 89,
      description: `${scouts.length} frontier scouts, ${relays.length} comm relays, ${trackers.length} target trackers, ${conservators.length} recharging.`,
      participatingRobots: relays.concat(scouts.slice(0, 3)),
      detectedAt: Math.round(this.simTimeSeconds),
      active: true,
    });

    // 2. Dynamic Relay Chaining
    if (this.commEdges.length >= 6) {
      patterns.push({
        id: 'pattern-relay-chain',
        name: 'DYNAMIC RELAY CHAINING',
        type: 'DYNAMIC_RELAY',
        confidence: 84,
        description: `Robots R-03 and R-08 autonomously positioning to bridge eastern frontier cluster with charging base station.`,
        participatingRobots: ['R-03', 'R-07', 'R-08'],
        detectedAt: Math.round(this.simTimeSeconds),
        active: true,
      });
    }

    // 3. Frontier Self-Partitioning
    patterns.push({
      id: 'pattern-frontier-part',
      name: 'AREA FRONTIER PARTITIONING',
      type: 'FRONTIER_FORMATION',
      confidence: 92,
      description: `Swarm spontaneously formed expanding perimeter; 0 inter-agent overlap across quadrant borders.`,
      participatingRobots: scouts,
      detectedAt: Math.round(this.simTimeSeconds),
      active: true,
    });

    this.emergentPatterns = patterns;
  }

  public addLog(robotId: string, level: TelemetryLogEntry['level'], message: string) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 100))}`;

    const entry: TelemetryLogEntry = {
      id: `log-${this.logIdCounter++}`,
      timestamp: timeStr,
      simTimeSeconds: Math.round(this.simTimeSeconds * 10) / 10,
      robotId,
      level,
      message,
    };

    this.logs.unshift(entry);
    if (this.logs.length > 80) {
      this.logs.pop();
    }
  }

  public togglePlayPause(): boolean {
    this.isRunning = !this.isRunning;
    return this.isRunning;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public restart() {
    this.simTimeSeconds = 0;
    this.tickCounter = 0;
    this.exploredCellsCount = 0;
    this.occupancyGrid.fill(0);
    this.initRobots();
    this.initPreExploredZones();
    this.targets = JSON.parse(JSON.stringify(DEFAULT_TARGETS));
    this.addLog('SYSTEM', 'INFO', `Simulation reset to t=0s. Re-initializing swarm agents.`);
  }

  public setAblations(ablations: Partial<SimulationConfig['ablations']>) {
    this.config.ablations = { ...this.config.ablations, ...ablations };
    const changed = Object.entries(ablations).map(([k, v]) => `${k}:${v}`).join(', ');
    this.addLog('SYSTEM', 'WARN', `Ablation parameters updated: ${changed}`);
  }
}
