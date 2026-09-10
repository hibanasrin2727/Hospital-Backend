const express = require("express");

const router = express.Router();

const doctorService =
    require("../../modules/doctor/doctor.service");


router.get("/", async (req, res) => {

    try {

        const doctors =
            await doctorService.getAllDoctors();

        res.status(200).json({
            doctors
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


router.get("/:id", async (req, res) => {

    try {

        const doctor =
            await doctorService.getDoctorById(
                req.params.id
            );

        res.status(200).json({
            doctor
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }

});


module.exports = router;