import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', authenticate, controller.getMe);
router.post('/refresh', controller.refreshToken);
router.post('/logout', authenticate, controller.logout);

router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-otp', controller.verifyOTP);
router.post('/reset-password', controller.resetPassword);

router.post('/login-otp/send', controller.sendLoginOTP);
router.post('/login-otp/verify', controller.verifyLoginOTP);
router.post('/oauth/google', controller.mockGoogleLogin);

export default router;
