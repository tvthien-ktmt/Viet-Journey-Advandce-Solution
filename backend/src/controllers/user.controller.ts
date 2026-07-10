import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, fullName: true, email: true, phone: true, role: true, createdAt: true }
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'Profile retrieved', data: user });
    } catch (error) {
        logger.error('getProfile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const { fullName, phone } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { fullName, phone },
            select: { id: true, fullName: true, email: true, phone: true, role: true }
        });

        res.json({ success: true, message: 'Profile updated', data: updatedUser });
    } catch (error) {
        logger.error('updateProfile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, fullName: true, email: true, phone: true, role: true, createdAt: true }
        });
        res.json({ success: true, data: users });
    } catch (error) {
        logger.error('getAllUsers error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
