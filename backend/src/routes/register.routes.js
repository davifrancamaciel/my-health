import { Router } from 'express';

import validateRegisterStore from '../app/validators/Register/store';
import RegisterController from '../app/controllers/RegisterController';

const registerRouter = Router();
registerRouter.post('/', validateRegisterStore, RegisterController.store);
registerRouter.put('/', RegisterController.update);

export default registerRouter;
