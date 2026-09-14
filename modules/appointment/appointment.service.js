const Appointment = require("./appointment.model");

const Doctor = require("../doctor/doctor.model");

const Department = require("../department/department.model");

const User = require("../user/user.model");

const AppError = require("../../utils/AppError");


// =====================================================
// CHECK DOCTOR AVAILABILITY
// =====================================================

const isDoctorAvailable = (schedule, date, time) => {

    if (!schedule || !date || !time) {
        return false;
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
        return false;
    }

    const selectedDay = selectedDate.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );

    // Example:
    // Monday-Saturday 10:00 AM-3:00 PM
    // Monday - Saturday, 10:00 AM - 3:00 PM

    const schedulePattern =
        /([A-Za-z]+)\s*-\s*([A-Za-z]+).*?(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i;

    const match = schedule.match(schedulePattern);

    if (!match) {
        return false;
    }

    const startDay = match[1];
    const endDay = match[2];
    const startTime = match[3];
    const endTime = match[4];

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const startDayIndex = days.indexOf(startDay);
    const endDayIndex = days.indexOf(endDay);
    const selectedDayIndex = days.indexOf(selectedDay);

    if (
        startDayIndex === -1 ||
        endDayIndex === -1 ||
        selectedDayIndex === -1
    ) {
        return false;
    }


    // =================================================
    // CHECK WORKING DAY
    // =================================================

    let validDay = false;

    if (startDayIndex <= endDayIndex) {

        validDay =
            selectedDayIndex >= startDayIndex &&
            selectedDayIndex <= endDayIndex;

    } else {

        // Handles schedules such as:
        // Friday - Monday

        validDay =
            selectedDayIndex >= startDayIndex ||
            selectedDayIndex <= endDayIndex;
    }

    if (!validDay) {
        return false;
    }


    // =================================================
    // CONVERT TIME TO MINUTES
    // =================================================

    const convertTimeToMinutes = (timeString) => {

        const timeMatch = timeString.match(
            /(\d{1,2}):(\d{2})\s*(AM|PM)/i
        );

        if (!timeMatch) {
            return null;
        }

        let hour = parseInt(timeMatch[1]);

        const minute = parseInt(timeMatch[2]);

        const period = timeMatch[3].toUpperCase();

        if (hour === 12) {
            hour = 0;
        }

        if (period === "PM") {
            hour += 12;
        }

        return hour * 60 + minute;
    };


    const appointmentMinutes =
        convertTimeToMinutes(time);

    const scheduleStartMinutes =
        convertTimeToMinutes(startTime);

    const scheduleEndMinutes =
        convertTimeToMinutes(endTime);

    if (
        appointmentMinutes === null ||
        scheduleStartMinutes === null ||
        scheduleEndMinutes === null
    ) {
        return false;
    }

    return (
        appointmentMinutes >= scheduleStartMinutes &&
        appointmentMinutes <= scheduleEndMinutes
    );
};


// =====================================================
// VALIDATE FUTURE DATE
// =====================================================

const isValidFutureDate = (date) => {

    if (!date) {
        return false;
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
        return false;
    }

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    selectedDate.setHours(
        0,
        0,
        0,
        0
    );

    return selectedDate >= today;
};


// =====================================================
// CREATE APPOINTMENT
// =====================================================

