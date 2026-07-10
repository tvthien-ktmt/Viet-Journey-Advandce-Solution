import { z } from 'zod';

export const createBookingSchema = z.object({
    body: z.object({
        bookingType: z.enum(['flight', 'tour', 'hotel']),
        referenceId: z.number().int().positive(),
        passengers: z.array(z.object({
            fullName: z.string().min(2),
            documentNumber: z.string().optional().nullable(),
            type: z.string().optional().nullable(),
            birthDate: z.string().optional().nullable(),
            gender: z.string().optional().nullable(),
            seatNumber: z.string().optional().nullable(),
            baggage: z.string().optional().nullable(),
            meal: z.string().optional().nullable()
        })).optional().nullable(),
        contactEmail: z.string().email('Email không hợp lệ').optional().nullable(),
        contactPhone: z.string().optional().nullable()
    }).passthrough()
});
