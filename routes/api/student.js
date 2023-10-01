const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const studentQuizController = require("../../controllers/student/quiz");
const tuteController = require("../../controllers/student/tute");
const courseController = require("../../controllers/student/course")
const paymentController = require("../../controllers/payementController")

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

router
  .route("/folder")
  .post(verifyRoles(ROLES_LIST.Student), tuteController.createFolder);

router
  .route("/courses")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getAllCoursesForStudent);

router
  .route("/courses/:courseId")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getCourseById);

router
  .route("/courses/:courseId/enroll")
  .post(verifyRoles(ROLES_LIST.Student), courseController.enrollToCourse);

router
  .route("/courses/:courseId/payment")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getCoursePayementDetailsByCourseId);

router
  .route("/mycourses")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getAllEnrolledCoursesForStudent);

router
  .route("/studypacks")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getAllStudyPacksForStudent);

router
  .route("/mystudypacks")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getAllPurchasedStudyPacksForStudent);

router
  .route("/studypacks/:studyPackId")
  .get(courseController.getStudyPackById);

router
  .route("/studypacks/:studyPackId/payment")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getPaymentDetailsByStudyPackId);

router
  .route("/studypacks/:studyPackId/content")
  .get(courseController.getStudyPackContent);

router
  .route("/tutors")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getAllTutorsForStudent);

router
  .route("/payment/create-payment-intent")
  .post(verifyRoles(ROLES_LIST.Student), paymentController.createPaymentIntent);

router
  .route("/payment/confirmPayment")
  .post(verifyRoles(ROLES_LIST.Student), paymentController.addPayment);

router
  .route("/payment/webhook")
  .post(verifyRoles(ROLES_LIST.Student), paymentController.webHook);


module.exports = router;
