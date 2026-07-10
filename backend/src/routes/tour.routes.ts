import { Router } from 'express';
import * as controller from '../controllers/tour.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTourSchema, updateTourSchema } from '../validations/tour.validation';

const router = Router();

router.get('/', controller.getAllTours);
router.get('/:idOrSlug', controller.getTourByIdOrSlug);

// Admin only routes
router.post('/', authenticate, authorizeAdmin, validate(createTourSchema), controller.createTour);
router.put('/:id', authenticate, authorizeAdmin, validate(updateTourSchema), controller.updateTour);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteTour);

export default router;
