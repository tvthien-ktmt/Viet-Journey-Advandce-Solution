import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tourRoutes from './routes/tour.routes';
import flightRoutes from './routes/flight.routes';
import hotelRoutes from './routes/hotel.routes';
import bookingRoutes from './routes/booking.routes';
import adminRoutes from './routes/admin.routes';
import blogRoutes from './routes/blog.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Node.js backend is running!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
