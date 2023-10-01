const express = require("express");
const router = express.Router();
const path = require("path");

const paymentController = require("../controllers/payementController");
const contentController = require("../controllers/contentController");

// Verify roles
const ROLES_LIST = require("../config/roleList");
const verifyRoles = require("../middleware/verifyRoles");

router
    .route("/payment")
    .post(express.raw({ type: 'application/json' }), paymentController.webHook);


router
    .route("/video_convert")
    .post(contentController.videoConvertWebhook);


module.exports = router;