const createAppointment = async (appointmentData) => {

    const {
        patientId,
        doctorId,
        departmentId,
        date,
        time,
        reason
    } = appointmentData;


    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
        !patientId ||
        !doctorId ||
        !departmentId ||
        !date ||
        !time ||
        !reason
    ) {
        throw new AppError(
            "All required appointment fields must be provided",
            400
        );
    }


    // =================================================
    // VALIDATE REASON
    // =================================================

    const trimmedReason = String(reason).trim();

    if (trimmedReason.length < 3) {
        throw new AppError(
            "Reason must contain at least 3 characters",
            400
        );
    }

    if (trimmedReason.length > 500) {
        throw new AppError(
            "Reason cannot exceed 500 characters",
            400
        );
    }


    // =================================================
    // VALIDATE DATE
    // =================================================

    if (!isValidFutureDate(date)) {
        throw new AppError(
            "Appointment date must be today or a future date",
            400
        );
    }


    // =================================================
    // CHECK PATIENT
    // =================================================

    const patient = await User.findOne({
        _id: patientId,
        role: "patient",
        status: "active"
    });

    if (!patient) {
        throw new AppError(
            "Active patient not found",
            404
        );
    }


    // =================================================
    // CHECK DOCTOR
    // =================================================

    const doctor = await Doctor.findOne({
        _id: doctorId,
        status: "active"
    });

    if (!doctor) {
        throw new AppError(
            "Doctor not found or inactive",
            404
        );
    }


    // =================================================
    // CHECK DEPARTMENT
    // =================================================

    const department = await Department.findOne({
        _id: departmentId,
        status: "active"
    });

    if (!department) {
        throw new AppError(
            "Department not found or inactive",
            404
        );
    }


    // =================================================
    // CHECK DOCTOR-DEPARTMENT MATCH
    // =================================================

    if (
        doctor.departmentId.toString() !==
        departmentId.toString()
    ) {
        throw new AppError(
            "Doctor does not belong to the selected department",
            400
        );
    }


    // =================================================
    // CHECK DOCTOR SCHEDULE
    // =================================================

    if (
        !isDoctorAvailable(
            doctor.schedule,
            date,
            time
        )
    ) {
        throw new AppError(
            "Doctor is not available at the selected date and time",
            400
        );
    }


    // =================================================
    // CHECK APPOINTMENT CONFLICT
    // =================================================

    const existingAppointment =
        await Appointment.findOne({
            doctorId,
            date,
            time,
            status: {
                $in: [
                    "pending",
                    "confirmed"
                ]
            }
        });

    if (existingAppointment) {
        throw new AppError(
            "This appointment slot is already booked",
            409
        );
    }


    // =================================================
    // CREATE APPOINTMENT
    // =================================================

    const appointment = await Appointment.create({

        patientId,

        // Get patient details from database
        patientName: patient.name,

        phone: patient.phone,

        doctorId,

        departmentId,

        date,

        time,

        reason: trimmedReason,

        status: "pending"
    });

    return appointment;
};


// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

const getAllAppointments = async () => {

    const appointments = await Appointment.find()
        .populate(
            "patientId",
            "-password"
        )
        .populate("doctorId")
        .populate("departmentId")
        .sort({
            createdAt: -1
        });

    return appointments;
};


// =====================================================
// GET APPOINTMENT BY ID
// =====================================================

const getAppointmentById = async (id) => {

    const appointment = await Appointment.findById(id)
        .populate(
            "patientId",
            "-password"
        )
        .populate("doctorId")
        .populate("departmentId");

    if (!appointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }

    return appointment;
};


// =====================================================
// UPDATE APPOINTMENT - ADMIN
// =====================================================

