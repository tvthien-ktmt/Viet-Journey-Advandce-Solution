import { Router } from 'express';
import * as controller from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, controller.getMyWishlist);
router.post('/', authenticate, controller.addToWishlist);
router.delete('/:id', authenticate, controller.removeFromWishlist);

export default router;
