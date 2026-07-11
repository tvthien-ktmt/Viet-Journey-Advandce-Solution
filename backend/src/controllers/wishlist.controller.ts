import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const getMyWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId },
            include: { tour: true, hotel: true }
        });

        res.json({ success: true, data: wishlist });
    } catch (error) {
        logger.error('getMyWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { tourId, hotelId } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const item = await prisma.wishlist.create({
            data: {
                userId,
                tourId: tourId ? Number(tourId) : null,
                hotelId: hotelId ? Number(hotelId) : null,
            }
        });

        res.status(201).json({ success: true, message: 'Added to wishlist', data: item });
    } catch (error) {
        logger.error('addToWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        await prisma.wishlist.deleteMany({
            where: {
                id: Number(id),
                userId
            }
        });

        res.json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        logger.error('removeFromWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
