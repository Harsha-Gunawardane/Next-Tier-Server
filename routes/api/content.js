const express = require("express");
const router = express.Router();
const path = require("path");

//controllers
const contentController = require("../../controllers/contentController");
const commentsController = require("../../controllers/commentsController");

//other imports
// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");
const convertVideo = require("../../middleware/fileUpload/convertVideo");
const upload = require("../../middleware/fileUpload/videoUpload");




//routes
router
    .route("/upload")
    .get(
        contentController.test
    )
    .post(
        // verifyRoles([ROLES_LIST.Tutor]),
        upload.single("video"),
        convertVideo,
        contentController.test,
        contentController.uploadVideo
    )

router
    .route("/:id")
    .get(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        contentController.getContentById
    )

router
    .route("/:id/react")
    .post(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        contentController.addReaction
    )

router
    .route("/:contentId/comment")
    .get(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        contentController.getComments
    )
    .post(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        commentsController.createParentComment
    )

router
    .get('/video/:videoName/hls', contentController.serveHLS);



module.exports = router;
