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
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        forumController.getPosts
    )
    .post(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        postController.createPost
    )



module.exports = router;
