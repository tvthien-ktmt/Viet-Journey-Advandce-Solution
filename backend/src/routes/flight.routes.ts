import { Router } from 'express';
import * as controller from '../controllers/flight.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createFlightSchema, updateFlightSchema } from '../validations/flight.validation';

const router = Router();

router.get('/', controller.searchFlights);
router.get('/status/:flightNumber', controller.getFlightStatus);
router.get('/:id/seat-map', controller.getSeatMap);
router.get('/:id', controller.getFlightById);

// Admin only
router.post('/', authenticate, authorizeAdmin, validate(createFlightSchema), controller.createFlight);
router.put('/:id', authenticate, authorizeAdmin, validate(updateFlightSchema), controller.updateFlight);
router.delete('/:id', authenticate, authorizeAdmin, controller.deleteFlight);

export default router;
