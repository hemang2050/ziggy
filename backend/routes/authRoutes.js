// backend/routes/authRoutes.js

import express from 'express';
import { signupUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';


const router = express.Router();

// Signup route
router.post('/signup', (req, res, next) => {
    console.log('📡 /signup route hit');
    next();
  }, signupUser);
  

// Login route
router.post('/login', loginUser);

//Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

export default router;  // ✅ Important: Export default router
