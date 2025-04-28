import express from 'express';
import { createBooking, getBookings, deleteBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.delete('/:id', protect, deleteBooking); // ← ADD THIS LINE

export default router;

