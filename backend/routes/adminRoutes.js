const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Add a middleware for admin

// --- USER MANAGEMENT (C.R.U.D.) ---

//POST /api/admin/users
//Create a new User (Member/Trainer/Admin)

router.post('/users', adminController.createUser);

// GET /api/admin/users
// Read all Users
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id
// Update User details
router.put('/users/:id', adminController.updateUser);

// DELETE /api/admin/users/:id
// Delete a User
router.delete('/users/:id', adminController.deleteUser);


// --- PLAN MANAGEMENT (C.R.U.D.) ---
// POST /api/admin/Plans
// Create a new Membership Plan
router.post('/plans',adminController.createPlan);

// GET /api/admin/plans
// Read all plans
router.get('/plans', adminController.getAllPlans);

//PUT /api/admin/plans/:id
// Update Plan details
router.put('/plans/:id', adminController.updatePlan);

//DELETE /api/admin/plans/:id
//Delete a Plan
router.delete('/plans/:id', adminController.deletePlan); 

// --- Trainer Profile management ---
// POST /api/admin/trainers
//Create a new Trainer Profile
router.post('/trainer', adminController.createTrainerProfile);

// GET /api/admin/trainers
// Read all Trainers (Profiles + User Data)
router.get('/trainers', adminController.getAllTrainers);

//PUT / api/admin/trainers/:user_id
//Update Trainer Profile details
router.put('/trainers/:user_id', adminController.updateTrainerProfile);

// DELETE / api/admin/trainers/:user_id
//Delete a Trainer Profile (user remains)
router.delete('/trainers/:user_id', adminController.deleteTrainerProfile); 

// --- MEMBER PROFILE MANAGEMENT (C.R.U.D) ---

//POST /api/admin/members
//Create a new Member Profile
router.post('/members', adminController.createMemberProfile);

//GET /api/admin/members
//Read all Members (Profile + User Data)
router.get('/members',adminController.getAllMembers);

//PUT /api/admin/members/:user_id
//Update Member Profile details
router.put('/members/:user_id', adminController.updateMemberProfile);

//DELETE /api/admin/members/:user_id
//DELETE a Member Profile(user remains)
router.delete('/members/:user_id', adminController.deleteMemberProfile);


module.exports = router;