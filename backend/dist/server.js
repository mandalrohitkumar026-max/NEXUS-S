import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { swarmRouter } from './routes/swarm.routes.js';
import { robotsRouter } from './routes/robots.routes.js';
import { targetsRouter } from './routes/targets.routes.js';
import { historyRouter } from './routes/history.routes.js';
import { swarmService } from './services/swarmService.js';
const app = express();
const PORT = process.env.PORT || 4000;
// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        platform: 'NEXUS-S Decentralized Swarm Intelligence Lab',
        version: '2.4.2',
        timestamp: new Date().toISOString(),
        agentsOnline: 12,
    });
});
// Mount Routes
app.use('/api/swarm', swarmRouter);
app.use('/api/robots', robotsRouter);
app.use('/api/targets', targetsRouter);
app.use('/api/history', historyRouter);
// HTTP Server
const server = http.createServer(app);
// WebSocket Server on /ws
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
    // Send immediate state snapshot
    ws.send(JSON.stringify({ type: 'INIT_STATE', payload: swarmService.getStateSnapshot() }));
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.action === 'TOGGLE_PLAY') {
                swarmService.togglePlayPause();
            }
            else if (data.action === 'RESET') {
                swarmService.reset();
            }
            else if (data.action === 'UPDATE_CONFIG') {
                swarmService.updateConfig(data.payload);
            }
        }
        catch {
            // ignore invalid messages
        }
    });
});
// Broadcast telemetry loop to all connected WebSocket clients
swarmService.setOnUpdate(state => {
    if (wss.clients.size === 0)
        return;
    const message = JSON.stringify({ type: 'TELEMETRY_TICK', payload: state });
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
});
// Start Server
server.listen(PORT, () => {
    console.log(`[NEXUS-S] Backend server running on http://localhost:${PORT}`);
    console.log(`[NEXUS-S] WebSocket stream active on ws://localhost:${PORT}/ws`);
});
