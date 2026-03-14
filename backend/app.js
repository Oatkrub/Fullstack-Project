require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
 
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const socialRoutes = require('./routes/social');
const app = express();
 
// Connect to Database
connectDB();
 
app.use(cors({
  // Allow both your Next.js app AND any mobile device (Expo sends no 'origin')
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow your Next.js frontend
    if (origin === 'http://localhost:3000') return callback(null, true);
    // Block everything else
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
 
app.use(express.json());
app.use(cookieParser());
 
const PORT = process.env.PORT || 5000;
 
// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/social', socialRoutes);
 
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
 