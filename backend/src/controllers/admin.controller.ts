import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const [usersCount, toursCount, hotelsCount, flightsCount, bookingsCount] = await Promise.all([
            prisma.user.count(),
            prisma.tour.count(),
            prisma.hotel.count(),
            prisma.flight.count(),
            prisma.booking.count()
        ]);

        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        res.json({
            success: true,
            data: {
                counts: {
                    users: usersCount,
                    tours: toursCount,
                    hotels: hotelsCount,
                    flights: flightsCount,
                    bookings: bookingsCount
                },
                recentBookings
            }
        });
    } catch (error) {
        console.error('getDashboardStats error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
