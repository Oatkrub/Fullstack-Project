// Load env vars at the very top
require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const socialRoutes = require('./routes/social');
const app = express();

// Connect to Database using the logic in db.js
connectDB();

app.use(cors({
  origin: 'http://localhost:3000', // Allow your Next.js app
  credentials: true                // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());
// Use the PORT from .env or default to 3000
const PORT = process.env.PORT || 3000;

// mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/social', socialRoutes);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});