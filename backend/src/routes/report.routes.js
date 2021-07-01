import { Router } from 'express';

import ReportController from '../app/controllers/ReportController';

const reportRouter = Router();

reportRouter.get('/', ReportController.index);

export default reportRouter;
