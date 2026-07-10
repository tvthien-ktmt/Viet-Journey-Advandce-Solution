import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { tour: true, hotel: true, flight: true, passengers: true, payment: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error('getMyBookings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { user: true, tour: true, hotel: true, flight: true, payment: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error('getAllBookings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const { bookingType, totalPrice, tourId, hotelId, flightId, passengers } = req.body;
        
        // Generate a random booking code
        const bookingCode = 'VJ-' + Math.random().toString(36).substring(2, 10).toUpperCase();

        const newBooking = await prisma.booking.create({
            data: {
                userId,
                bookingType,
                totalPrice,
                bookingCode,
                tourId: tourId || null,
                hotelId: hotelId || null,
                flightId: flightId || null,
                status: 'pending',
                passengers: passengers ? { create: passengers } : undefined,
                payment: {
                    create: { amount: totalPrice, status: 'pending' }
                }
            },
            include: { passengers: true, payment: true }
        });

        res.status(201).json({ success: true, message: 'Booking created', data: newBooking });
    } catch (error) {
        console.error('createBooking error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedBooking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json({ success: true, message: 'Booking status updated', data: updatedBooking });
    } catch (error) {
        console.error('updateBookingStatus error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
