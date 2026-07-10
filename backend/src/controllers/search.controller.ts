import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const { keyword } = req.query;

        if (!keyword || typeof keyword !== 'string') {
            res.json({ success: true, data: { tours: [], hotels: [], flights: [] } });
            return;
        }

        const [tours, hotels, flights] = await Promise.all([
            prisma.tour.findMany({
                where: {
                    OR: [
                        { name: { contains: keyword } },
                        { location: { contains: keyword } }
                    ]
                },
                take: 5
            }),
            prisma.hotel.findMany({
                where: {
                    OR: [
                        { name: { contains: keyword } },
                        { location: { contains: keyword } }
                    ]
                },
                take: 5
            }),
            prisma.flight.findMany({
                where: {
                    OR: [
                        { departureAirport: { contains: keyword } },
                        { arrivalAirport: { contains: keyword } },
                        { airlineCode: { contains: keyword } }
                    ]
                },
                take: 5
            })
        ]);

        res.json({ success: true, data: { tours, hotels, flights } });
    } catch (error) {
        console.error('globalSearch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
