import { Router } from 'express';
import * as controller from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, authorizeAdmin, controller.getDashboardStats);

export default router;
