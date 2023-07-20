const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth/auth");
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.handleLogin);

module.exports = router;
