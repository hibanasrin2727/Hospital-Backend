const Doctor = require("./doctor.model");
const AppError = require("../../utils/AppError");


// ===============================
// CREATE DOCTOR
// ===============================

const createDoctor = async (doctorData) => {

    const doctor = await Doctor.create(doctorData);

    return doctor;
};


// ===============================
// GET ALL DOCTORS
// ===============================
// Used by ADMIN DASHBOARD
// Returns active + inactive doctors

const getAllDoctors = async () => {

    const doctors = await Doctor.find()
        .populate("departmentId")
        .sort({ createdAt: -1 });

    return doctors;
};


// ===============================
// GET ACTIVE DOCTORS
// ===============================
// Used by PUBLIC WEBSITE

const getActiveDoctors = async () => {

    const doctors = await Doctor.find({
        status: "active"
    })
        .populate("departmentId")
        .sort({ createdAt: -1 });

    return doctors;
};


// ===============================
// GET DOCTOR BY ID
// ===============================
// Used by ADMIN DASHBOARD

const getDoctorById = async (id) => {

    const doctor = await Doctor.findById(id)
        .populate("departmentId");

    if (!doctor) {

        throw new AppError(
            "Doctor not found",
            404
        );
    }

    return doctor;
};
// ===============================
// GET ACTIVE DOCTOR BY ID
// ===============================
// Used by PUBLIC WEBSITE

const getActiveDoctorById = async (id) => {

    const doctor = await Doctor.findOne({
        _id: id,
        status: "active"
    })
        .populate("departmentId");

    if (!doctor) {

        throw new AppError(
            "Doctor not found",
            404
        );
    }

    return doctor;
};


// ===============================
// UPDATE DOCTOR
// ===============================

const updateDoctor = async (id, updateData) => {

    const doctor =
        await Doctor.findByIdAndUpdate(
            id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .populate("departmentId");

    if (!doctor) {

        throw new AppError(
            "Doctor not found",
            404
        );
    }

    return doctor;
};


// ===============================
// DELETE DOCTOR
// ===============================

const deleteDoctor = async (id) => {

    const doctor =
        await Doctor.findByIdAndDelete(id);

    if (!doctor) {

        throw new AppError(
            "Doctor not found",
            404
        );
    }

    return doctor;
};


// ===============================
// EXPORTS
// ===============================

module.exports = {

    createDoctor,

    getAllDoctors,

    getActiveDoctors,

    getDoctorById,

    getActiveDoctorById,

    updateDoctor,

    deleteDoctor
};