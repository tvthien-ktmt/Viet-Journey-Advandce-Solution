import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { createServer } from 'http';
import { initSocket } from './socket';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tourRoutes from './routes/tour.routes';
import flightRoutes from './routes/flight.routes';
import hotelRoutes from './routes/hotel.routes';
import bookingRoutes from './routes/booking.routes';
import adminRoutes from './routes/admin.routes';
import blogRoutes from './routes/blog.routes';
import reviewRoutes from './routes/review.routes';
import wishlistRoutes from './routes/wishlist.routes';
import notificationRoutes from './routes/notification.routes';
import searchRoutes from './routes/search.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';
import promotionRoutes from './routes/promotion.routes';
import loyaltyRoutes from './routes/loyalty.routes';
import checkinRoutes from './routes/checkin.routes';
import addonsRoutes from './routes/addons.routes';
import contactRoutes from './routes/contact.routes';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler } from './middlewares/errorHandler.middleware';
import { startReservationCron } from './cron/reservation.cron';
import { startPaymentCron } from './cron/payment.cron';
import { startSepayCron } from './cron/sepay.cron';
import path from 'path';

dotenv.config();

const app = express();

// Start Background Jobs
startReservationCron();
startPaymentCron();
startSepayCron();

const port = process.env.PORT || 8080;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // allow loading images from other origins
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/addons', addonsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Node.js backend is running!' });
});

// Global Error Handler
app.use(globalErrorHandler);

const server = createServer(app);
initSocket(server);

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export default app;
