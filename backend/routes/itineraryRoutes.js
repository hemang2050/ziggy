import express from 'express';
import { saveTripRating } from '../controllers/itineraryController.js';

const router = express.Router();

router.post('/:tripId/rating', saveTripRating);

export default router;
