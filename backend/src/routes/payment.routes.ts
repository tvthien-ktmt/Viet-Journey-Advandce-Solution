import { Router } from 'express';
import * as controller from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', authenticate, controller.createPaymentUrl);
router.post('/qr', authenticate, controller.createQRPayment);
router.get('/:id/status', authenticate, controller.getPaymentStatus);
router.post('/webhook', controller.mockWebhook);
router.get('/vnpay-ipn', controller.vnpayIpn);

export default router;
