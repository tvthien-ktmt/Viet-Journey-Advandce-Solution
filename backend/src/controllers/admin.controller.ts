import { Request, Response } from 'express';
import prisma from '../utils/prisma';

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
      
      const monthlyRevenueRaw = await prisma.payment.groupBy({
        by: ['createdAt'],
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      });
      // Convert to month groupings (in JS to avoid DB specific date functions or Prisma's complex raw queries)
      const monthlyData: Record<string, number> = {};
      monthlyRevenueRaw.forEach(item => {
        const date = new Date(item.createdAt);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[month] = (monthlyData[month] || 0) + Number(item._sum.amount || 0);
      });
      const monthlyRevenue = Object.entries(monthlyData)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => b.month.localeCompare(a.month))
        .slice(0, 6);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalBookings,
          totalRevenue: totalRevenue._sum.amount || 0,
          recentBookings,
          monthlyRevenue
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Users
  getUsers: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '0', 10);
      const size = parseInt((req.query.size as string) || '100', 10);
      const skip = page * size;
      const [users, totalElements] = await prisma.$transaction([
        prisma.user.findMany({
          select: { id: true, fullName: true, email: true, role: true, createdAt: true, lockedUntil: true },
          skip, take: size, orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count()
      ]);
      res.json({ success: true, data: { content: users, totalElements, totalPages: Math.ceil(totalElements / size), page, size } });
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
      
      res.json({ success: true, data: updated });
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
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Flights
  getFlights: async (req: Request, res: Response) => {
    try {
      const flights = await prisma.flight.findMany({ orderBy: { departureTime: 'desc' }, take: 100 });
      res.json({ success: true, data: flights });
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
      res.json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  updateBookingStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const ALLOWED_TRANSITIONS: Record<string, string[]> = {
          RESERVED: ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'],
          PENDING: ['CONFIRMED', 'CANCELLED'],
          CONFIRMED: ['COMPLETED', 'CANCELLED'],
          EXPIRED: [],
          CANCELLED: [],
          COMPLETED: []
      };

      const current = await prisma.booking.findUnique({ where: { id: Number(id) } });
      if (!current || !ALLOWED_TRANSITIONS[current.status]?.includes(status)) {
          res.status(400).json({ success: false, message: `Cannot transition from ${current?.status} to ${status}` });
          return;
      }

      if (status === 'CANCELLED') {
          res.status(400).json({ success: false, message: 'Please use the /cancel endpoint to cancel bookings' });
          return;
      }

      const updated = await prisma.booking.update({
        where: { id: Number(id) },
        data: { status }
      });
      
      await prisma.log.create({
        data: { action: 'UPDATE_BOOKING_STATUS', userId: (req as any).user.id, details: `Booking ID: ${id}, New Status: ${status}` }
      });
      
      res.json({ success: true, data: updated });
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
      res.json({ success: true, data: payments });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Logs
  getLogs: async (req: Request, res: Response) => {
    try {
      const logs = await prisma.log.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Promotions
  getPromotions: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '0', 10);
      const size = parseInt((req.query.size as string) || '100', 10);
      const skip = page * size;
      const [promos, totalElements] = await prisma.$transaction([
        prisma.promotion.findMany({ skip, take: size, orderBy: { createdAt: 'desc' } }),
        prisma.promotion.count()
      ]);
      res.json({ success: true, data: { content: promos, totalElements, totalPages: Math.ceil(totalElements / size), page, size } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  createPromotion: async (req: Request, res: Response) => {
    try {
      const { code, description, discountValue, discountType, validFrom, validUntil, isActive } = req.body;
      const promo = await prisma.promotion.create({ 
        data: { code, description, discountValue, discountType, validFrom, validUntil, isActive } 
      });
      res.json({ success: true, data: promo });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Tours
  getTours: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '0', 10);
      const size = parseInt((req.query.size as string) || '100', 10);
      const skip = page * size;
      const [tours, totalElements] = await prisma.$transaction([
        prisma.tour.findMany({ skip, take: size, orderBy: { createdAt: 'desc' } }),
        prisma.tour.count()
      ]);
      res.json({ success: true, data: { content: tours, totalElements, totalPages: Math.ceil(totalElements / size), page, size } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Feedbacks
  getFeedbacks: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '0', 10);
      const size = parseInt((req.query.size as string) || '100', 10);
      const skip = page * size;
      const [feedbacks, totalElements] = await prisma.$transaction([
        prisma.review.findMany({ 
          skip, take: size, orderBy: { createdAt: 'desc' },
          include: { user: { select: { fullName: true, email: true } }, tour: { select: { name: true } } }
        }),
        prisma.review.count()
      ]);
      res.json({ success: true, data: { content: feedbacks, totalElements, totalPages: Math.ceil(totalElements / size), page, size } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  
  updateReviewStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await prisma.review.update({
        where: { id: Number(id) },
        data: { status }
      });
      await prisma.log.create({
        data: { action: 'UPDATE_REVIEW_STATUS', userId: (req as any).user.id, details: `Review ID: ${id}, New Status: ${status}` }
      });
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};
