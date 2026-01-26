const { message } = require("statuses");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// =======================================================
// CORE ADMIN API ENDPOINTS (Protected by authenticate, isAdmin)
// =======================================================

// --- 1. GET ADMIN PROFILE (Self-Access) ---
// Route: GET /api/admin/profile
exports.getAdminProfile = async (req, res) => {
    // This function fetches the currently authenticated Admin's user data
    try {
        const [rows] = await db.execute(
            "SELECT id, full_name, email, phone, gender, dob, address, role FROM users WHERE id = ?",
            [req.user.id] // req.user.id is set by the authentication middleware
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin user not found." });
        }
        res.status(200).json({
            message: "Admin profile fetched successfully.",
            profile: rows[0]
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Server error while retrieving profile data." });
    }
};

// --- 2. CREATE USER (REFАCTORED: Uses users.role ENUM) ---
// Route: POST /api/admin/users
exports.createUser = async (req, res) => {
    // role is now the ENUM value: 'admin', 'member', or 'trainer'
    const { full_name, email, phone, gender, dob, address, password, role } =
        req.body;

    // 1. Basic validation
    if (!full_name || !email || !password || !role) {
        return res.status(400).json({
            message: "Missing required fields: full_name, email, password, and role ('member', 'trainer', or 'admin').",
        });
    }

    if (!['member', 'trainer', 'admin'].includes(role)) {
         return res.status(400).json({ message: "Invalid role specified. Must be 'member', 'trainer', or 'admin'." });
    }

    let connection;
    try {
        // Check if user already exists
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        // 2. Hash Password
        const password_hash = await bcrypt.hash(password, 10);

        // 3. Insert into users table, including the role directly
        const [userResult] = await db.execute(
            "INSERT INTO users (full_name, email, phone, gender, dob, address, password_hash, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [full_name, email, phone, gender, dob, address, password_hash, role]
        );
        const newUserId = userResult.insertId;

        // Note: We no longer need to use a transaction or the user_roles table.

        res.status(201).json({
            message: `User created successfully with role: ${role}.`,
            userId: newUserId,
            role: role
        });
    } catch (error) {
        // NOTE: The previous logic relied on transactions which are now simplified.
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Server error during user creation.",
            error: error.message
        });
    }
};

// --- 3. READ ALL USERS (REFАCTORED: Uses users.role ENUM) ---
// Route: GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        // Query to select all users and their single role from the 'users' table
        const [rows] = await db.query(`
            SELECT 
            id, full_name, email, phone, gender, dob, address, role
            FROM users
            ORDER BY id DESC
        `);
        res.status(200).json({ users: rows });
    } catch (error) {
        console.error("Error fetching users:", error);
        res
            .status(500)
            .json({ message: "Error fetching users", error: error.message });
    }
};

// --- 4. GET USER BY ID ---
// Route: GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        // Query the database for a single user (excluding password hash)
        const [rows] = await db.execute(
            'SELECT id, full_name, email, phone, gender, dob, address, role, created_at, updated_at FROM users WHERE id = ?', [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: `User with ID ${userId} not found.` });
        }
        
        res.status(200).json({
            message: 'User fetched successfully',
            user: rows[0]
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error while fetching user data.', error: error.message });
    }
};

