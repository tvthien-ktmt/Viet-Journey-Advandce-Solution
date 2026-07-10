import { Router } from 'express';
import * as controller from '../controllers/flight.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/search', controller.searchFlights);
router.get('/:id', controller.getFlightById);

// Admin only
router.post('/', authenticate, authorizeAdmin, controller.createFlight);
router.put('/:id', authenticate, authorizeAdmin, controller.updateFlight);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteFlight);

export default router;
