const express = require("express");
const router = express.Router();

const registerController = require("../../controllers/Staff/TeacherRegister");
const getHallController = require("../../controllers/Staff/ListHalls");
const getScheduleController = require("../../controllers/Staff/HallSchedule");
const courseController = require("../../controllers/Staff/CourseApproval");
const complaintsController = require("../../controllers/Staff/ViewComplaints");
const staffController = require("../../controllers/Staff/GetStaffDetails");
const studentController = require("../../controllers/Staff/GetStudentDetails");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/tutor")
  .get(verifyRoles(ROLES_LIST.Staff), registerController.getAllTutorDetails)
  .post(verifyRoles(ROLES_LIST.Staff), registerController.handleNewTeacher);

  router
  .route("/tutor/:id")
  .put(verifyRoles(ROLES_LIST.Staff), registerController.updateTutorStatus);

  router
  .route("/tutor/count")
  .get(verifyRoles(ROLES_LIST.Staff), registerController.getTutorCount);

  router
  .route("/count")
  .get(verifyRoles(ROLES_LIST.Staff), staffController.getStaffCount);

  router
  .route("/student/count")
  .get(verifyRoles(ROLES_LIST.Staff), studentController.getStudentCount);


  router
  .route("/hall")
  .get(verifyRoles(ROLES_LIST.Staff), getHallController.getAllHallDetails)
  .post(verifyRoles(ROLES_LIST.Staff), getHallController.registerHall)
  .put(verifyRoles(ROLES_LIST.Staff), getHallController.updateHall);

  router
  .route("/hall/count")
  .get(verifyRoles(ROLES_LIST.Staff), getHallController.getHallCount);

router
  .route("/schedule")
  .get(verifyRoles(ROLES_LIST.Staff), getScheduleController.getAllHallSchedule)
  .post(verifyRoles(ROLES_LIST.Staff), getScheduleController.createSchedule);
  // .put(verifyRoles(ROLES_LIST.Staff), getScheduleController.updateHallSchedule);

  router
  .route("/schedule/:hall_id/:day/:start_time/:end_time")
  .put(verifyRoles(ROLES_LIST.Staff), getScheduleController.updateHallSchedule);

  router
  .route("/class")
  .get(verifyRoles(ROLES_LIST.Staff), courseController.handleRequests)
  .post(verifyRoles(ROLES_LIST.Staff), courseController.handleNewCourse);

  router
  .route("/class/count")
  .get(verifyRoles(ROLES_LIST.Staff), courseController.getClassCount),

  router
  .route("/class/details")
  .get(verifyRoles(ROLES_LIST.Staff), courseController.getClassDetails);

  router
  .route("/class/approve/:id")
  .put(verifyRoles(ROLES_LIST.Staff), courseController.approveRequest);

  router
  .route("/class/reject/:id")
  .put(verifyRoles(ROLES_LIST.Staff), courseController.rejectRequest);

  router
  .route("/complaints")
  .get(verifyRoles(ROLES_LIST.Staff), complaintsController.complaints);


module.exports = router;
