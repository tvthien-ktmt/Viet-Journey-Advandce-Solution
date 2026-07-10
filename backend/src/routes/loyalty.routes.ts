import { Router } from 'express';
import * as controller from '../controllers/loyalty.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/history', authenticate, controller.getLoyaltyHistory);

export default router;
