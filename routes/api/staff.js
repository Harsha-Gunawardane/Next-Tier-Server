const express = require("express");
const router = express.Router();
const staffController = require("../../controllers/staffController");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(staffController.getAllStaffs)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    staffController.createNewStaff
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    staffController.updateStaff
  )
  .delete(verifyRoles(ROLES_LIST.Admin), staffController.deleteStaff);

router.route("/:id").get(staffController.getStaff);

module.exports = router;
