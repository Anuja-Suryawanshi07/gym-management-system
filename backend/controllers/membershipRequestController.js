const db = require("../config/db");

/**
 * Public: Create membership request
 * POST /api/public/membership-requests
 */

const createMembershipRequest = async (req, res) => {
    const { full_name, email, phone, message } = req.body;

    if (!full_name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    try {
        const sql = `
        INSERT INTO membership_requests (full_name, email, phone, message) 
        VALUES (?, ?, ?, ?)`;

        await db.query(sql, [full_name, email, phone, message]);

        res.status(201).json({
            message: "Membership request submitted successfully",
        });
    } catch (error) {
        console.error("Membership request error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { createMembershipRequest };
