import { Router } from 'express';

import SpecialityTypeController from '../app/controllers/SpecialityTypeController';

const specialitiesTypesRouter = Router();

specialitiesTypesRouter.post('/', SpecialityTypeController.store);
specialitiesTypesRouter.put('/', SpecialityTypeController.update);
specialitiesTypesRouter.get('/', SpecialityTypeController.index);
specialitiesTypesRouter.get('/:id', SpecialityTypeController.find);
specialitiesTypesRouter.delete('/:id', SpecialityTypeController.delete);

export default specialitiesTypesRouter;
