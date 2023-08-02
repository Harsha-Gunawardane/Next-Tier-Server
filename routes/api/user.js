const express = require("express");
const router = express.Router();

// import middlewares
const upload = require("../../middleware/fileUpload/fileUpload");

// import controllers
const userProfileController = require("../../controllers/user/profilePicture");

router
  .route("/profile-image")
  .post(upload.single("image"), userProfileController.uploadProfilePicture);

module.exports = router;
