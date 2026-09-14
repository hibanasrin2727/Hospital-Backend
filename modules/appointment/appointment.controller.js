const appointmentService =
    require("./appointment.service");


// CREATE APPOINTMENT

const createAppointment = async (req, res, next) => {
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

        next(error);

    }
};


// GET ALL APPOINTMENTS

const getAppointments = async (req, res, next) => {
    try {

        const appointments =
            await appointmentService.getAllAppointments();

        res.status(200).json({
            appointments
        });

    } catch (error) {

        next(error);

    }
};


// GET APPOINTMENT BY ID

const getAppointment = async (req, res, next) => {
    try {

        const appointment =
            await appointmentService.getAppointmentById(
                req.params.id
            );

        res.status(200).json({
            appointment
        });

    } catch (error) {

        next(error);

    }
};


// UPDATE APPOINTMENT

const updateAppointment = async (req, res, next) => {
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

        next(error);

    }
};


// DELETE APPOINTMENT

const deleteAppointment = async (req, res, next) => {
    try {

        await appointmentService.deleteAppointment(
            req.params.id
        );

        res.status(200).json({
            message: "Appointment deleted successfully"
        });

    } catch (error) {

        next(error);

    }
};


// ======================================
// PATIENT EDIT OWN APPOINTMENT
// ======================================

const updatePatientAppointment = async (
    req,
    res,
    next
) => {

    try {

        const appointment =
            await appointmentService.updatePatientAppointment(
                req.params.id,
                req.user.userId,
                req.body
            );


        res.status(200).json({

            message:
                "Appointment updated successfully",

            appointment

        });

    } catch (error) {

        next(error);

    }
};


// ======================================
// PATIENT CANCEL OWN APPOINTMENT
// ======================================

const cancelPatientAppointment = async (
    req,
    res,
    next
) => {

    try {

        const appointment =
            await appointmentService.cancelPatientAppointment(
                req.params.id,
                req.user.userId
            );

        res.status(200).json({

            message:
                "Appointment cancelled successfully",

            appointment

        });

    } catch (error) {

        next(error);

    }
};


// ======================================
// PATIENT GET OWN APPOINTMENTS
// ======================================

const getPatientAppointments = async (
    req,
    res,
    next
) => {

    try {

        const appointments =
            await appointmentService.getPatientAppointments(
                req.user.userId
            );

        res.status(200).json({
            appointments
        });

    } catch (error) {

        next(error);

    }
};
module.exports = {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    updatePatientAppointment,
    cancelPatientAppointment,
    getPatientAppointments
};