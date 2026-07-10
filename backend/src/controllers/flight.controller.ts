import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const searchFlights = async (req: Request, res: Response): Promise<void> => {
    try {
        const { from, to, departDate } = req.query;

        // Simplified search logic
        let dateFilter = {};
        if (departDate) {
            const startOfDay = new Date(departDate as string);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(departDate as string);
            endOfDay.setUTCHours(23, 59, 59, 999);
            dateFilter = {
                departTime: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            };
        }

        const flights = await prisma.flight.findMany({
            where: {
                ...(from && { from: from as string }),
                ...(to && { to: to as string }),
                ...dateFilter
            },
            orderBy: { departTime: 'asc' }
        });

        res.json({ success: true, data: { outbound: flights, request: req.query } });
    } catch (error) {
        console.error('searchFlights error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getFlightById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const flight = await prisma.flight.findUnique({ where: { id: Number(id) } });

        if (!flight) {
            res.status(404).json({ success: false, message: 'Flight not found' });
            return;
        }

        res.json({ success: true, data: flight });
    } catch (error) {
        console.error('getFlightById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createFlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        const newFlight = await prisma.flight.create({
            data: {
                ...data,
                departTime: new Date(data.departTime),
                arriveTime: new Date(data.arriveTime)
            }
        });
        res.status(201).json({ success: true, message: 'Flight created', data: newFlight });
    } catch (error) {
        console.error('createFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateFlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedFlight = await prisma.flight.update({
            where: { id: Number(id) },
            data: {
                ...data,
                departTime: data.departTime ? new Date(data.departTime) : undefined,
                arriveTime: data.arriveTime ? new Date(data.arriveTime) : undefined
            }
        });
        res.json({ success: true, message: 'Flight updated', data: updatedFlight });
    } catch (error) {
        console.error('updateFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.flight.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Flight deleted' });
    } catch (error) {
        console.error('deleteFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
