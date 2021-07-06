import { Router } from 'express';

import PurseProfileController from '../app/controllers/PurseProfileController';

const pursesRouter = Router();

pursesRouter.get('/me', PurseProfileController.index);

export default pursesRouter;
