const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 7000;

//Middleware to parse JSON bodies
app.use(express.json());

// --- TEST ROUTE: Fetch all users from a table ---

// --- ROUTES ---
// Admin routes for managing users, plans, etc.
app.use('/api/admin', adminRoutes);

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