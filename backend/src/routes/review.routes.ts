import { Router } from 'express';
import * as controller from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/tour/:tourId', controller.getTourReviews);
router.post('/', authenticate, controller.addReview);
router.delete('/:id', authenticate, controller.deleteReview);

export default router;