const updateAppointment = async (
    id,
    updateData
) => {

    const appointment = await Appointment.findById(id);

    if (!appointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }


    // =================================================
    // ALLOWED UPDATE FIELDS
    // =================================================

    const allowedFields = [
        "doctorId",
        "departmentId",
        "date",
        "time",
        "reason",
        "status",
        "notes"
    ];

    const safeUpdateData = {};

    allowedFields.forEach((field) => {

        if (updateData[field] !== undefined) {
            safeUpdateData[field] =
                updateData[field];
        }
    });


    // =================================================
    // STATUS WORKFLOW
    // =================================================

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
        safeUpdateData.status &&
        safeUpdateData.status !== appointment.status
    ) {

        const allowedNextStatuses =
            allowedTransitions[
            appointment.status
            ] || [];

        if (
            !allowedNextStatuses.includes(
                safeUpdateData.status
            )
        ) {
            throw new AppError(
                `Cannot change appointment status from ${appointment.status} to ${safeUpdateData.status}`,
                400
            );
        }
    }


    // =================================================
    // VALIDATE DATE
    // =================================================

    if (safeUpdateData.date) {

        if (
            !isValidFutureDate(
                safeUpdateData.date
            )
        ) {
            throw new AppError(
                "Appointment date must be today or a future date",
                400
            );
        }
    }


    // =================================================
    // VALIDATE REASON
    // =================================================

    if (
        safeUpdateData.reason !== undefined
    ) {

        const reason =
            String(
                safeUpdateData.reason
            ).trim();

        if (reason.length < 3) {
            throw new AppError(
                "Reason must contain at least 3 characters",
                400
            );
        }

        if (reason.length > 500) {
            throw new AppError(
                "Reason cannot exceed 500 characters",
                400
            );
        }

        safeUpdateData.reason = reason;
    }


    // =================================================
    // CHECK DETAILS ONLY IF CHANGED
    // =================================================

    const detailsChanged =
        safeUpdateData.doctorId ||
        safeUpdateData.departmentId ||
        safeUpdateData.date ||
        safeUpdateData.time;


    if (detailsChanged) {

        const doctorId =
            safeUpdateData.doctorId ||
            appointment.doctorId;

        const departmentId =
            safeUpdateData.departmentId ||
            appointment.departmentId;

        const date =
            safeUpdateData.date ||
            appointment.date;

        const time =
            safeUpdateData.time ||
            appointment.time;


        // =============================================
        // CHECK DOCTOR
        // =============================================

        const doctor = await Doctor.findOne({
            _id: doctorId,
            status: "active"
        });

        if (!doctor) {
            throw new AppError(
                "Doctor not found or inactive",
                404
            );
        }


        // =============================================
        // CHECK DEPARTMENT
        // =============================================

        const department =
            await Department.findOne({
                _id: departmentId,
                status: "active"
            });

        if (!department) {
            throw new AppError(
                "Department not found or inactive",
                404
            );
        }


        // =============================================
        // CHECK DOCTOR-DEPARTMENT
        // =============================================

        if (
            doctor.departmentId.toString() !==
            departmentId.toString()
        ) {
            throw new AppError(
                "Doctor does not belong to the selected department",
                400
            );
        }


        // =============================================
        // CHECK DOCTOR SCHEDULE
        // =============================================

        if (
            !isDoctorAvailable(
                doctor.schedule,
                date,
                time
            )
        ) {
            throw new AppError(
                "Doctor is not available at the selected date and time",
                400
            );
        }


        // =============================================
        // CHECK CONFLICT
        // =============================================

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
                        "confirmed"
                    ]
                }
            });

        if (conflict) {
            throw new AppError(
                "This appointment slot is already booked",
                409
            );
        }
    }


    // =================================================
    // UPDATE APPOINTMENT
    // =================================================

    const updatedAppointment =
        await Appointment.findByIdAndUpdate(
            id,
            safeUpdateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate(
                "patientId",
            "-password"
        )
            .populate("doctorId")
            .populate("departmentId");


    return updatedAppointment;
};


// =====================================================
// DELETE APPOINTMENT
// =====================================================

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


// =====================================================
// UPDATE PATIENT APPOINTMENT
// =====================================================

