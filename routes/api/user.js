const express = require("express");
const router = express.Router();

// import middlewares
const {upload} = require("../../middleware/fileUpload/fileUpload");

// import controllers
const userProfileController = require("../../controllers/user/profilePicture");
const userInfoController = require("../../controllers/user/userInfo");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roleList");

router
  .route("/profile-image")
  .post(upload.single("file"), userProfileController.uploadProfilePicture);

router
  .route("/info")
  .get(
    // verifyRoles(ROLES_LIST.User),
    userInfoController.getUserInfo
  )

module.exports = router;
