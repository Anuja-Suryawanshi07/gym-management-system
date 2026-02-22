const { message } = require('statuses');
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
                DATE_FORMAT(mp.membership_start_date, '%Y-%m-%d') AS membership_start_date,
                DATE_FORMAT(mp.membership_end_date, '%Y-%m-%d') AS membership_end_date,
                mp.current_plan_id, -- Used for Plan join
                mp.assigned_trainer_id, -- Used for Trainer join
                
                -- Plan Details (Requires JOIN on current_plan_id)
                p.plan_name,
                p.duration_months,
                p.price AS plan_price,
                
                -- Trainer Details (Requires JOIN on assigned_trainer_id)
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
        console.log("Member Profile Query Result:", rows);
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
        const [rows] = await db.execute(
            `SELECT
                a.id AS attendance_id,
                DATE_FORMAT(a.check_in_at, '%Y-%m-%d') AS date,
                TIME_FORMAT(a.check_in_at, '%h:%i %p') AS check_in_time,
                TIME_FORMAT(a.check_out_at, '%h:%i %p') AS check_out_time,

                TIMESTAMPDIFF (
                    MINUTE,
                    a.check_in_at,
                    a.check_out_at
                ) AS duration_minutes,

                a.notes,
                u.full_name AS trainer_name
                FROM attendance a
                LEFT JOIN users u ON a.trainer_id = u.id
                WHERE a.member_id = ?
                ORDER BY a.check_in_at DESC `,
                [memberUserId]
        );

        res.status(200).json({
            message: "Attendance history fetched successfully.",
            count: rows.length,
            attendance: rows
        });
    } catch (error) {
        console.error("Error fetching member attendance:", error);
        res.status(500).json({
            message: "Server error while retrieving attendance data."
        });
    }    
};   

