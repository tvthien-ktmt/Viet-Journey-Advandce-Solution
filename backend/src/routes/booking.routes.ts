import { Router } from 'express';
import * as controller from '../controllers/booking.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBookingSchema } from '../validations/booking.validation';

const router = Router();

router.get('/my-bookings', authenticate, controller.getMyBookings);
router.get('/search', controller.searchBookings);
router.get('/:id', authenticate, controller.getBookingById);
router.post('/', authenticate, validate(createBookingSchema), controller.createBooking);
router.patch('/:id/addons', authenticate, controller.updateBookingAddons);

// Admin only
router.get('/', authenticate, authorizeAdmin, controller.getAllBookings);
router.patch('/:id/status', authenticate, authorizeAdmin, controller.updateBookingStatus);

export default router;
