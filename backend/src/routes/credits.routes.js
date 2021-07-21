import { Router } from 'express';

import roulesMiddleware from '../app/middlewares/roules';
import CreditProfileController from '../app/controllers/CreditProfileController';
import CreditController from '../app/controllers/CreditController';

const creditsRouter = Router();

creditsRouter.get('/me', CreditProfileController.index);

creditsRouter.use(roulesMiddleware);
creditsRouter.get('/', CreditController.index);
creditsRouter.post('/', CreditController.store);
creditsRouter.put('/', CreditController.update);
creditsRouter.get('/:id', CreditController.find);
creditsRouter.delete('/:id', CreditController.delete);

export default creditsRouter;
