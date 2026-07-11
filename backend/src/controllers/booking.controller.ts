import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';
import { BookingStatus } from '@prisma/client';
import logger from '../utils/logger';

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
        logger.error('getMyBookings error:', error);
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
        logger.error('getAllBookings error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
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

        if (booking.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        logger.error('getBookingById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const searchBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, lastName, email } = req.query;
        
        if (!code || (!lastName && !email)) {
            res.status(400).json({ success: false, message: 'Booking code and (Last Name or Email) are required' });
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

        const maskedBooking = {
            ...booking,
            contactEmail: booking.contactEmail ? booking.contactEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
            contactPhone: booking.contactPhone ? booking.contactPhone.replace(/(\d{3})\d+(?=\d{3})/, '$1****') : null,
            passengers: booking.passengers.map(p => ({
                ...p,
                fullName: p.fullName ? p.fullName.split(' ').map(name => name.charAt(0) + '*'.repeat(Math.max(0, name.length - 1))).join(' ') : p.fullName,
                documentNumber: p.documentNumber ? p.documentNumber.replace(/.(?=.{4})/g, '*') : null
            }))
        };

        res.json({ success: true, data: maskedBooking });
    } catch (error) {
        logger.error('searchBookings error:', error);
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

        const { referenceId, passengers, contactEmail, contactPhone } = req.body;
        const bookingType = req.body.bookingType as 'flight' | 'tour' | 'hotel';
        
        if (!['flight', 'tour', 'hotel'].includes(bookingType)) {
            res.status(400).json({ success: false, message: 'Invalid bookingType' });
            return;
        }
        
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
            if (flightId) {
                await tx.$executeRawUnsafe(`SELECT * FROM \`Flight\` WHERE id = ? FOR UPDATE`, flightId);
                const lockedFlight = await tx.flight.findUnique({ where: { id: flightId } });
                if (!lockedFlight || lockedFlight.availableSeats < pax) {
                    throw new Error('NOT_ENOUGH_SEATS');
                }
            }
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
                    passengers: passengers ? { 
                        create: passengers.map((p: any) => ({
                            ...p,
                            birthDate: p.birthDate ? new Date(p.birthDate) : null
                        }))
                    } : undefined,
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
    } catch (error: any) {
        if (error.message === 'NOT_ENOUGH_SEATS') {
            res.status(400).json({ success: false, message: 'Not enough seats available' });
            return;
        }
        logger.error('createBooking error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBookingAddons = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { passengers } = req.body;

        const booking = await prisma.booking.findUnique({
            where: { id: Number(id) }
        });

        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        if (booking.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        if (booking.status !== 'RESERVED' && booking.status !== 'PENDING') {
            res.status(400).json({ success: false, message: 'Booking is not in an editable state' });
            return;
        }

        let extraFee = 0;
        
        await prisma.$transaction(async (tx) => {
            // Lock the flight row to prevent seat race condition (Row-level lock)
            if (booking.flightId) {
                await tx.$executeRawUnsafe(`SELECT * FROM \`Flight\` WHERE id = ? FOR UPDATE`, booking.flightId);
            }

            // Extract requested seat numbers
            const requestedSeats = passengers.map((p: any) => p.seatNumber).filter(Boolean);

            if (booking.flightId && requestedSeats.length > 0) {
                // Check if any requested seat is already taken in the same flight
                const takenSeats = await tx.bookingPassenger.findMany({
                    where: {
                        seatNumber: { in: requestedSeats },
                        booking: {
                            flightId: booking.flightId,
                            status: { in: ['PENDING', 'CONFIRMED'] },
                            id: { not: booking.id } // Exclude current booking
                        }
                    }
                });

                if (takenSeats.length > 0) {
                    throw new Error('SEAT_TAKEN');
                }
            }

            for (const pax of passengers) {
                if (pax.baggage) extraFee += (Number(pax.baggage) / 20) * 150000;
                if (pax.seatNumber) extraFee += 100000;
                if (pax.meal && pax.meal !== 'none') extraFee += 50000;

                await tx.bookingPassenger.update({
                    where: { id: Number(pax.id) },
                    data: {
                        seatNumber: pax.seatNumber,
                        baggage: pax.baggage ? String(pax.baggage) : null,
                        meal: pax.meal
                    }
                });
            }

            if (extraFee > 0) {
                await tx.booking.update({
                    where: { id: Number(id) },
                    data: { totalPrice: { increment: extraFee } }
                });
                
                const existingPayment = await tx.payment.findUnique({ where: { bookingId: Number(id) } });
                if (existingPayment) {
                    await tx.payment.update({
                        where: { id: existingPayment.id },
                        data: { amount: { increment: extraFee } }
                    });
                }
            }
        });

        res.json({ success: true, message: 'Addons updated' });
    } catch (error: any) {
        if (error.message === 'SEAT_TAKEN') {
            res.status(409).json({ success: false, message: 'One or more requested seats are already taken' });
            return;
        }
        logger.error('updateBookingAddons error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
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

        const updatedBooking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json({ success: true, message: 'Booking status updated', data: updatedBooking });
    } catch (error) {
        logger.error('updateBookingStatus error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const booking = await prisma.booking.findUnique({
            where: { id: Number(id) },
            include: { passengers: true, flight: true, payment: true }
        });

        if (!booking || (booking.userId !== userId && req.user?.role !== 'ADMIN')) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }

        if (booking.status === 'CANCELLED' || booking.status === 'EXPIRED') {
            res.status(400).json({ success: false, message: 'Booking is already cancelled or expired' });
            return;
        }

        if (booking.flight && booking.flight.departureTime) {
            const timeDiff = booking.flight.departureTime.getTime() - Date.now();
            if (timeDiff < 3 * 60 * 60 * 1000) {
                res.status(400).json({ success: false, message: 'Cannot cancel booking less than 3 hours before departure' });
                return;
            }
        }

        await prisma.$transaction(async (tx) => {
            // Lock booking to prevent double cancellation race condition
            const lockedBookings: any[] = await tx.$queryRaw`SELECT status FROM \`Booking\` WHERE id = ${booking.id} FOR UPDATE`;
            if (lockedBookings.length === 0 || lockedBookings[0].status === 'CANCELLED' || lockedBookings[0].status === 'EXPIRED') {
                throw new Error('ALREADY_CANCELLED');
            }

            await tx.booking.update({
                where: { id: booking.id },
                data: { status: 'CANCELLED' }
            });

            // Handle refund status if paid
            if (booking.payment && booking.payment.status === 'SUCCESS') {
                // Update itemSnapshot to mark refund, keep Payment as SUCCESS for historical record
                await tx.booking.update({
                    where: { id: booking.id },
                    data: { itemSnapshot: booking.itemSnapshot ? { ...(booking.itemSnapshot as any), refundStatus: 'PENDING' } : { refundStatus: 'PENDING' } }
                });
            }

            // Restore inventory
            if (booking.bookingType === 'flight' && booking.flightId) {
                const pax = booking.passengers?.length || 1;
                await tx.flight.update({
                    where: { id: booking.flightId },
                    data: { availableSeats: { increment: pax } }
                });
            }
            
            // Release seats
            await tx.bookingPassenger.updateMany({
                where: { bookingId: booking.id },
                data: { seatNumber: null }
            });
        });

        res.json({ success: true, message: 'Booking cancelled successfully. If paid, refund is pending.' });
    } catch (error: any) {
        if (error.message === 'ALREADY_CANCELLED') {
            res.status(400).json({ success: false, message: 'Booking is already cancelled or expired' });
            return;
        }
        logger.error('cancelBooking error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const changeFlight = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { newFlightId } = req.body;
        const userId = req.user?.id;

        const booking = await prisma.booking.findUnique({
            where: { id: Number(id) },
            include: { passengers: true }
        });

        if (!booking || (booking.userId !== userId && req.user?.role !== 'ADMIN') || booking.bookingType !== 'flight' || !booking.flightId) {
            res.status(404).json({ success: false, message: 'Valid flight booking not found' });
            return;
        }

        const newFlight = await prisma.flight.findUnique({ where: { id: Number(newFlightId) } });
        if (!newFlight) {
            res.status(404).json({ success: false, message: 'New flight not found' });
            return;
        }

        const pax = booking.passengers?.length || 1;

        await prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(`SELECT * FROM \`Flight\` WHERE id = ? FOR UPDATE`, booking.flightId);
            await tx.$executeRawUnsafe(`SELECT * FROM \`Flight\` WHERE id = ? FOR UPDATE`, newFlight.id);

            const lockedNewFlight = await tx.flight.findUnique({ where: { id: newFlight.id } });
            if (!lockedNewFlight || lockedNewFlight.availableSeats < pax) {
                throw new Error('NOT_ENOUGH_SEATS');
            }

            // Restore old flight
            await tx.flight.update({
                where: { id: booking.flightId as number },
                data: { availableSeats: { increment: pax } }
            });

            // Decrement new flight
            await tx.flight.update({
                where: { id: newFlight.id },
                data: { availableSeats: { decrement: pax } }
            });

            // Update booking
            await tx.booking.update({
                where: { id: booking.id },
                data: {
                    flightId: newFlight.id,
                    itemSnapshot: {
                        ...(booking.itemSnapshot as any || {}),
                        flightNumber: newFlight.flightNumber,
                        from: newFlight.departureAirport,
                        to: newFlight.arrivalAirport
                    }
                }
            });
        });

        res.json({ success: true, message: 'Flight changed successfully' });
    } catch (error: any) {
        if (error.message === 'NOT_ENOUGH_SEATS') {
            res.status(400).json({ success: false, message: 'Not enough seats available on new flight' });
            return;
        }
        logger.error('changeFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
