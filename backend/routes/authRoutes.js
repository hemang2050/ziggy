import express from 'express';
import { signupUser, loginUser, forgotPassword, resetPassword, confirmEmail } from '../controllers/authController.js';  // ✅ Correct import

const router = express.Router();

// Signup route
router.post('/signup', (req, res, next) => {
  console.log('📡 /signup route hit');
  next();
}, signupUser);

// Login route
router.post('/login', loginUser);

// Confirm email route
router.post('/confirm-email', confirmEmail); // ✅ Correct usage

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

export default router;