import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';

import validateUserUpdate from '../app/validators/User/update';
import ProfileController from '../app/controllers/ProfileController';

const upload = multer(multerConfig);

const profileRouter = Router();

profileRouter.put(
  '/',
  upload.single('file'),
  validateUserUpdate,
  ProfileController.update
);

export default profileRouter;
