import { Router } from 'express';
import * as controller from '../controllers/notification.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, controller.getMyNotifications);
router.patch('/:id/read', authenticate, controller.markAsRead);

export default router;
