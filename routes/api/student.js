const express = require("express");
const router = express.Router();

const studentInfoController = require("../../controllers/student/studentInfo");
const studentQuizController = require("../../controllers/student/quiz");
const tuteController = require("../../controllers/student/tute");
const courseController = require("../../controllers/student/course");
const paymentController = require("../../controllers/payementController");
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

//Added for paper marking feature
router.route("/students").get(studentInfoController.getAllStudentsInfo);

router
  .route("/students/attendance")
  .get(studentInfoController.getStudentAttendance);

router
  .route("/students/attendance/:studentId")
  .post(studentInfoController.addStudentAttendance);

router.route("/students/:id").get(studentInfoController.getStudent);

router
  .route("/students/marks/:paperId")
  .get(studentInfoController.getStudentMarksDetails);

router
  .route("/students/addMarks/:studentId/:paperId")
  .put(studentInfoController.updateStudentMarks);

router
  .route("/quiz")
  .post(verifyRoles(ROLES_LIST.Student), studentQuizController.generateQuiz)
  .patch(verifyRoles(ROLES_LIST.Student), studentQuizController.doneQuiz);

router
  .route("quiz/available")
  .get(
    verifyRoles(ROLES_LIST.Student),
    studentQuizController.checkQuizAvailability
  );

router
  .route("/attempt_quiz")
  .get(verifyRoles(ROLES_LIST.Student), studentQuizController.attempQuiz)
  .post(
    verifyRoles(ROLES_LIST.Student),
    studentQuizController.getCourseRelatedQuestions
  );

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
  .route("/courses")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getAllCoursesForStudent
  );

router
  .route("/courses/:courseId")
  .get(verifyRoles(ROLES_LIST.Student), courseController.getCourseById);

router
  .route("/courses/:courseId/enroll")
  .post(verifyRoles(ROLES_LIST.Student), courseController.enrollToCourse);

router
  .route("/courses/:courseId/payment")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getCoursePayementDetailsByCourseId
  );

router
  .route("/mycourses")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getAllEnrolledCoursesForStudent
  );

router
  .route("/studypacks")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getAllStudyPacksForStudent
  );

router
  .route("/mystudypacks")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getAllPurchasedStudyPacksForStudent
  );

router.route("/studypacks/:studyPackId").get(courseController.getStudyPackById);

router
  .route("/studypacks/:studyPackId/payment")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getPaymentDetailsByStudyPackId
  );

router
  .route("/studypacks/:studyPackId/content")
  .get(courseController.getStudyPackContent);

router
  .route("/tutors")
  .get(
    verifyRoles(ROLES_LIST.Student),
    courseController.getAllTutorsForStudent
  );

router
  .route("/payment/create-payment-intent")
  .post(verifyRoles(ROLES_LIST.Student), paymentController.createPaymentIntent);

router
  .route("/payment/confirmPayment")
  .post(verifyRoles(ROLES_LIST.Student), paymentController.addPayment);

router
  .route("/payment/webhook")
  .post(verifyRoles(ROLES_LIST.Student), paymentController.webHook);

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
