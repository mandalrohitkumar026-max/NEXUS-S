# NEXUS-S — Decentralized Swarm Intelligence Platform

<div align="center">

![NEXUS-S Status](https://img.shields.io/badge/Status-Operational-16A34A?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-2563EB?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-0ea5e9?style=flat-square&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-16A34A?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-475569?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8.2-7C3AED?style=flat-square&logo=vite&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Streaming-D97706?style=flat-square)

**A Research-Grade Robotics Operations Console & Decentralized Swarm Simulation Platform**

[Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [Research Principles](#-core-research-concepts) • [API Reference](#-backend-api-reference) • [Design System](#-modern-light-design-system)

</div>

---

## 📖 Overview

**NEXUS-S** is an advanced robotics operations platform designed for simulating, observing, and evaluating groups of 10–20 autonomous ground robots operating as a **decentralized swarm** in complex, GPS-denied, and communication-constrained environments (such as collapsed urban rubble, subterranean tunnel networks, or disaster search & rescue zones).

### The Core Vision
> *"No central controller. No single point of failure. Each robot makes independent decisions based exclusively on local observations, 1-hop peer communication, battery constraints, and collective mission goals."*

Unlike conventional robotics architectures that rely on a central server to dispatch waypoints to every robot, NEXUS-S models true **emergent swarm intelligence**:
- If an agent loses radio connection, it continues exploring autonomously.
- If an agent detects a survivor, it propagates the location to nearby peers via ad-hoc gossip.
- If an agent drops below safe battery levels, it independently routes itself to an inductive charging dock while surrounding agents redistribute to cover the vacated sector.

---

## 🔬 Core Research Concepts

NEXUS-S implements established multi-agent robotics coordination algorithms:

```
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  Robot Observation   │ ───► │    Local Decision    │ ───► │  Peer Communication  │ ───► │    Swarm Behavior    │
│  Sensors (R = 75m)   │      │ Neural Policy / POMDP│      │ 1-Hop Mesh Gossip    │      │ Emergent Dispersion  │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

1. **Dec-POMDP (Decentralized Partially Observable Markov Decision Process)**:
   - Each robot computes a utility score over discrete candidate actions (`FRONTIER_DISPERSION`, `TARGET_INSPECTION`, `RELAY_POSITIONING`, `DOCK_RETURN`, `AVOID_COLLISION`).
   - Decision-making occurs at 60Hz purely on onboard sensor state.

2. **Ad-Hoc 802.11s Communication Mesh**:
   - Radio propagation follows a log-distance path loss model:
     $$\text{Signal Strength} = \max\left(0, 1 - \left(\frac{d}{R_{\text{comm}}}\right)^2\right)$$
   - When scouts push into radio-shadowed corridors, intermediate units autonomously re-task as static relay bridges.

3. **Autonomous Battery Hysteresis & Rolling Recharging**:
   - Default return threshold is set to **22% SOC**.
   - Robots navigate to base inductive pads, recharge to **95%**, and re-enter exploration perimeter. This allows continuous 24/7 mission operation without swarm downtime.

4. **Explainable Swarm AI (XAI)**:
   - A built-in reasoning engine translates mathematical state vectors and Dec-POMDP policies into human-readable plain-English justifications in real time (e.g., *"R07 moved to Sector B because Sector B is unexplored, battery is 82%, and Sector A already has active peer coverage"*).

---

## 📁 System Architecture

The project is structured as a professional **two-tier monorepo**:

```
NEXUS-S/
├── frontend/                        # React 19 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── shell/               # Sidebar.tsx, TopCommandBar.tsx
│   │   │   ├── operations/          # LiveOperationsView, TacticalSwarmMap,
│   │   │   │                        # SwarmIntelligencePanel, LiveEventStream,
│   │   │   │                        # MissionProgressSection, HowNexusThinksModal
│   │   │   ├── pages/               # RobotsPage, TargetsPage, AnalyticsPage,
│   │   │   │                        # MissionOverviewPage, MissionHistoryPage
│   │   │   ├── swarm/               # SwarmView (Fleet grid & table)
│   │   │   └── communications/      # CommunicationsView (Ad-hoc RF graph)
│   │   ├── simulation/              # Client-side 60Hz engine & XAI translator
│   │   ├── types/                   # Robot, Target, and Telemetry TypeScript contracts
│   │   ├── App.tsx                  # Root application coordinator
│   │   ├── index.css                # Centralized Modern Light Design System
│   │   └── main.tsx                 # React entry point
│   ├── public/                      # Static branding assets
│   ├── index.html                   # HTML entry (Light theme)
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.ts               # Vite server with API & WebSocket proxy
│   ├── tsconfig.json                # TypeScript configuration
│   └── tailwind.config.js           # Tailwind theme definition
│
├── backend/                         # Node.js + Express + WebSocket Server
│   ├── src/
│   │   ├── server.ts                # Express app + WebSocket server (port 4000)
│   │   ├── routes/
│   │   │   ├── swarm.routes.ts      # /api/swarm (state, config, control)
│   │   │   ├── robots.routes.ts     # /api/robots (individual & fleet telemetry)
│   │   │   ├── targets.routes.ts    # /api/targets (survivor localization status)
│   │   │   └── history.routes.ts    # /api/history (archived mission trials)
│   │   ├── services/
│   │   │   └── swarmService.ts      # Server-side swarm coordination & mesh evaluator
│   │   └── types/                   # Shared backend data models
│   ├── package.json                 # Backend dependencies (express, ws, cors, tsx)
│   └── tsconfig.json                # TypeScript NodeNext configuration
│
├── package.json                     # Monorepo root workspace orchestrator (concurrently)
└── README.md                        # Platform documentation & operational manual
```

---

## 🎨 Modern Light Design System

NEXUS-S uses an **Apple / Linear / Notion-grade light visual design system** tailored for clean aerospace and robotics command consoles. It avoids dark cyberpunk gaming tropes, neon borders, and cluttered layouts in favor of whitespace, high typography contrast, and restrained semantic colors.

### CSS Custom Properties (`frontend/src/index.css`)

```css
:root {
  /* Surfaces & Backgrounds */
  --bg: #F6F8FB;           /* Bright, spacious operational canvas */
  --surface: #FFFFFF;      /* Clean white cards and panels */
  --surface-soft: #F8FAFC; /* Secondary inset cards and tables */
  --border: #E2E8F0;       /* 1px subtle boundary line */
  --border-strong: #CBD5E1;

  /* High-Contrast Typography */
  --text: #0F172A;          /* Deep slate primary headings & metrics */
  --text-secondary: #475569;/* Body copy and labels */
  --text-muted: #64748B;    /* Subtitles and telemetry metadata */

  /* Semantic Color Accents */
  --primary: #2563EB;       /* Engineering SaaS blue */
  --primary-soft: #EFF6FF;  /* Light blue active states & badges */
  --success: #16A34A;       /* Confirmed targets & healthy battery */
  --success-soft: #F0FDF4;
  --warning: #D97706;       /* Low battery & target discovery alerts */
  --warning-soft: #FFFBEB;
  --danger: #DC2626;        /* Critical battery (<15%) & communication drop */
  --danger-soft: #FEF2F2;
}
```

### Key UI Modules

1. **White Sidebar**:
   - Left brand header with `NEXUS-S // OPS` badge.
   - Navigation links with subtle `#EFF6FF` background and `#2563EB` icons on active selection.
   - Real-time telemetry indicators for DDS Bus, ROS 2 Bridge, and Decentralized Core.

2. **Top Command Bar**:
   - `LIVE OPERATIONS: SEARCH & RESCUE // Zone A`.
   - Live badge: `● Autonomous Active` (`#16A34A` on `#F0FDF4`).
   - Mission clock (`00:00:28`) with quick Play/Pause and Reset buttons.
   - Fleet metrics: `Agents (12/12)`, `Energy (79%)`, `Coverage (33%)`.

3. **Light Technical Swarm Map**:
   - `#F8FAFC` background with a clean `#FFFFFF` arena border.
   - Explored regions highlighted in subtle blue `rgba(37, 99, 235, 0.06)`.
   - Unexplored terrain rendered in soft neutral gray `rgba(241, 245, 249, 0.9)`.
   - Crisp blue robot markers (`#2563EB`) with directional heading pips and bold IDs.
   - Top-right floating controls: `+`, `−`, `⌖ Center Swarm`, `□ Fit Mission`.
   - Clean legend: `● Robot`, `◆ Target`, `— Communication`, `▧ Explored`, `□ Unexplored`.

4. **Swarm Intelligence & Inspector Panel**:
   - Explains current swarm intent: *"Agents are redistributing across unexplored sectors while maintaining communication coverage."*
   - Bulleted rationale for individual movement with checkmarks (`✓ Sector B is unexplored`, `✓ R07 has sufficient battery`, etc.).
   - Inspector tab for drill-down into any robot's speed, battery, task, neighbors, and decision confidence.

5. **Mission Progress & Coordination Pipeline**:
   - Clean horizontal progress bars for coverage, targets found, area explored, and battery health.
   - 4-step horizontal coordination pipeline visualizer.

6. **Live Event Stream**:
   - Vertical timeline with mono timestamps, color status pips, robot badge filters (`ALL | ROBOTS | TARGETS | SYSTEM`), and human-readable logs.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.0.0` or higher (`v24.x` recommended)
- **npm**: `v10.0.0` or higher

### 1. Clone & Install
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

### 2. Launch Development Environment
From the root directory:
```bash
npm run dev
```

This single command starts both tiers concurrently:
- **Frontend Dashboard**: [http://localhost:5173/](http://localhost:5173/)
- **Backend REST API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **WebSocket Telemetry**: `ws://localhost:4000/ws`

### 3. Individual Service Execution
- **Run Frontend Only**:
  ```bash
  npm run dev:frontend
  ```
- **Run Backend Only**:
  ```bash
  npm run dev:backend
  ```

### 4. Production Build
```bash
npm run build
```
Builds both the backend (TypeScript output in `backend/dist`) and the frontend (optimized static bundle in `frontend/dist`).

---

## 📡 Backend API Reference

### Base URL: `http://localhost:4000`

### REST Endpoints

#### 1. System Health
- **`GET /api/health`**
  - **Response (200 OK):**
    ```json
    {
      "status": "ok",
      "platform": "NEXUS-S Decentralized Swarm Intelligence Lab",
      "version": "2.4.2",
      "timestamp": "2026-09-06T05:32:09.625Z",
      "agentsOnline": 12
    }
    ```

#### 2. Swarm State & Telemetry
- **`GET /api/swarm/state`**
  - Returns a full snapshot containing fleet coordinates, exploration metrics, target states, communication links, and logs.
  - **Response (200 OK):**
    ```json
    {
      "isRunning": true,
      "stats": {
        "elapsedSeconds": 28,
        "totalExploredM2": 204800,
        "areaCoveragePercent": 33,
        "targetsFound": 1,
        "totalTargets": 3,
        "avgBatteryPercent": 79,
        "commConnectedPercent": 96,
        "activeRobotCount": 12,
        "messagesPerMin": 142,
        "packetLossPercent": 2.8
      },
      "robots": [...],
      "targets": [...],
      "commEdges": [...]
    }
    ```

#### 3. Mission Simulation Controls
- **`POST /api/swarm/control`**
  - **Request Body:**
    ```json
    {
      "action": "play" // Options: "play", "pause", "toggle", "reset"
    }
    ```
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "isRunning": true
    }
    ```

#### 4. Swarm Configuration
- **`POST /api/swarm/config`**
  - **Request Body:**
    ```json
    {
      "commRadius": 160,
      "returnThreshold": 25,
      "maxSpeed": 2.5
    }
    ```
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "config": {
        "worldWidth": 960,
        "worldHeight": 640,
        "commRadius": 160,
        "returnThreshold": 25,
        "maxSpeed": 2.5
      }
    }
    ```

#### 5. Robots Directory
- **`GET /api/robots`**
  - Returns telemetry for all 12 autonomous robots.
- **`GET /api/robots/:id`** (e.g., `/api/robots/R07`)
  - Returns detailed sensor observations, local policy goal, and 1-hop neighbor list for the requested agent.

#### 6. Targets Directory
- **`GET /api/targets`**
  - Returns all hidden and detected survivor targets with coordinate and confidence ratings.

#### 7. Historical Benchmarks
- **`GET /api/history`**
  - Returns archived historical mission trials with key scientific findings.

---

### WebSocket Protocol: `ws://localhost:4000/ws`

The WebSocket connection allows client applications to receive live telemetry without polling.

#### Client to Server Messages
```json
{ "action": "TOGGLE_PLAY" }
{ "action": "RESET" }
{ "action": "UPDATE_CONFIG", "payload": { "commRadius": 180 } }
```

#### Server to Client Broadcasts
```json
// Initial handshake
{
  "type": "INIT_STATE",
  "payload": { /* Full Swarm State Snapshot */ }
}

// 10Hz Real-Time Telemetry Tick
{
  "type": "TELEMETRY_TICK",
  "payload": { /* Updated robot positions, battery, edges, stats */ }
}
```

---

## ⚙️ Simulation Configuration & Parameters

Default parameters can be customized either via the platform UI (Settings modal), the REST API (`POST /api/swarm/config`), or by editing `backend/src/services/swarmService.ts`:

| Parameter | Default Value | Description |
| :--- | :--- | :--- |
| `worldWidth` | `960` | Operational arena width in virtual meters |
| `worldHeight` | `640` | Operational arena height in virtual meters |
| `robotCount` | `12` | Total number of autonomous agents |
| `commRadius` | `140` | Maximum 1-hop radio communication horizon ($R_{\text{comm}}$ in meters) |
| `sensorRadius` | `75` | Local LiDAR and obstacle detection horizon (meters) |
| `returnThreshold` | `22` | Battery SOC percentage that triggers autonomous dock return |
| `maxSpeed` | `2.2` | Maximum ground traversal velocity ($m/s$) |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8.2 (with HMR and proxy middleware)
- **Styling**: TailwindCSS 3.4 + Centralized CSS Custom Properties
- **Icons**: Lucide React
- **Canvas Rendering**: HTML5 Canvas 2D with hardware acceleration

### Backend
- **Runtime**: Node.js (`v22+` / `v24+`)
- **Server Framework**: Express 4.21
- **Real-Time Layer**: `ws` (Lightweight WebSocket Server)
- **Execution & Compilation**: `tsx` (fast TypeScript execution) + `tsc` (strict verification)
- **CORS**: Configured for cross-origin local development

---

## 📜 License

This project is licensed under the MIT License — see the LICENSE file for details. Developed for advanced robotics research and multi-agent decentralized systems evaluation.
