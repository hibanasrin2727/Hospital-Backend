const Doctor = require("./doctor.model");


// CREATE DOCTOR

const createDoctor = async (doctorData) => {

    const doctor = await Doctor.create(doctorData);

    return doctor;
};


// GET ALL DOCTORS

const getAllDoctors = async () => {

    const doctors = await Doctor.find()
        .populate("departmentId")
        .sort({ createdAt: -1 });

    return doctors;
};


// GET DOCTOR BY ID

const getDoctorById = async (id) => {

    const doctor = await Doctor.findById(id)
        .populate("departmentId");

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    return doctor;
};


// UPDATE DOCTOR

const updateDoctor = async (id, updateData) => {

    const doctor = await Doctor.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).populate("departmentId");

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    return doctor;
};


// DELETE DOCTOR

const deleteDoctor = async (id) => {

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
        throw new Error("Doctor not found");
    }

    return doctor;
};


module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};