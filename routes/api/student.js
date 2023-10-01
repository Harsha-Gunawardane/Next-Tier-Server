const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const studentQuizController = require("../../controllers/student/quiz");
const tuteController = require("../../controllers/student/tute");
const tuteActivityController = require("../../controllers/student/tuteActivity");

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

// import middlewares
const { upload } = require("../../middleware/fileUpload/fileUpload");

router
  .route("/info")
  .get(verifyRoles(ROLES_LIST.Student), studentInfoController.getStudentInfo)
  .put(
    verifyRoles(ROLES_LIST.Student),
    studentInfoController.updateStudentInfo
  );

router
  .route("/quiz")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.generateQuiz)
  .patch(verifyRoles(ROLES_LIST.Student), studentQuizController.doneQuiz);

router
  .route("/marking")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.getQuizMarking);

router
  .route("/quiz-revision/")
  .get(
    verifyRoles(ROLES_LIST.Student),
    studentQuizController.getPreviousQuizzes
  );

router
  .route("/tute")
  .post(verifyRoles(ROLES_LIST.Student), tuteController.initializeTute)
  .put(verifyRoles(ROLES_LIST.Student), tuteController.writeOnTute)
  .get(verifyRoles(ROLES_LIST.Student), tuteController.getTuteContent);

router
  .route("/tute/schedule")
  .post(verifyRoles(ROLES_LIST.Student), tuteController.setReminder)
  .get(verifyRoles(ROLES_LIST.Student), tuteController.getReminders);

router
  .route("/tutes")
  .get(verifyRoles(ROLES_LIST.Student), tuteController.getTutesAndFolders);

router
  .route("/pdf")
  .get(verifyRoles(ROLES_LIST.Student), tuteController.viewPdf);

router
  .route("/folder")
  .post(verifyRoles(ROLES_LIST.Student), tuteController.createFolder);

router
  .route("/dash/tutes")
  .get(verifyRoles(ROLES_LIST.Student), tuteActivityController.getRecentTutes);

router
  .route("/tute/archive")
  .get(verifyRoles(ROLES_LIST.Student), tuteActivityController.getArchivedTutes)
  .put(verifyRoles(ROLES_LIST.Student), tuteActivityController.archivedTute);

router
  .route("/tute/star")
  .get(verifyRoles(ROLES_LIST.Student), tuteActivityController.getStarredTutes)
  .put(verifyRoles(ROLES_LIST.Student), tuteActivityController.starredTute);

module.exports = router;
