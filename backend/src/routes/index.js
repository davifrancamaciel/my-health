import { Router } from 'express';

import authMiddleware from '../app/middlewares/auth';
import roulesMiddleware from '../app/middlewares/roules';

import dashboardRouter from './dashboard.routes';
import appointmentsRouter from './appointments.routes';
import specialitiesRouter from './specialities.routes';
import segmentsRouter from './segments.routes';
import specialitiesTypesRouter from './specialities-types.routes';
import usersRouter from './users.routes';
import pursesRouter from './purses.routes';
import reportRouter from './report.routes';
import scheduleRouter from './schedule.routes';
import profileRouter from './profile.routes';
import availableRouter from './available.routes';
import registerRouter from './register.routes';
import forgotRouter from './forgot.routes';
import sessionsRouter from './sessions.routes';
import specialityProviderRouter from './speciality-provider.routes';
import specialitiesTypesListRouter from './specialities-types-list.routes';
import segmentsListRouter from './segments-list.routes';

const routes = Router();

routes.get('/', (req, res) =>
  res.json({ message: 'Bem vindo a api do UPIS Saúde' })
);
// rotas publicas
routes.use('/register', registerRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/forgot', forgotRouter);

// rotas privadas
routes.use(authMiddleware);
routes.use('/dashboard', dashboardRouter);
routes.use('/available', availableRouter);
routes.use('/appointments', appointmentsRouter);
routes.use('/specialities', specialitiesRouter);
routes.use('/purses', pursesRouter);
routes.use('/report', reportRouter);
routes.use('/schedule', scheduleRouter);
routes.use('/profile', profileRouter);
routes.use('/speciality-provider', specialityProviderRouter);
routes.use('/specialities-types-list', specialitiesTypesListRouter);
routes.use('/segments-list', segmentsListRouter);

routes.use(roulesMiddleware);
routes.use('/segments', segmentsRouter);
routes.use('/specialities-types', specialitiesTypesRouter);
routes.use('/users', usersRouter);

export default routes;
