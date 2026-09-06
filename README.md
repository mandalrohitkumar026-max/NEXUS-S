# NEXUS-S — Decentralized Swarm Intelligence Platform

NEXUS-S is a research-grade robotics operations console and simulation platform for autonomous multi-agent decentralized swarms (10–20 robots). Operating via peer-to-peer consensus without a single central controller, robots independently explore unknown environments, search for targets, manage battery levels, and maintain ad-hoc communication meshes.

---

## 📁 Project Architecture

The codebase is organized into a clean **two-tier monorepo architecture**:

```
NEXUS-S/
├── frontend/                        # Modern Light Operations Dashboard (React 19 + Vite + TypeScript)
│   ├── src/                         # UI components, views, shell, hooks, simulation engine
│   ├── public/                      # Static assets
│   ├── index.html                   # Entry point
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
│   └── tsconfig.json                # TypeScript configuration
│
├── package.json                     # Monorepo root workspace orchestrator
└── README.md                        # Documentation & setup guide
```

---

## 🚀 Quick Start

### 1. Run Both Frontend & Backend (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **WebSocket Stream:** `ws://localhost:4000/ws`

### 2. Run Individually
- **Frontend only:**
  ```bash
  npm run dev:frontend
  ```
- **Backend only:**
  ```bash
  npm run dev:backend
  ```

### 3. Build for Production
```bash
npm run build
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and online agent count |
| `GET` | `/api/swarm/state` | Complete state snapshot (robots, targets, commEdges, stats) |
| `POST` | `/api/swarm/control` | Send mission actions: `{ "action": "play" \| "pause" \| "toggle" \| "reset" }` |
| `POST` | `/api/swarm/config` | Update parameters: `{ "commRadius": 160, "returnThreshold": 25 }` |
| `GET` | `/api/robots` | List all 12 autonomous robots with real-time telemetry |
| `GET` | `/api/robots/:id` | Detailed telemetry & local decision state for specific robot |
| `GET` | `/api/targets` | List detected targets and localization confidence scores |
| `GET` | `/api/history` | Historical mission trial archives and scientific takeaways |
| `WS` | `/ws` | Real-time bi-directional telemetry broadcast stream |
