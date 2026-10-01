import { Router } from 'express';
import { swarmService } from '../services/swarmService.js';
export const targetsRouter = Router();
targetsRouter.get('/', (_req, res) => {
    res.json(swarmService.getTargets());
});
