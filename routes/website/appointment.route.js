const express = require("express");

const router = express.Router();

const appointmentService =
    require("../../modules/appointment/appointment.service");

const appointmentController =
    require("../../modules/appointment/appointment.controller");

const authMiddleware =
    require("../../middleware/auth.middleware");


// ======================================
// GET MY APPOINTMENTS
// ======================================

router.get(
    "/my",
    authMiddleware,
    appointmentController.getPatientAppointments
);


// ======================================
// PATIENT EDIT APPOINTMENT
// ======================================

router.put(
    "/:id",
    authMiddleware,
    appointmentController.updatePatientAppointment
);


// ======================================
// PATIENT CANCEL APPOINTMENT
// ======================================

router.patch(
    "/:id/cancel",
    authMiddleware,
    appointmentController.cancelPatientAppointment
);


// ======================================
// BOOK APPOINTMENT
// ======================================

router.post(
    "/",
    authMiddleware,
    async (req, res, next) => {

        try {

            const appointmentData = {
                ...req.body,

                // Patient ID comes from JWT token
                patientId: req.user.userId
            };

            const appointment =
                await appointmentService.createAppointment(
                    appointmentData
                );

            res.status(201).json({
                message: "Appointment booked successfully",
                appointment
            });

        } catch (error) {

            next(error);

        }

    }
);


module.exports = router;