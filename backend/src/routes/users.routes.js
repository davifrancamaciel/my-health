import { Router } from 'express';

import UserController from '../app/controllers/UserController';
import validateUserUpdate from '../app/validators/User/update';

const usersRouter = Router();

usersRouter.put('/', validateUserUpdate, UserController.update);
usersRouter.get('/', UserController.index);
usersRouter.get('/:id', UserController.find);
usersRouter.delete('/:id', UserController.delete);

export default usersRouter;
