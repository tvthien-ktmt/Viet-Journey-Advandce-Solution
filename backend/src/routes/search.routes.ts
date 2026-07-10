import { Router } from 'express';
import * as controller from '../controllers/search.controller';

const router = Router();

router.get('/', controller.globalSearch);

export default router;
