const express = require("express");
const router = express.Router();

//controllers
const commentsController = require("../../controllers/commentsController");

//other imports
// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");


//routes
router
    .route("/:id")
    .delete(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        commentsController.deleteComment
    )

router
    .route("/:id/replies")
    .patch(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        commentsController.getReplyComments
    )
    .post(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        commentsController.createReplyComment
    )

router
    .route("/:id/react")
    .post(
        verifyRoles([ROLES_LIST.Student, ROLES_LIST.Tutor]),
        commentsController.addReaction
    )


module.exports = router;
