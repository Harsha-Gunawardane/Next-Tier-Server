const express = require("express");
const router = express.Router();

const registerController = require("../../controllers/Staff/TeacherRegister");
const getHallController = require("../../controllers/Staff/ListHalls");
const getScheduleController = require("../../controllers/Staff/HallSchedule");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/tutor")
  .get(registerController.getAllTutorDetails)
  .post(verifyRoles(ROLES_LIST.Staff), registerController.handleNewTeacher);

router
  .route("/hall")
  .get(getHallController.getAllHallDetails)
  .post(verifyRoles(ROLES_LIST.Staff), getHallController.registerHall)
  .put(verifyRoles(ROLES_LIST.Staff), getHallController.updateHall);

router
  .route("/schedule")
  .get(getScheduleController.getAllHallSchedule);

module.exports = router;
