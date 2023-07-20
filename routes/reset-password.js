const express = require("express");
const router = express.Router();
const ResetPasswordController = require('../controllers/auth/resetPassword');

router.route('/send-otp').post(ResetPasswordController.sendOTP);

router.route('/verify-otp').post(ResetPasswordController.verifyOTP);

router.route('/reset-password').post(ResetPasswordController.resetPassword);

module.exports = router;