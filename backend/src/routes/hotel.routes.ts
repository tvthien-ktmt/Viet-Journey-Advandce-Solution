import { Router } from 'express';
import * as controller from '../controllers/hotel.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', controller.getAllHotels);
router.get('/:id', controller.getHotelById);

// Admin only
router.post('/', authenticate, authorizeAdmin, controller.createHotel);
router.put('/:id', authenticate, authorizeAdmin, controller.updateHotel);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteHotel);

export default router;
