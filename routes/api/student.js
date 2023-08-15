const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const studentQuizController = require("../../controllers/student/quiz");
const tuteController = require("../../controllers/student/tute");

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

// import middlewares
const { upload } = require("../../middleware/fileUpload/fileUpload");

router
  .route("/info")
  .get(verifyRoles(ROLES_LIST.Student), studentInfoController.getStudentInfo)
  .put(verifyRoles(ROLES_LIST.Student), studentInfoController.updateStudentInfo)

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
  .post(
    upload.single("file"),
    verifyRoles(ROLES_LIST.Student),
    tuteController.initializeTute
  )
  .put(verifyRoles(ROLES_LIST.Student), tuteController.generatePdf)
  .get(verifyRoles(ROLES_LIST.Student), tuteController.getTuteContent);

router
  .route("/tutes")
  .get(verifyRoles(ROLES_LIST.Student), tuteController.getTutesAndFolders);

router
  .route("/pdf")
  .get(verifyRoles(ROLES_LIST.Student), tuteController.viewPdf);

module.exports = router;
