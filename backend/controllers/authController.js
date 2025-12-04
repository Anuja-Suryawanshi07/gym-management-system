const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { message } = require("statuses");

// --- Login Function ---
exports.login = async (req, res) => {
    console.log('Login attempt received!');
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  try {
    //1. Find User by Email
    const [userRows] = await db.execute(
      "SELECT id, email, password_hash, full_name FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const user = userRows[0];

    //2. Compare Password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    //3. Fetch User Role(s)
    const [roleRows] = await db.execute(
      `
            SELECT r.role_name
            FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = ?`,
      [user.id]
    );

    // Assuming a user can have one primary role for now (e.g., 'admin' is the most significant)
    const role = roleRows.length > 0 ? roleRows[0].role_name : "unassigned";

    //4. Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: role },
      process.env.JWT_SECRET, // Access the secret from .env
      { expiresIn: "1d" } // Token expires in 1 day
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        role: role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: " An internal server error occured during login." });
  }
};
