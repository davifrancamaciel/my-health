import { Router } from 'express';

import AvailableController from '../app/controllers/AvailableController';

const availableRouter = Router();

availableRouter.get('/providers/:specialityId', AvailableController.index);

export default availableRouter;
