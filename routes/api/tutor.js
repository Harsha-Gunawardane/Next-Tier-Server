const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

const courseController = require("../../controllers/tutor/course");
const contentController = require("../../controllers/tutor/content");
const studypackController = require("../../controllers/tutor/studypack");
// const registerController = require('../../controllers/tutor/register')

//Sithija
const quizController = require("../../controllers/tutor/quizController");
const mcqController = require("../../controllers/tutor/mcqController");
const categoryController = require("../../controllers/tutor/categoryController");
const staffController = require("../../controllers/tutor/staffController");

router

  .route("/course")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getAllCourses)
  .post(verifyRoles(ROLES_LIST.Tutor), courseController.createCourse);

router
  .route("/course/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getCourseById);

router
  .route("/course/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.editCourse);

router
  .route("/course/:id")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeCourse);

router
  .route("/course/studypack/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.editStudypack_ids);

router
  .route("/course/:id/:studypackId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeStudyPack);

router
  .route("/course/:id/:studypackId/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeIds);

router
  .route("/course/public/content/:id/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removePublicIds);

router
  .route("/course/:id/:studypackId/:week/:contentId")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.addIds);

router

  .route("/studypack")
  .get(studypackController.getAllStudyPacks)
  .post(verifyRoles(ROLES_LIST.Tutor), studypackController.createStudyPack);

router
  .route("/studypack/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), studypackController.getStudypackById);

router
  .route("/studypack/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), studypackController.editStudypack);

router
  .route("/studypack/:id")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeStudypack);

router
  .route("/studypack/content/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), studypackController.editContent_ids);

router
  .route("/studypack/content/:id/:week")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeContent);

router
  .route("/studypack/removecontent/:id/:part/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeIds);

router
  .route("/content")
  .post(verifyRoles(ROLES_LIST.Tutor), contentController.createContent);

router
  .route("/content")
  .get(verifyRoles(ROLES_LIST.Tutor), contentController.getAllContents);

router
  .route("/content/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), contentController.getContentById);

// Sithija*************

//Quizzes
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
  .route("/quizzes/getMcqs/:quizId")
  // .post(verifyRoles(ROLES_LIST.Tutor), quizController.getMcqsFromQuiz);
  .get(quizController.getMcqsFromQuiz);

router
  .route("/quizzes/addMcq/:id")
  // .post(verifyRoles(ROLES_LIST.Tutor), quizController.mcqAddToQuiz);
  .post(quizController.mcqAddToQuiz);

router
  .route("/quizzes/addMcqId/:quizId")
  // .post(verifyRoles(ROLES_LIST.Tutor), quizController.mcqIdAddToQuiz);
  .post(quizController.mcqIdAddToQuiz);

router
  .route("/quizzes/deleteMcq/:quizId/:mcqId")
  .delete(quizController.mcqDeleteFromQuiz);

//Mcqs
router
  .route("/mcqs")
  .get(mcqController.getAllMcqs)
  // .post(verifyRoles(ROLES_LIST.Tutor), mcqController.createNewMcq);
  .post(mcqController.createNewMcq);

router
  .route("/mcqs/:id")
  .get(mcqController.getMcq)
  // .put(verifyRoles(ROLES_LIST.Tutor), mcqController.updateMcq)
  .put(mcqController.updateMcq)
  // .delete(verifyRoles(ROLES_LIST.Tutor), mcqController.deleteMcq);
  .delete(mcqController.deleteMcq);

//Categories

router
  .route("/categories")
  .get(categoryController.getAllMcqCategories)
  // .post(verifyRoles(ROLES_LIST.Tutor), categoryController.createNewMcqCategory);
  .post(categoryController.createNewMcqCategory);

router
  .route("/categories/:id")
  .get(categoryController.getMcqCategory)
  // .put(verifyRoles(ROLES_LIST.Tutor), categoryController.updateMcqCategory)
  .put(categoryController.updateMcqCategory)
  // .delete(verifyRoles(ROLES_LIST.Tutor), categoryController.deleteMcqCategory);
  .delete(categoryController.deleteMcqCategory);

router
  .route("/categories/addMcq/:id")
  // .post(verifyRoles(ROLES_LIST.Tutor), categoryController.mcqAddToCategory);
  .post(categoryController.mcqAddToCategory);

router
  .route("/categories/deleteMcq/:categoryId/:mcqId")
  .delete(categoryController.mcqDeleteFromCategory);

//Staffs

router
  .route("/staffs")
  .get(staffController.getAllStaffs)
  .post(verifyRoles(ROLES_LIST.Tutor), staffController.createNewStaff);

router
  .route("/staffs/:id")
  .get(staffController.getStaff)
  .put(verifyRoles(ROLES_LIST.Tutor), staffController.updateStaff)
  .delete(verifyRoles(ROLES_LIST.Tutor), staffController.deleteStaff);

module.exports = router;
