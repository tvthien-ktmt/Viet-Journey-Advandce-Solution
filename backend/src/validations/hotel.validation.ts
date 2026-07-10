import { z } from 'zod';

export const createHotelSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Tên khách sạn phải có ít nhất 2 ký tự'),
        price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    }).passthrough()
});

export const updateHotelSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        price: z.number().min(0).optional(),
    }).passthrough()
});
