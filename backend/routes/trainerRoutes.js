const express = require("express");
const router = express.Router();
const { authenticate, isTrainer } = require('../middleware/authMiddleware');
const trainerController = require('../controllers/trainerController');

// All Trainer routes require authenticatin
router.use(authenticate, isTrainer);

// --- TRAINER SELF-MANAGEMENT ---

// GET /api/trainer/profile - Get Trainer's own profile 
router.get('/profile', trainerController.getTrainerProfile);

// PUT /api/trainer/schedule - Update the trainer's availability/schedule
router.put('/schedule', trainerController.updateSchedule);

router.post("/sessions",trainerController.createSession);

router.get("/sessions", trainerController.getTrainerSessions);

router.put("/sessions/:id", trainerController.updateSession);

router.put("/sessions/:id/status", trainerController.updateSessionStatus);

router.get("/dashboard/stats", trainerController.getTrainerDashboardStats );

// GET /api/trainer/members - Get a list of members assgined to this trainer
router.get("/members", trainerController.getAssignedMembers);

// POST /api/trainer/checkin - Mark a member's check-in
router.post("/Checkin", trainerController.recordAttendance);
// POST /api/trainer/checkout- Mark a member's check-out
router.post("/checkout", trainerController.checkOutAttendance);

module.exports = router;










