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
  );

module.exports = router;