// --- 5. UPDATE USER DETAILS (REFАCTORED: Uses users.role ENUM) ---
// Route: PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, role } = req.body; // 'role' is now the ENUM value

    let updateFields = { ...req.body };
    delete updateFields.password;
    delete updateFields.role; // Remove role for special handling

    let query = "UPDATE users SET ";
    const queryParams = [];

    // Dynamically build the query based on fields provided
    for (const key in updateFields) {
        if (updateFields[key] !== undefined && updateFields[key] !== null) {
            query += `${key} = ?, `;
            queryParams.push(updateFields[key]);
        }
    }

    // Handle password update separately (must be hashed)
    if (password) {
        const password_hash = await bcrypt.hash(password, 10);
        query += "password_hash = ?, ";
        queryParams.push(password_hash);
    }

    // Handle role update separately (if provided and valid)
    if (role !== undefined) {
         if (!['member', 'trainer', 'admin'].includes(role)) {
             return res.status(400).json({ message: "Invalid role specified. Must be 'member', 'trainer', or 'admin'." });
         }
         query += "role = ?, ";
         queryParams.push(role);
    }
    
    // Check if any fields are provided for the 'users' table update
    if (queryParams.length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    // Execute the 'users' table update (no transaction needed now)
    let finalUserQuery = query.slice(0, -2) + " WHERE id = ?";
    queryParams.push(id);

    try {
        const [result] = await db.execute(finalUserQuery, queryParams);

        if (result.affectedRows === 0) {
            // Check if the user exists but no fields changed
            const [userCheck] = await db.execute("SELECT id FROM users WHERE id = ?", [id]);
            if (userCheck.length === 0) {
                 return res.status(404).json({ message: "User not found." });
            }
            return res.status(200).json({ message: "User details already up-to-date, no changes made." });
        }

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// --- 6. DELETE USER ---
// Route: DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Deleting from users should cascade delete through all related tables (member_profiles, trainer_profiles, etc.)
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) { 
            return res.status(404).json({ message: "User not found." });
        }
        
        res.status(200).json({
            message: "User and all related records deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res
            .status(500)
            .json({ message: "Error deleting user", error: error.message });
    }
};

// =======================================================
// PLAN MANAGEMENT API ENDPOINTS (CRUD)
// =======================================================

// --- 7. CREATE PLAN ---
// Route: POST /api/admin/plans
exports.createPlan = async (req, res) => {
    const { plan_name, duration_months, price, description, status } = req.body;

    if (!plan_name || !duration_months || !price) {
        return res.status(400).json({
            message: "Missing required fields: plan_name, duration_months, price.",
        });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO plans (plan_name, duration_months, price, description, status) VALUES (?, ?, ?, ?, ?)",
            [plan_name, duration_months, price, description, status || "active"] //Default status to 'active'
        );
        res.status(201).json({
            message: "Plan created successfully",
            planId: result.insertId,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res
                .status(409)
                .json({ message: `Plan with name "${plan_name}" already exists.` });
        }
        console.error("Error creating plan:", error);
        res
            .status(500)
            .json({ message: "Error creating plan", error: error.message });
    }
};

// --- 8. READ ALL PLANS ---
// Route: GET /api/admin/plans
exports.getAllPlans = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM plans ORDER BY id ASC");
        res.status(200).json({ plans: rows });
    } catch (error) {
        console.error("Error fetching plans:", error);
        res
            .status(500)
            .json({ message: "Error fetching plans", error: error.message });
    }
};

// --- 9. GET PLAN BY ID ---
// Route: GET /api/admin/plans/:id
exports.getPlanById = async (req, res) => {
    const planId = req.params.id;

    try {
        const [rows] = await db.execute(
            'SELECT id, plan_name, duration_months, price, description, status FROM plans WHERE id =?', [planId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: `Membership plan with ID ${planId} not found.` });
        }
        res.status(200).json({
            message: 'Plan fetched successfully',
            plan: rows[0]
        });
    } catch (error) {
        console.error('Error fetching plan by ID:', error);
        res.status(500).json({ message: 'Server error while fetching plan data.', error: error.message });
    }
};

