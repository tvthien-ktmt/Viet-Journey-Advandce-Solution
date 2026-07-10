import { Router } from 'express';
import * as controller from '../controllers/addons.controller';

const router = Router();

router.get('/baggage', controller.getBaggagePricing);
router.get('/meals', controller.getMealOptions);
router.get('/insurance', controller.getInsuranceOptions);

export default router;
