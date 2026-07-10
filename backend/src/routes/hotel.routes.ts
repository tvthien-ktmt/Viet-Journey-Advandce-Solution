import { Router } from 'express';
import * as controller from '../controllers/hotel.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createHotelSchema, updateHotelSchema } from '../validations/hotel.validation';

const router = Router();

router.get('/', controller.getAllHotels);
router.get('/:id', controller.getHotelById);

// Admin only
router.post('/', authenticate, authorizeAdmin, validate(createHotelSchema), controller.createHotel);
router.put('/:id', authenticate, authorizeAdmin, validate(updateHotelSchema), controller.updateHotel);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteHotel);

export default router;
