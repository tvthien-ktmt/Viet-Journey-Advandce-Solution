import { z } from 'zod';

export const createFlightSchema = z.object({
    body: z.object({
        flightNumber: z.string().min(2, 'Số chuyến bay phải có ít nhất 2 ký tự'),
        departureAirport: z.string().min(2),
        arrivalAirport: z.string().min(2),
        price: z.number().min(0),
    }).passthrough()
});

export const updateFlightSchema = z.object({
    body: z.object({
        flightNumber: z.string().min(2).optional(),
        departureAirport: z.string().min(2).optional(),
        arrivalAirport: z.string().min(2).optional(),
        price: z.number().min(0).optional(),
    }).passthrough()
});
