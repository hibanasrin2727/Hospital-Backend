const express = require("express");

const router = express.Router();

const appointmentService =
    require("../../modules/appointment/appointment.service");

const authMiddleware =
    require("../../middleware/auth.middleware");


// CREATE APPOINTMENT

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

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

            res.status(400).json({
                message: error.message
            });

        }

    }
);


module.exports = router;