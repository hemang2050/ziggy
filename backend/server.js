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

app.use(cors({
    origin: ['https://ziggy-frontend.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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