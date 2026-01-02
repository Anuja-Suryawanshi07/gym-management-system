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
// --- CORS CONFIGURATION ---
// This tells the browser that requests from your frontend origin are allowed
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL (e.g., http://localhost:3000)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.path === '/api/auth/login') {
    console.log(`[DEBUG] Login Attempt - Body:`, req.body);
  }
  next();
});


// Public Authentication routes (Login)
app.use('/api/auth', authRoutes);

// Public Membership Request routes
app.use('/api/public', membershipRequestRoutes);

// --- TEST ROUTE: Fetch all users from a table ---

// --- ROUTES ---
// Admin routes for managing users, plans, etc.
app.use('/api/admin', adminRoutes);

// Trainer routes
app.use('/api/trainer', trainerRoutes);

// member routes
app.use('/api/member', memberRoutes);


app.get('/api/users', async (req , res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        
        res.status(200).json({
            message: "Users fetched successfully",
            data: rows
        });
    }catch (error) {
        console.error('Error executing query: ' , error);
        res.status(500).json({
            message:'Failed to fetch users',
            error: error.message
        });
    }
});
// Basic health check or root message
app.get('/', (req, res) => {
    res.send('<h1>Gym Management System Backend is Running!</h1>');
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});