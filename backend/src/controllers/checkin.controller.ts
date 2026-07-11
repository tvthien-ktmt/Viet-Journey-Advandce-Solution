import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const processCheckin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { pnr, lastName } = req.body;
        if (!pnr || !lastName) {
            res.status(400).json({ success: false, message: 'Missing PNR or Last Name' });
            return;
        }

        const booking = await prisma.booking.findUnique({
            where: { bookingCode: pnr },
            include: { passengers: true, flight: true }
        });

        if (!booking || booking.bookingType !== 'flight') {
            res.status(404).json({ success: false, message: 'Flight booking not found' });
            return;
        }

        // Validate lastName
        const hasMatchingPassenger = booking.passengers.some(p => p.fullName.toLowerCase().includes(lastName.toLowerCase()));
        if (!hasMatchingPassenger) {
            res.status(400).json({ success: false, message: 'Invalid Last Name for this PNR' });
            return;
        }

        if (booking.status !== 'CONFIRMED') {
            res.status(400).json({ success: false, message: 'Booking is not confirmed' });
            return;
        }

        if (booking.flight && booking.flight.departureTime) {
            const timeDiff = booking.flight.departureTime.getTime() - Date.now();
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                res.status(400).json({ success: false, message: 'Online check-in only opens 24 hours before departure' });
                return;
            }
            if (hoursDiff < 1) {
                res.status(400).json({ success: false, message: 'Online check-in closes 1 hour before departure' });
                return;
            }
        }

        if (booking.itemSnapshot && (booking.itemSnapshot as any).isCheckedIn) {
            res.status(400).json({ success: false, message: 'PNR đã được check-in trước đó' });
            return;
        }

        // Mock generating a QR Code
        const qrCodeData = Buffer.from(JSON.stringify({ pnr, flightNumber: booking.flight?.flightNumber })).toString('base64');
        const qrCodeUrl = `data:image/png;base64,${qrCodeData}`; // Mocked as string, frontend will use qrcode.react anyway or just show the string.

        const updatedSnapshot = { ...(booking.itemSnapshot as any || {}), isCheckedIn: true, checkInTime: new Date().toISOString() };
        await prisma.booking.update({
            where: { id: booking.id },
            data: { itemSnapshot: updatedSnapshot }
        });

        res.json({
            success: true,
            message: 'Check-in successful',
            data: {
                qrCodeUrl,
                boardingTime: booking.flight?.departureTime,
                seatNumber: booking.passengers[0]?.seatNumber || 'A1'
            }
        });
    } catch (error) {
        logger.error('processCheckin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
