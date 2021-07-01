import { Router } from 'express';

import SpecialityTypeController from '../app/controllers/SpecialityTypeController';

const listRouter = Router();

listRouter.get('/', SpecialityTypeController.list);

export default listRouter;
