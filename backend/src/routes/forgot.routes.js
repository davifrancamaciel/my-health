import { Router } from 'express';

import ForgotController from '../app/controllers/ForgotController';

const forgotRouter = Router();
forgotRouter.post('/', ForgotController.store);
forgotRouter.put('/', ForgotController.update);

export default forgotRouter;
