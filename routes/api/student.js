const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const userPasswordController = require("../../controllers/user/resetPassword")

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/info")
  .get(verifyRoles(ROLES_LIST.Student), studentInfoController.getStudentInfo)
  .put(
    verifyRoles(ROLES_LIST.Student),
    studentInfoController.updateStudentInfo
  )
  .patch(
    verifyRoles(ROLES_LIST.Student),
    userPasswordController.resetPassword
  )

module.exports = router;
