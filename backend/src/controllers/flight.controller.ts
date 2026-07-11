import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const searchFlights = async (req: Request, res: Response): Promise<void> => {
    try {
        const { departureAirport, arrivalAirport, departureTime, page = '0', size = '10' } = req.query;

        if (departureAirport && arrivalAirport && departureAirport === arrivalAirport) {
            res.status(400).json({ success: false, message: 'Departure and arrival airports cannot be the same' });
            return;
        }

        // Simplified search logic
        let dateFilter = {};
        if (departureTime) {
            const startOfDay = new Date(departureTime as string);
            startOfDay.setUTCHours(0, 0, 0, 0);
            
            // Do not allow searching for dates before today
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);
            if (startOfDay < today) {
                res.status(400).json({ success: false, message: 'Cannot search for past flights' });
                return;
            }
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

export const getFlightStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { flightNumber, origin, destination, date } = req.query;
        let flights: any[] = [];
        
        if (flightNumber) {
            flights = await prisma.flight.findMany({
                where: { flightNumber: String(flightNumber) },
                orderBy: { departureTime: 'desc' }
            });
        } else if (origin && destination) {
            flights = await prisma.flight.findMany({
                where: { 
                    departureAirport: String(origin),
                    arrivalAirport: String(destination)
                },
                orderBy: { departureTime: 'desc' },
                take: 5
            });
        }

        if (!flights || flights.length === 0) {
            res.status(404).json({ success: false, message: 'Flight not found' });
            return;
        }

        const now = new Date();
        const results = flights.map(flight => {
            let status = 'SCHEDULED';
            const dept = new Date(flight.departureTime);
            const arr = new Date(flight.arrivalTime);

            if (now >= arr) {
                status = 'LANDED';
            } else if (now >= dept) {
                status = 'IN_AIR';
            } else if (now >= new Date(dept.getTime() - 45 * 60000)) {
                status = 'BOARDING';
            }
            
            return {
                ...flight,
                status,
                gate: 'A12',
                terminal: 'T1',
                baggageClaim: 'Carousel 4'
            };
        });

        res.json({
            success: true,
            data: flightNumber ? results[0] : results
        });
    } catch (error) {
        logger.error('getFlightStatus error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getSeatMap = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const flight = await prisma.flight.findUnique({
            where: { id: Number(id) }
        });

        if (!flight) {
            res.status(404).json({ success: false, message: 'Flight not found' });
            return;
        }

        // Generate deterministic seat map for this flight
        const generateSeatMap = () => {
            const seats = [];
            const COLUMNS_BUSINESS = ['A', 'C', 'D', 'G'];
            const COLUMNS_ECONOMY = ['A', 'B', 'C', 'D', 'E', 'G'];
            
            // Seeded random based on flight number + date
            const seedStr = `${flight.flightNumber}-${flight.departureTime.toISOString()}`;
            let hash = 0;
            for (let i = 0; i < seedStr.length; i++) {
                hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
            }
            const seededRandom = () => {
                hash = Math.sin(hash) * 10000;
                return hash - Math.floor(hash);
            };

            for (let row = 1; row <= 30; row++) {
                const isBusiness = row <= 3;
                const isExitRow = row === 12 || row === 14;
                const isPremium = row >= 4 && row <= 6;
                const columns = isBusiness ? COLUMNS_BUSINESS : COLUMNS_ECONOMY;
                const type = isBusiness ? 'business' : (isExitRow ? 'exit-row' : (isPremium ? 'premium' : 'economy'));
                
                let price = 0;
                if (isBusiness) price = 800000;
                else if (isPremium) price = 150000;
                else if (isExitRow) price = 250000;
                else price = 80000;

                for (const col of columns) {
                    const id = `${row}${col}`;
                    let status = 'available';
                    
                    // Randomly occupy seats, more likely for economy
                    const rand = seededRandom();
                    if (isBusiness && rand < 0.3) status = 'occupied';
                    else if (!isBusiness && rand < 0.6) status = 'occupied';

                    seats.push({
                        id, row, col, type, status, price
                    });
                }
            }
            return seats;
        };

        const seats = generateSeatMap();
        res.json({ success: true, data: seats });
    } catch (error) {
        logger.error('getSeatMap error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