// --- 10. UPDATE PLAN ---
// Route: PUT /api/admin/plans/:id
exports.updatePlan = async (req, res) => {
    const { id } = req.params;
    const { plan_name, duration_months, price, description, status } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    let query = "UPDATE plans SET ";
    const queryParams = [];
    const fields = { plan_name, duration_months, price, description, status };

    // Dynamically build the query based on fields provided
    for (const key in fields) {
        if (fields[key] !== undefined) {
            query += `${key} = ?, `;
            queryParams.push(fields[key]);
        }
    }
    // Remove the trailing comma and space, add WHERE clause
    query = query.slice(0, -2) + " WHERE id = ?";
    queryParams.push(id);

    try {
        const [result] = await db.execute(query, queryParams);

        if (result.affectedRows === 0) {
            // Check if the plan was not found
            const [planCheck] = await db.execute(
                "SELECT id FROM plans WHERE id = ?",
                [id]
            );

            if (planCheck.length === 0) {
                return res.status(404).json({ message: "Plan not found." });
            }
            // If plan found but 0 affected rows, it means data was identical
            return res
                .status(200)
                .json({ message: "Plan details already up-to-date, no changes made." });
        }
        res.status(200).json({ message: "Plan updated successfully." });
    } catch (error) {
        console.error("Error updating plan:", error);
        res
            .status(500)
            .json({ message: "Error updating plan", error: error.message });
    }
};

// --- 11. DELETE PLAN ---
// Route: DELETE /api/admin/plans/:id
exports.deletePlan = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute("DELETE FROM plans WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Plan not found." });
        }
        res.status(200).json({ message: "Plan deleted successfully." });
    } catch (error) {
        // Check for integrity constraint violation (e.g., if plan is in use)
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                message: "Cannot delete plan because it is currently enrolled by members. Please deactivate it instead.",
                error: error.message,
            });
        }
        console.error("Error deleting plan:", error);
        res
            .status(500)
            .json({ message: "Error deleting plan", error: error.message });
    }
};


// =======================================================
// TRAINER PROFILE MANAGEMENT API ENDPOINTS (CRUD)
// =======================================================

// --- 12. CREATE TRAINER PROFILE ---
// Route: POST /api/admin/trainers
exports.createTrainerProfile = async (req, res) => {
    const {
        full_name,
        email,
        phone,
        password,
        specialty,
        experience_years, 
        certification_details,
        status,
        schedule
    } = req.body;
    
    // Basic validation
    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: "full_name, email and password are required"
        });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Check if email already exists
        const [existingUser] = await connection.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create USER with role = trainer
        const [userResult] = await connection.execute(
            `INSERT INTO users (full_name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, 'trainer')`,
            [full_name, email, phone, password_hash]
        );

        const userId  = userResult.insertId;
        
        // Create Trainer profile
        await connection.execute(
            `INSERT INTO trainer_profiles
            (user_id, specialty, experience_years, certification_details, status, schedule)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                specialty || null,
                experience_years || 0,
                certification_details || null,
                status || "active",
                schedule || null
            ]
        );

            await connection.commit();

            res.status(201).json({
                message: "Trainer created successfuly",
                user_id: userId
            });

        } catch (error) {
            await connection.rollback();
            console.error("Error creating trainer profile:", error);
            res.status(500).json({
                message: "Failed to create trainer",
                error: error.message
            });
        } finally {
            connection.release();
        }
    };   

// --- 13. READ ALL TRAINERS (JOINED with Users) ---
// Route: GET /api/admin/trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
            u.id AS user_id, u.full_name, u.email, u.phone, tp.id AS profile_id, tp.specialty, tp.experience_years, tp.certification_details, tp.status, tp.schedule
            FROM users u
            JOIN trainer_profiles tp ON u.id = tp.user_id
            WHERE u.role = 'trainer'
            ORDER BY u.id DESC
        `);
        // Note: The schedule field is returned as a string and may need client-side parsing.
        res.status(200).json({ trainers: rows });
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res
            .status(500)
            .json({ message: "Error fetching trainers", error: error.message });
    }
};

