import { Router } from 'express';
import { MeasureController } from '../controllers/measureController';

const router = Router();

router.post('/upload', MeasureController.upload);
router.patch('/confirm', MeasureController.confirm);
router.get('/:customer_code/list', MeasureController.list);

export default router;
