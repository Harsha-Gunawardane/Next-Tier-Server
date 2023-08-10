const express = require("express");
const router = express.Router();

//controllers
const contentController = require("../../controllers/contentController");
const commentsController = require("../../controllers/commentsController");

//other imports
// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");



//routes
router
    .route("/:id")
    .get(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        contentController.getContentById
    )

router
    .route("/:id/react")
    .post(
        // verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
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



module.exports = router;
