import { Router } from 'express';
import * as controller from '../controllers/admin.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, authorizeAdmin, controller.getDashboardStats);
router.get('/users', authenticate, authorizeAdmin, controller.getAllUsers);
router.get('/bookings', authenticate, authorizeAdmin, controller.getAllBookingsAdmin);
router.get('/flights', authenticate, authorizeAdmin, controller.getAllFlightsAdmin);

export default router;
