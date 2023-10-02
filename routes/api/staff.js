const express = require("express");
const router = express.Router();

const profileController = require("../../controllers/Staff/StaffDetails");
const userPasswordController = require("../../controllers/Staff/resetPassword");
const registerController = require("../../controllers/Staff/registerStaff");
const getAllStaffController = require("../../controllers/Staff/getAllStaffDetails");
const allStaffProfileController = require("../../controllers/Staff/staffProfile");
const editDetailsController = require("../../controllers/Staff/editDetails");
const complaintsController = require("../../controllers/Staff/complaints");
const allTutorProfileController = require("../../controllers/Staff/tutorProfile");
const courseProfileController = require("../../controllers/Staff/getCourseDetails");
const studentProfileController = require("../../controllers/Staff/getStudentDetails");
const studentPaymentController = require("../../controllers/Staff/getPaymentDetails");
const studentPaymentHistoryController = require("../../controllers/Staff/getStudentPaymentHistory");
const physicalPaymentReceipt = require("../../controllers/Staff/getPhysicalReceipt");
const onlinePaymentReceipt = require("../../controllers/Staff/getOnlineReceipt");
const updatePendingPayment = require("../../controllers/Staff/updatePendingPhysicalPayment");
const extendExpiredPayment = require("../../controllers/Staff/extendPayment");

//shimra's routes
const registerTeacherController = require("../../controllers/Staff/TeacherRegister");
const teacherController = require("../../controllers/Staff/TeacherRegister");
const getHallController = require("../../controllers/Staff/ListHalls");
const getScheduleController = require("../../controllers/Staff/HallSchedule");
const courseController = require("../../controllers/Staff/CourseApproval");
// const complaintsController = require("../../controllers/Staff/ViewComplaints");
const staffController = require("../../controllers/Staff/GetStaffDetails");
const studentController = require("../../controllers/Staff/GetStudentCount");

// verify roles
const ROLES_LIST = require("../../config/roleList");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/profile")
  .get(verifyRoles(ROLES_LIST.Staff), profileController.getStaffDetails)
  .patch(verifyRoles(ROLES_LIST.Staff), userPasswordController.resetPassword)
  .put(verifyRoles(ROLES_LIST.Staff), editDetailsController.editDetails);

router
  .route("/register")
  .post(verifyRoles(ROLES_LIST.Staff), registerController.registerStaff);

router
  .route("/staffList")
  .get(verifyRoles(ROLES_LIST.Staff), getAllStaffController.getAllStaffDetails);

router
  .route("/profile/:id")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    allStaffProfileController.staffProfile
  );

router
  .route("/complaints")
  .get(verifyRoles(ROLES_LIST.Staff), complaintsController.complaints);

router
  .route("/complaints/edit/:id")
  .put(verifyRoles(ROLES_LIST.Staff), complaintsController.editComplaint);

router
  .route("/complaints/ignore/:id")
  .put(verifyRoles(ROLES_LIST.Staff), complaintsController.ignoreComplaint);

router.get(
  "/tutor-profile/:id",
  verifyRoles(ROLES_LIST.Staff),
  allTutorProfileController.tutorProfile
);

router
  .route("/course/:id")
  .get(verifyRoles(ROLES_LIST.Staff), courseProfileController.getCourseDetails);

router
  .route("/stu-profile/:id")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    studentProfileController.getStudentDetails
  );

router
  .route("/stu-payment/:username")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    studentPaymentController.getPaymentDetails
  );

router
  .route("/payment-history/:id")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    studentPaymentHistoryController.getStudentPaymentHistory
  );

router
  .route("/physical-payment-receipt/:id")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    physicalPaymentReceipt.getPhysicalReceipt
  );

router
  .route("/online-payment-receipt/:id")
  .get(verifyRoles(ROLES_LIST.Staff), onlinePaymentReceipt.getOnlineReceipt);

router
.route("/update-payment/:id")
.put(verifyRoles(ROLES_LIST.Staff),updatePendingPayment.updatePendingPhysicalPyament);

router
.route("/extend-payment/:id")
.put(verifyRoles(ROLES_LIST.Staff),extendExpiredPayment.extendPyament);

//shimra's routes

router
  .route("/tutor")
  .get(
    verifyRoles(ROLES_LIST.Staff),
    registerTeacherController.getAllTutorDetails
  )
  .post(
    verifyRoles(ROLES_LIST.Staff),
    registerTeacherController.handleNewTeacher
  )
  .get(verifyRoles(ROLES_LIST.Staff), teacherController.getAllTutorDetails)
  .post(verifyRoles(ROLES_LIST.Staff), teacherController.handleNewTeacher);

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
