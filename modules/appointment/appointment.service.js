const Appointment = require("./appointment.model");
const Doctor = require("../doctor/doctor.model");
const Department = require("../department/department.model");

const AppError =
    require("../../utils/AppError");


// ======================================
// CREATE APPOINTMENT
// ======================================

const createAppointment = async (appointmentData) => {

    const {
        patientId,
        patientName,
        phone,
        doctorId,
        departmentId,
        date,
        time,
        reason
    } = appointmentData;


    // CHECK REQUIRED FIELDS

    if (
        !patientId ||
        !patientName ||
        !phone ||
        !doctorId ||
        !departmentId ||
        !date ||
        !time ||
        !reason
    ) {
        throw new AppError(
            "All appointment fields are required",
            400
        );
    }


    // CHECK DOCTOR EXISTS

    const doctor =
        await Doctor.findById(doctorId);

    if (!doctor) {
        throw new AppError(
            "Doctor not found",
            404
        );
    }


    // CHECK DOCTOR STATUS

    if (doctor.status !== "active") {
        throw new AppError(
            "Doctor is currently inactive",
            400
        );
    }


    // CHECK DEPARTMENT EXISTS

    const department =
        await Department.findById(departmentId);

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }


    // CHECK DEPARTMENT STATUS

    if (department.status !== "active") {
        throw new AppError(
            "Department is currently inactive",
            400
        );
    }


    // CHECK DOCTOR BELONGS TO DEPARTMENT

    if (
        doctor.departmentId.toString() !==
        departmentId.toString()
    ) {
        throw new AppError(
            "Doctor does not belong to the selected department",
            400
        );
    }


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
        throw new AppError(
            "This doctor already has an appointment at this time",
            409
        );
    }


    // CREATE APPOINTMENT

    const appointment =
        await Appointment.create(
            appointmentData
        );

    return appointment;
};


// ======================================
// GET ALL APPOINTMENTS
// ======================================

const getAllAppointments = async () => {

    const appointments =
        await Appointment.find()
            .populate(
                "patientId",
                "name email phone"
            )
            .populate(
                "doctorId",
                "name specialization"
            )
            .populate(
                "departmentId",
                "name"
            )
            .sort({
                createdAt: -1
            });

    return appointments;
};


// ======================================
// GET APPOINTMENT BY ID
// ======================================

const getAppointmentById = async (id) => {

    const appointment =
        await Appointment.findById(id)
            .populate(
                "patientId",
                "name email phone"
            )
            .populate(
                "doctorId",
                "name specialization"
            )
            .populate(
                "departmentId",
                "name"
            );


    if (!appointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }


    return appointment;
};


// ======================================
// UPDATE APPOINTMENT
// ======================================