// --- 3. GET CURRENT MEMBERSHIP PLAN DETAILS ---
// Route: GET /api/member/plan
exports.getMemberPlan = async (req, res) => {
    const memberUserId = req.user.id;

    try {
        // 1. Fetch current plan + properly formatted membership dates
        const [memberProfile] = await db.execute(
            `
            SELECT 
                current_plan_id,
                DATE_FORMAT(membership_start_date, '%Y-%m-%d') AS membership_start_date,
                DATE_FORMAT(membership_end_date, '%Y-%m-%d') AS membership_end_date
            FROM member_profiles
            WHERE user_id = ?
            `,
            [memberUserId]
        );

        if (memberProfile.length === 0 || !memberProfile[0].current_plan_id) {
            return res.status(404).json({
                message: "No active membership plan found for this member."
            });
        }

        const {
            current_plan_id: planId,
            membership_start_date,
            membership_end_date
        } = memberProfile[0];

        // 2. Fetch plan details
        const [planDetails] = await db.execute(
            `
            SELECT 
                id,
                plan_name,
                duration_months,
                price,
                description,
                status
            FROM plans
            WHERE id = ?
            `,
            [planId]
        );

        if (planDetails.length === 0) {
            return res.status(404).json({
                message: "Plan details not found (Plan ID exists but record is missing)."
            });
        }

        // 3. Combine plan + membership dates
        const finalPlanDetails = {
            ...planDetails[0],
            membership_start_date,
            membership_end_date
        };

        res.status(200).json({
            message: "Current membership plan fetched successfully.",
            plan: finalPlanDetails
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
// This simulates the successful confirmation of a renewal payment.
exports.initiateRenewal = async (req, res) => {
    const memberUserId = req.user.id;

    try {
        // 1. Get member plan info
        const [memberData] = await db.execute(
            `SELECT current_plan_id, membership_end_date
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
                message: "No active plan found to renew."
            });
        }

        // 2. Get plan details
        const [planRows] = await db.execute(
            `SELECT duration_months, price FROM plans WHERE id = ?`,
            [current_plan_id]
        );

        if (planRows.length === 0) {
            return res.status(500).json({ message: "Plan not found." });
        }

        const { duration_months, price } = planRows[0];

        // 3. Calculate new end date safely
        let startDate = new Date();

        if (membership_end_date) {
            const endDate = new Date(membership_end_date + "T00:00:00");
            if (endDate > startDate) startDate = endDate;
        }

        const newEndDate = new Date(startDate);
        newEndDate.setMonth(newEndDate.getMonth() + duration_months);

        const formattedEndDate = newEndDate.toISOString().split("T")[0];

        // 4. Update member profile
        await db.execute(
            `UPDATE member_profiles
             SET membership_status = 'Active',
                 membership_end_date = ?
             WHERE user_id = ?`,
            [formattedEndDate, memberUserId]
        );

        // 5. Insert payment (FIXED)
        const [paymentResult] = await db.execute(
            `INSERT INTO payments
             (member_id, enrollment_id, plan_id, amount, payment_date, payment_method, status)
             VALUES (?, NULL, ?, ?, NOW(), 'Stripe', 'success')`,
            [memberUserId, current_plan_id, price]
        );

        res.status(200).json({
            message: "Plan renewed successfully",
            new_end_date: formattedEndDate,
            payment_id: paymentResult.insertId
        });

    } catch (error) {
        console.error("Error initiating plan renewal:", error);
        res.status(500).json({
            message: "Server error during renewal",
            error: error.message
        });
    }
};

// --- 5. Change plan
// Route: POST /api/member/change-plan

exports.changePlan = async (req, res) => {
    const memberUserId = req.user.id;
    const { new_plan_id } = req.body;

    if (!new_plan_id) {
        return res.status(400).json({ message: "New plan ID is required" });
    }

    try {
        // 1. Get current member plan
        const [memberRows] = await db.execute(
            `SELECT current_plan_id
            FROM member_profiles
            WHERE user_id = ?`,
            [memberUserId]
        );
        
        if (memberRows.length === 0) {
            return res.status(404).json({ message: "Member profile not found" });
        }

        const currentPlanId = memberRows[0].current_plan_id;

        if (currentPlanId === new_plan_id) {
            return res.status(400).json({
                message:"You are already on this plan"
            });
        }

        // 2. Get new plan details
        const [planRows] = await db.execute(
            `SELECT duration_months, price, plan_name
            FROM plans
            WHERE id = ?`,
            [new_plan_id]
        );

        if (planRows.length === 0) {
            return res.status(404).json({ message: "Select plan not found" });
        }
        const { duration_months, price, plan_name } = planRows[0];

        // 3. Calculate dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + duration_months);
        
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        // 4. Update member profile
        await db.execute(
            `UPDATE member_profiles
            SET current_plan_id = ?,
                membership_status = 'Active',
                membership_start_date = ?,
                membership_end_date = ?
            WHERE user_id = ?`,
            [new_plan_id, formattedStartDate, formattedEndDate, memberUserId]
        );

        // 5. Insert payment record
        const [paymentResult] = await db.execute(
            `INSERT INTO payments
            (member_id, enrollment_id, plan_id, amount, payment_date, payment_method, status)
            VALUES (?, NULL, ?, ?, NOW(), 'Strip', 'success')`,
            [memberUserId, new_plan_id, price]
        );

        res.status(200).json({
            message: "Plan changed successfully",
            new_plan: plan_name,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            payment_id: paymentResult.insertId

        });
    } catch (error) {
        console.error("Error changing plan:", error);
        res.status(500).json({
            message: "Server error while changing plan",
            error: error.message
        });
    }
};



// --- 5. GET MEMBER PAYMENT HISTORY ---
// Route: GET /api/member/payments
exports.getMemberPayments = async (req, res) => {
    const memberUserId = req.user.id;

    try {
        const [payments] = await db.execute(
            `SELECT
                p.id AS payment_id,
                p.amount,
                p.payment_date,
                p.payment_method,
                p.status,
                pl.plan_name
            FROM payments p
            LEFT JOIN plans pl ON p.plan_id = pl.id
            WHERE p.member_id = ?
            ORDER BY p.payment_date DESC`,
            [memberUserId]
        );

        res.status(200).json({
            message: "Payment history fetched successfully.",
            count: payments.length,
            payments: payments
        });

    } catch (error) {
        console.error("Error fetching member payments:", error);
        res.status(500).json({ message: "Server error while fetching payments." });
    }
};

// --- 6. GET MEMBER SCHEDULED SESSIONS ---
// Route: GET /api/member/sessions
exports.getMemberSessions = async (req, res) => {
  const memberUserId = req.user.id;

  try {
    const [sessions] = await db.execute(
      `
      SELECT
        s.id AS session_id,

        DATE_FORMAT(s.session_date, '%Y-%m-%d') AS session_date,
        TIME_FORMAT(s.session_time, '%h:%i %p') AS session_time,

        s.duration_minutes,
        s.status,
        s.notes,

        u.full_name AS trainer_name,
        tp.specialty AS trainer_specialty

      FROM sessions s
      JOIN users u 
        ON s.trainer_user_id = u.id
        AND u.role = 'trainer'
      LEFT JOIN trainer_profiles tp 
        ON tp.user_id = u.id

      WHERE s.member_user_id = ?
      ORDER BY s.session_date DESC, s.session_time DESC
      `,
      [memberUserId]
    );

    res.status(200).json({
      message: "Member sessions fetched successfully",
      count: sessions.length,
      sessions
    });

  } catch (error) {
    console.error("Error fetching member sessions:", error);
    res.status(500).json({
      message: "Server error while retrieving session data"
    });
  }
};
