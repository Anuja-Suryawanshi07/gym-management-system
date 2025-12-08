const { message } = require('statuses');
const db = require('../config/db');

// --- 1. GET TRAINER PROFILE (Self-Access) ---
// Route: GET / api/trainer/profile
exports.getTrainerProfile = async (req, res) => {
    // The user ID is retrived from the JWT payload attached to req.user by the 'authenticate' middleware.
    const trainerUserId = req.user.id;

    try {
        // SQL query to join the user's base information with their secific trainer profile.
        const [rows] = await db.execute(
            `SELECT u.id AS user_id,
            u.full_name,
            u.email,
            u.phone,
            u.gender,
            u.dob,
            u.address,
            tp.specialty,
            tp.experience_years,
            tp.certification_details,
            tp.status AS trainer_status,
            u.created_at
            FROM users u
            JOIN trainer_profiles tp ON u.id = tp.user_id
            WHERE u.id = ?`, [trainerUserId]
        );

        if (rows.length === 0) {
            // This should ideally not happen if the user is authenticated, 
            // but it catches cases where the user exists but the trainer_profile record is missing.
            return res.status(404).json({ message: "Trainer profile not found." });
        }
        res.status(200).json({
            message: "Trainer profile fetched successfully.",
            profile: rows[0]
        });
    } catch (error) {
        console.error("Error fetching trainer profile:", error);
        res.status(500).json({ message: " Server error while retrieving profile data.",
            error: error.message
        });
    }
};

// --- 2. GET ASSIGNED MEMBERS ---
//Route: GET /api/trainer/members
// Fetches a list of all members assigned to the current authenticated trainer.
exports.getAssignedMembers = async (req, res) => {
    // Get the trainer's user ID from the authentication middleware.
    const trainerUserId = req.user.id;

    try {
        // Query to join member profiles ( filtering by assigned_trainer_id) with user data and member plan details.

        const [members] = await db.execute(
            `SELECT
            u.id AS member_id,
            u.full_name,
            u.email,
            u.phone,
            mp.membership_status,
            mp.health_goals,
            mp.current_plan_id,
            mp.membership_end_date
            FROM users u
            JOIN member_profiles mp ON u.id = mp.user_id
            WHERE mp.assigned_trainer_id = ?
            ORDER BY u.full_name ASC`, [trainerUserId]
        );
        res.status(200).json({
            message: "Assigned membes list fetched successfully.",
            count: members.length,
            members: members
        });
    } catch (error) {
        console.error("Error fetching assigned members:", error);
        res.status(500).json({
            message: "Server error while retriving assigned members.",
            error: error.message
        });
    }
};

// --- 3. RECORD MEMBER ATTENDANCE ---
//Route: POST /api/trainer/checkin
//Allows trainer to mark a member's attendence for the current time.
exports.recordAttendence = async (req, res) => {
    const { member_id } = req.body;
    const trainerId = req.user.id; // Trianer ID from authenticated JWT 

    // 1. Basic Input Validation
    if (!member_id) {
        return res.status(400).json({
            message: "Member ID is required to record attendance."
        });
    }
    // 2. Optional: Verify Member is Assigned to this Trainer
    // This is a security and integrity check.
    try { 
        const [check] = await db.execute(
            `SELECT 1
            FROM member_profiles
            WHERE user_id = ? AND assigned_trainer_id = ?`,
            [member_id, trainerId]
        );

        if (check.length === 0) {
            return res.status(403).json({
                message: "Unauthorized: Member is not assigned to this trainer or Member does not exist."
            });
        }
    } catch (error) {
        console.error("Error during member assignment check:", error);
        return res.status(500).json({
            message: "Server error during validation.",
            error: error.message
        });
    }

    // 3. Insert Attendance Record
    try {
        const [result] = await db.execute(
            `INSERT INTO attendance (member_id, trainer_id, check_in_time)
            VALUES ( ?, ?, NOW())`, //NOW() inserts the current server timestamp
            [member_id, trainerId] 
        );

        res.status(201).json({
            message: "Attendance recorded successfully.",
            attendance_id: result.insertId,
            member_id: member_id,
            checked_in_by_trainer: trainerId
        });
    } catch (error) {
        console.error("Error recording attendance.", error);
        res.status(500).json({
            message: "Server error while recording attendance.",
            error: error.message
        });
    }
};

// --- 4. UPDATE TRAINER SCHEDULE ---
// Route: PUT / api/trainer/schedule
// Allow a trainer to update their availability/work schedule in the trainer_profiles table.
exports.updateSchedule = async (req, res) => {
    const { schedule } = req.body;
    const trainerId = req.user.id; // Trainer ID from authenticated JWT

    // 1. Validation
    if (schedule === undefined || schedule === null) {
        return res.status(400).json({
            message: "Schedule data (key 'schedule') is required in the request body."
        });
    }
    try {
        // Update the 'schedule' field in the trainer_profiles table
        const [result] = await db.execute(
            `UPDATE trainer_profiles
            SET schedule = ?
            WHERE user_id = ?`,
            [schedule, trainerId]
        );

        if (result.affectedRows === 0) {
            // user_id exists but a lack of trainer_profiles or no change in schedule.
            return res.status(404).json({
                message: "Trainer profile not found or no change were made."
            });
        }
        res.status(200).json({
            message: "Schedule updated successfully.",
            trainer_id: trainerId,
            new_schedule_date: schedule
        });
    } catch (error) {
        console.error("Error updating trainer schedule:",error);
        res.status(500).json({
            message: "Server error while updating schedule.",
            error: error.message
        });
    }
};