// --- 14. GET TRAINER BY ID ---
// Route: GET /api/admin/trainers/:user_id
exports.getTrainerById = async (req, res) => {
    const trainerUserId = req.params.user_id;

    try {
        const [rows] = await db.execute(
            ` SELECT
            u.id AS user_id,
            u.full_name,
            u.email,
            u.phone,
            tp.specialty,
            tp.experience_years,
            tp.certification_details,
            tp.status,
            tp.schedule
            FROM users u
            JOIN trainer_profiles tp ON u.id = tp.user_id
            WHERE u.id = ? AND u.role = 'trainer'
        `, [trainerUserId]
        );
        console.log("TRAINER ROW:", rows[0]);
        if (rows.length === 0) {
            return res.status(404).json({ message: `Trainer profile for user ID ${trainerUserId} not found.` });
        }
        res.status(200).json({
            message: 'Trainer profile fetched successfully',
            trainer: rows[0]
        });
    } catch (error) {
        console.error('Error fetching trainer profile by ID:', error);
        res.status(500).json({ message: 'Server error while fetching trainer profile data.', error: error.message });
    }
};

// --- 15. UPDATE TRAINER PROFILE ---
// Route: PUT /api/admin/trainers/:user_id
exports.updateTrainerProfile = async (req, res) => {
    const { user_id } = req.params;
    const { specialty, 
            experience_years, 
            certification_details, 
            status, 
            schedule } = req.body;

    let query = "UPDATE trainer_profiles SET ";
    const queryParams = [];
    const fields = {
        specialty,
        experience_years,
        certification_details,
        status,
        schedule
    };

    // Build query dynamically
    for (const key in fields) {
        if (fields[key] !== undefined) {
            query += `${key} = ?, `;
            queryParams.push(fields[key]);
        }
    }

    if (queryParams.length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    query = query.slice(0, -2) + " WHERE user_id = ?";
    queryParams.push(user_id);

    try {
        const [result] = await db.execute(query, queryParams);

        if (result.affectedRows === 0) {
            // Check for 404
            const [profileCheck] = await db.execute("SELECT user_id FROM trainer_profiles WHERE user_id = ?", [user_id]);
            if (profileCheck.length === 0) {
                return res.status(404).json({ message: "Trainer profile not found." });
            }
            return res.status(200).json({ message: "Trainer profile details already up-to-date, no changes made." });
        }
        res.status(200).json({ message: "Trainer profile updated successfully." });
    } catch (error) {
        console.error("Error updating trainer profile:", error);
        res.status(500).json({
            message: "Error updating trainer profile",
            error: error.message,
        });
    }
};

// --- 16. DELETE TRAINER PROFILE ---
// Route: DELETE /api/admin/trainers/:user_id
exports.deleteTrainerProfile = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [result] = await db.execute(
            "DELETE FROM trainer_profiles WHERE user_id = ?",
            [user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Trainer profile not found." });
        }
        res.status(200).json({ message: "Trainer profile deleted successfully." });
    } catch (error) {
        console.error("Error deleting trainer profile:", error);
        res.status(500).json({
            message: "Error deleting trainer profile",
            error: error.message,
        });
    }
};

// =======================================================
// MEMBER PROFILE MANAGEMENT API ENDPOINTS (CRUD)
// =======================================================

// --- 17. CREATE MEMBER PROFILE ---
// Route: POST /api/admin/members
exports.createMemberProfile = async (req, res) => {
    const {
        user_id,
        trainer_id,
        membership_start_date,
        membership_end_date,
        health_details,
        current_plan_id // Added plan ID
    } = req.body;

    if (!user_id || !membership_start_date || !membership_end_date || !current_plan_id) {
        return res.status(400).json({
            message: "Missing required fields: user_id, membership_start, membership_end, and current_plan_id.",
        });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO member_profiles (user_id, trainer_id, membership_start_date, membership_end_date, health_details, current_plan_id) VALUES (?, ?, ?, ?, ?, ?)",
            [
                user_id,
                trainer_id || null,
                membership_start_date,
                membership_end_date,
                health_details,
                current_plan_id
            ]
        );
        res.status(201).json({
            message: "Member profile created successfully",
            profileId: result.insertId,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Member profile already exists for this user ID.",
            });
        }
        // You should also check for ER_NO_REFERENCED_ROW_2 if trainer_id, user_id, or current_plan_id don't exist
        console.error("Error creating member profile:", error);
        res.status(500).json({
            message: "Error creating member profile",
            error: error.message,
        });
    }
};

