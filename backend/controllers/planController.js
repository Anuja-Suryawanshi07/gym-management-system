const db = require("../config/db");

// GET /api/plans
exports.getAllPlans = async (req, res) => {
    try {
        const [plans] = await db.execute(
            `SELECT id, plan_name, duration_months
            FROM plans
            WHERE status = 'active'`
        );

        res.status(200).json(plans);
    } catch (error) {
        console.error("Get plans error:", error);
        res.status(500).json({
            message: "Server error while fetching plans"
        });
    }
};