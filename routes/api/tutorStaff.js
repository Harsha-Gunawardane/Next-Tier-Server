const express = require("express");
const router = express.Router();
const staffController = require("../../controllers/tutor/tutorStaffController");

const profileController =  require('../../controllers/Staff/StaffDetails');
// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(staffController.getAllStaffs)
  .post(verifyRoles(ROLES_LIST.Tutor), staffController.createNewStaff)
  .put(verifyRoles(ROLES_LIST.Tutor), staffController.updateStaff)
  .delete(verifyRoles(ROLES_LIST.Tutor), staffController.deleteStaff);

// router.route("/:id").get(staffController.getStaff);
router 
    .route("/profile")
    .get(verifyRoles(ROLES_LIST.Staff),
    profileController.getStaffDetails)

module.exports = router;
