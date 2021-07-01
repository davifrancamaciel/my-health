import { Router } from 'express';

import SpecialityController from '../app/controllers/SpecialityController';
import validateSpecialityStore from '../app/validators/Speciality/store';
import validateSpecialityUpdate from '../app/validators/Speciality/update';

const specialitiesRouter = Router();

specialitiesRouter.post(
  '/',
  validateSpecialityStore,
  SpecialityController.store
);
specialitiesRouter.put(
  '/',
  validateSpecialityUpdate,
  SpecialityController.update
);
specialitiesRouter.get('/', SpecialityController.index);
specialitiesRouter.get('/:id', SpecialityController.find);
specialitiesRouter.delete('/:id', SpecialityController.delete);

export default specialitiesRouter;
