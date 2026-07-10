import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';
import { BookingStatus } from '@prisma/client';

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { page = '0', size = '10' } = req.query;
        const take = parseInt(size as string);
        const skip = parseInt(page as string) * take;

        const [bookings, totalElements] = await prisma.$transaction([
            prisma.booking.findMany({
                where: { userId },
                skip,
                take,
                include: { tour: true, hotel: true, flight: true, passengers: true, payment: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.booking.count({ where: { userId } })
        ]);
        
        const totalPages = Math.ceil(totalElements / take);
        res.json({ success: true, data: { content: bookings, totalElements, totalPages } });
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

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.findUnique({
            where: { id: Number(id) },
            include: { user: true, tour: true, hotel: true, flight: true, passengers: true, payment: true }
        });
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        console.error('getBookingById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const searchBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, lastName, email } = req.query;
        
        if (!code) {
            res.status(400).json({ success: false, message: 'Booking code is required' });
            return;
        }

        const booking = await prisma.booking.findFirst({
            where: {
                bookingCode: String(code),
                ...(email ? { contactEmail: String(email) } : {}),
                ...(lastName ? { 
                    passengers: {
                        some: {
                            fullName: { contains: String(lastName) }
                        }
                    } 
                } : {})
            },
            include: { tour: true, hotel: true, flight: true, passengers: true, payment: true }
        });

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        console.error('searchBookings error:', error);
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

        const { bookingType, referenceId, passengers, contactEmail, contactPhone } = req.body;
        
        let tourId = null, hotelId = null, flightId = null;
        let totalPrice = 0;
        let itemSnapshot = {};
        const pax = passengers?.length || 1;

        if (bookingType === 'flight' && referenceId) {
            flightId = referenceId;
            const targetFlight = await prisma.flight.findUnique({ where: { id: flightId } });
            if (!targetFlight) {
                res.status(404).json({ success: false, message: 'Flight not found' });
                return;
            }
            if (targetFlight.availableSeats < pax) {
                res.status(400).json({ success: false, message: 'Not enough seats available' });
                return;
            }
            totalPrice = Number(targetFlight.price) * pax;
            itemSnapshot = { flightNumber: targetFlight.flightNumber, from: targetFlight.departureAirport, to: targetFlight.arrivalAirport };
        } else if (bookingType === 'tour' && referenceId) {
            tourId = referenceId;
            const targetTour = await prisma.tour.findUnique({ where: { id: tourId } });
            if (!targetTour) {
                res.status(404).json({ success: false, message: 'Tour not found' });
                return;
            }
            totalPrice = Number(targetTour.price) * pax;
            itemSnapshot = { tourName: targetTour.name };
        } else if (bookingType === 'hotel' && referenceId) {
            hotelId = referenceId;
            const targetHotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
            if (!targetHotel) {
                res.status(404).json({ success: false, message: 'Hotel not found' });
                return;
            }
            totalPrice = Number(targetHotel.price) * pax;
            itemSnapshot = { hotelName: targetHotel.name };
        }

        const bookingCode = 'VJ-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const reservedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const newBooking = await prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    userId,
                    bookingType,
                    totalPrice,
                    bookingCode,
                    contactEmail,
                    contactPhone,
                    itemSnapshot,
                    tourId,
                    hotelId,
                    flightId,
                    status: BookingStatus.RESERVED,
                    reservedUntil,
                    passengers: passengers ? { create: passengers } : undefined,
                    payment: {
                        create: { amount: totalPrice, status: 'PENDING' }
                    }
                },
                include: { passengers: true, payment: true }
            });

            if (bookingType === 'flight' && flightId) {
                await tx.flight.update({
                    where: { id: flightId },
                    data: { availableSeats: { decrement: pax } }
                });
            }

            return booking;
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
