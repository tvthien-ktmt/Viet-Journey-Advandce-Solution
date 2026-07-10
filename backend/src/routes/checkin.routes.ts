import { Router } from 'express';
import * as controller from '../controllers/checkin.controller';

const router = Router();

router.post('/', controller.processCheckin);

export default router;
