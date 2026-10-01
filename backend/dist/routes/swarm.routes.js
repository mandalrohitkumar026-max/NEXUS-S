import { Router } from 'express';
import { swarmService } from '../services/swarmService.js';
export const swarmRouter = Router();
swarmRouter.get('/state', (_req, res) => {
    res.json(swarmService.getStateSnapshot());
});
swarmRouter.post('/control', (req, res) => {
    const { action } = req.body;
    if (action === 'play') {
        swarmService.setRunning(true);
    }
    else if (action === 'pause') {
        swarmService.setRunning(false);
    }
    else if (action === 'toggle') {
        swarmService.togglePlayPause();
    }
    else if (action === 'reset') {
        swarmService.reset();
    }
    else {
        res.status(400).json({ error: 'Invalid action. Supported: play, pause, toggle, reset' });
        return;
    }
    res.json({ success: true, isRunning: swarmService.getStateSnapshot().isRunning });
});
swarmRouter.post('/config', (req, res) => {
    const { commRadius, returnThreshold, maxSpeed } = req.body;
    swarmService.updateConfig({
        ...(commRadius ? { commRadius: Number(commRadius) } : {}),
        ...(returnThreshold ? { returnThreshold: Number(returnThreshold) } : {}),
        ...(maxSpeed ? { maxSpeed: Number(maxSpeed) } : {}),
    });
    res.json({ success: true, config: swarmService.getStateSnapshot().config });
});
