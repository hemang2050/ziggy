import express from 'express';
import { shareItinerary } from '../controllers/shareController.js';

const router = express.Router();

router.post('/', shareItinerary);

export default router;