const updateAppointment = async (
    id,
    updateData
) => {

    // FIND EXISTING APPOINTMENT

    const existingAppointment =
        await Appointment.findById(id);


    if (!existingAppointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }


    // ======================================
    // CHECK APPOINTMENT STATUS
    // ======================================

    if (updateData.status) {

        const allowedStatuses = [
            "pending",
            "confirmed",
            "rescheduled",
            "cancelled",
            "completed"
        ];


        if (
            !allowedStatuses.includes(
                updateData.status
            )
        ) {
            throw new AppError(
                "Invalid appointment status",
                400
            );
        }
    }


    // ======================================
    // CHECK STATUS TRANSITION
    // ======================================

    if (updateData.status) {

        const currentStatus =
            existingAppointment.status;

        const newStatus =
            updateData.status;


        const allowedTransitions = {

            pending: [
                "confirmed",
                "rescheduled",
                "cancelled"
            ],

            confirmed: [
                "rescheduled",
                "cancelled",
                "completed"
            ],

            rescheduled: [
                "confirmed",
                "cancelled"
            ],

            cancelled: [],

            completed: []

        };


        if (
            !allowedTransitions[currentStatus]
                .includes(newStatus)
        ) {

            throw new AppError(
                `Cannot change appointment status from ${currentStatus} to ${newStatus}`,
                400
            );

        }
    }


    // ======================================
    // USE NEW VALUE OR OLD VALUE
    // ======================================

    const doctorId =
        updateData.doctorId ||
        existingAppointment.doctorId;

    const departmentId =
        updateData.departmentId ||
        existingAppointment.departmentId;

    const date =
        updateData.date ||
        existingAppointment.date;

    const time =
        updateData.time ||
        existingAppointment.time;


    // ======================================
    // CHECK DOCTOR
    // ======================================

    const doctor =
        await Doctor.findById(doctorId);


    if (!doctor) {
        throw new AppError(
            "Doctor not found",
            404
        );
    }


    // CHECK DOCTOR STATUS

    if (doctor.status !== "active") {
        throw new AppError(
            "Doctor is currently inactive",
            400
        );
    }


    // ======================================
    // CHECK DEPARTMENT
    // ======================================

    const department =
        await Department.findById(
            departmentId
        );


    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }


    // CHECK DEPARTMENT STATUS

    if (department.status !== "active") {
        throw new AppError(
            "Department is currently inactive",
            400
        );
    }


    // ======================================
    // CHECK DOCTOR BELONGS TO DEPARTMENT
    // ======================================

    if (
        doctor.departmentId.toString() !==
        departmentId.toString()
    ) {
        throw new AppError(
            "Doctor does not belong to the selected department",
            400
        );
    }


    // ======================================
    // CHECK APPOINTMENT CONFLICT
    // ======================================

    const conflict =
        await Appointment.findOne({
            _id: {
                $ne: id
            },
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


    if (conflict) {
        throw new AppError(
            "This doctor already has another appointment at this time",
            409
        );
    }


    // ======================================
    // UPDATE APPOINTMENT
    // ======================================

    const appointment =
        await Appointment.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate(
                "patientId",
                "name email phone"
            )
            .populate(
                "doctorId",
                "name specialization"
            )
            .populate(
                "departmentId",
                "name"
            );


    return appointment;
};


// ======================================
// DELETE APPOINTMENT
// ======================================

const deleteAppointment = async (id) => {

    const appointment =
        await Appointment.findByIdAndDelete(id);


    if (!appointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }


    return appointment;
};


// ======================================
// PATIENT EDIT OWN APPOINTMENT
// ======================================

const updatePatientAppointment = async (
    id,
    patientId,
    updateData
) => {

    // FIND APPOINTMENT

    const appointment =
        await Appointment.findById(id);


    if (!appointment) {

        throw new AppError(
            "Appointment not found",
            404
        );

    }


    // CHECK OWNERSHIP

    if (
        appointment.patientId.toString() !==
        patientId.toString()
    ) {

        throw new AppError(
            "You can only edit your own appointment",
            403
        );

    }


    // CHECK APPOINTMENT STATUS

    if (
        appointment.status === "cancelled" ||
        appointment.status === "completed"
    ) {

        throw new AppError(
            "This appointment cannot be edited",
            400
        );

    }


    // PATIENT CAN ONLY EDIT THESE FIELDS

    const allowedFields = [
        "date",
        "time",
        "reason"
    ];


    const filteredData = {};


    allowedFields.forEach((field) => {

        if (
            updateData[field] !== undefined
        ) {

            filteredData[field] =
                updateData[field];

        }

    });


    // CHECK IF THERE IS ANYTHING TO UPDATE

    if (
        Object.keys(filteredData).length === 0
    ) {

        throw new AppError(
            "No valid fields to update",
            400
        );

    }


    // CHECK DOCTOR SLOT IF DATE/TIME CHANGES

    const newDate =
        filteredData.date ||
        appointment.date;

    const newTime =
        filteredData.time ||
        appointment.time;


    const conflict =
        await Appointment.findOne({

            _id: {
                $ne: id
            },

            doctorId:
                appointment.doctorId,

            date: newDate,

            time: newTime,

            status: {
                $in: [
                    "pending",
                    "confirmed",
                    "rescheduled"
                ]
            }

        });


    if (conflict) {

        throw new AppError(
            "This doctor already has another appointment at this time",
            409
        );

    }


    // UPDATE APPOINTMENT

    const updatedAppointment =
        await Appointment.findByIdAndUpdate(

            id,

            filteredData,

            {
                new: true,
                runValidators: true
            }

        )
            .populate(
                "doctorId",
                "name specialization"
            )
            .populate(
                "departmentId",
                "name"
            );


    return updatedAppointment;
};


// ======================================
// PATIENT CANCEL OWN APPOINTMENT
// ======================================

const cancelPatientAppointment = async (
    id,
    patientId
) => {

// FIND APPOINTMENT

    const appointment =
        await Appointment.findById(id);


    if (!appointment) {

        throw new AppError(
            "Appointment not found",
            404
        );

    }


    // CHECK OWNERSHIP

    if (
        appointment.patientId.toString() !==
        patientId.toString()
    ) {

        throw new AppError(
            "You can only cancel your own appointment",
            403
        );

    }


    // CHECK CURRENT STATUS

    if (
        appointment.status === "cancelled"
    ) {

        throw new AppError(
            "Appointment is already cancelled",
            400
        );

    }


    if (
        appointment.status === "completed"
    ) {

        throw new AppError(
            "Completed appointment cannot be cancelled",
            400
        );

    }


    // CANCEL APPOINTMENT

    appointment.status = "cancelled";

    await appointment.save();


    return appointment;
};

// GET PATIENT OWN APPOINTMENTS
const getPatientAppointments = async (patientId) => {

    const appointments =
        await Appointment.find({
            patientId: patientId
        })
            .populate(
                "doctorId",
                "name specialization"
            )
            .populate(
                "departmentId",
                "name"
            )
            .sort({
                createdAt: -1
            });

    return appointments;
};

// ======================================
// EXPORT FUNCTIONS
// ======================================

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    updatePatientAppointment,
    cancelPatientAppointment,
    getPatientAppointments
};