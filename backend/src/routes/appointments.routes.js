import { Router } from 'express';

import AppointmentController from '../app/controllers/AppointmentController';

const appointmentsRouter = Router();

appointmentsRouter.get('/', AppointmentController.index);
appointmentsRouter.get('/:id', AppointmentController.find);
appointmentsRouter.post('/', AppointmentController.store);
appointmentsRouter.delete('/:id', AppointmentController.delete);

export default appointmentsRouter;
