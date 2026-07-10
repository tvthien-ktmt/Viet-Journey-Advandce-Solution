import cron from 'node-cron';
import prisma from '../utils/prisma';
import logger from '../utils/logger';
import { BookingStatus } from '@prisma/client';

export const startReservationCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const expiredBookings = await prisma.booking.findMany({
                where: {
                    status: BookingStatus.RESERVED,
                    reservedUntil: { lt: new Date() }
                },
                include: { passengers: true }
            });

            for (const booking of expiredBookings) {
                await prisma.$transaction(async (tx) => {
                    await tx.booking.update({
                        where: { id: booking.id },
                        data: { status: BookingStatus.EXPIRED }
                    });

                    await tx.payment.updateMany({
                        where: { bookingId: booking.id, status: 'PENDING' },
                        data: { status: 'FAILED' }
                    });

                    // Restore flight inventory
                    if (booking.bookingType === 'flight' && booking.flightId) {
                        const numPassengers = booking.passengers?.length || 1;
                        await tx.flight.update({
                            where: { id: booking.flightId },
                            data: { availableSeats: { increment: numPassengers } }
                        });
                    }
                });
                console.log(`[Cron] Booking ${booking.id} expired. Inventory restored.`);
            }
        } catch (error) {
            logger.error('[Cron] Error processing expired bookings:', error);
        }
    });
};
