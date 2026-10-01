import { Router } from 'express';
import { swarmService } from '../services/swarmService.js';
export const robotsRouter = Router();
robotsRouter.get('/', (_req, res) => {
    res.json(swarmService.getRobots());
});
robotsRouter.get('/:id', (req, res) => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const robot = swarmService.getRobotById(id);
    if (!robot) {
        res.status(404).json({ error: `Robot with ID ${id} not found` });
        return;
    }
    res.json(robot);
});
