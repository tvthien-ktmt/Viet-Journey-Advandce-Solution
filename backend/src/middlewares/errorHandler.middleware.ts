import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    console.error('Global Error Handler:', err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(400).json({ success: false, message: 'Duplicate field value entered' });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Record not found' });
            return;
        }
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        res.status(400).json({ success: false, message: 'Validation Error', error: err.message });
        return;
    }

    if (err.name === 'ZodError') {
        res.status(400).json({ success: false, message: 'Invalid Input Data', error: err.issues });
        return;
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