// --- 18. READ ALL MEMBERS (JOINED with users, Trainer, and Plan) ---
// Route: GET /api/admin/members
exports.getAllMembers = async (req, res) => {
    try {
        const [rows] = await db.query(`
  SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    u.phone,

    mp.membership_start_date,
    mp.membership_end_date,
    mp.health_goals,
    mp.membership_status,

    t.full_name AS assigned_trainer_name,
    p.plan_name AS current_plan_name,

    -- Auto-expiry logic
    CASE
      WHEN mp.membership_end_date IS NOT NULL
       AND mp.membership_end_date < CURDATE()
      THEN 1
      ELSE 0
    END AS is_expired

  FROM users u
  JOIN member_profiles mp ON u.id = mp.user_id
  LEFT JOIN users t ON mp.assigned_trainer_id = t.id
  LEFT JOIN plans p ON mp.current_plan_id = p.id
  WHERE u.role = 'member'
  ORDER BY u.id DESC
`);

        res.status(200).json({ members: rows });
    } catch (error) {
        console.error("Error fetching members:", error);
        res
            .status(500)
            .json({ message: "Error fetching members", error: error.message });
    }
};

// --- 19. GET MEMBER BY ID ---
// Route: GET /api/admin/members/:user_id
exports.getMemberById = async (req, res) => {
    const memberUserId = req.params.user_id;

    try {
        const [rows] = await db.execute(
            `SELECT 
                u.id AS user_id,
                u.full_name,
                u.email,
                u.phone,

                mp.membership_status,
                mp.health_goals,
                mp.membership_start_date,
                mp.membership_end_date,
                mp.assigned_trainer_id,
                mp.current_plan_id,

                t.full_name As trainer_name,
                p.plan_name

            FROM users u
            JOIN member_profiles mp ON u.id = mp.user_id
            LEFT JOIN users t ON mp.assigned_trainer_id = t.id
            LEFT JOIN plans p ON mp.current_plan_id = p.id
            WHERE u.id = ? AND u.role = 'member'`,
            [memberUserId]        );
        if (rows.length === 0) {
            return res.status(404).json({ message: `Member profile for user ID ${memberUserId} not found.` });
        }
        res.status(200).json({
            message: 'Member profile fetched successfully',
            member: rows[0]
        });
    } catch (error) {
        console.error('Error fetching member profile by ID:', error);
        res.status(500).json({ message: 'Server error while fetching member profile data.', error: error.message });
    }
};

// --- 20. UPDATE MEMBER PROFILE (Admin Management) ---
// Route: PUT /api/admin/members/:user_id
// Uses the best version of this function found in the provided code
exports.updateMemberProfile = async (req, res) => {
    const  user_id   = req.params.user_id;

    console.log("UPDATE MEMBER:", user_id, req.body);


    //  Destructure with DEFAULT null (VERY IMPORTANT)
    const {
        assigned_trainer_id,
        current_plan_id,
        membership_start_date,
        membership_end_date,
        health_goals
    } = req.body;

    const fields = {};
    if (assigned_trainer_id !== undefined) fields.assigned_trainer_id = assigned_trainer_id;
    if (current_plan_id !== undefined) fields.current_plan_id = current_plan_id;
    if (membership_start_date !== undefined) fields.membership_start_date = membership_start_date;
    if (membership_end_date !== undefined) fields.membership_end_date = membership_end_date;
    if (health_goals !== undefined) fields.health_goals = health_goals;

    if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: "No fields provided for update" });
    }
    

    // Build query dynamically, but NEVER allow undefined
    const setClause = Object.keys(fields)
        .map(key => `${key} = ?`)
        .join(", ");
    
    const values = [...Object.values(fields), user_id];
    
    const sql = `UPDATE member_profiles SET ${setClause} WHERE user_id = ?`;

    try {
        const [result] = await db.execute(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Member profile not found" });
        }

        res.status(200).json({ message: "Member profile updated successfully" });
    } catch (error) {
        console.error("Error updating member profile:", error);
        res.status(500).json({
            message: "Error updating member profile",
            error: error.message
        });
    }
};

