const express = require("express");
const router = express.Router();
const registerController = require("../controllers/auth/register");

router.post("/", registerController.handleNewUser);

module.exports = router;
