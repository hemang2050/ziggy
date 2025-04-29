// backend/controllers/authController.js
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// backend/controllers/authController.js


export const signupUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashedPassword });
  
      // Generate email confirmation token
      const confirmationToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      const confirmLink = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
  
      // Setup transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Send confirmation email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: 'Confirm your Ziggy account',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-block; background: #3b82f6; border-radius: 50%; width: 50px; height: 50px; line-height: 50px;">
                  <span style="font-size: 24px; color: white;">◇</span>
                </div>
                <h1 style="margin-top: 10px; font-size: 24px; color: #1f2937;">Ziggy</h1>
              </div>
  
              <h2 style="color: #111827;">Confirm your email address</h2>
              <p style="color: #4b5563; font-size: 15px;">Hello ${name.split(' ')[0]},</p>
              <p style="color: #4b5563; font-size: 15px;">Thanks for signing up with Ziggy! Please confirm your email address by clicking the button below.</p>
  
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Confirm Email</a>
              </div>
  
              <p style="color: #6b7280; font-size: 13px;">If you didn't create an account, you can safely ignore this email.</p>
  
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="text-align: center; font-size: 12px; color: #9ca3af;">© 2025 Ziggy. All rights reserved.</p>
            </div>
          </div>
        `
      });
  
      res.status(201).json({
        message: 'Signup successful! Please check your email to confirm your account.',
      });
  
    } catch (err) {
      console.error('Signup Error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({
        token,
        userId: user._id,
        email: user.email,
        name: user.name, // ✅ ADD THIS
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

//Forgot password 
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
  
      // ✅ Use dynamic frontend URL
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
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


// Confirm email
export const confirmEmail = async (req, res) => {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      if (user.isVerified) {
        return res.status(200).json({ message: 'Email already verified' });
      }
  
      user.isVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Email confirmed successfully!' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };