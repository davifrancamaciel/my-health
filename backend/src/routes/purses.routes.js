import { Router } from 'express';

import PurseController from '../app/controllers/PurseController';

const pursesRouter = Router();

pursesRouter.get('/', PurseController.index);

export default pursesRouter;
