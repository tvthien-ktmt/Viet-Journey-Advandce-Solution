import { Router } from 'express';
import * as controller from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', authenticate, controller.createPaymentUrl);
router.get('/vnpay-ipn', controller.vnpayIpn);

export default router;
