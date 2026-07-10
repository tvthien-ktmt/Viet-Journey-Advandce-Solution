import { Router } from 'express';
import * as controller from '../controllers/contact.controller';

const router = Router();

router.post('/', controller.submitContactForm);

export default router;
