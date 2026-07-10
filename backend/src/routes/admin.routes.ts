import { Router } from 'express';
import * as controller from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

import * as blogController from '../controllers/blog.controller';

const router = Router();

router.get('/dashboard', authenticate, authorizeAdmin, controller.getDashboardStats);
router.get('/stats', authenticate, authorizeAdmin, controller.getDashboardStats);
router.get('/users', authenticate, authorizeAdmin, controller.getAllUsers);
router.put('/users/:id/roles', authenticate, authorizeAdmin, controller.updateUserRole);
router.get('/bookings', authenticate, authorizeAdmin, controller.getAllBookingsAdmin);
router.get('/flights', authenticate, authorizeAdmin, controller.getAllFlightsAdmin);
router.get('/news', authenticate, authorizeAdmin, blogController.getAllBlogs);

export default router;
