const Department = require("./department.model");

const AppError =
    require("../../utils/AppError");


// CREATE DEPARTMENT

const createDepartment = async (departmentData) => {

    const department = await Department.create(
        departmentData
    );

    return department;
};


// GET ALL DEPARTMENTS

const getAllDepartments = async () => {

    const departments = await Department.find()
        .sort({ createdAt: -1 });

    return departments;
};


// GET DEPARTMENT BY ID

const getDepartmentById = async (id) => {

    const department = await Department.findById(id);

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }

    return department;
};


// UPDATE DEPARTMENT

const updateDepartment = async (id, updateData) => {

    const department = await Department.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }

    return department;
};


// DELETE DEPARTMENT

const deleteDepartment = async (id) => {

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
        throw new AppError(
            "Department not found",
            404
        );
    }

    return department;
};


module.exports = {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};