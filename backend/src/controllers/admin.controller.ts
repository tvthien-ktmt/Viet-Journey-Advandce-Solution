import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminController = {
  // Analytics
  getAnalytics: async (req: Request, res: Response) => {
    try {
      const totalUsers = await prisma.user.count();
      const totalBookings = await prisma.booking.count();
      const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      });
      const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } }
      });
      
      // Revenue by month (dummy logic for simplicity)
      const monthlyRevenue = await prisma.$queryRaw`
        SELECT DATE_FORMAT(createdAt, '%Y-%m') as month, SUM(amount) as revenue
        FROM Payment
        WHERE status = 'SUCCESS'
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
      `;

      res.json({
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        recentBookings,
        monthlyRevenue
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Users
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, fullName: true, email: true, role: true, createdAt: true, lockedUntil: true }
      });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  toggleUserLock: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      const isLocked = user.lockedUntil && user.lockedUntil > new Date();
      const updated = await prisma.user.update({
        where: { id: Number(id) },
        data: { lockedUntil: isLocked ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
      });
      
      await prisma.log.create({
        data: { action: isLocked ? 'UNLOCK_USER' : 'LOCK_USER', userId: (req as any).user.id, details: `Target User ID: ${id}` }
      });
      
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  updateRole: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { roles } = req.body;
      const role = roles.includes('ADMIN') ? 'ADMIN' : 'USER';
      const updated = await prisma.user.update({
        where: { id: Number(id) },
        data: { role }
      });
      await prisma.log.create({
        data: { action: 'UPDATE_ROLE', userId: (req as any).user.id, details: `Target User ID: ${id}, Role: ${role}` }
      });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Flights
  getFlights: async (req: Request, res: Response) => {
    try {
      const flights = await prisma.flight.findMany({ orderBy: { departureTime: 'desc' }, take: 100 });
      res.json(flights);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Bookings
  getBookings: async (req: Request, res: Response) => {
    try {
      const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } }, payment: true },
        take: 100
      });
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  updateBookingStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await prisma.booking.update({
        where: { id: Number(id) },
        data: { status }
      });
      
      await prisma.log.create({
        data: { action: 'UPDATE_BOOKING_STATUS', userId: (req as any).user.id, details: `Booking ID: ${id}, New Status: ${status}` }
      });
      
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Payments
  getPayments: async (req: Request, res: Response) => {
    try {
      const payments = await prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        include: { booking: { select: { bookingCode: true, user: { select: { email: true } } } } },
        take: 100
      });
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Logs
  getLogs: async (req: Request, res: Response) => {
    try {
      const logs = await prisma.log.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Promotions
  getPromotions: async (req: Request, res: Response) => {
    try {
      const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(promos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  createPromotion: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const promo = await prisma.promotion.create({ data });
      res.json(promo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Tours
  getTours: async (req: Request, res: Response) => {
    try {
      const tours = await prisma.tour.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(tours);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Feedbacks
  getFeedbacks: async (req: Request, res: Response) => {
    try {
      const feedbacks = await prisma.review.findMany({ 
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } }
      });
      res.json(feedbacks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};
