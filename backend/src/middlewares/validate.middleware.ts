import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: (error as any).errors.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
            });
            return;
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
