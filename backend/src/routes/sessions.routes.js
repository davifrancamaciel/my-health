import { Router } from 'express';

import validateSessionStore from '../app/validators/Session/store';
import SessionController from '../app/controllers/SessionController';

const sessionsRouter = Router();
sessionsRouter.post('/', validateSessionStore, SessionController.store);

export default sessionsRouter;
