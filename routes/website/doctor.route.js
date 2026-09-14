const express = require("express");

const router = express.Router();

const doctorService =
    require("../../modules/doctor/doctor.service");

// GET ALL DOCTORS
router.get("/", async (req, res, next) => {

    try {

        const doctors =
            await doctorService.getActiveDoctors();

        res.status(200).json({
            doctors
        });

    } catch (error) {
        next(error);
    }

});
// GET DOCTOR BY ID

router.get("/:id", async (req, res, next) => {

    try {

        const doctor =
            await doctorService.getActiveDoctorById(
                req.params.id
            );

        res.status(200).json({
            doctor
        });

    } catch (error) {
        next(error);
    }

});


module.exports = router;