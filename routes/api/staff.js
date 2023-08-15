const express = require("express");
const router = express.Router();
// const staffController = require("../../controllers/staffController");

const profileController = require("../../controllers/Staff/StaffDetails");
const userPasswordController = require("../../controllers/Staff/resetPassword");
const registerController = require("../../controllers/Staff/registerStaff");
const getAllStaffController = require("../../controllers/Staff/getAllStaffDetails");
const allStaffProfileController = require("../../controllers/Staff/staffProfile");
const editDetailsController = require("../../controllers/Staff/editDetails");
const complaintsController = require("../../controllers/Staff/complaints");
// const complaintsManagerController = require("../../controllers/Staff/complaintsManagement")
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
router;
//   .route("/")
//   .get(staffController.getAllStaffs)
//   .post(
//     verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//     staffController.createNewStaff
//   )
//   .put(
//     verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//     staffController.updateStaff
//   )
//   .delete(verifyRoles(ROLES_LIST.Admin), staffController.deleteStaff);

// router.route("/:id").get(staffController.getStaff);

router
  .route("/profile")
  .get(verifyRoles(ROLES_LIST.Staff), profileController.getStaffDetails)
  .patch(verifyRoles(ROLES_LIST.Staff), userPasswordController.resetPassword)
  .put(verifyRoles(ROLES_LIST.Staff), editDetailsController.editDetails);

router
  .route("/register")
  .post(verifyRoles(ROLES_LIST.Staff), registerController.registerStaff);

router
  .route("/staffList")
  .get(verifyRoles(ROLES_LIST.Staff), getAllStaffController.getAllStaffDetails);

router.get(
  "/profile/:id",
  verifyRoles(ROLES_LIST.Staff),
  allStaffProfileController.staffProfile
);

router
  .route("/complaints")
  .get(verifyRoles(ROLES_LIST.Staff), complaintsController.complaints);

router
  .route("/complaints/edit/:id")
  .put(verifyRoles(ROLES_LIST.Staff), complaintsController.editComplaint);

router
  .route("/complaints/ignore/:id")
  .put(verifyRoles(ROLES_LIST.Staff), complaintsController.ignoreComplaint);

module.exports = router;
