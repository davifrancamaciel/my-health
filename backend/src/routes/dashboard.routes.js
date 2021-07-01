import { Router } from 'express';

import DashboardController from '../app/controllers/DashboardController';

const dashboardRouter = Router();

dashboardRouter.get('/', DashboardController.index);
dashboardRouter.get(
  '/appointments-graph',
  DashboardController.getAppointmentsGraph
);

export default dashboardRouter;
