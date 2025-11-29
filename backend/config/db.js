const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // gym_management_system
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get the promise-based connection pool
const promisePool = pool.promise();

// Optional: Test the connection when the pool is created
promisePool.getConnection()
    .then(connection => {
        console.log('✅ Connected to the MySQL database!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
    });


// Export the pool to be used in routes/controllers
module.exports = promisePool;