exports.updateMemberStatus = async (req, res) => {
    const { user_id } = req.params;
    const { membership_status } = req.body;

    console.log("UPDATE STATUS:", user_id, membership_status);

    if (!membership_status) {
        return res.status(400).json({ message: "membership status is required" });
    }
    
    try {
        const [result] = await db.execute(
            `UPDATE member_profiles
            SET membership_status = ?
            WHERE user_id = ?`,
            [membership_status, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200). json({ message: "Membership status updated" });
    } catch (error) {
        console.error("Status update error:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
};


// --- 21. DELETE MEMBER PROFILE ---
// Route: DELETE /api/admin/members/:user_id
exports.deleteMemberProfile = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [result] = await db.execute(
            // NOTE: This deletes only the profile, the base user remains. Use DELETE /api/admin/users/:id to delete both.
            "DELETE FROM member_profiles WHERE user_id = ?",
            [user_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Member profile not found." });
        }
        res.status(200).json({
            message: "Member profile deleted successfully (Base User remains).",
        });
    } catch (error) {
        console.error("Error deleting member profile:", error);
        res
            .status(500)
            .json({ message: "Error deleting member profile", error: error.message });
    }
};

// =======================================================
// SESSION MANAGEMENT API ENDPOINTS (CRUD)
// =======================================================

// --- 22. CREATE SESSION ---
// Route: POST /api/admin/sessions
exports.createSession = async (req, res) => {
    const { member_id, trainer_id, session_time, duration_minutes, notes } = req.body;

    if (!member_id || !trainer_id || !session_time || !duration_minutes) {
        return res.status(400).json({
            message: "Missing required fields: member_id, trainer_id, session_time, and duration_minutes.",
        });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO sessions (member_id, trainer_id, session_time, duration_minutes, status, notes) VALUES (?, ?, ?, ?, ?, ?)",
            [member_id, trainer_id, session_time, duration_minutes, 'scheduled', notes || null]
        );
        res.status(201).json({
            message: "Session scheduled successfully",
            sessionId: result.insertId,
        });
    } catch (error) {
        // You might want to check for foreign key errors (member_id or trainer_id invalid)
        console.error("Error creating session:", error);
        res.status(500).json({
            message: "Error scheduling session",
            error: error.message,
        });
    }
};

// --- 23. READ ALL SESSIONS ---
// Route: GET /api/admin/sessions
exports.getAllSessions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                s.id AS session_id,
                s.session_time,
                s.duration_minutes,
                s.status,
                s.notes,
                m.full_name AS member_name,
                t.full_name AS trainer_name
            FROM sessions s
            JOIN users m ON s.member_id = m.id AND m.role = 'member'
            JOIN users t ON s.trainer_id = t.id AND t.role = 'trainer'
            ORDER BY s.session_time DESC
        `);
        res.status(200).json({ sessions: rows });
    } catch (error) {
        console.error("Error fetching all sessions:", error);
        res.status(500).json({ message: "Error fetching sessions", error: error.message });
    }
};

// --- 24. UPDATE SESSION ---
// Route: PUT /api/admin/sessions/:id
exports.updateSession = async (req, res) => {
    const { id } = req.params;
    const { session_time, duration_minutes, status, notes, trainer_id } = req.body;

    let query = "UPDATE sessions SET ";
    const queryParams = [];
    const fields = { session_time, duration_minutes, status, notes, trainer_id };

    for (const key in fields) {
        if (fields[key] !== undefined) {
            query += `${key} = ?, `;
            queryParams.push(fields[key]);
        }
    }

    if (queryParams.length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    query = query.slice(0, -2) + " WHERE id = ?";
    queryParams.push(id);

    try {
        const [result] = await db.execute(query, queryParams);

        if (result.affectedRows === 0) {
            const [sessionCheck] = await db.execute("SELECT id FROM sessions WHERE id = ?", [id]);
            if (sessionCheck.length === 0) {
                return res.status(404).json({ message: "Session not found." });
            }
            return res.status(200).json({ message: "Session details already up-to-date, no changes made." });
        }
        res.status(200).json({ message: "Session updated successfully." });
    } catch (error) {
        console.error("Error updating session:", error);
        res.status(500).json({ message: "Error updating session", error: error.message });
    }
};

// --- 25. DELETE SESSION ---
// Route: DELETE /api/admin/sessions/:id
exports.deleteSession = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute("DELETE FROM sessions WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Session not found." });
        }
        res.status(200).json({ message: "Session deleted successfully." });
    } catch (error) {
        console.error("Error deleting session:", error);
        res.status(500).json({ message: "Error deleting session", error: error.message });
    }
};

// --- 26. GET ALL MEMBERSHIP REQUESTS ---
//Route: GET /api/admin/membership-requests

exports.getAllMembershipRequests = async (req, res) => {
    try {
        const [requests] = await db.execute(
            `SELECT id, full_name, email, phone, message, status, created_at
            FROM membership_requests
            ORDER BY created_at DESC`
        );

        res.status(200).json({
            message: "Membership requests fetched successfully",
            data: requests
        });
    } catch (error) {
        console.error("Error fetching membership requests:", error);
        res.status(500).json({
            message: "Server error while fetching membership requests",
            error: error.message
        });
    }
};

// --- APPROVE / REJECT MEMBERSHIP REQUEST ---
// Route: PUT /api/admin/membership-requests/:id

exports.updateMembershipRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // approved | rejected

    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
            message: "Invalid status. Use 'approved' or 'rejected'."
        });
    }

    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        //  Check request exists & is pending
        const [requests] = await connection.execute(
            "SELECT * FROM membership_requests WHERE id = ? AND status = 'pending'",
            [id]
        );

        if (requests.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Membership request not found or already processed"
            });
        }

        const request = requests[0];

        //  Update request status
        await connection.execute(
            "UPDATE membership_requests SET status = ? WHERE id = ?",
            [status, id]
        );

        //  If APPROVED → create user & member profile
        if (status === "approved") {
            const passwordHash = await bcrypt.hash("password123", 10);

            // Create user
            const [userResult] = await connection.execute(
                `INSERT INTO users (full_name, email, phone, password_hash, role)
                 VALUES (?, ?, ?, ?, 'member')`,
                [
                    request.full_name,
                    request.email,
                    request.phone,
                    passwordHash
                ]
            );

            // Create member profile
            await connection.execute(
                "INSERT INTO member_profiles (user_id) VALUES (?)",
                [userResult.insertId]
            );
        }

        //  Commit ONCE
        await connection.commit();

        return res.json({
            message: `Membership request ${status} successfully`
        });

    } catch (error) {
        console.error("Membership approval error:", error);

        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
            }
        }

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });

    } finally {
        if (connection) connection.release();
    }
};


// --- ASSIGN TRAINER AND PLAN TO MEMBER ---
// Route: PUT /api/admin/members/:id/assign
exports.assignTrainerAndPlan = async (req, res) => {
    console.log("RAW BODY:", req.body);
    const user_id = req.params.user_id;

    //  SAFELY MAP FRONTEND KEYS
    const {
        trainerId,
        planId
    } = req.body;

    //  Convert undefined → null
    const assigned_trainer_id = trainerId ?? null;
    const current_plan_id = planId ?? null;

    console.log("ASSIGN FIXED:", {
        user_id,
        assigned_trainer_id,
        current_plan_id
    });

    try {
        const [result] = await db.execute(
            `UPDATE member_profiles
             SET assigned_trainer_id = ?, current_plan_id = ?
             WHERE user_id = ?`,
            [assigned_trainer_id, current_plan_id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Member profile not found"
            });
        }

        res.status(200).json({
            message: "Trainer and plan assigned successfully"
        });

    } catch (error) {
        console.error("Assign error:", error);
        res.status(500).json({
            message: "Assignment failed",
            error: error.message
        });
    }
};

exports.getTrainers = async (req, res) => {
    const [rows] = await db.execute(
        `SELECT u.id, u.full_name
        FROM users u
        WHERE u.role = 'trainer'`
    );
    res.json({ trainers: rows });
};

exports.getPlans = async (req, res) => {
    const [rows] = await db.execute(
        `SELECT id, plan_name FROM plan`
    );
    res.json({ plans: rows });
};

exports.updateMembershipDates = async (req, res) => {
    const { id } = req.params;
    const { membership_start_date, membership_end_date } = req.body;
  //console.log("REQ BODY:", req.body);
  console.log("HIT MEMBERSHIP DATE ROUTE", req.params, req.body);

    // Validation
  if (!membership_start_date || !membership_end_date) {
    return res.status(400).json({
      message: "Start date and End date are required"
    });
  }

  try {
    const [result] = await db.execute(
      `UPDATE member_profiles
       SET membership_start_date = ?, membership_end_date = ?
       WHERE user_id = ?`,
      [membership_start_date, membership_end_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: "Member not found" 
    });
    }

    res.status(200).json({
      message: "Membership dates updated successfully"
    });

  } catch (error) {
    console.error("Error updating membership dates:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendPaymentReminder = async (req, res) => {
    const { id } = req.params;

    try {
        const [[member]] = await db.execute(`
            SELECT
                u.email,
                u.full_name,
                mp.membership_end_date
            FROM users u
            JOIN member_profiles mp ON u.id = mp.user_id
            WHERE u.id = ?    
            `, [id]);

            if (!member) {
                return res.status(404).json({ message: "Member not found "});
            }

            // For log (later email/ whatsApp)
            console.log(`
                PAYMENT REMINDER
                Name: ${member.full_name}
                Email: ${member.email}
                Expired on: ${member.membership_end_date}
                `);

                res.json({
                    message: "Payment reminder sent successfully"
                });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send reminder" });
    }
};
exports.getAdminDashboardStats = async (req, res) => {
    try {
        // Total Members
        const [[totalMembers]] = await db.execute(
            `SELECT COUNT(*) AS total FROM users WHERE role = 'member'`
        );
        // Active Trainers    
        const [[activeTrainers]] = await db.execute(
            `SELECT COUNT(*) AS total FROM users WHERE role = 'trainer'`
        );

        // Expired Memberships
        const [[expiredMemberships]] = await db.execute(
            `SELECT COUNT(*) AS total
            FROM member_profiles
            WHERE membership_end_date < CURDATE()`
        );

        // Currently Checked-in Members
        const [[checkedInNow]] = await db.execute(
         `SELECT COUNT(*) AS total
            FROM attendance
            WHERE check_out_at IS NULL`
        );

        res.status(200).json({
            success: true,
            stats: {
            totalMembers: totalMembers.total,
            activeTrainers: activeTrainers.total,
            expiredMemberships: expiredMemberships.total,
            checkedInNow: checkedInNow.total,
            },
        });
    } catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({ message: "failed to load admin dashboard stats", });
    }
};