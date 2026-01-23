const db = require("../config/db");

// --- 1. GET TRAINER PROFILE (Self-Access) ---
// Route: GET /api/trainer/profile
exports.getTrainerProfile = async (req, res) => {
  // The user ID is retrieved from the JWT payload attached to req.user by the 'authenticate' middleware.
  const trainerUserId = req.user.id;

  try {
    // SQL query to join the user's base information with their specific trainer profile details.
    const [rows] = await db.execute(
      `SELECT 
                u.id AS user_id,
                u.full_name,
                u.email,
                u.phone,
                u.gender,
                u.dob,
                u.address,
                tp.specialty,
                tp.bio, -- Adding bio here if it exists in your schema
                tp.experience_years,
                tp.certification_details,
                tp.status AS trainer_status,
                u.created_at
            FROM users u
            JOIN trainer_profiles tp ON u.id = tp.user_id
            WHERE u.id = ?`,
      [trainerUserId],
    );

    if (rows.length === 0) {
      // This should ideally not happen if the user is authenticated,
      // but it catches cases where the user exists but the trainer_profile record is missing.
      return res.status(404).json({ message: "Trainer profile not found." });
    }
    res.status(200).json({
      message: "Trainer profile fetched successfully.",
      profile: rows[0],
    });
  } catch (error) {
    console.error("Error fetching trainer profile:", error);
    res.status(500).json({
      message: "Server error while retrieving profile data.",
      error: error.message,
    });
  }
};

// --- 2. GET ASSIGNED MEMBERS ---
// Route: GET /api/trainer/members
// Fetches a list of all members assigned to the current authenticated trainer.
exports.getAssignedMembers = async (req, res) => {
  // Get the trainer's user ID from the authentication middleware.
  const trainer_user_id = req.user.id;

  try {
    // Query to join member profiles (filtering by assigned_trainer_id) with user data and member plan details.
    const [members] = await db.execute(
      `SELECT
                u.id AS user_id,
                u.full_name,
                EXISTS (
                    SELECT 1 FROM attendance a
                    WHERE a.member_id = u.id
                        AND a.trainer_id = ?
                        AND a.check_out_at IS NULL
                    ) As is_checked_in
        FROM member_profiles mp
        JOIN users u ON u.id = mp.user_id
        WHERE mp.assigned_trainer_id = ?`,
      [trainer_user_id, trainer_user_id]
    );

    res.status(200).json({
      message: "Assigned members list fetched successfully.",
      count: members.length,
      members: members,
    });
  } catch (error) {
    console.error("Error fetching assigned members:", error);
    res.status(500).json({
      message: "Server error while retrieving assigned members.",
      error: error.message,
    });
  }
};

// --- 3. RECORD MEMBER ATTENDANCE ---
// Route: POST /api/trainer/attendance/check-in
// Allows trainer to mark a member's attendance for the current time.

exports.recordAttendance = async (req, res) => {
  try {
    const trainer_id = req.user.id;
    const { member_id } = req.body;

    if (!member_id) {
      return res.status(400).json({ message: "Member ID is required" });
    }

    // 1️⃣ Verify member is assigned to trainer
    const [[member]] = await db.execute(
      `SELECT 1
       FROM member_profiles
       WHERE user_id = ?
         AND assigned_trainer_id = ?`,
      [member_id, trainer_id]
    );

    if (!member) {
      return res.status(403).json({
        message: "Member not assigned to this trainer",
      });
    }

    // 2️⃣ Prevent double check-in
    const [[existing]] = await db.execute(
      `SELECT id
       FROM attendance
       WHERE member_id = ?
         AND trainer_id = ?
         AND check_out_at IS NULL`,
      [member_id, trainer_id]
    );

    if (existing) {
      return res.status(400).json({
        message: "Member already checked in",
      });
    }

    // 3️⃣ Insert attendance
    const [result] = await db.execute(
      `INSERT INTO attendance
        (member_id, trainer_id, check_in_at, created_at)
       VALUES (?, ?, NOW(), NOW())`,
      [member_id, trainer_id]
    );

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance_id: result.insertId,
    });
  } catch (error) {
    console.error("Record attendance error:", error);
    res.status(500).json({ message: "Failed to record attendance" });
  }
};
//  Check-Out Logic

