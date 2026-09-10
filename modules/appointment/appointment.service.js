const Appointment = require("./appointment.model");


// CREATE APPOINTMENT

const createAppointment = async (appointmentData) => {

    const {
        doctorId,
        date,
        time
    } = appointmentData;


    // CHECK DOCTOR SLOT

    const existingAppointment =
        await Appointment.findOne({
            doctorId,
            date,
            time,
            status: {
                $in: [
                    "pending",
                    "confirmed",
                    "rescheduled"
                ]
            }
        });


    if (existingAppointment) {
        throw new Error(
            "This doctor already has an appointment at this time"
        );
    }


    const appointment =
        await Appointment.create(
            appointmentData
        );

    return appointment;
};


// GET ALL APPOINTMENTS

const getAllAppointments = async () => {

    const appointments =
        await Appointment.find()
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization")
            .populate("departmentId", "name")
            .sort({ createdAt: -1 });

    return appointments;
};


// GET APPOINTMENT BY ID

const getAppointmentById = async (id) => {

    const appointment =
        await Appointment.findById(id)
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization")
            .populate("departmentId", "name");


    if (!appointment) {
        throw new Error("Appointment not found");
    }


    return appointment;
};


// UPDATE APPOINTMENT

const updateAppointment = async (
    id,
    updateData
) => {

    const appointment =
        await Appointment.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization")
            .populate("departmentId", "name");


    if (!appointment) {
        throw new Error("Appointment not found");
    }


    return appointment;
};


// DELETE APPOINTMENT

const deleteAppointment = async (id) => {

    const appointment =
        await Appointment.findByIdAndDelete(id);


    if (!appointment) {
        throw new Error("Appointment not found");
    }


    return appointment;
};


module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};