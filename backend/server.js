import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

dotenv.config();

const app = express();

// Updated CORS configuration to fix the preflight request issue
app.use(cors({
  origin: ['https://ziggy-frontend.vercel.app', 'https://ziggy-llyf.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'x-client-key',
    'x-client-token',
    'x-client-secret',
    'Authorization'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/email', emailRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Test route
app.get('/test', (req, res) => {
  res.send('✅ Server is working');
});

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));