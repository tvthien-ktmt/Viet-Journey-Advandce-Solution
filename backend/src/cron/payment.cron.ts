import cron from 'node-cron';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const startPaymentCron = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            
            // Find payments that are PENDING and older than 5 minutes
            const expiredPayments = await prisma.payment.findMany({
                where: {
                    status: 'PENDING',
                    createdAt: { lt: fiveMinutesAgo }
                }
            });

            if (expiredPayments.length === 0) return;

            logger.info(`Found ${expiredPayments.length} expired payments. Processing expiration...`);

            for (const payment of expiredPayments) {
                await prisma.$transaction(async (tx) => {
                    // Update Payment to EXPIRED (or FAILED)
                    await tx.payment.update({
                        where: { id: payment.id },
                        data: { status: 'FAILED' } // Using FAILED as PaymentStatus doesn't have EXPIRED
                    });

                    // Update Booking to CANCELLED
                    const updatedBooking = await tx.booking.update({
                        where: { id: payment.bookingId },
                        data: { status: 'CANCELLED' },
                        include: { passengers: true }
                    });

                    await tx.bookingPassenger.updateMany({
                        where: { bookingId: payment.bookingId },
                        data: { seatNumber: null }
                    });

                    // Restore inventory if flight
                    if (updatedBooking.bookingType === 'flight' && updatedBooking.flightId) {
                        const paxCount = updatedBooking.passengers.length || 1;
                        await tx.flight.update({
                            where: { id: updatedBooking.flightId },
                            data: { availableSeats: { increment: paxCount } }
                        });
                    }
                });
            }
        } catch (error) {
            logger.error('Error running payment expiration cron:', error);
        }
    });
};
