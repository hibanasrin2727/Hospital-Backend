
const doctorService = require("./doctor.service");


// ===============================
// CREATE DOCTOR
// ===============================

const createDoctor = async (req, res, next) => {

    try {

        const doctorData = {
            ...req.body
        };


        // ===============================
        // ADD IMAGE
        // ===============================

        if (req.file) {

            doctorData.image =
                `/uploads/doctors/${req.file.filename}`;

        }


        const doctor =
            await doctorService.createDoctor(
                doctorData
            );


        res.status(201).json({

            message:
                "Doctor created successfully",

            doctor

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// GET ALL DOCTORS
// ===============================

const getDoctors = async (req, res, next) => {

    try {

        const doctors =
            await doctorService.getAllDoctors();


        res.status(200).json({

            doctors

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// GET DOCTOR BY ID
// ===============================

const getDoctor = async (req, res, next) => {

    try {

        const doctor =
            await doctorService.getDoctorById(
                req.params.id
            );


        res.status(200).json({

            doctor

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// UPDATE DOCTOR
// ===============================

const updateDoctor = async (req, res, next) => {

    try {

        const updateData = {
            ...req.body
        };


        // ===============================
        // UPDATE IMAGE ONLY IF NEW IMAGE
        // ===============================

        if (req.file) {

            updateData.image =
                `/uploads/doctors/${req.file.filename}`;

        }


        const doctor =
            await doctorService.updateDoctor(
                req.params.id,
                updateData
            );


        res.status(200).json({

            message:
                "Doctor updated successfully",

            doctor

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// DELETE DOCTOR
// ===============================

const deleteDoctor = async (req, res, next) => {

    try {

        await doctorService.deleteDoctor(
            req.params.id
        );


        res.status(200).json({

            message:
                "Doctor deleted successfully"

        });

    } catch (error) {

        next(error);

    }

};


// ===============================
// EXPORTS
// ===============================

module.exports = {

    createDoctor,

    getDoctors,

    getDoctor,

    updateDoctor,

    deleteDoctor

};
