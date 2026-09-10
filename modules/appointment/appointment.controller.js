const appointmentService =
    require("./appointment.service");


// CREATE APPOINTMENT

const createAppointment = async (req, res) => {
    try {

        const appointment =
            await appointmentService.createAppointment(
                req.body
            );

        res.status(201).json({
            message: "Appointment created successfully",
            appointment
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// GET ALL APPOINTMENTS

const getAppointments = async (req, res) => {
    try {

        const appointments =
            await appointmentService.getAllAppointments();

        res.status(200).json({
            appointments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET ONE APPOINTMENT

const getAppointment = async (req, res) => {
    try {

        const appointment =
            await appointmentService.getAppointmentById(
                req.params.id
            );

        res.status(200).json({
            appointment
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};


// UPDATE APPOINTMENT

const updateAppointment = async (req, res) => {
    try {

        const appointment =
            await appointmentService.updateAppointment(
                req.params.id,
                req.body
            );

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// DELETE APPOINTMENT

const deleteAppointment = async (req, res) => {
    try {

        await appointmentService.deleteAppointment(
            req.params.id
        );

        res.status(200).json({
            message: "Appointment deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};


module.exports = {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment
};