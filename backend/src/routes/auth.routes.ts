import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' }
});

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.get('/me', authenticate, controller.getMe);
router.post('/refresh', controller.refreshToken);
router.post('/logout', authenticate, controller.logout);
router.post('/change-password', authenticate, controller.changePassword);

router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-otp', controller.verifyOTP);
router.post('/reset-password', controller.resetPassword);

router.post('/login-otp/send', controller.sendLoginOTP);
router.post('/login-otp/verify', controller.verifyLoginOTP);
router.post('/oauth/google', controller.mockGoogleLogin);

export default router;
