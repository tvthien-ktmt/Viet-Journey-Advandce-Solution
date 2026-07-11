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

const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5,
    keyGenerator: (req) => {
        return req.body.email ? `${req.ip}_${req.body.email}` : (req.ip || 'unknown');
    },
    message: { success: false, message: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 5 phút.' }
});

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.get('/me', authenticate, controller.getMe);
router.post('/refresh', controller.refreshToken);
router.post('/logout', authenticate, controller.logout);
router.post('/change-password', authenticate, controller.changePassword);

router.post('/forgot-password', otpLimiter, controller.forgotPassword);
router.post('/verify-otp', otpLimiter, controller.verifyOTP);
router.post('/reset-password', otpLimiter, controller.resetPassword);

router.post('/login-otp/send', otpLimiter, controller.sendLoginOTP);
router.post('/login-otp/verify', otpLimiter, controller.verifyLoginOTP);
router.post('/oauth/google', controller.mockGoogleLogin);

export default router;
