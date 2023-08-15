const express = require("express");
const router = express.Router();

//controllers
const courseController = require("../../controllers/courseController");
const forumController = require("../../controllers/forumController");
const postController = require("../../controllers/postController");

//other imports
// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");
const { upload, multi_upload } = require("../../middleware/fileUpload/fileUpload");



//routes
router
    .route("/:id")
    .get(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        courseController.getCourseById
    )

router
    .route("/:id/forum")
    .get(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        forumController.getForumDetails
    )


router
    .route("/:id/forum/posts")
    .get(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        forumController.getPosts
    )
    .post(
        multi_upload.array('files'),
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        postController.createPost
    )

router
    .route("/:id/forum/posts/:postId")
    .get(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        postController.getPostById
    )

router
    .route("/forum/posts/react")
    .post(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        postController.addReaction
    )



module.exports = router;
