const express = require("express");
const router = express.Router();

const fileUpload = require("express-fileupload");
const filePayloadExists = require("../../middleware/fileUpload/filePayloadExists");
const fileExtLimitter = require("../../middleware/fileUpload/fileExtLimitter");
const fileSizeLimitter = require("../../middleware/fileUpload/fileSizeLimitter");

const userProfileController = require("../../controllers/user/profilePicture");

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

module.exports = router;
