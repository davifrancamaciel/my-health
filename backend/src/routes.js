import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multerConfig';

import authMiddleware from './app/middlewares/auth';
import roulesMiddleware from './app/middlewares/roules';

import DashboardController from './app/controllers/DashboardController';

import AppointmentController from './app/controllers/AppointmentController';

import AvailableController from './app/controllers/AvailableController'

import ScheduleController from './app/controllers/ScheduleController'
import SpecialityProviderController from './app/controllers/SpecialityProviderController'

import RegisterController from './app/controllers/RegisterController';
import validateRegisterStore from './app/validators/Register/store';

import ProfileController from './app/controllers/ProfileController';
import UserController from './app/controllers/UserController';
import validateUserStore from './app/validators/User/store';
import validateUserUpdate from './app/validators/User/update';

import SessionController from './app/controllers/SessionController';
import validateSessionStore from './app/validators/Session/store';

import SpecialityController from './app/controllers/SpecialityController';
import validateSpecialityStore from './app/validators/Speciality/store';
import validateSpecialityUpdate from './app/validators/Speciality/update';

import SpecialityTypeController from './app/controllers/SpecialityTypeController';

import SegmentController from './app/controllers/SegmentController';

import ForgotController from './app/controllers/ForgotController';
import ReportController from './app/controllers/ReportController';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) =>
  res.json({ message: 'Bem vindo a api do UPIS Saúde' })
);

// rotas publicas
routes.post('/register', validateRegisterStore, RegisterController.store);
routes.put('/register', RegisterController.update);
routes.post('/sessions', validateSessionStore, SessionController.store);
routes.post('/forgot', ForgotController.store);
routes.put('/forgot', ForgotController.update);

// rotas privadas
routes.use(authMiddleware);

routes.get('/dashboard', DashboardController.index);
routes.get('/dashboard-appointments-graph', DashboardController.getAppointmentsGraph);

routes.get('/appointments', AppointmentController.index);
routes.get('/appointments/:id', AppointmentController.find);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/available/providers/:specialityId', AvailableController.index)

routes.get('/schedule', ScheduleController.index)

routes.put(
  '/profile',
  upload.single('file'),
  validateUserUpdate,
  ProfileController.update
);

routes.get('/speciality-provider/:id', SpecialityProviderController.find)
routes.post('/specialities', validateSpecialityStore, SpecialityController.store);
routes.put('/specialities', validateSpecialityUpdate, SpecialityController.update);
routes.get('/specialities', SpecialityController.index);
routes.get('/specialities/:id', SpecialityController.find);
routes.delete('/specialities/:id', SpecialityController.delete);

routes.get('/specialities-types-list', SpecialityTypeController.list);
routes.get('/segments-list', SegmentController.list);

routes.get('/report', ReportController.index);

routes.use(roulesMiddleware);
routes.post('/segments', SegmentController.store);
routes.put('/segments', SegmentController.update);
routes.delete('/segments/:id', SegmentController.delete);
routes.get('/segments', SegmentController.index);
routes.get('/segments/:id', SegmentController.find);

routes.post('/specialities-types', SpecialityTypeController.store);
routes.put('/specialities-types', SpecialityTypeController.update);
routes.delete('/specialities-types/:id', SpecialityTypeController.delete);
routes.get('/specialities-types', SpecialityTypeController.index);
routes.get('/specialities-types/:id', SpecialityTypeController.find);

routes.put('/users', validateUserUpdate, UserController.update);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.find);
routes.delete('/users/:id', UserController.delete);

export default routes;
