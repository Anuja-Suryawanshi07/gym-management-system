const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper function to get the ID for a given role name
const getRoleId = async (roleName) => {
    const [roleRows] = await db.execute("SELECT id FROM roles WHERE role_name = ?", [roleName]);
    if (roleRows.length === 0) {
        throw new Error(`Role '${roleName}' not found in the database.`);
    }
    return roleRows[0].id;
};

// --- Register Function ---
// Route: POST /api/auth/register
exports.register = async (req, res) => {
    const { 
        full_name, 
        email, 
        password, 
        role, // Expected to be 'Member', 'Trainer', or 'Admin'
        phone, 
        gender, 
        dob, 
        address 
    } = req.body;

    // 1. Basic Validation
    if (!email || !password || !full_name || !role) {
        return res.status(400).json({ message: "Full name, email, password, and role are required." });
    }
    
    // Simple role check for security/integrity
    const allowedRoles = ['member', 'trainer', 'admin'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
    }

    // Use transaction for atomic operation (user creation and role assignment)
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 2. Check if user already exists
        const [existingUsers] = await connection.execute("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(409).json({ message: "User with this email already exists." });
        }

        // 3. Hash the password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 4. Insert user into 'users' table
        const [userResult] = await connection.execute(
            `INSERT INTO users (full_name, email, password_hash, phone, gender, dob, address)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, password_hash, phone || null, gender || null, dob || null, address || null]
        );
        const newUserId = userResult.insertId;

        // 5. Get Role ID and assign role in 'user_roles' table
        const roleId = await getRoleId(role);
        await connection.execute(
            `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
            [newUserId, roleId]
        );

        // 6. If role is Member or Trainer, create corresponding profile table entry (essential for the join logic to work)
        if (role === 'member') {
            await connection.execute(
                `INSERT INTO member_profiles (user_id) VALUES (?)`, 
                [newUserId]
            );
        } else if (role === 'trainer') {
             await connection.execute(
                `INSERT INTO trainer_profiles (user_id) VALUES (?)`, 
                [newUserId]
            );
        }

        // Commit the transaction
        await connection.commit();

        res.status(201).json({
            message: "User registered successfully.",
            user: { id: newUserId, full_name, email, role },
            note: `Successfully created user and initial ${role} profile.`
        });

    } catch (error) {
        await connection.rollback();
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "An internal server error occurred during registration.",
            error: error.message
        });
    } finally {
        connection.release();
    }
};

// --- Login Function ---
// Route: POST /api/auth/login
exports.login = async (req, res) => {
    console.log("Login attempt received!");
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // 1. Find user
        const [userRows] = await db.execute(
            "SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?",
            [email]
        );
        console.log("User from DB:", userRows);

        if (userRows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = userRows[0];

        // 2. Compare password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // 3. Fetch role properly
        const [roleRows] = await db.execute(
            `
            SELECT r.role_name
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?
            `,
            [user.id]
        );

        const role = roleRows.length > 0
            ? roleRows[0].role_name.toLowerCase()
            : "unassigned";

        // 4. Generate JWT
        const token = jwt.sign(
            { id: user.id,
             email: user.email,
             role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log("JWT Payload:", {
  id: user.id,
  email: user.email,
  role: user.role
});
            


        // 5. Respond
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "An internal server error occurred during login.",
        });
    }
};
