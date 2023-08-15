const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");
const courseController = require('../../controllers/tutor/course')
const contentController = require('../../controllers/tutor/content')
const studypackController = require('../../controllers/tutor/studypack')
// const registerController = require('../../controllers/tutor/register')


router
  .route("/course")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getAllCourses)
  .post(verifyRoles(ROLES_LIST.Tutor), courseController.createCourse)

router
  .route("/course/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), courseController.getCourseById)
router
  .route("/course/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.editCourse)
router
  .route("/course/:id")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeCourse)
router
  .route("/course/studypack/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.editStudypack_ids)

router
  .route("/course/:id/:studypackId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeStudyPack)


router
  .route("/course/:id/:studypackId/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeIds)

router
  .route("/course/public/content/:id/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), courseController.removePublicIds)


router
  .route("/course/:id/:studypackId/:week/:contentId")
  .put(verifyRoles(ROLES_LIST.Tutor), courseController.addIds)














router

  .route("/studypack")
  .get(studypackController.getAllStudyPacks)
  .post(verifyRoles(ROLES_LIST.Tutor), studypackController.createStudyPack)

router
  .route("/studypack/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), studypackController.getStudypackById)

router
  .route("/studypack/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), studypackController.editStudypack)

router
  .route("/studypack/:id")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeStudypack)

router
  .route("/studypack/content/:id")
  .put(verifyRoles(ROLES_LIST.Tutor), studypackController.editContent_ids)

router
  .route("/studypack/content/:id/:week")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeContent)


router
  .route("/studypack/removecontent/:id/:part/:contentId")
  .delete(verifyRoles(ROLES_LIST.Tutor), studypackController.removeIds)






router
  .route("/content")
  .post(verifyRoles(ROLES_LIST.Tutor), contentController.createContent)


router
  .route("/content")
  .get(verifyRoles(ROLES_LIST.Tutor), contentController.getAllContents)


router
  .route("/content/:id")
  .get(verifyRoles(ROLES_LIST.Tutor), contentController.getContentById)


module.exports = router;