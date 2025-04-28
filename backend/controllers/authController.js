// backend/controllers/authController.js
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Sign up a new user
export const signupUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
  
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(201).json({ 
        message: 'User registered successfully',
        token,
        userId: newUser._id,
        email: newUser.email
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Log in user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, userId: user._id, email: user.email });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Forgot password 
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No account with that email found' });
      }
  
      // Generate a short-lived token (15 minutes)
      const resetToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
  
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  
      // Set up nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Email contents
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password.</p>
          <p><a href="${resetLink}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a></p>
          <p>If you did not request this, you can ignore this email.</p>
          <p><b>Note:</b> This link will expire in 15 minutes.</p>
        `
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Password reset email sent successfully' });
  
    } catch (err) {
      console.error('Forgot Password Error:', err.message);
      res.status(500).json({ message: 'Something went wrong, try again later' });
    }
  };


  // Reset password
  // Reset Password
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ message: 'Invalid token or user not found' });
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful!' });
  
    } catch (err) {
      console.error('Reset Password Error:', err.message);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };
