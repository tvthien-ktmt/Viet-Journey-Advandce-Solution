import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
        email: z.string().email('Email không hợp lệ'),
        password: z.string()
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
            .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
            .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),
        phone: z.string().optional()
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Email không hợp lệ'),
        password: z.string().min(1, 'Vui lòng nhập mật khẩu')
    })
});
