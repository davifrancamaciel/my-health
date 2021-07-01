import { Router } from 'express';

import SegmentController from '../app/controllers/SegmentController';

const segmentsRouter = Router();

segmentsRouter.post('/', SegmentController.store);
segmentsRouter.put('/', SegmentController.update);
segmentsRouter.delete('/:id', SegmentController.delete);
segmentsRouter.get('/', SegmentController.index);
segmentsRouter.get('/:id', SegmentController.find);

export default segmentsRouter;
