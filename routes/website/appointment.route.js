const express = require("express");

const router = express.Router();

const appointmentService =
    require("../../modules/appointment/appointment.service");

const authMiddleware =
    require("../../middleware/auth.middleware");


// BOOK APPOINTMENT

router.post(
    "/",
    authMiddleware,
    async (req, res, next) => {

        try {

            const appointmentData = {
                ...req.body,
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