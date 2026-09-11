const express = require("express");

const router = express.Router();

const appointmentController =
    require("../../modules/appointment/appointment.controller");

const authMiddleware =
    require("../../middleware/auth.middleware");

const roleMiddleware =
    require("../../middleware/role.middleware");


// ======================================
// CREATE APPOINTMENT
// ======================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    appointmentController.createAppointment
);


// ======================================
// GET ALL APPOINTMENTS
// ======================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    appointmentController.getAppointments
);


// ======================================
// PATIENT EDIT APPOINTMENT
// ======================================

router.put(
    "/patient/:id",
    authMiddleware,
    appointmentController.updatePatientAppointment
);


// ======================================
// PATIENT CANCEL APPOINTMENT
// ======================================

router.patch(
    "/patient/:id/cancel",
    authMiddleware,
    appointmentController.cancelPatientAppointment
);


// ======================================
// GET ONE APPOINTMENT
// ======================================

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    appointmentController.getAppointment
);


// ======================================
// UPDATE APPOINTMENT
// ======================================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    appointmentController.updateAppointment
);


// ======================================
// DELETE APPOINTMENT
// ======================================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    appointmentController.deleteAppointment
);


module.exports = router;