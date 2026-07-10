import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import logger from '../utils/logger';

export const getLoyaltyHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        const history = await prisma.loyaltyTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { lotusmilesTier: true, lotusmilesMiles: true }
        });

        res.json({
            success: true,
            data: {
                tier: user?.lotusmilesTier || 'SILVER',
                miles: user?.lotusmilesMiles || 0,
                history
            }
        });
    } catch (error) {
        logger.error('getLoyaltyHistory error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
