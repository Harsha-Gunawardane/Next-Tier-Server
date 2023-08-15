const express = require("express");
const router = express.Router();
const quizController = require("../../controllers/tutor/tutorQuizController");
const profileController = require("../../controllers/Staff/StaffDetails");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/quizzes")
  .get(quizController.getAllQuizzes)
  // .post(verifyRoles(ROLES_LIST.Tutor), quizController.createNewQuiz);
  .post(quizController.createNewQuiz);

router
  .route("/quizzes/:id")
  .get(quizController.getQuiz)
  // .put(verifyRoles(ROLES_LIST.Tutor), quizController.updateQuiz)
  .put(quizController.updateQuiz)
  // .delete(verifyRoles(ROLES_LIST.Tutor), quizController.deleteQuiz);
  .delete(quizController.deleteQuiz);

router
  .route("/quizzes/addMcq/:id")
  // .post(verifyRoles(ROLES_LIST.Tutor), quizController.mcqAddToQuiz);
  .post(quizController.mcqAddToQuiz);

module.exports = router;
