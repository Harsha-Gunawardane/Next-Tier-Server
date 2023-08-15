const express = require("express");
const router = express.Router();
const mcqController = require("../../controllers/tutor/tutorMcqController");
const profileController = require("../../controllers/Staff/StaffDetails");


// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

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


module.exports = router;
