# NEXUS-S — Decentralized Swarm Intelligence Platform

A robotics operations console and decentralized swarm simulation platform for coordinating autonomous multi-agent systems.

TypeScript · React · Node.js · WebSocket

[Quick Start](#quick-start) · [Architecture](#architecture) · [Research Principles](#research-principles) · [API Reference](#api-reference) · [Design System](#design-system)

---

## Overview

NEXUS-S is a decentralized swarm robotics platform designed to simulate, coordinate, and monitor autonomous robot teams operating in dynamic environments.

The platform coordinates a fleet of 10–20 autonomous ground robots performing complex collective missions (such as search & rescue, unknown-area exploration, survivor localization, and communication relaying) in GPS-denied and communication-constrained spaces without any central controller or single point of failure.

### Core Philosophy
> *"No central controller. Each robot makes local decisions based on its observations, neighboring robots, battery state, mission objective, and limited communication."*

Unlike conventional centralized robotics platforms where a master server dictates waypoints to every agent:
- **Resilient to radio disconnections:** If an agent leaves communication range, it continues exploring independently using local neural policies.
- **Peer-to-peer gossip protocol:** When an agent discovers a survivor beacon or obstacle, it propagates coordinates to adjacent 1-hop neighbors.
- **Autonomous energy stewardship:** When battery levels drop below safe margins (22%), agents independently route themselves to inductive docks for charging, while adjacent peers redistribute to cover the vacated sector.

---

## Research Principles

NEXUS-S implements established multi-agent robotics coordination algorithms:

```
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  Robot Observation   │ ───► │    Local Decision    │ ───► │  Peer Communication  │ ───► │    Swarm Behavior    │
│  Sensors (R = 75m)   │      │ Neural Policy / POMDP│      │ 1-Hop Mesh Gossip    │      │ Emergent Dispersion  │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

### 1. Dec-POMDP (Decentralized Partially Observable Markov Decision Process)
Each robot calculates local action utility values at 60Hz across discrete actions:
- `FRONTIER_DISPERSION`: Maximizes unexplored boundary gradient while avoiding clustered areas.
- `TARGET_INSPECTION`: Transitions into high-confidence orbit upon detecting an unverified beacon.
- `RELAY_POSITIONING`: Maintains mesh connectivity across RF-shadowed rubble zones.
- `DOCK_RETURN`: Returns to inductive base station when energy reserves reach threshold.
- `AVOID_COLLISION`: Repels from nearby static structures and peer agents.

### 2. Ad-Hoc 802.11s Communication Mesh
Radio propagation models distance-based signal attenuation:
$$\text{Signal Strength} = \max\left(0, 1 - \left(\frac{d}{R_{\text{comm}}}\right)^2\right)$$
Where $R_{\text{comm}}$ represents the maximum line-of-sight communication horizon (default: 140m). Scouts pushing beyond coverage limits trigger intermediate robots to spontaneously establish relay bridges.

### 3. Energy Hysteresis & Rolling Recharging
- **Return Threshold:** 22% SOC triggers return-to-dock routing.
- **Charge Target:** 95% SOC triggers release back into active exploration perimeter.
- **Rolling Coverage:** The swarm operates 24/7 without mission stalls by cycling units through charging docks in continuous shifts.

### 4. Explainable Swarm AI (XAI)
The platform translates complex mathematical state vectors into plain-English reasoning:
- *"R07 is moving to Sector B because Sector B is unexplored, R07 has 82% battery, and nearby agents already cover Sector A."*

---

## Architecture

NEXUS-S is organized as a clean **two-tier monorepo architecture**:

```
NEXUS-S/
├── frontend/                        # Modern Light Operations Dashboard (React 19 + Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── shell/               # Sidebar.tsx, TopCommandBar.tsx
│   │   │   ├── operations/          # LiveOperationsView, TacticalSwarmMap,
│   │   │   │                        # SwarmIntelligencePanel, LiveEventStream,
│   │   │   │                        # MissionProgressSection, HowNexusThinksModal
│   │   │   ├── pages/               # RobotsPage, TargetsPage, AnalyticsPage,
│   │   │   │                        # MissionOverviewPage, MissionHistoryPage
│   │   │   ├── swarm/               # SwarmView (Fleet grid & table views)
│   │   │   └── communications/      # CommunicationsView (Ad-hoc RF graph)
│   │   ├── simulation/              # Client-side 60Hz engine & XAI translator
│   │   ├── types/                   # Robot, Target, and Telemetry TypeScript contracts
│   │   ├── App.tsx                  # Root application coordinator
│   │   ├── index.css                # Centralized Modern Light Design System
│   │   └── main.tsx                 # React entry point
│   ├── public/                      # Static branding assets
│   ├── index.html                   # HTML entry (Light theme)
│   ├── package.json                 # Frontend dependencies (React, Lucide, TailwindCSS)
│   ├── vite.config.ts               # Vite configuration with API & WebSocket proxy
│   └── tailwind.config.js           # Design system configuration
│
├── backend/                         # Dedicated Swarm Server (Node.js + Express + WebSocket)
│   ├── src/
│   │   ├── server.ts                # Express server + WebSocket broadcast on port 4000
│   │   ├── routes/
│   │   │   ├── swarm.routes.ts      # /api/swarm (state, config, mission controls)
│   │   │   ├── robots.routes.ts     # /api/robots (individual & fleet telemetry)
│   │   │   ├── targets.routes.ts    # /api/targets (survivor localization coordinates)
│   │   │   └── history.routes.ts    # /api/history (archived benchmark trials)
│   │   ├── services/
│   │   │   └── swarmService.ts      # Server-side swarm coordination & mesh evaluator
│   │   └── types/                   # Shared telemetry & state contracts
│   ├── package.json                 # Backend dependencies (express, ws, cors, tsx)
│   └── tsconfig.json                # TypeScript NodeNext configuration
│
├── package.json                     # Monorepo root workspace orchestrator (concurrently)
└── README.md                        # Documentation & setup guide
```

---

## Quick Start

### Prerequisites
- **Node.js**: `v20.0.0` or higher (`v24.x` recommended)
- **npm**: `v10.0.0` or higher

### 1. Installation
```bash
git clone https://github.com/your-username/NEXUS-S.git
cd NEXUS-S

# Install root dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install

# Install backend dependencies
npm --prefix backend install
```

### 2. Start Both Tiers Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173/](http://localhost:5173/)
- **Backend REST API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **WebSocket Stream:** `ws://localhost:4000/ws`

### 3. Run Individual Services
- **Frontend only:**
  ```bash
  npm run dev:frontend
  ```
- **Backend only:**
  ```bash
  npm run dev:backend
  ```

### 4. Build for Production
```bash
npm run build
```

---

## API Reference

### Base URL: `http://localhost:4000`

### REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health status and online agent count |
| `GET` | `/api/swarm/state` | Complete state snapshot (robots, targets, commEdges, stats) |
| `POST` | `/api/swarm/control` | Control commands: `{ "action": "play" \| "pause" \| "toggle" \| "reset" }` |
| `POST` | `/api/swarm/config` | Update parameters: `{ "commRadius": 160, "returnThreshold": 25 }` |
| `GET` | `/api/robots` | Telemetry for all 12 autonomous robots |
| `GET` | `/api/robots/:id` | Detailed telemetry & local decision state for specific robot |
| `GET` | `/api/targets` | List detected targets and localization confidence scores |
| `GET` | `/api/history` | Historical mission trial archives and scientific takeaways |

#### Example: Health Check
```bash
curl http://localhost:4000/api/health
```
**Response (200 OK):**
```json
{
  "status": "ok",
  "platform": "NEXUS-S Decentralized Swarm Intelligence Lab",
  "version": "2.4.2",
  "timestamp": "2026-09-06T05:32:09.625Z",
  "agentsOnline": 12
}
```

#### Example: Mission Control
```bash
curl -X POST http://localhost:4000/api/swarm/control \
  -H "Content-Type: application/json" \
  -d '{"action": "play"}'
```
**Response (200 OK):**
```json
{
  "success": true,
  "isRunning": true
}
```

### WebSocket Streaming: `ws://localhost:4000/ws`

The WebSocket connection delivers bi-directional live telemetry streams without client polling:

```json
// Server broadcast on connection
{
  "type": "INIT_STATE",
  "payload": { /* Full Swarm Snapshot */ }
}

// 10Hz Real-Time Telemetry Tick
{
  "type": "TELEMETRY_TICK",
  "payload": {
    "stats": { "elapsedSeconds": 28, "areaCoveragePercent": 33, "avgBatteryPercent": 79 },
    "robots": [...],
    "commEdges": [...]
  }
}
```

---

## Design System

NEXUS-S features a **Modern Light Professional Interface** inspired by Linear, Notion, and Apple engineering software. It prioritizes clarity, whitespace, and high typography contrast over dark neon game aesthetics.

### Color Tokens (`frontend/src/index.css`)

| Variable | Hex Value | Usage |
| :--- | :--- | :--- |
| `--bg` / `--bg-primary` | `#F6F8FB` | Main operational canvas background |
| `--surface` | `#FFFFFF` | Primary white cards, sidebar, top command bar |
| `--surface-soft` | `#F8FAFC` | Inset metric cards, tables, timeline rows |
| `--border` | `#E2E8F0` | Subtle, crisp 1px borders |
| `--text-primary` | `#0F172A` | Deep slate headings, titles, and metrics |
| `--text-secondary` | `#475569` | Body copy, descriptions, and labels |
| `--text-muted` | `#64748B` | Category trackers and metadata |
| `--primary` | `#2563EB` | Professional blue accent & active state highlights |
| `--primary-soft` | `#EFF6FF` | Soft blue backgrounds for active nav & badges |
| `--success` | `#16A34A` | Confirmed targets, healthy battery status |
| `--warning` | `#D97706` | Amber target discovery & low battery advisories |
| `--danger` | `#DC2626` | Critical alerts |

### Key Modules
- **White Sidebar:** Logo with `NEXUS-S // OPS` badge, light blue active items (`#EFF6FF`), and live telemetry status.
- **Top Command Bar:** `LIVE OPERATIONS // Zone A`, status badge `● Autonomous Active`, mission clock, and fleet counters.
- **Light Technical Swarm Map:** HTML5 Canvas with `#F8FAFC` background, white arena `#FFFFFF`, subtle coordinate grid, explored blue tint, neutral unexplored fog of war, and floating controls (`+`, `−`, `⌖ Center Swarm`, `□ Fit Mission`).
- **Explainable Swarm Intelligence Panel:** Plain-English explanations of collective behavior and individual robot rationale with checkmarks (`✓`).
- **Live Event Stream:** Clean vertical timeline with filter tabs (`ALL | ROBOTS | TARGETS | SYSTEM`), mono timestamps, and severity pips.
- **Mission Progress & Coordination Pipeline:** Progress bars for coverage, targets, area, and battery, plus a 4-step coordination flow:
  $$\text{Robot Observation} \longrightarrow \text{Local Decision} \longrightarrow \text{Peer Communication} \longrightarrow \text{Collective Swarm Behavior}$$

---

## Simulation Parameters

| Parameter | Default Value | Description |
| :--- | :--- | :--- |
| `worldWidth` | `960` | Operational arena width in virtual meters |
| `worldHeight` | `640` | Operational arena height in virtual meters |
| `robotCount` | `12` | Number of autonomous ground agents |
| `commRadius` | `140` | 1-hop radio communication horizon ($R_{\text{comm}}$ in meters) |
| `sensorRadius` | `75` | Local LiDAR and obstacle detection horizon (meters) |
| `returnThreshold` | `22` | Battery SOC percentage that triggers autonomous dock return |
| `maxSpeed` | `2.2` | Maximum velocity ($m/s$) |

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, TailwindCSS 3.4, Lucide React, HTML5 2D Canvas.
- **Backend**: Node.js (`v22+` / `v24+`), Express 4.21, WebSocket (`ws`), TypeScript (`tsx`), CORS.
- **Architecture**: Monorepo with `concurrently` orchestration.

---

## License

MIT License. Developed for research in autonomous multi-agent robotics and decentralized swarm intelligence.
