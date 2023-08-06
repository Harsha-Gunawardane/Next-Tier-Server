const express = require("express");
const router = express.Router();
const staffController = require("../../controllers/staffController");

const profileController =  require('../../controllers/Staff/StaffDetails');
const userPasswordController = require("../../controllers/user/resetPassword");
const registerController = require("../../controllers/Staff/registerStaff")

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
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
    .get(verifyRoles(ROLES_LIST.Staff),profileController.getStaffDetails)
    .patch(verifyRoles(ROLES_LIST.Staff), userPasswordController.resetPassword)
   
router
    .route("/register")
    .post(verifyRoles(ROLES_LIST.Staff),registerController.registerStaff);

module.exports = router;
