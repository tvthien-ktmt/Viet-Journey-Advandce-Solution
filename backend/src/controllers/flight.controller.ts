import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const searchFlights = async (req: Request, res: Response): Promise<void> => {
    try {
        const { departureAirport, arrivalAirport, departureTime, page = '0', size = '10' } = req.query;

        // Simplified search logic
        let dateFilter = {};
        if (departureTime) {
            const startOfDay = new Date(departureTime as string);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(departureTime as string);
            endOfDay.setUTCHours(23, 59, 59, 999);
            dateFilter = {
                departureTime: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            };
        }

        const take = parseInt(size as string);
        const skip = parseInt(page as string) * take;

        const [flights, totalElements] = await prisma.$transaction([
            prisma.flight.findMany({
                where: {
                    ...(departureAirport && { departureAirport: departureAirport as string }),
                    ...(arrivalAirport && { arrivalAirport: arrivalAirport as string }),
                    ...dateFilter
                },
                skip,
                take,
                orderBy: { departureTime: 'asc' }
            }),
            prisma.flight.count({
                where: {
                    ...(departureAirport && { departureAirport: departureAirport as string }),
                    ...(arrivalAirport && { arrivalAirport: arrivalAirport as string }),
                    ...dateFilter
                }
            })
        ]);
        
        const totalPages = Math.ceil(totalElements / take);

        res.json({ success: true, data: { content: flights, totalElements, totalPages } });
    } catch (error) {
        logger.error('searchFlights error:', error);
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
        logger.error('getFlightById error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createFlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            flightNumber, departureAirport, arrivalAirport, airlineCode, 
            departureTime, arrivalTime, duration, stops, aircraft, 
            seatClass, price, availableSeats, nextDay 
        } = req.body;
        
        const newFlight = await prisma.flight.create({
            data: {
                flightNumber, departureAirport, arrivalAirport, airlineCode, 
                duration, stops, aircraft, seatClass, price, availableSeats, nextDay,
                departureTime: new Date(departureTime),
                arrivalTime: new Date(arrivalTime)
            }
        });
        res.status(201).json({ success: true, message: 'Flight created', data: newFlight });
    } catch (error) {
        logger.error('createFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateFlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { 
            flightNumber, departureAirport, arrivalAirport, airlineCode, 
            departureTime, arrivalTime, duration, stops, aircraft, 
            seatClass, price, availableSeats, nextDay 
        } = req.body;

        const updatedFlight = await prisma.flight.update({
            where: { id: Number(id) },
            data: {
                ...(flightNumber && { flightNumber }),
                ...(departureAirport && { departureAirport }),
                ...(arrivalAirport && { arrivalAirport }),
                ...(airlineCode && { airlineCode }),
                ...(duration && { duration }),
                ...(stops !== undefined && { stops }),
                ...(aircraft && { aircraft }),
                ...(seatClass && { seatClass }),
                ...(price && { price }),
                ...(availableSeats !== undefined && { availableSeats }),
                ...(nextDay !== undefined && { nextDay }),
                ...(departureTime && { departureTime: new Date(departureTime) }),
                ...(arrivalTime && { arrivalTime: new Date(arrivalTime) })
            }
        });
        res.json({ success: true, message: 'Flight updated', data: updatedFlight });
    } catch (error) {
        logger.error('updateFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteFlight = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.flight.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Flight deleted' });
    } catch (error) {
        logger.error('deleteFlight error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
