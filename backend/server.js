const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const PORT = process.env.PORT || 7000;
const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const memberRoutes = require('./routes/memberRoutes');
const authRoutes = require('./routes/authRoutes');

//Middleware to parse JSON bodies
app.use(express.json());


// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Public Authentication routes (Login)
app.use('/api/auth', authRoutes);

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