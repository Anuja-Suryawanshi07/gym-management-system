// A dedicated script file (e.g., resetPasswords.js)
const db = require("./config/db"); // Your database connection
const bcrypt = require("bcrypt");

const PLAIN_PASSWORD = "password123";

async function resetPasswords() {
    try {
        // Generate the secure hash for the known password
        const secureHash = await bcrypt.hash(PLAIN_PASSWORD, 10);
        
        console.log(`New secure hash generated: ${secureHash}`);

        // Get all users with the short/invalid hash
        const [usersToUpdate] = await db.execute(
            "SELECT id, email FROM users WHERE LENGTH(password_hash) < 60"
        );
        
        console.log(`Found ${usersToUpdate.length} users to update.`);

        for (const user of usersToUpdate) {
            // Update the password_hash for each user
            await db.execute(
                "UPDATE users SET password_hash = ? WHERE id = ?",
                [secureHash, user.id]
            );
            console.log(`Updated password for user ID: ${user.id} (${user.email})`);
        }
        
        console.log("Password reset complete for all invalid accounts.");
    } catch (error) {
        console.error("Error during password reset:", error);
    } finally {
        // You may need to close your database connection here
        // if your 'db' object has a specific close method.
    }
}

resetPasswords();