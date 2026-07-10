import { Router } from 'express';
import * as controller from '../controllers/booking.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/my-bookings', authenticate, controller.getMyBookings);
router.post('/', authenticate, controller.createBooking);

// Admin only
router.get('/', authenticate, authorizeAdmin, controller.getAllBookings);
router.patch('/:id/status', authenticate, authorizeAdmin, controller.updateBookingStatus);

export default router;
