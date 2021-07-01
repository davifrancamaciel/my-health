import { Router } from 'express';

import ScheduleController from '../app/controllers/ScheduleController';

const scheduleRouter = Router();

scheduleRouter.get('/', ScheduleController.index);

export default scheduleRouter;
