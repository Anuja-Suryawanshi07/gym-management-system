const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

//  MIDDLEWARE APPLICATION

// --- APPLY SECURITY TO ALL ADMIN ROUTES ---
// This middleware runs BEFORE every route defined below it.
// 1. authenticate: Checks for valid JWT.
// 2. isAdmin: Checks if the decoded JWT role is 'Admin'.
router.use(authenticate, isAdmin);

// ROUTE DEFINITIONS
// All routes below this line are protected by (authenticate, isAdmin)
// --- USER MANAGEMENT (C.R.U.D.) ---
//POST /api/admin/users - Create a new User (Member/Trainer/Admin)
router.post('/users', adminController.createUser);

// GET /api/admin/users - Read all Users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/users/:id - Read a single User
router.get('/users/:id', adminController.getUserById);

// PUT /api/admin/users/:id - Update User details
router.put('/users/:id', adminController.updateUser);

// DELETE /api/admin/users/:id - Delete a User
router.delete('/users/:id', adminController.deleteUser);

// --- PLAN MANAGEMENT (C.R.U.D.) ---
// POST /api/admin/Plans -  Create a new Membership Plan
router.post('/plans',adminController.createPlan);

// GET /api/admin/plans - Read all plans
router.get('/plans', adminController.getAllPlans);

// GET /api/admin/plans/:id - Read a single Plan
router.get('/plans/:id', adminController.getPlanById);

//PUT /api/admin/plans/:id - Update Plan details
router.put('/plans/:id', adminController.updatePlan);

//DELETE /api/admin/plans/:id - Delete a Plan
router.delete('/plans/:id', adminController.deletePlan); 

// --- Trainer Profile management ---
// POST /api/admin/trainers - Create a new Trainer Profile
router.post('/trainer', adminController.createTrainerProfile);
//router.post('/trainers', adminController.createTrainerProfile);

// GET /api/admin/trainers - // Read all Trainers (Profiles + User Data)
router.get('/trainers', adminController.getAllTrainers);

// GET /api/admin/trainers/:user_id - Read a single Trainer
router.get('/trainers/:user_id', adminController.getTrainerById);

//PUT / api/admin/trainers/:user_id - Update Trainer Profile details
router.put('/trainers/:user_id', adminController.updateTrainerProfile);

// DELETE / api/admin/trainers/:user_id - Delete a Trainer Profile (user remains)
router.delete('/trainers/:user_id', adminController.deleteTrainerProfile); 

// --- MEMBER PROFILE MANAGEMENT (C.R.U.D) ---
//POST /api/admin/members - //Create a new Member Profile
router.post('/members', adminController.createMemberProfile);

//GET /api/admin/members - Read all Members (Profile + User Data)
router.get('/members',adminController.getAllMembers);

// GET /api/admin/members/:user_id - Read a single Member
router.get('/members/:user_id', adminController.getMemberById);

//PUT /api/admin/members/:user_id - //Update Member Profile details
router.put('/members/:user_id', adminController.updateMemberProfile);

//DELETE /api/admin/members/:user_id - //DELETE a Member Profile(user remains)
router.delete('/members/:user_id', adminController.deleteMemberProfile);

// --- ADMIN SELF-MANAGEMENT ---
// GET /api/admin/profile - Get Admin's own user profile
router.get('/profile', adminController.getAdminProfile);

// --- MEMBER MANAGEMENT ---
// PUT /api/admin/member/:memberId/profile - Update a specific member's profile (plans, trainer, goals)
router.put('/member/:memberId/profile', adminController.updateMemberProfile);


module.exports = router;