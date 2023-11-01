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
// const convertVideo = require("../../middleware/fileUpload/convertVideo");
const { upload, uploadDirect } = require("../../middleware/fileUpload/videoUpload");
// const convertVideoAll = require("../../middleware/fileUpload/convertVideoAll");




//routes
router
    .route("/")
    .get(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        contentController.getRecommendedContent
    )

// router
//     .route("/upload")
//     .get(
//         contentController.test
//     )
//     .post(
//         // verifyRoles([ROLES_LIST.Tutor]),
//         upload.single("video"),
//         convertVideoAll,
//         contentController.test,
//         contentController.uploadVideo
//     )

router
    .route("/upload_direct")
    .post(
        verifyRoles([ROLES_LIST.Tutor]),
        uploadDirect.single("files"),
        contentController.uploadVideoDirect
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

router
    .get('/video/:videoName/hls/:quality', contentController.serveHLS);



module.exports = router;
