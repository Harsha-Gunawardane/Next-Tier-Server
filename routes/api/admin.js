const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/admin/admin");
const staffController = require("../../controllers/admin/users");

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .post(verifyRoles(ROLES_LIST.Admin), adminController.register)
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getAdmin)
  .patch(verifyRoles(ROLES_LIST.Admin), adminController.edit);

router
  .route("/all")
  .get(verifyRoles(ROLES_LIST.Admin), adminController.getAdmins);

router
  .route("/staff")
  .post(verifyRoles(ROLES_LIST.Admin), staffController.register)
  .get(verifyRoles(ROLES_LIST.Admin), staffController.getUsers);

router
  .route("/user/:username")
  .patch(verifyRoles(ROLES_LIST.Admin), staffController.activeUser);

module.exports = router;
