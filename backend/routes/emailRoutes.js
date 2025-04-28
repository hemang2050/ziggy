// routes/emailRoutes.js
import express from 'express';
import { shareItinerary } from '../controllers/emailController.js';

const router = express.Router();

router.post('/share', shareItinerary);

export default router;
