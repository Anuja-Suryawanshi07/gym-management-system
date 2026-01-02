const express = require ("express");
const { createMembershipRequest } = require("../controllers/membershipRequestController");

const router = express.Router();

//PUBLIC route
router.post("/membership-requests", createMembershipRequest);

module.exports = router;