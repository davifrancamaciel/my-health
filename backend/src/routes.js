import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multerConfig';

import authMiddleware from './app/middlewares/auth';

import DashboardController from './app/controllers/DashboardController';

import CompanyController from './app/controllers/CompanyController';
import validateCompanyStore from './app/validators/Company/store';
import validateCompanyUpdate from './app/validators/Company/update';

import RegisterController from './app/controllers/RegisterController';
import validateRegisterStore from './app/validators/Register/store';

import ProfileController from './app/controllers/ProfileController';
import UserController from './app/controllers/UserController';
import validateUserStore from './app/validators/User/store';
import validateUserUpdate from './app/validators/User/update';

import SessionController from './app/controllers/SessionController';
import validateSessionStore from './app/validators/Session/store';

import VehicleController from './app/controllers/VehicleController';
import validateVehicleStore from './app/validators/Vehicle/store';
import validateVehicleUpdate from './app/validators/Vehicle/update';

import SpecialtyController from './app/controllers/SpecialtyController';
import validateSpecialtyStore from './app/validators/Specialty/store';
import validateSpecialtyUpdate from './app/validators/Specialty/update';

import SpecialtyTypeController from './app/controllers/SpecialtyTypeController';

import FileController from './app/controllers/FileController';

import SaleController from './app/controllers/SaleController';
import validateSaleStore from './app/validators/Sale/store';

import ForgotController from './app/controllers/ForgotController';

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
routes.get('/dashboard-specialties-graph', DashboardController.getSpecialtiesGraph);

routes.post(
  '/companies',
  upload.single('file'),
  validateCompanyStore,
  CompanyController.store
);
routes.put(
  '/companies',
  upload.single('file'),
  validateCompanyUpdate,
  CompanyController.update
);
routes.get('/companies', CompanyController.index);
routes.get('/companies/list', CompanyController.list);
routes.get('/companies/:id', CompanyController.find);
routes.delete('/companies/:id', CompanyController.delete);

routes.post('/users', validateUserStore, UserController.store);
routes.put('/users', validateUserUpdate, UserController.update);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.find);
routes.delete('/users/:id', UserController.delete);
routes.get('/users-list', UserController.list);

routes.put(
  '/profile',
  upload.single('file'),
  validateUserUpdate,
  ProfileController.update
);

routes.post('/vehicles', validateVehicleStore, VehicleController.store);
routes.put('/vehicles', validateVehicleUpdate, VehicleController.update);
routes.get('/vehicles', VehicleController.index);
routes.get('/vehicles/:id', VehicleController.find);
routes.delete('/vehicles/:id', VehicleController.delete);
routes.get('/vehicles-list', VehicleController.list);

routes.post('/specialties', validateSpecialtyStore, SpecialtyController.store);
routes.put('/specialties', validateSpecialtyUpdate, SpecialtyController.update);
routes.get('/specialties', SpecialtyController.index);
routes.get('/specialties/:id', SpecialtyController.find);
routes.delete('/specialties/:id', SpecialtyController.delete);

routes.get('/specialties-types', SpecialtyTypeController.index);

routes.get('/files/:id', FileController.index);
routes.post('/files', upload.single('file'), FileController.store);
routes.delete('/files/:id', FileController.delete);

routes.get('/sales', SaleController.index);
routes.get('/sales/:id', SaleController.find);
routes.post('/sales', validateSaleStore, SaleController.store);
routes.put('/sales', validateSaleStore, SaleController.update);
routes.delete('/sales/:id', SaleController.delete);

export default routes;
