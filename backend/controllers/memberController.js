const db = require('../config/db');

// --- Utility Function for Date Calculation ---
// Helper to correctly calculate a new date after adding a specific number of months.
// This handles MySQL date strings (YYYY-MM-DD) and avoids issues when adding months 
// to dates like Jan 31st (which could incorrectly become Mar 2nd).
const addMonths = (dateString, months) => {
    // Parse the date string safely (using 'T00:00:00' prevents timezone shifts on pure dates)
    const date = new Date(dateString + 'T00:00:00'); 
    
    // Get the current day of the month
    const day = date.getDate();

    // Add the specified number of months
    date.setMonth(date.getMonth() + months);

    // If the day is different after setMonth (e.g., Feb 30th doesn't exist, date auto-shifted to Mar 2nd)
    if (date.getDate() !== day) {
        // Set the date to the last day of the target month (e.g., Feb 28th/29th)
        date.setDate(0); 
    }

    // Format to YYYY-MM-DD for MySQL insertion
    return date.toISOString().split('T')[0];
};

// --- 1. GET MEMBER PROFILE (Self-Access) ---
// Route: GET /api/member/profile
exports.getMemberProfile = async (req, res) => {
    const memberUserId = req.user.id; // User ID from authenticated JWT

    try {
        // Query to join User, Member Profile, Plan, and Assigned Trainer data
        const [rows] = await db.execute(
            `SELECT 
                u.id AS user_id,
                u.full_name,
                u.email,
                u.phone,
                u.gender,
                u.dob,
                u.address,
                
                -- Member Profile Fields (Crucially including the newly added columns)
                mp.membership_status,
                mp.health_goals,
                mp.membership_start_date,
                mp.membership_end_date,
                mp.current_plan_id, -- Used for Plan join
                mp.assigned_trainer_id, -- Used for Trainer join
                
                -- Plan Details (Requires JOIN on current_plan_id)
                p.plan_name,
                p.duration_months,
                p.price AS plan_price,
                
                -- Trainer Details (Requires JOIN on assigned_trainer_id)
                tp.user_id AS trainer_id,
                t_user.full_name AS trainer_name,
                tp.specialty AS trainer_specialty
                
            FROM users u
            JOIN member_profiles mp ON u.id = mp.user_id
            -- LEFT JOIN ensures the query works even if plan/trainer IDs are NULL
            LEFT JOIN plans p ON mp.current_plan_id = p.id
            LEFT JOIN trainer_profiles tp ON mp.assigned_trainer_id = tp.user_id
            LEFT JOIN users t_user ON tp.user_id = t_user.id
            WHERE u.id = ?`,
            [memberUserId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Member profile not found." });
        }
        
        res.status(200).json({
            message: "Member profile fetched successfully.",
            profile: rows[0]
        });
        
    } catch (error) {
        console.error("Error fetching member profile:", error);
        res.status(500).json({ 
            message: "Server error while retrieving member profile data.",
            error: error.message
        });
    }
};

// --- 2. GET MEMBER ATTENDANCE HISTORY ---
// Route: GET /api/member/attendance
exports.getMemberAttendance = async (req, res) => {
    const memberUserId = req.user.id;

    try {
        // Query to fetch attendance records and the name of the trainer who checked them in.
        const [attendanceRecords] = await db.execute(
            `SELECT
                a.check_in_time,
                a.trainer_id,
                u.full_name AS checked_in_by_trainer_name
            FROM attendance a
            LEFT JOIN users u ON a.trainer_id = u.id
            WHERE a.member_id = ?
            ORDER BY a.check_in_time DESC`,
            [memberUserId]
        );

        res.status(200).json({
            message: "Attendance history fetched successfully.",
            count: attendanceRecords.length,
            history: attendanceRecords
        });

    } catch (error) {
        console.error("Error fetching member attendance:", error);
        res.status(500).json({
            message: "Server error while retrieving attendance data.",
            error: error.message
        });
    }
};

// --- 3. GET CURRENT MEMBERSHIP PLAN DETAILS ---
// Route: GET /api/member/plan
exports.getMemberPlan = async (req, res) => {
    const memberUserId = req.user.id;

    try {
        // First, find the current plan ID from the member_profiles table
        const [memberProfile] = await db.execute(
            "SELECT current_plan_id FROM member_profiles WHERE user_id = ?",
            [memberUserId]
        );

        if (memberProfile.length === 0 || !memberProfile[0].current_plan_id) {
            return res.status(404).json({ message: "No active membership plan found for this member." });
        }

        const planId = memberProfile[0].current_plan_id;

        // Then, fetch the full plan details
        const [planDetails] = await db.execute(
            "SELECT id, plan_name, price, duration_months, description, created_at FROM plans WHERE id = ?",
            [planId]
        );

        if (planDetails.length === 0) {
            return res.status(404).json({ message: "Plan details not found (Plan ID exists but record is missing)." });
        }

        res.status(200).json({
            message: "Current membership plan fetched successfully.",
            plan: planDetails[0]
        });

    } catch (error) {
        console.error("Error fetching membership plan:", error);
        res.status(500).json({
            message: "Server error while retrieving plan data.",
            error: error.message
        });
    }
};

// --- 4. INITIATE PLAN RENEWAL (Self-Access) ---
// Route: POST /api/member/renew
// In a real app, this would be the final step after a payment gateway confirms success.
exports.initiateRenewal = async (req, res) => {
    const memberUserId = req.user.id;

    try {
        // 1. Get member's current plan info
        const [memberData] = await db.execute(
            `SELECT 
            current_plan_id,
            membership_end_date
            FROM member_profiles
            WHERE user_id = ?`,
            [memberUserId]
        );

        if (memberData.length === 0) {
            return res.status(404).json({ message: "Member profile not found." });
        }
        const { current_plan_id, membership_end_date } = memberData[0];

        if (!current_plan_id) {
            return res.status(400).json({
                message: "Renewal failed: Member does not have an active plan to renew."
            });
        }
        
        // 2. Get the duration of the current plan to calculate the new end date 
        const [planDetails] = await db.execute(
            `SELECT duration_months FROM plans WHERE id = ?`,
            [current_plan_id]
        );

        if (planDetails.length === 0) {
            return res.status(500).json({
                message: "Configuration Error: Assigned plan details could not be retrieved."
            });
        }
        const duration = planDetails[0].duration_months;

        // Calculate the new end date
        let renewalStartDate;
        
        // Determine the start date for the new period:
        if (!membership_end_date || new Date(membership_end_date) < new Date()) {
            // Case 1: Plan is null or expired. Renewal starts today.
            renewalStartDate = new Date().toISOString().split('T')[0];
        } else {
             // Case 2: Plan is active. Renewal starts the day after the current end date.
            const endDate = new Date(membership_end_date);
            // Increment the end date by one day
            endDate.setDate(endDate.getDate() + 1); 
            renewalStartDate = endDate.toISOString().split('T')[0];
        }

        const newEndDate = addMonths(renewalStartDate, duration);

        // 3. Update the member profile
        const [result] = await db.execute(
            `UPDATE member_profiles
            SET 
            membership_status = 'Active',
            membership_end_date = ?
            WHERE user_id = ?`,
            [newEndDate, memberUserId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(500).json({
                message: "Renewal database update failed. Check member profile existence."
            });
        }
        
        res.status(200).json({
            message: "Plan renewal initiated and membership end date extended successfully.",
            user_id: memberUserId,
            new_end_date: newEndDate,
            plan_id: current_plan_id
        });
    } catch (error) {
        console.error("Error initiating plan renewal:", error);
        res.status(500).json({
            message: "Server error during plan renewal process.",
            error: error.message
        });
    }
};