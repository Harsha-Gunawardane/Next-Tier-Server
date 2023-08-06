const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const userPasswordController = require("../../controllers/user/resetPassword");
const studentQuizController = require("../../controllers/student/quiz");

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/info")
  .get(verifyRoles(ROLES_LIST.Student), studentInfoController.getStudentInfo)
  .put(verifyRoles(ROLES_LIST.Student), studentInfoController.updateStudentInfo)
  .patch(verifyRoles(ROLES_LIST.Student), userPasswordController.resetPassword)

router
  .route("/quiz")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.generateQuiz)
  .patch(verifyRoles(ROLES_LIST.Student), studentQuizController.doneQuiz)

router
  .route("/marking")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.getQuizMarking)

router.
  route("/quiz-revision/:subject/:quizname?")
  .get(verifyRoles(ROLES_LIST.Student), studentQuizController.getPreviousQuizzes)

module.exports = router;