exports.checkOutAttendance = async (req, res) => {
  try {
    const trainer_id = req.user.id;
    const { member_id, notes } = req.body;

    const [[attendance]] = await db.execute(
      `SELECT id
       FROM attendance
       WHERE member_id = ?
         AND trainer_id = ?
         AND check_out_at IS NULL`,
      [member_id, trainer_id]
    );

    if (!attendance) {
      return res.status(400).json({
        message: "No active check-in found",
      });
    }

    await db.execute(
      `UPDATE attendance
       SET check_out_at = NOW(),
           notes = ?
       WHERE id = ?`,
      [notes || null, attendance.id]
    );

    res.json({ message: "Checked out successfully" });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
};


// --- 4. UPDATE TRAINER SCHEDULE ---
// Route: PUT /api/trainer/schedule
// Allow a trainer to update their availability/work schedule in the trainer_profiles table.
exports.updateSchedule = async (req, res) => {
  // The schedule format is expected to be a string or JSON string from the client
  const { schedule } = req.body;
  const trainerId = req.user.id; // Trainer ID from authenticated JWT

  // 1. Validation
  if (schedule === undefined || schedule === null) {
    return res.status(400).json({
      message:
        "Schedule data (key 'schedule') is required in the request body.",
    });
  }

  try {
    // Update the 'schedule' field in the trainer_profiles table
    const [result] = await db.execute(
      `UPDATE trainer_profiles
            SET schedule = ?
            WHERE user_id = ?`,
      [schedule, trainerId],
    );

    if (result.affectedRows === 0) {
      // Check if the profile exists but no changes were made
      const [check] = await db.execute(
        "SELECT 1 FROM trainer_profiles WHERE user_id = ?",
        [trainerId],
      );
      if (check.length === 0) {
        return res.status(404).json({ message: "Trainer profile not found." });
      }
      return res.status(200).json({
        message:
          "Schedule updated successfully (no changes applied as value was the same).",
      });
    }

    res.status(200).json({
      message: "Schedule updated successfully.",
      trainer_id: trainerId,
      new_schedule: schedule,
    });
  } catch (error) {
    console.error("Error updating trainer schedule:", error);
    res.status(500).json({
      message: "Server error while updating schedule.",
      error: error.message,
    });
  }
};

exports.createSession = async (req, res) => {
  const trainer_user_id = req.user.id; // users.id from JWT

  const {
    member_id, // users.id of member
    session_date,
    session_time,
    duration_minutes,
    notes,
  } = req.body;

  //  Validation
  if (!member_id || !session_date || !session_time) {
    return res.status(400).json({
      message: "member_id, session_date, and session_time are required",
    });
  }

  try {
    //  1. Verify member is ACTIVE and assigned to this trainer
    const [[member]] = await db.execute(
      `
            SELECT mp.id
            FROM member_profiles mp
            WHERE mp.user_id = ?
              AND mp.assigned_trainer_id = ?
              AND mp.membership_status = 'Active'
            `,
      [member_id, trainer_user_id],
    );

    if (!member) {
      return res.status(403).json({
        message: "Member not assigned to this trainer or inactive",
      });
    }

    //  2. Insert session
    const [result] = await db.execute(
      `
            INSERT INTO sessions
            (trainer_user_id, member_user_id, session_date, session_time, duration_minutes, status, notes)
            VALUES (?, ?, ?, ?, ?, 'scheduled', ?)
            `,
      [
        trainer_user_id,
        member_id,
        session_date,
        session_time,
        duration_minutes || 60,
        notes || null,
      ],
    );

    res.status(201).json({
      message: "Session scheduled successfully",
      session_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      message: "Failed to create session",
      error: error.message,
    });
  }
};

exports.getTrainerSessions = async (req, res) => {
  const trainer_user_id = req.user.id;

  try {
    const [sessions] = await db.execute(
      ` SELECT 
                s.id,
                DATE_FORMAT(s.session_date, '%Y-%m-%d') AS session_date,
               TIME_FORMAT(s.session_time, '%H:%i') AS session_time,
                s.duration_minutes,
                s.status,
                s.notes,
                u.full_name AS member_name,
                u.id AS member_user_id
            FROM sessions s
            JOIN users u ON u.id = s.member_user_id
            WHERE s.trainer_user_id = ?
            ORDER BY s.session_date ASC, s.session_time ASC`,
      [trainer_user_id],
    );

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching trainer sessions:", error);
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message,
    });
  }
};

