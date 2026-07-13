const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const db = require('./config/db');
const PORT = process.env.PORT || 7000;

const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const memberRoutes = require('./routes/memberRoutes');
const authRoutes = require('./routes/authRoutes');
const membershipRequestRoutes = require("./routes/membershipRequestRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const planRoutes = require("./routes/planRoutes");

// --- CORS CONFIGURATION ---
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ⚡ CRITICAL FIX: Conditionally parse raw body buffer ONLY for Stripe webhooks, 
// and standard JSON everywhere else. This avoids splitting your route logic!
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf; // Stores the pristine raw buffer onto the request object
    }
  }
}));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Debugging middleware for tracking login attempts
app.use((req, res, next) => {
  if (req.path === '/api/auth/login') {
    console.log(`[DEBUG] Login Attempt - Body:`, req.body);
  }
  next();
});

// --- API ROUTES ---
app.use('/api/payments', paymentRoutes); // This handles both /payments/create-checkout-session and /payments/webhook
app.use("/api/plans", planRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', membershipRequestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/member', memberRoutes);

// --- TEST ROUTE: Fetch all users ---
app.get('/api/users', async (req , res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.status(200).json({
            message: "Users fetched successfully",
            data: rows
        });
    } catch (error) {
        console.error('Error executing query: ' , error);
        res.status(500).json({
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Basic health check or root message
app.get('/', (req, res) => {
    res.send('<h1>Gym Management System Backend is Running!</h1>');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening at http://0.0.0.0:${PORT}`);
});