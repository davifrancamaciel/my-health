import { Router } from 'express';

import UserController from '../app/controllers/UserController';
import validateUserUpdate from '../app/validators/User/update';

const usersRouter = Router();

usersRouter.get('/', UserController.index);
usersRouter.get('/list', UserController.list);
usersRouter.get('/:id', UserController.find);
usersRouter.put('/', validateUserUpdate, UserController.update);
usersRouter.delete('/:id', UserController.delete);

export default usersRouter;
