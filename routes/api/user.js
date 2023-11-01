const express = require("express");
const router = express.Router();

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

// import middlewares
const { upload } = require("../../middleware/fileUpload/fileUpload");

// import controllers
const userPasswordController = require("../../controllers/user/resetPassword");
const userProfileController = require("../../controllers/user/profilePicture");
const userInfoController = require("../../controllers/user/userinfo");
const feedbackController = require("../../controllers/admin/feedback");
const userFeedbackController = require("../../controllers/user/feedback");

router
  .route("/profile-image")

  .post(
    verifyRoles(ROLES_LIST.User),
    upload.single("file"),
    userProfileController.uploadProfilePicture
  );

router
  .route("/info")
  .patch(verifyRoles(ROLES_LIST.User), userPasswordController.resetPassword)
  .get(
    // verifyRoles(ROLES_LIST.User),
    userInfoController.getUserInfo
  );

router
  .route("/sys/feedback")
  .get(verifyRoles(ROLES_LIST.Admin), feedbackController.getAllFeedbacks)
  .delete(verifyRoles(ROLES_LIST.User), feedbackController.removeFeedback)
  .post(verifyRoles(ROLES_LIST.User), userFeedbackController.giveFeedback);

module.exports = router;
