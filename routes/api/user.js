const express = require("express");
const router = express.Router();

const fileUpload = require("express-fileupload");
const filePayloadExists = require("../../middleware/fileUpload/filePayloadExists");
const fileExtLimitter = require("../../middleware/fileUpload/fileExtLimitter");
const fileSizeLimitter = require("../../middleware/fileUpload/fileSizeLimitter");

const userProfileController = require("../../controllers/user/profilePicture");
const userInfoController = require("../../controllers/user/userInfo");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roleList");

// middleware for file upload
router.use(
  fileUpload({
    createParentPath: true,
  })
);

router
  .route("/profile-image")
  .post(
    // filePayloadExists(),
    // fileExtLimitter([".jpg", ".png", ".jpeg"]),
    // fileSizeLimitter(),
    userProfileController.uploadProfilePicture
  );

router
  .route("/info")
  .get(
    // verifyRoles(ROLES_LIST.User),
    userInfoController.getUserInfo
  )

module.exports = router;
