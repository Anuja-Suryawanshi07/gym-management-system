const db = require("../config/db");
const bcrypt = require("bcrypt");
// const SALT_ROUNDS = 10; // Declaring here but using the value 10 directly in hash functions

// =======================================================
// CORE ADMIN API ENDPOINTS (Protected by authenticate, isAdmin)
// =======================================================

// --- 1. GET ADMIN PROFILE (Simple Test Route) ---
exports.getAdminProfile = (req, res) => {
    // This route is typically used for the admin to fetch their own detailed profile data.
    // However, as a simple test:
    res.status(200).json({
        message: 'Welcome to your profile!',
        user: req.user, // Decoded JWT payload
    });
};

// --- 2. CREATE USER (Transaction Logic: User + Role) ---
// Route: POST /api/admin/users
exports.createUser = async (req, res) => {
    const { full_name, email, phone, gender, dob, address, password, role_name } =
        req.body;

    // 1. Basic validation
    if (!full_name || !email || !password || !role_name) {
        return res.status(400).json({
            message: "Missing required fields: full_name, email, password, role_name.",
        });
    }

    let connection;
    try {
        // Check if user already exists
        const [existingUser] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 2. Hash Password
        const password_hash = await bcrypt.hash(password, 10); // Using 10 directly

        // 3. Insert into users table
        const [userResult] = await connection.execute(
            "INSERT INTO users (full_name, email, phone, gender, dob, address, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [full_name, email, phone, gender, dob, address, password_hash]
        );
        const newUserId = userResult.insertId;

        // 4. Assign the role -- Find the role ID
        const [roleRows] = await connection.execute(
            "SELECT id FROM roles WHERE role_name = ?",
            [role_name]
        );
        if (roleRows.length === 0) {
            // It's crucial to rollback here as the user insertion succeeded
            await connection.rollback(); 
            return res.status(400).json({ message: `Invalid role specified: ${role_name}.` });
        }
        const roleId = roleRows[0].id;

        // Assign role to user
        await connection.execute(
            "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
            [newUserId, roleId]
        );

        // 5. Commit transaction
        await connection.commit();

        res.status(201).json({
            message: "User created successfully with role assignment.",
            userId: newUserId,
            role: role_name
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Server error during user creation.",
            error: error.message
        });
    } finally {
        if (connection) connection.release();
    }
};

