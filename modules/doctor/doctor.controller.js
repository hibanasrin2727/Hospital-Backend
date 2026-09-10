const doctorService = require("./doctor.service");


// CREATE DOCTOR

const createDoctor = async (req, res) => {
    try {

        const doctor = await doctorService.createDoctor(
            req.body
        );

        res.status(201).json({
            message: "Doctor created successfully",
            doctor
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// GET ALL DOCTORS

const getDoctors = async (req, res) => {
    try {

        const doctors = await doctorService.getAllDoctors();

        res.status(200).json({
            doctors
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET ONE DOCTOR

const getDoctor = async (req, res) => {
    try {

        const doctor = await doctorService.getDoctorById(
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
};


// UPDATE DOCTOR

const updateDoctor = async (req, res) => {
    try {

        const doctor = await doctorService.updateDoctor(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Doctor updated successfully",
            doctor
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// DELETE DOCTOR

const deleteDoctor = async (req, res) => {
    try {

        await doctorService.deleteDoctor(
            req.params.id
        );

        res.status(200).json({
            message: "Doctor deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};


module.exports = {
    createDoctor,
    getDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor
};