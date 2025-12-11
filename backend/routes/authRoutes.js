const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Public route for user Register.
router.post('/register', authController.register);

// Public route for user login
router.post('/login', authController.login);

module.exports = router;