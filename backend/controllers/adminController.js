const db = require("../config/db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

// --- 1. CREATE USER ---
exports.createUser = async (req, res) => {
  const { full_name, email, password, phone, gender, dob, address, role_name } =
    req.body;

  let connection;

  if (!full_name || !email || !password || !role_name) {
    return res.status(400).json({
      message:
        "Missing required fields: full_name, email, password, role_name.",
    });
  }

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    //1. Hash Password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    //2. Insert into users table
    const [userResult] = await connection.execute(
      "INSERT INTO users (full_name, email, phone, gender, dob, address, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [full_name, email, phone, gender, dob, address, password_hash]
    );
    const userId = userResult.insertId;

    // 3. Find the role_id
    const [roleRows] = await connection.execute(
      "SELECT id FROM roles WHERE role_name = ?",
      [role_name]
    );
    if (roleRows.length === 0) {
      throw new Error(`Role "${role_name}" not found.`);
    }
    const roleId = roleRows[0].id;

    //4. Assign role to user
    await connection.execute(
      "INSERT INTO user_roles (user_id, role_id ) VALUES (?, ?)",
      [userId, roleId]
    );

    //5. Commit transaction
    await connection.commit();

    res
      .status(201)
      .json({ message: "User and role created successfully", userId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

//--- 2. READ ALL USERS (with Roles) ---

exports.getAllUsers = async (req, res) => {
  try {
    //Query to join users and role tables
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
    console.error("Error fetching users", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// --- 3. UPDATE USER DETAILS ---
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, gender, dob, address, password } = req.body;

  let updateFields = req.body;
  let query = "UPDATE users SET ";
  const queryParams = [];

  //Dynamically build the query based on fields provided

  for (const key in updateFields) {
    if (updateFields[key] !== undefined && key !== "password") {
      // Exclude password for seperate handling
      query += `${key} = ?, `;
      queryParams.push(updateFields[key]);
    }
  }

  //Handle password update seperately (must be hashed)
  if (password) {
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    query += "password_hash = ?, ";
    queryParams.push(password_hash);
  }

  // Remove the trailing comma and space, add WHERE clause
  query = query.slice(0, -2) + " WHERE id = ?";
  queryParams.push(id);

  try {
    const [result] = await db.execute(query, queryParams);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made." });
    }
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// --- 4. DELETE USER ---

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    //Deleting from users table will automatically delete related records
    // in user_roles,member_profiles,trcener_profiles, etc., due to ON DELETE CASCADE
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRoos === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    res
      .status(200)
      .json({ message: "User and all realted records deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// --- 5. CREATE  PLAN ---
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
// --- 6. READ ALL PLANS ---
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

// --- 7. UPDATE PLAN ---
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
      // Check if the plan was not found or if no change were made
      const [planCheck] = await db.execute(
        "SELECT id FROM plans WHERE id = ?",
        [id]
      );

      if (planCheck.length === 0) {
        return res.status(404).json({ message: "Plan not found." });
      }
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

// --- 8. DELETE PLAN ---
exports.deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
    // NOTE: Deleting a plan might require a check to see if any members are currently enrollrd.
    // For now, we rely on the database foregin key constraint to prevent deletion if enrollment exists.

    const [result] = await db.execute("DELETE FROM plans WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plan not found." });
    }
    res.status(200).json({ message: "Plan deleted successfully." });
  } catch (error) {
    // Check for integrity constraint violation (e.g., if plan is in use)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message:
          " Cannot delete plan because it is currently enrolled by members. Please deactivate it instead.",
        error: error.message,
      });
    }
    console.error("Error deleting plan:", error);
    res
      .status(500)
      .json({ message: "Error deleting plan", error: error.message });
  }
};
// --- 9. CREATE TRAINER POFILE ---
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
        message: "Trainer profile already exists for this user ID. ",
      });
    }
    console.error("Error creating trainer profile:", error);
    res.status(500).json({
      message: "Error creating trainer profile",
      error: error.message,
    });
  }
};

// --- 10. READ ALL TRAINERS (JOINED with Users) ---
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

// --- 11. UPDATE TRAINER PROFILE ---
exports.updateTrainerProfile = async (req, res) => {
  const { user_id } = req.params; // Using user_id for convenience
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

  query = query.slice(0, -2) + " WHERE user_id = ?";
  queryParams.push(user_id);

  try {
    const [result] = await db.execute(query, queryParams);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Trainer profile not found or no changes made." });
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

// --- 12. DELETE TRAINER PROFILE ---
// NOTE: Deleting the profile (trainer_profiles) does NOT delete the user (users).
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

// --- 13. CREATE MEMBER PROFILE ---
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
      message:
        "Missing requird fields: user_id, membership_start, membership_end.",
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
      //trainer_id can be null
    );
    res.status(201).json({
      message: "Member profile created successfully",
      profileId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Member profile is already exists for this user ID.",
      });
    }
    console.error("Error creating member profile:", error);
    res.status(500).json({
      message: "Error creating member profile",
      error: error.message,
    });
  }
};

// --- 14. READ ALL MEMBERS (JOINED with users and Assigned Trainer) ---
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

// --- 15. UPDATE MEMBER PROFILE ---
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
      query += `${key} = ?, `;
      queryParams.push(fields[key]);
    }
  }
  // Check if any fields were provided
  if (queryParams.length === 0) {
    return res.status(400).json({ message: " No fields provided for update." });
  }
  query = query.slice(0, -2) + " WHERE user_id = ?";
  queryParams.push(user_id);

  try {
    const [result] = await db.execute(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Member profile not found or no changes made.",
      });
    }
    res.status(200).json({
      message: " Member profile updated successfully.",
    });
  } catch (error) {
    console.error("Error updating member profile:", error);
    res
      .status(500)
      .json({ message: "Error updating member profile", error: error.message });
  }
};

// --- 16. DELETE MEMBER PROFILE ---
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
      message: " Member profile deleted successfully (Base User remains).",
    });
  } catch (error) {
    console.error("Error deleting member profile:", error);
    res
      .status(500)
      .json({ message: "Error deleting member profile", error: error.message });
  }
};
