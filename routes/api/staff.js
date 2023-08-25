const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/Staff/StaffDetails");
const userPasswordController = require("../../controllers/Staff/resetPassword");
const registerController = require("../../controllers/Staff/registerStaff");
const getAllStaffController = require("../../controllers/Staff/getAllStaffDetails");
const allStaffProfileController = require("../../controllers/Staff/staffProfile");
const editDetailsController = require("../../controllers/Staff/editDetails");
const complaintsController = require("../../controllers/Staff/complaints");
const allTutorProfileController = require("../../controllers/Staff/tutorProfile");
const courseProfileController=require("../../controllers/Staff/getCourseDetails")

//shimra's routes
const registerTeacherController = require("../../controllers/Staff/TeacherRegister");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

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

  router.get(
    "/tutor-profile/:id",
    verifyRoles(ROLES_LIST.Staff),
    allTutorProfileController.tutorProfile
  );

  router
  .route("/course/:id")
  .get(verifyRoles(ROLES_LIST.Staff), courseProfileController.getCourseDetails);

//shimra's routes

router
  .route("/tutor")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    registerTeacherController.getAllTutorDetails
  )
  .post(
    verifyRoles(ROLES_LIST.Staff),
    registerTeacherController.handleNewTeacher
  );



module.exports = router;
