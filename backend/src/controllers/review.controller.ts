import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import prisma from '../utils/prisma';

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { tourId, rating, comment } = req.body;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const newReview = await prisma.review.create({
            data: {
                userId,
                tourId: tourId ? Number(tourId) : null,
                rating: Number(rating),
                comment
            }
        });

        res.status(201).json({ success: true, message: 'Review added', data: newReview });
    } catch (error) {
        console.error('addReview error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getTourReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { tourId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { tourId: Number(tourId) },
            include: { user: { select: { id: true, fullName: true } } },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: reviews });
    } catch (error) {
        console.error('getTourReviews error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const review = await prisma.review.findUnique({ where: { id: Number(id) } });

        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }

        if (review.userId !== userId && req.user?.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        await prisma.review.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        console.error('deleteReview error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
