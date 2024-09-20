import { Router } from 'express';
import { createEvent, deleteEvent, listEvents, updateEvent } from '../controllers/eventController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createEvent);
router.get('/', listEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Add more routes for update, delete, and filtering events

export default router;