const updatePatientAppointment = async (
    id,
    patientId,
    updateData
) => {

    // =================================================
    // CHECK OWNERSHIP
    // =================================================

    const appointment =
        await Appointment.findOne({
            _id: id,
            patientId
        });

    if (!appointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }


    // =================================================
    // COMPLETED/CANCELLED CANNOT BE EDITED
    // =================================================

    if (
        appointment.status === "completed" ||
        appointment.status === "cancelled"
    ) {
        throw new AppError(
            "This appointment cannot be edited",
            400
        );
    }


    const {
        doctorId,
        departmentId,
        date,
        time,
        reason
    } = updateData;


    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
        !doctorId ||
        !departmentId ||
        !date ||
        !time ||
        !reason
    ) {
        throw new AppError(
            "Doctor, department, date, time and reason are required",
            400
        );
    }


    // =================================================
    // VALIDATE DATE
    // =================================================

    if (!isValidFutureDate(date)) {
        throw new AppError(
            "Appointment date must be today or a future date",
            400
        );
    }


    // =================================================
    // VALIDATE REASON
    // =================================================

    const trimmedReason =
        String(reason).trim();

    if (trimmedReason.length < 3) {
        throw new AppError(
            "Reason must contain at least 3 characters",
            400
        );
    }

    if (trimmedReason.length > 500) {
        throw new AppError(
            "Reason cannot exceed 500 characters",
            400
        );
    }


    // =================================================
    // CHECK DOCTOR
    // =================================================

    const doctor = await Doctor.findOne({
        _id: doctorId,
        status: "active"
    });

    if (!doctor) {
        throw new AppError(
            "Doctor not found or inactive",
            404
        );
    }


    // =================================================
    // CHECK DEPARTMENT
    // =================================================

    const department =
        await Department.findOne({
            _id: departmentId,
            status: "active"
        });

    if (!department) {
        throw new AppError(
            "Department not found or inactive",
            404
        );
    }


    // =================================================
    // CHECK DOCTOR-DEPARTMENT
    // =================================================

    if (
        doctor.departmentId.toString() !==
        departmentId.toString()
    ) {
        throw new AppError(
            "Doctor does not belong to the selected department",
            400
        );
    }


    // =================================================
    // CHECK DOCTOR SCHEDULE
    // =================================================

    if (
        !isDoctorAvailable(
            doctor.schedule,
            date,
            time
        )
    ) {
        throw new AppError(
            "Doctor is not available at the selected date and time",
            400
        );
    }


    // =================================================
    // CHECK CONFLICT
    // =================================================

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
                    "confirmed"
                ]
            }
        });

    if (conflict) {
        throw new AppError(
            "This appointment slot is already booked",
            409
        );
    }


    // =================================================
    // UPDATE
    // =================================================

    const updatedAppointment =
        await Appointment.findByIdAndUpdate(
            id,
            {
                doctorId,
                departmentId,
                date,
                time,
                reason: trimmedReason
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate(
            "patientId",
            "-password"
        )
            .populate("doctorId")
            .populate("departmentId");


    return updatedAppointment;
};


// =====================================================
// CANCEL PATIENT APPOINTMENT
// =====================================================

const cancelPatientAppointment = async (
    id,
    patientId
) => {

    // =================================================
    // CHECK OWNERSHIP
    // =================================================

    const appointment =
        await Appointment.findOne({
            _id: id,
            patientId
        });

    if (!appointment) {
        throw new AppError(
            "Appointment not found",
            404
        );
    }


    // =================================================
    // ALREADY CANCELLED
    // =================================================

    if (
        appointment.status === "cancelled"
    ) {
        throw new AppError(
            "Appointment is already cancelled",
            400
        );
    }


    // =================================================
    // COMPLETED CANNOT BE CANCELLED
    // =================================================

    if (
        appointment.status === "completed"
    ) {
        throw new AppError(
            "Completed appointment cannot be cancelled",
            400
        );
    }


    // =================================================
    // CANCEL
    // =================================================

    const updatedAppointment =
        await Appointment.findByIdAndUpdate(
            id,
            {
                status: "cancelled"
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate(
                "patientId",
                "-password"
            )
            .populate("doctorId")
            .populate("departmentId");


    return updatedAppointment;
};


// =====================================================
// GET PATIENT APPOINTMENTS
// =====================================================

const getPatientAppointments = async (
    patientId
) => {

    const appointments =
        await Appointment.find({
            patientId
        })
            .populate("doctorId")
            .populate("departmentId")
            .sort({
                createdAt: -1
            });

    return appointments;
};


// =====================================================
// EXPORT
// =====================================================

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