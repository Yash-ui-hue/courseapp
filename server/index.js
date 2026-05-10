const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const authRoutes    = require('./routes/auth');
const aadhaarRoutes = require('./routes/aadhaar');
const paymentRoutes = require('./routes/payment');
const allowedOrigins = [
  'http://localhost:5173',
  'https://courseapp-pi.vercel.app',
  'https://courseapp-git-main-yashdemo.vercel.app',
];


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use('/api/auth',    authRoutes);
app.use('/api/aadhaar', aadhaarRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));