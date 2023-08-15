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
const userInfoController = require("../../controllers/user/userInfo");

router
  .route("/profile-image")
  .post(upload.single("file"), userProfileController.uploadProfilePicture);

router
  .route("/info")
  .patch(verifyRoles(ROLES_LIST.User), userPasswordController.resetPassword)
  .get(
    // verifyRoles(ROLES_LIST.User),
    userInfoController.getUserInfo
  )

module.exports = router;
