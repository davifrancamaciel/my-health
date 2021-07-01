import { Router } from 'express';

import SpecialityProviderController from '../app/controllers/SpecialityProviderController';

const specialityProviderRouter = Router();

specialityProviderRouter.get('/:id', SpecialityProviderController.find);

export default specialityProviderRouter;