// --- 3. READ ALL USERS (with Roles) ---
// Route: GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        // Query to join users and role tables
        const [rows] = await db.query(`
            SELECT 
            u.id, u.full_name, u.email, u.phone, u.gender, u.dob, u.address,
            GROUP_CONCAT(r.role_name) AS roles
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN roles r ON ur.role_id = r.id
            GROUP BY u.id
            ORDER BY u.id DESC
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
            'SELECT id, full_name, email, phone, gender, dob, address, created_at, updated_at FROM users WHERE id = ?', [userId]
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

// --- 5. UPDATE USER DETAILS ---
// Route: PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, role_name } = req.body; // Separate out role and password for custom handling

    let updateFields = { ...req.body };
    delete updateFields.password;
    delete updateFields.role_name; 

    let query = "UPDATE users SET ";
    const queryParams = [];

    // Dynamically build the query based on fields provided (excluding password and role_name)
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
    
    // Check if any fields are provided for the 'users' table update
    if (queryParams.length === 0 && !role_name) {
        return res.status(400).json({ message: "No fields provided for update." });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Execute 'users' table update
        let affectedRows = 0;
        if (queryParams.length > 0) {
            // Remove the trailing comma and space, add WHERE clause
            let finalUserQuery = query.slice(0, -2) + " WHERE id = ?";
            const [userResult] = await connection.execute(finalUserQuery, [...queryParams, id]);
            affectedRows = userResult.affectedRows;
        }

        // 2. Update Role (if provided)
        if (role_name) {
            const [roleRow] = await connection.execute('SELECT id FROM roles WHERE role_name = ?', [role_name]);
            if (roleRow.length === 0) {
                await connection.rollback();
                return res.status(400).json({ message: `Invalid role specified: ${role_name}.` });
            }
            const newRoleId = roleRow[0].id;
            
            // Assuming one role per user:
            const [roleUpdateResult] = await connection.execute('UPDATE user_roles SET role_id = ? WHERE user_id = ?', [newRoleId, id]);
            affectedRows += roleUpdateResult.affectedRows; // Track total changes
        }

        await connection.commit();
        
        if (affectedRows === 0) {
            // Check if the user exists but no fields changed
            const [userCheck] = await db.execute("SELECT id FROM users WHERE id = ?", [id]);
            if (userCheck.length === 0) {
                 return res.status(404).json({ message: "User not found." });
            }
            return res.status(200).json({ message: "User details already up-to-date, no changes made." });
        }

        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// --- 6. DELETE USER ---
// Route: DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        // You correctly rely on database ON DELETE CASCADE, which is the best practice!
        const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
        
        // Fix: Typo corrected (result.affectedRoos -> result.affectedRows)
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
// PLAN MANAGEMENT API ENDPOINTS
// =======================================================

// --- 7. CREATE PLAN ---
// Route: POST /api/admin/plans
exports.createPlan = async (req, res) => {
    // Standardizing variable names to match SQL schema (plan_name -> name)
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
// TRAINER PROFILE API ENDPOINTS
// =======================================================

// --- 12. CREATE TRAINER PROFILE ---
// Route: POST /api/admin/trainers
exports.createTrainerProfile = async (req, res) => {
    const {
        user_id,
        specialty,
        experience_years,
        certification_details,
        status,
    } = req.body;

    if (!user_id || !specialty) {
        return res
            .status(400)
            .json({ message: "Missing required fields: user_id and specialty." });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO trainer_profiles (user_id, specialty, experience_years, certification_details, status) VALUES (?, ?, ?, ?, ?)",
            [
                user_id,
                specialty,
                experience_years,
                certification_details,
                status || "active",
            ]
        );
        res.status(201).json({
            message: "Trainer profile created successfully",
            profileId: result.insertId,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Trainer profile already exists for this user ID.",
            });
        }
        console.error("Error creating trainer profile:", error);
        res.status(500).json({
            message: "Error creating trainer profile",
            error: error.message,
        });
    }
};

// --- 13. READ ALL TRAINERS (JOINED with Users) ---
// Route: GET /api/admin/trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
            u.id AS user_id, u.full_name, u.email, u.phone, tp.id AS profile_id, tp.specialty, tp.experience_years, tp.certification_details, tp.status
            FROM users u
            JOIN trainer_profiles tp ON u.id = tp.user_id
            ORDER BY u.id DESC
        `);
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
    // FIX: Corrected typo from req.parms.user_id to req.params.user_id
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
            tp.status
            FROM users u
            JOIN trainer_profiles tp ON u.id = tp.user_id
            WHERE u.id = ?
        `, [trainerUserId]
        );
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
    const { specialty, experience_years, certification_details, status } =
        req.body;

    let query = "UPDATE trainer_profiles SET ";
    const queryParams = [];
    const fields = {
        specialty,
        experience_years,
        certification_details,
        status,
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
            // Better 404 check: check if profile exists first
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
        // You might want to add a check for ER_ROW_IS_REFERENCED_2 if any members are assigned to this trainer
        console.error("Error deleting trainer profile:", error);
        res.status(500).json({
            message: "Error deleting trainer profile",
            error: error.message,
        });
    }
};

// =======================================================
// MEMBER PROFILE API ENDPOINTS
// =======================================================

// --- 17. CREATE MEMBER PROFILE ---
// Route: POST /api/admin/members
exports.createMemberProfile = async (req, res) => {
    const {
        user_id,
        trainer_id,
        membership_start,
        membership_end,
        health_details,
    } = req.body;

    if (!user_id || !membership_start || !membership_end) {
        return res.status(400).json({
            message: "Missing required fields: user_id, membership_start, membership_end.",
        });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO member_profiles (user_id, trainer_id, membership_start, membership_end, health_details) VALUES (?, ?, ?, ?, ?)",
            [
                user_id,
                trainer_id || null,
                membership_start,
                membership_end,
                health_details,
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
        // You should also check for ER_NO_REFERENCED_ROW_2 if trainer_id or user_id don't exist
        console.error("Error creating member profile:", error);
        res.status(500).json({
            message: "Error creating member profile",
            error: error.message,
        });
    }
};

// --- 18. READ ALL MEMBERS (JOINED with users and Assigned Trainer) ---
// Route: GET /api/admin/members
exports.getAllMembers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
            u.id AS user_id, u.full_name, u.email, u.phone,
            mp.membership_start, mp.membership_end, mp.health_details,
            t.full_name AS assigned_trainer_name
            FROM users u
            JOIN member_profiles mp ON u.id = mp.user_id
            LEFT JOIN users t ON mp.trainer_id = t.id
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
            ` SELECT u.id AS user_id,
            u.full_name,
            u.email,
            u.phone,
            mp.trainer_id,
            mp.membership_start,
            mp.membership_end,
            mp.health_details
            FROM users u
            JOIN member_profiles mp ON u.id = mp.user_id
            WHERE u.id = ?`,
            [memberUserId]
        );
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

// --- 20. UPDATE MEMBER PROFILE ---
// Route: PUT /api/admin/members/:user_id
exports.updateMemberProfile = async (req, res) => {
    const { user_id } = req.params;
    const { trainer_id, membership_start, membership_end, health_details } =
        req.body;

    let query = " UPDATE member_profiles SET ";
    const queryParams = [];
    const fields = {
        trainer_id,
        membership_start,
        membership_end,
        health_details,
    };

    // Build query dynamically
    for (const key in fields) {
        if (fields[key] !== undefined) {
            // FIX: If trainer_id is explicitly set to null (or 0), we should allow it.
            // Assuming trainer_id is only pushed if defined. If defined but null, SQL will handle it.
            query += `${key} = ?, `;
            queryParams.push(fields[key]);
        }
    }
    
    // Check if any fields were provided
    if (queryParams.length === 0) {
        return res.status(400).json({ message: "No fields provided for update." });
    }
    
    query = query.slice(0, -2) + " WHERE user_id = ?";
    queryParams.push(user_id);

    try {
        const [result] = await db.execute(query, queryParams);

        if (result.affectedRows === 0) {
            // Check for 404
            const [profileCheck] = await db.execute("SELECT user_id FROM member_profiles WHERE user_id = ?", [user_id]);
            if (profileCheck.length === 0) {
                 return res.status(404).json({ message: "Member profile not found." });
            }
            return res.status(200).json({ message: "Member profile details already up-to-date, no changes made." });
        }
        res.status(200).json({
            message: "Member profile updated successfully.",
        });
    } catch (error) {
        console.error("Error updating member profile:", error);
        res
            .status(500)
            .json({ message: "Error updating member profile", error: error.message });
    }
};

// --- 21. DELETE MEMBER PROFILE ---
// Route: DELETE /api/admin/members/:user_id
exports.deleteMemberProfile = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [result] = await db.execute(
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
// --- 1. GET ADMIN PROFILE (Self-Access) ---
// Route: GET /api/admin/profile
exports.getAdminProfile = async (req, res) => {
    // This function fetches the currently authenticated Admin's user data
    try {
        const [rows] = await db.execute(
            "SELECT id, full_name, email, phone, gender, dob, address FROM users WHERE id = ?",
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

// --- 2. UPDATE MEMBER PROFILE (Admin Management) ---
// Route: PUT /api/admin/member/:memberId/profile
exports.updateMemberProfile = async (req, res) => {
    const memberId = req.params.memberId;
    const updateData = req.body;
    
    // Define the list of fields allowed to be updated in the member_profiles table
    const allowedFields = [
        'membership_status', 
        'health_goals', 
        'membership_start_date', 
        'membership_end_date', 
        'current_plan_id', 
        'assigned_trainer_id'
    ];
    
    const fieldsToUpdate = [];
    const values = [];

    // Dynamically build the SET part of the SQL query to handle partial updates
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            fieldsToUpdate.push(`${field} = ?`);
            // Handle null values explicitly for DB columns that allow it
            values.push(updateData[field] === null ? null : updateData[field]);
        }
    }

    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update." });
    }

    // Add the member ID to the end of the values array for the WHERE clause
    values.push(memberId);
    
    try {
        // Construct the final SQL query
        const sql = `UPDATE member_profiles SET ${fieldsToUpdate.join(', ')} WHERE user_id = ?`;
        
        const [result] = await db.execute(sql, values);

        if (result.affectedRows === 0) {
            // Check if the member profile exists but no change was needed
            const [check] = await db.execute("SELECT 1 FROM member_profiles WHERE user_id = ?", [memberId]);
            if (check.length === 0) {
                return res.status(404).json({ message: "Member profile not found." });
            }
            return res.status(200).json({ message: "Member profile found, but no new changes were applied." });
        }
        
        res.status(200).json({
            message: `Member ID ${memberId} profile updated successfully.`,
            updatedFields: updateData
        });

    } catch (error) {
        console.error("Error updating member profile by Admin:", error);
        res.status(500).json({
            message: "Server error during member profile update.",
            error: error.message
        });
    }
};