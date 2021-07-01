import { Router } from 'express';

import SegmentController from '../app/controllers/SegmentController';

const listRouter = Router();

listRouter.get('/', SegmentController.list);

export default listRouter;
