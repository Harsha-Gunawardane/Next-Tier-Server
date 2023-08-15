const express = require("express");
const router = express.Router();
const tutorCategoryController = require("../../controllers/tutor/tutorCategoryController");
const profileController = require("../../controllers/Staff/StaffDetails");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(tutorCategoryController.getAllMcqCategories)
  // .post(verifyRoles(ROLES_LIST.Tutor), tutorCategoryController.createNewMcqCategory);
  .post(tutorCategoryController.createNewMcqCategory);

router.route("/:id").get(tutorCategoryController.getMcqCategory);
// .put(verifyRoles(ROLES_LIST.Tutor), tutorCategoryController.updateMcqCategory)
// .put(tutorCategoryController.updateMcqCategory)
// .delete(verifyRoles(ROLES_LIST.Tutor), tutorCategoryController.deleteMcqCategory);
// .delete(tutorCategoryController.deleteMcqCategory);

router;
// .route("/addMcq/:id")
// .post(verifyRoles(ROLES_LIST.Tutor), tutorCategoryController.mcqAddToMcqCategory);
// .post(tutorCategoryController.mcqAddToMcqCategory);

module.exports = router;
