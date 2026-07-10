import { Router } from 'express';
import * as controller from '../controllers/user.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authenticate, controller.getProfile);
router.put('/me', authenticate, controller.updateProfile);
router.get('/', authenticate, authorizeAdmin, controller.getAllUsers);

export default router;
