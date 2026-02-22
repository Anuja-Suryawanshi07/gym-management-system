const express = require('express');
const router = express.Router();
const  paymentController  = require('../controllers/paymentController');
const { authenticate }  = require('../middleware/authMiddleware');

// Webhook 
router.post(
    '/Webhook',
    paymentController.handleStripeWebhook
);

// Checkout session
router.post(
    '/create-checkout-session',
    authenticate,
    paymentController.createCheckoutSession
);

module.exports = router;