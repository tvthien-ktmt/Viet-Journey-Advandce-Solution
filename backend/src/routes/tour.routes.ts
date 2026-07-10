import { Router } from 'express';
import * as controller from '../controllers/tour.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', controller.getAllTours);
router.get('/:idOrSlug', controller.getTourByIdOrSlug);

// Admin only routes
router.post('/', authenticate, authorizeAdmin, controller.createTour);
router.put('/:id', authenticate, authorizeAdmin, controller.updateTour);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteTour);

export default router;
