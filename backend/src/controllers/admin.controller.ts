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

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, fullName: true, role: true, phone: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('getAllUsers error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAllBookingsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: { select: { email: true, fullName: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error('getAllBookingsAdmin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAllFlightsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const flights = await prisma.flight.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: flights });
    } catch (error) {
        console.error('getAllFlightsAdmin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
