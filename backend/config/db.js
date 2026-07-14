const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true, 
    keepAliveInitialDelay: 10000 
});

// Get the promise-based connection pool wrapper
const promisePool = pool.promise();

// Clean event listeners to log status without breaking the pool stream
pool.on('connection', () => {
    console.log('🔄 New database connection initialized in pool');
});

pool.on('error', (err) => {
    console.error('❌ Database Pool Error:', err.message);
});

// Export the pool safely
module.exports = promisePool;