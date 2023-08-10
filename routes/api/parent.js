const express = require("express");
const router = express.Router();

const parentInfoController = require("../../controllers/parent/parentInfo");

// Verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/info")
  .get(
    verifyRoles([ROLES_LIST.Student, ROLES_LIST.Parent]),
    parentInfoController.getParentInfo
  )
  .put(
    verifyRoles([ROLES_LIST.Student, ROLES_LIST.Parent]),
    parentInfoController.updateParentInfo
  )

module.exports = router;
