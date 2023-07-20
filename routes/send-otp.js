const express = require("express");
const router = express.Router();
const OTPController = require('../controllers/auth/verifyUser');

router.route('/').post(OTPController.sendOTP);

module.exports = router;