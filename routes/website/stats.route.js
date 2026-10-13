const express = require("express");

const router = express.Router();

const User = require("../../modules/user/user.model");
const Doctor = require("../../modules/doctor/doctor.model");
const Department = require("../../modules/department/department.model");
const Service = require("../../modules/service/service.model");


// =====================================================
// PUBLIC WEBSITE STATS
// GET /api/website/stats
// =====================================================

router.get("/", async (req, res, next) => {

    try {

        const totalDoctors =
            await Doctor.countDocuments();

        const totalDepartments =
            await Department.countDocuments();

        const totalServices =
            await Service.countDocuments({
                status: "active"
            });

        const totalPatients =
            await User.countDocuments({
                role: "patient"
            });


        res.status(200).json({

            totalDoctors,
            totalDepartments,
            totalServices,
            totalPatients

        });

    } catch (error) {

        next(error);

    }

});


module.exports = router;