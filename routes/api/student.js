const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const userPasswordController = require("../../controllers/user/resetPassword");
const studentQuizController = require("../../controllers/student/quiz");
const tuteController = require("../../controllers/student/tute");

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/info")
  .get(verifyRoles(ROLES_LIST.Student), studentInfoController.getStudentInfo)
  .put(verifyRoles(ROLES_LIST.Student), studentInfoController.updateStudentInfo)
  .patch(verifyRoles(ROLES_LIST.Student), userPasswordController.resetPassword);

router
  .route("/quiz")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.generateQuiz)
  .patch(verifyRoles(ROLES_LIST.Student), studentQuizController.doneQuiz);

router
  .route("/marking")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.getQuizMarking);

router
  .route("/quiz-revision/:subject/:quizname?")
  .get(
    verifyRoles(ROLES_LIST.Student),
    studentQuizController.getPreviousQuizzes
  );

router
  .route("/tute")
  .post(verifyRoles(ROLES_LIST.Student), tuteController.initializeTute)
  .put(verifyRoles(ROLES_LIST.Student), tuteController.generatePdf)
  .get(verifyRoles(ROLES_LIST.Student), tuteController.getTuteContent)

router
    .route("/tutes")
    .get(verifyRoles(ROLES_LIST.Student), tuteController.getTutesAndFolders)

module.exports = router;