exports.updateSession = async (req, res) => {
  const trainer_user_id = req.user.id;
  const sessionId = req.params.id;

  const { session_date, session_time, duration_minutes, notes } = req.body;

  if (!session_date || !session_time) {
    return res.status(400).json({
      message: "session_date and session_time are required",
    });
  }

  try {
    //  Verify session belongs to trainer
    const [[session]] = await db.execute(
      `
      SELECT id, status
      FROM sessions
      WHERE id = ?
        AND trainer_user_id = ?
      `,
      [sessionId, trainer_user_id],
    );

    if (!session) {
      return res.status(403).json({
        message: "Unauthorized to update this session",
      });
    }

    if (session.status !== "scheduled") {
      return res.status(400).json({
        message: "Cannot edit a session that is completed or canceled",
      });
    }

    //  Update session
    await db.execute(
      `
      UPDATE sessions
      SET session_date = ?,
          session_time = ?,
          duration_minutes = ?,
          notes = ?
      WHERE id = ?
      `,
      [
        session_date,
        session_time,
        duration_minutes || 60,
        notes || null,
        sessionId,
      ],
    );

    return res.json({
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return res.status(500).json({
      message: "Failed to update session",
    });
  }
};

// --- Mark Session Completed/Canceled ---
// Route: PUT /api/trainer/sessions/:id/status
exports.updateSessionStatus = async (req, res) => {
  const trainer_user_id = req.user.id;
  const sessionId = req.params.id;
  const { status } = req.body;

  // Validate status

  if (!["completed", "canceled"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Allowed: completed, canceled",
    });
  }

  try {
    // verify session belongs to this trainer
    const [[session]] = await db.execute(
      `SELECT id, status
            FROM sessions
            WHERE id = ?
                AND trainer_user_id = ?`,
      [sessionId, trainer_user_id],
    );

    if (!session) {
      return res.status(403).json({
        message: "Unauthorized to update this session",
      });
    }
    if (session.status !== "scheduled") {
      return res.status(400).json({
        message: `Session already ${session.status}. Status cannot be changed.`,
      });
    }

    const updateFields =
      status === "completed"
        ? "status = ?, completed_at = NOW()"
        : "status = ?, canceled_at = NOW()";

    // Update status
    await db.execute(
      `UPDATE sessions
            SET ${updateFields}
            WHERE id = ?`,
      [status, sessionId],
    );

    res.json({
      message: `Session marked as ${status}`,
    });
  } catch (error) {
    console.error("Error updating session status:", error);
    res.status(500).json({
      message: "Failed to update session status",
    });
  }
};

// --- Trainer Dashboard Stats ---
// Route: GET /api/trainer/dashboard/stats

exports.getTrainerDashboardStats = async (req, res) => {
  const trainer_user_id = req.user.id;

  try {
    // Assign Members count
    const [[members]] = await db.execute(
      `SELECT COUNT (*) AS total_members
            FROM member_profiles
            WHERE assigned_trainer_id = ?`,
      [trainer_user_id],
    );

    // Session stats
    const [[sessions]] = await db.execute(
      `SELECT COUNT (*) AS total_sessions,
            SUM(status = 'scheduled') AS scheduled_sessions,
            SUM(status = 'completed') AS completed_sessions,
            SUM(status = 'canceled') AS canceled_sessions
            FROM sessions
            WHERE trainer_user_id = ?`,
      [trainer_user_id],
    );

    // Today's sessions
    const [[today]] = await db.execute(
      `SELECT COUNT (*) AS today_sessions
            FROM sessions
            WHERE trainer_user_id = ? 
            AND session_date = CURDATE()`,
      [trainer_user_id],
    );

    res.status(200).json({
      stats: {
        total_members: members.total_members,
        total_sessions: sessions.total_sessions,
        scheduled_sessions: sessions.scheduled_sessions,
        completed_sessions: sessions.completed_sessions,
        canceled_sessions: sessions.canceled_sessions,
        today_sessions: today.today_sessions,
      },
    });
  } catch (error) {
    console.error("Error fetching trainer dashboard stats:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};
