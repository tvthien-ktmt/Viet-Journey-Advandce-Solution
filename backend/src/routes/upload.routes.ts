import { Router } from 'express';
import * as controller from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, controller.uploadFile);

export default router;
