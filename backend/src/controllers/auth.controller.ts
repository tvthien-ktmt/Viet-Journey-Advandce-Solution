import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import crypto from 'crypto';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';

const generateTokens = (user: any) => {
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
    return { token, refreshToken };
};

const setCookie = (res: Response, token: string, refreshToken: string) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 mins
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password, phone } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                phone
            }
        });

        const { token, refreshToken } = generateTokens(newUser);
        setCookie(res, token, refreshToken);

        await prisma.refreshToken.deleteMany({ where: { userId: newUser.id } });

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            data: { 
                token, 
                refreshToken,
                user: { id: String(newUser.id), email: newUser.email, fullName: newUser.fullName, role: newUser.role, roles: [newUser.role] } 
            }
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(400).json({ success: false, message: 'Email đã tồn tại!' });
            return;
        }
        logger.error('register error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(400).json({ success: false, message: 'Sai email hoặc mật khẩu' });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400).json({ success: false, message: 'Sai email hoặc mật khẩu' });
        return;
    }

    const { token, refreshToken } = generateTokens(user);
    setCookie(res, token, refreshToken);

    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
            token,
            refreshToken,
            user: {
                id: String(user.id),
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                roles: [user.role]
            }
        }
    });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }

    res.json({
        success: true,
        data: {
            id: String(user.id),
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            roles: [user.role]
        }
    });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    // FE might send refresh token in body or cookies depending on implementation. Let's try to get it.
    let rToken = req.body.refreshToken || (req.cookies && req.cookies.refreshToken);
    
    // If not provided in body, wait, in FE contract: `await axios.post(BASE_URL + '/auth/refresh', {}, { withCredentials: true });`
    // Which means it relies on cookies! If FE expects to use refresh token from cookie, we need to read it.
    // However, I returned `refreshToken` in response body earlier, FE might not set it in cookie automatically.
    // Let's assume FE sends it in the cookie if it can, or we can check the database for the last valid one? No, that's not secure.
    // If we want FE to use refresh token via cookie, we MUST set it as cookie during login/register!
    
    if (!rToken) {
        // Find by userId from the expired token in req? We don't have auth middleware here usually.
        res.status(401).json({ success: false, message: 'Refresh token required' });
        return;
    }

    try {
        const decoded = jwt.verify(rToken, JWT_REFRESH_SECRET) as { id: number };
        const storedToken = await prisma.refreshToken.findUnique({ where: { token: rToken } });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        const tokens = generateTokens(user);
        setCookie(res, tokens.token, tokens.refreshToken);

        await prisma.refreshToken.delete({ where: { token: rToken } }).catch(() => {});

        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.json({
            success: true,
            data: {
                token: tokens.token,
                refreshToken: tokens.refreshToken,
                user: {
                    id: String(user.id),
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    roles: [user.role]
                }
            }
        });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    // If we received a refresh token in body, delete it
    if (req.body.refreshToken) {
        await prisma.refreshToken.deleteMany({ where: { token: req.body.refreshToken } }).catch(() => {});
    }
    res.json({ success: true, message: 'Logged out successfully' });
};

import { sendOTP } from '../utils/email.service';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.json({ success: true, message: 'Nếu email tồn tại trong hệ thống, mã OTP đã được gửi' });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiresAt }
        });

        await sendOTP(email, otp);
        res.json({ success: true, message: 'Nếu email tồn tại trong hệ thống, mã OTP đã được gửi' });
    } catch (error) {
        logger.error('forgotPassword error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            res.status(400).json({ success: false, message: 'OTP không hợp lệ hoặc đã hết hạn' });
            return;
        }

        res.json({ success: true, message: 'Xác thực OTP thành công' });
    } catch (error) {
        logger.error('verifyOTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            res.status(400).json({ success: false, message: 'Yêu cầu không hợp lệ' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword, otp: null, otpExpiresAt: null }
        });

        res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        logger.error('Reset Password error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const sendLoginOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.json({ success: true, message: 'Nếu email tồn tại, OTP đã được gửi.' });
            return;
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiresAt }
        });

        // Mock sending email
        logger.info(`Login OTP for ${email}: ${otp}`);

        res.json({ success: true, message: 'Nếu email tồn tại, OTP đã được gửi.' });
    } catch (error) {
        logger.error('sendLoginOTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const verifyLoginOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            res.status(400).json({ success: false, message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
            return;
        }

        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpiresAt: null }
        });

        const tokens = generateTokens(user);
        setCookie(res, tokens.token, tokens.refreshToken);

        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.json({
            success: true,
            data: {
                token: tokens.token,
                user: { id: String(user.id), email: user.email, fullName: user.fullName, role: user.role, roles: [user.role] }
            }
        });
    } catch (error) {
        logger.error('verifyLoginOTP error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const mockGoogleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name } = req.body;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    fullName: name || 'Google User',
                    password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10)
                }
            });
        }

        const tokens = generateTokens(user);
        setCookie(res, tokens.token, tokens.refreshToken);

        await prisma.refreshToken.create({
            data: {
                token: tokens.refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        res.json({
            success: true,
            data: {
                token: tokens.token,
                user: { id: String(user.id), email: user.email, fullName: user.fullName, role: user.role, roles: [user.role] }
            }
        });
    } catch (error) {
        logger.error('mockGoogleLogin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
