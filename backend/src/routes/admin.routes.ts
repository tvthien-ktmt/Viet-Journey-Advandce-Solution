import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Middleware to check ADMIN role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

router.use(authenticate);
router.use(requireAdmin);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Users
router.get('/users', adminController.getUsers);
router.patch('/users/:id/lock', adminController.toggleUserLock);
router.put('/users/:id/role', adminController.updateRole);

// Flights
router.get('/flights', adminController.getFlights);

// Bookings
router.get('/bookings', adminController.getBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

// Payments
router.get('/payments', adminController.getPayments);

// Promotions
router.get('/promotions', adminController.getPromotions);
router.post('/promotions', adminController.createPromotion);

// Tours
router.get('/tours', adminController.getTours);

// Feedbacks
router.get('/feedbacks', adminController.getFeedbacks);

// Logs
router.get('/logs', adminController.getLogs);

export default router;
