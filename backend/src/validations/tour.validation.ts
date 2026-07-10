import { z } from 'zod';

export const createTourSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Tên tour phải có ít nhất 2 ký tự'),
        price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    }).passthrough()
});

export const updateTourSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        price: z.number().min(0).optional(),
    }).passthrough()
});
