const express = require("express");

const router = express.Router();

const User = require("../../modules/user/user.model");
const Doctor = require("../../modules/doctor/doctor.model");
const Department = require("../../modules/department/department.model");
const Service = require("../../modules/service/service.model");
const Appointment = require("../../modules/appointment/appointment.model");

const authMiddleware =
    require("../../middleware/auth.middleware");

const roleMiddleware =
    require("../../middleware/role.middleware");


router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),

    async (req, res) => {

        try {

            const totalPatients =
                await User.countDocuments({
                    role: "patient"
                });

            const totalDoctors =
                await Doctor.countDocuments();

            const totalDepartments =
                await Department.countDocuments();

            const totalServices =
                await Service.countDocuments();

            const totalAppointments =
                await Appointment.countDocuments();


            const pendingAppointments =
                await Appointment.countDocuments({
                    status: "pending"
                });

            const confirmedAppointments =
                await Appointment.countDocuments({
                    status: "confirmed"
                });

            const completedAppointments =
                await Appointment.countDocuments({
                    status: "completed"
                });


            res.status(200).json({

                totalPatients,

                totalDoctors,

                totalDepartments,

                totalServices,

                totalAppointments,

                pendingAppointments,

                confirmedAppointments,

                completedAppointments

            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;