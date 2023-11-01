const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

const courseController = require("../../controllers/tutor/course");
const contentController = require("../../controllers/tutor/content");
const studypackController = require("../../controllers/tutor/studypack");
const complaintsController = require("../../controllers/tutor/complaints");
const registerController = require("../../controllers/tutor/register");
const userPasswordController = require("../../controllers/Staff/resetPassword");
const editDetailsController = require("../../controllers/Staff/editDetails");

//Sithija
const quizController = require("../../controllers/tutor/quizController");
const mcqController = require("../../controllers/tutor/mcqController");
const categoryController = require("../../controllers/tutor/categoryController");
const staffController = require("../../controllers/tutor/staffController");
const paperController = require("../../controllers/tutor/paperController");
const { uploadTute  } = require("../../middleware/fileUpload/fileUploadPublic");
const { uploadThumbnail  } = require("../../middleware/fileUpload/fileUploadPublic");


router
  .route("/course")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getAllCourses)
  .post(verifyRoles(ROLES_LIST.Tutor),uploadThumbnail.single("files"), courseController.createCourse);

router
  .route("/course/:id")
  .get(courseController.getCourseById);

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
  .route("/courses/poll")
  .post(verifyRoles(ROLES_LIST.Tutor), courseController.createPoll);
// .get(verifyRoles(ROLES_LIST.Tutor), courseController.getAllPolls);

router
  .route("/courses/polls/:pollId")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getPoll);

router
  .route("/courses/poll/:courseId")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getAllPolls);

router
  .route("/courses/poll/:pollId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.deletePoll);

router
  .route("/courses/poll/:pollId/:option")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.updateVoteCount);

router
  .route("/courses/paper/:courseId")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getPapers);

router
  .route("/courses/paper/unique/:paperId")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getPapersbyId);

router

  .route("/studypack")
  .get(studypackController.getAllStudyPacks)
  .post(verifyRoles(ROLES_LIST.Tutor),uploadThumbnail.single("files"), studypackController.createStudyPack);

router
  .route("/studypack/:id")
  .get(studypackController.getStudypackById);

router
  .route("/weekstudypack/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), studypackController.getWeekStudypackById);

router
  .route("/studypack/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), studypackController.editStudypack);

router
  .route("/weekstudypack/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), studypackController.editWeekStudypack);

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
  .route("/studypack/removecontenttute/:id/:part/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeIds2);

router
  .route("/studypack/remove/:id/:part/:contentId")
  .delete(
    verifyRoles(ROLES_LIST.Tutor),
    studypackController.removecoursepackIds
  );

router
  .route("/content")
  .post(verifyRoles(ROLES_LIST.Tutor),uploadTute.single("files"),contentController.createContent);

router
  .route("/content")
  .get(verifyRoles(ROLES_LIST.Tutor), contentController.getAllContents);

// router
//   .route("/getall/:id")
//   .get(verifyRoles(ROLES_LIST.Tutor), contentController.getAll);

router
  .route("/content/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), contentController.getContentById);

  router
  .route("/content/:id")
  .delete(verifyRoles(ROLES_LIST.Tutor), contentController.deleteContentById);

  router
  .route("/videos")
  .get(contentController.getVideoByTutorId)

  
router
  .route("/tutordetails")
  .get(verifyRoles(ROLES_LIST.Tutor), registerController.getStaffDetails)
  .patch(verifyRoles(ROLES_LIST.Tutor), userPasswordController.resetPassword)
  .put(verifyRoles(ROLES_LIST.Tutor), editDetailsController.editDetails);

// Sithija*************

//Quizzes
router
  .route("/quizzes")
  .get(quizController.getAllQuizzes)
  .post(verifyRoles(ROLES_LIST.Tutor), quizController.createNewQuiz);
// .post(quizController.createNewQuiz);

router
  .route("/quizzes/:id")
  .get(quizController.getQuiz)
  .put(verifyRoles(ROLES_LIST.Tutor), quizController.updateQuiz)
  // .put(quizController.updateQuiz)
  .delete(verifyRoles(ROLES_LIST.Tutor), quizController.deleteQuiz);
// .delete(quizController.deleteQuiz);

router
  .route("/quizzes/getMcqs/:quizId")
  .post(verifyRoles(ROLES_LIST.Tutor), quizController.getMcqsFromQuiz);
// .get(quizController.getMcqsFromQuiz);

router
  .route("/quizzes/addMcq/:id")
  .post(verifyRoles(ROLES_LIST.Tutor), quizController.mcqAddToQuiz);
// .post(quizController.mcqAddToQuiz);

router
  .route("/quizzes/addMcqId/:quizId")
  .post(verifyRoles(ROLES_LIST.Tutor), quizController.mcqIdAddToQuiz);
// .post(quizController.mcqIdAddToQuiz);

router
  .route("/quizzes/deleteMcq/:quizId/:mcqId")
  .delete(verifyRoles(ROLES_LIST.Tutor), quizController.mcqDeleteFromQuiz);

//Mcqs
router
  .route("/mcqs")
  .get(mcqController.getAllMcqs)
  .post(verifyRoles(ROLES_LIST.Tutor), mcqController.createNewMcq);
// .post(mcqController.createNewMcq);

router
  .route("/mcqs/:id")
  .get(mcqController.getMcq)
  .put(verifyRoles(ROLES_LIST.Tutor), mcqController.updateMcq)
  // .put(mcqController.updateMcq)
  .delete(verifyRoles(ROLES_LIST.Tutor), mcqController.deleteMcq);
// .delete(mcqController.deleteMcq);

//Categories

router
  .route("/categories")
  .get(categoryController.getAllMcqCategories)
  .post(verifyRoles(ROLES_LIST.Tutor), categoryController.createNewMcqCategory);
// .post(categoryController.createNewMcqCategory);

router
  .route("/categories/:id")
  .get(categoryController.getMcqCategory)
  .put(verifyRoles(ROLES_LIST.Tutor), categoryController.updateMcqCategory)
  // .put(categoryController.updateMcqCategory)
  .delete(verifyRoles(ROLES_LIST.Tutor), categoryController.deleteMcqCategory);
// .delete(categoryController.deleteMcqCategory);

router
  .route("/categories/addMcq/:id")
  .post(verifyRoles(ROLES_LIST.Tutor), categoryController.mcqAddToCategory);
// .post(categoryController.mcqAddToCategory);

router
  .route("/categories/getMcqs/:categoryId")
  .post(verifyRoles(ROLES_LIST.Tutor), categoryController.getMcqsFromCategory);
// .get(categoryController.getMcqsFromCategory);

router
  .route("/categories/deleteMcq/:categoryId/:mcqId")
  .delete(
    verifyRoles(ROLES_LIST.Tutor),
    categoryController.mcqDeleteFromCategory
  );

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


router
  .route("/videos")
  .get(contentController.getVideoByTutorId)
//Papers
router
  .route("/papers")
  .get(paperController.getAllPapers)
  .post(verifyRoles(ROLES_LIST.Tutor), paperController.addNewPaper);

router
  .route("/papers/:id")
  .get(paperController.getPaper)
  .put(verifyRoles(ROLES_LIST.Tutor), paperController.updatePaper)
  .delete(verifyRoles(ROLES_LIST.Tutor), paperController.deletePaper);

router
  .route("/complaints")
  .get(verifyRoles(ROLES_LIST.Tutor), complaintsController.complaints);

router
  .route("/complaints/edit/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), complaintsController.editComplaint);

router
  .route("/complaints/ignore/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), complaintsController.ignoreComplaint);

module.exports = router;
