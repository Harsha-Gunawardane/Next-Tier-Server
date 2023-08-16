const express = require("express");
const router = express.Router();

//controllers
const courseController = require("../../controllers/courseController");
const forumController = require("../../controllers/forumController");
const postController = require("../../controllers/postController");
const commentsController = require("../../controllers/commentsController");

//other imports
// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");
const { upload, multi_upload } = require("../../middleware/fileUpload/fileUpload");


router
    .route("/:id")
    .get(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        forumController.getForumDetails
    )


router
    .route("/:id/posts")
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
    .route("/posts/react")
    .post(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        postController.addReaction
    )

router
    .route("/posts/:post_id/comment")
    .get(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        postController.getComments
    )
    .post(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        commentsController.createParentComment
    )



module.exports = router;
