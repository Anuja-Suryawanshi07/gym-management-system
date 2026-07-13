const db = require("../config/db");
const bcrypt = require("bcrypt"); // Added bcrypt for hashing

/**
 * Public: Create membership request
 * POST /api/public/membership-requests
 */

const createMembershipRequest = async (req, res) => {
    // Added password to the destructured body fields
    const { full_name, email, phone, password, message } = req.body;

    // Validate that password is also provided
    if (!full_name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        // Hash the password securely before saving it to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Updated SQL query to include the password column (adjust the column name to match your DB schema, e.g., password_hash)
        const sql = `
        INSERT INTO membership_requests (full_name, email, phone, password_hash, message) 
        VALUES (?, ?, ?, ?, ?)`;

        // Included hashedPassword in the array mapping to the query parameters
        await db.query(sql, [full_name, email, phone, hashedPassword, message]);

        res.status(201).json({
            message: "Membership request submitted successfully",
        });
    } catch (error) {
        console.error("Membership request error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createMembershipRequest };