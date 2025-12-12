const express = require('express');
const router = express.Router();
const { authenticate, isMember } = require('../middleware/authMiddleware');
const memberController = require('../controllers/memberController');

// All Member routes require authentication
router.use(authenticate, isMember);

// --- MEMBER SELF-MANAGEMENT ---

// GET /api/member/profile - Get member's own profile, plan status, and assigned trainer info
router.get('/profile', memberController.getMemberProfile);

// GET /api/member/attendance - Get member's attendance history
router.get('/attendance', memberController.getMemberAttendance);

// GET /api/member/plan - Get details of the member's current plan
router.get('/plan', memberController.getMemberPlan);

// POST /api/member/renew - Initiate a plan renewal process
router.post('/renew', memberController.initiateRenewal);

// 5. GET /api/member/payments - Fetch payment history
router.get('/payments', memberController.getMemberPayments);

// 6. GET /api/member/sessions - Fetch scheduled sessions
router.get('/sessions', memberController.getMemberSessions);

module.exports = router;