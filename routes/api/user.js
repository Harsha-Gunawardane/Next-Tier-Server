const express = require("express");
const router = express.Router();
const userController = require('../../controllers/user');

// verify roles
// const ROLES_LIST = require("../../config/roleList");
// const verifyRoles = require("../../middleware/verifyRoles");

router.route("/:username").get(userController.getUser);

module.exports = router;