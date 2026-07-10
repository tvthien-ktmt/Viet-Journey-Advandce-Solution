import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// Get all promotions
router.get('/', async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { isActive: true }
    });
    res.json(promotions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get promotion by code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const promotion = await prisma.promotion.findUnique({
      where: { code }
    });
    if (!promotion || !promotion.isActive) {
      return res.status(404).json({ message: 'Promotion not found or inactive' });
    }
    res.json(promotion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
