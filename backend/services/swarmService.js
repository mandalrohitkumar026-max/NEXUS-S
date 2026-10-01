export class SwarmService {
    isRunning = true;
    config = {
        worldWidth: 960,
        worldHeight: 640,
        robotCount: 12,
        commRadius: 140,
        sensorRadius: 75,
        returnThreshold: 22,
        maxSpeed: 2.2,
    };
    robots = [];
    targets = [];
    obstacles = [];
    chargers = [];
    commEdges = [];
    logs = [];
    stats = {
        elapsedSeconds: 28,
        totalExploredM2: 204800,
        areaCoveragePercent: 33.3,
        targetsFound: 1,
        totalTargets: 3,
        avgBatteryPercent: 79,
        commConnectedPercent: 96,
        activeRobotCount: 12,
        messagesPerMin: 142,
        packetLossPercent: 2.8,
    };
    simulationInterval = null;
    onUpdateCallback = null;
    constructor() {
        this.initializeEnvironment();
        this.startLoop();
    }
    initializeEnvironment() {
        // 12 Deployed Robots
        const roles = ['SCOUT', 'FRONTIER_SEARCH', 'RELAY_NODE', 'AREA_SWEEP'];
        for (let i = 1; i <= 12; i++) {
            const id = `R${String(i).padStart(2, '0')}`;
            const angle = ((i - 1) / 12) * Math.PI * 2;
            const dist = 120 + (i % 3) * 60;
            const x = Math.max(60, Math.min(900, 480 + Math.cos(angle) * dist));
            const y = Math.max(60, Math.min(580, 320 + Math.sin(angle) * dist));
            this.robots.push({
                id,
                x,
                y,
                heading: angle + Math.PI / 2,
                speed: 1.6 + (i % 4) * 0.2,
                battery: Math.max(30, 92 - (i * 2.5)),
                state: i === 4 ? 'CHARGING' : i === 12 ? 'RETURNING' : 'EXPLORING',
                role: roles[(i - 1) % roles.length],
                commRadius: this.config.commRadius,
                sensorRadius: this.config.sensorRadius,
                localObservation: {
                    visibleTargetIds: [],
                    neighborCount: 2,
                    nearestNeighborDist: 45,
                    nearestDockDist: 180,
                    inCommRange: true,
                },
                localPolicy: {
                    actionName: 'FRONTIER_DISPERSION',
                    utilityScore: 0.88,
                    activeGoal: 'Explore Sector B',
                },
            });
        }
        // Targets
        this.targets = [
            { id: 'TGT-ALPHA', x: 280, y: 190, type: 'survivor', detected: true, confirmed: true, detectedBy: 'R03', confidence: 0.94 },
            { id: 'TGT-BETA', x: 740, y: 220, type: 'survivor', detected: true, confirmed: false, detectedBy: 'R07', confidence: 0.72 },
            { id: 'TGT-GAMMA', x: 620, y: 480, type: 'beacon', detected: false, confirmed: false, confidence: 0 },
        ];
        // Charging Stations
        this.chargers = [
            { id: 'CHG-WEST', x: 140, y: 320, radius: 45 },
            { id: 'CHG-EAST', x: 820, y: 320, radius: 45 },
        ];
        // Obstacles
        this.obstacles = [
            { id: 'OBS-1', x: 380, y: 140, width: 80, height: 160, label: 'STRUCTURE_A' },
            { id: 'OBS-2', x: 500, y: 360, width: 100, height: 140, label: 'STRUCTURE_B' },
            { id: 'OBS-3', x: 220, y: 420, width: 120, height: 70, label: 'RUBBLE_ZONE' },
        ];
        // Initial Logs
        this.logs = [
            { id: '1', timestamp: '00:00:28', robotId: 'SYSTEM', level: 'INFO', message: 'Swarm autonomous decentralized loop running at 60Hz' },
            { id: '2', timestamp: '00:00:26', robotId: 'R03', level: 'SUCCESS', message: 'Localized survivor beacon at Sector A (TGT-ALPHA)' },
            { id: '3', timestamp: '00:00:24', robotId: 'R12', level: 'WARN', message: 'Engaged automatic dock return trajectory at 22% battery' },
            { id: '4', timestamp: '00:00:22', robotId: 'R07', level: 'INFO', message: 'Redistributed search direction into Sector B' },
        ];
        this.computeCommEdges();
    }
    computeCommEdges() {
        this.commEdges = [];
        const rComm = this.config.commRadius;
        for (let i = 0; i < this.robots.length; i++) {
            let neighbors = 0;
            for (let j = i + 1; j < this.robots.length; j++) {
                const r1 = this.robots[i];
                const r2 = this.robots[j];
                const dist = Math.hypot(r1.x - r2.x, r1.y - r2.y);
                if (dist <= rComm) {
                    neighbors++;
                    const signal = Math.max(0.1, 1 - (dist / rComm) ** 2);
                    this.commEdges.push({
                        from: r1.id,
                        to: r2.id,
                        distance: Math.round(dist),
                        signalStrength: signal,
                    });
                }
            }
            this.robots[i].localObservation.neighborCount = neighbors;
            this.robots[i].localObservation.inCommRange = neighbors > 0;
        }
        const connectedNodes = new Set();
        this.commEdges.forEach(e => {
            connectedNodes.add(e.from);
            connectedNodes.add(e.to);
        });
        this.stats.commConnectedPercent = Math.round((connectedNodes.size / Math.max(1, this.robots.length)) * 100);
    }
    startLoop() {
        this.simulationInterval = setInterval(() => {
            if (!this.isRunning)
                return;
            this.step(0.1);
        }, 100);
    }
    step(dt) {
        this.stats.elapsedSeconds += dt;
        // Advance robots slightly
        for (const r of this.robots) {
            if (r.state === 'CHARGING') {
                r.battery = Math.min(100, r.battery + 0.3);
                if (r.battery >= 95)
                    r.state = 'EXPLORING';
                continue;
            }
            // Battery drain
            r.battery = Math.max(5, r.battery - 0.02);
            if (r.battery <= this.config.returnThreshold && r.state !== 'RETURNING') {
                r.state = 'RETURNING';
            }
            // Motion
            const vx = Math.cos(r.heading) * r.speed * 2;
            const vy = Math.sin(r.heading) * r.speed * 2;
            r.x += vx * dt;
            r.y += vy * dt;
            // Arena boundaries bounce
            if (r.x < 50 || r.x > this.config.worldWidth - 50) {
                r.heading = Math.PI - r.heading;
            }
            if (r.y < 50 || r.y > this.config.worldHeight - 50) {
                r.heading = -r.heading;
            }
            // Clamp coordinates
            r.x = Math.max(50, Math.min(this.config.worldWidth - 50, r.x));
            r.y = Math.max(50, Math.min(this.config.worldHeight - 50, r.y));
        }
        this.computeCommEdges();
        // Update fleet metrics
        const avgBat = this.robots.reduce((sum, r) => sum + r.battery, 0) / this.robots.length;
        this.stats.avgBatteryPercent = Math.round(avgBat);
        this.stats.areaCoveragePercent = Math.min(100, 33.3 + (this.stats.elapsedSeconds * 0.04));
        if (this.onUpdateCallback) {
            this.onUpdateCallback(this.getStateSnapshot());
        }
    }
    setOnUpdate(cb) {
        this.onUpdateCallback = cb;
    }
    getStateSnapshot() {
        return {
            isRunning: this.isRunning,
            stats: {
                ...this.stats,
                elapsedSeconds: Math.floor(this.stats.elapsedSeconds),
                areaCoveragePercent: Math.round(this.stats.areaCoveragePercent),
            },
            robots: this.robots,
            targets: this.targets,
            chargers: this.chargers,
            obstacles: this.obstacles,
            commEdges: this.commEdges,
            logs: this.logs,
            config: this.config,
        };
    }
    getRobots() {
        return this.robots;
    }
    getRobotById(id) {
        return this.robots.find(r => r.id.toLowerCase() === id.toLowerCase());
    }
    getTargets() {
        return this.targets;
    }
    getLogs() {
        return this.logs;
    }
    togglePlayPause() {
        this.isRunning = !this.isRunning;
        return this.isRunning;
    }
    setRunning(run) {
        this.isRunning = run;
    }
    reset() {
        this.robots = [];
        this.stats.elapsedSeconds = 0;
        this.stats.areaCoveragePercent = 10;
        this.stats.targetsFound = 0;
        this.initializeEnvironment();
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.robots.forEach(r => {
            if (newConfig.commRadius)
                r.commRadius = newConfig.commRadius;
        });
        this.computeCommEdges();
    }
}
export const swarmService = new SwarmService();
