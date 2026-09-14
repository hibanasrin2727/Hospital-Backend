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

// ===============================
// GET ACTIVE DEPARTMENTS
// ===============================
// Used by PUBLIC WEBSITE

const getActiveDepartments = async () => {

    const departments = await Department.find({
        status: "active"
    }).sort({ createdAt: -1 });

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

// ===============================
// GET ACTIVE DEPARTMENT BY ID
// ===============================
// Used by PUBLIC WEBSITE

const getActiveDepartmentById = async (id) => {

    const department = await Department.findOne({
        _id: id,
        status: "active"
    });

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
            returnDocument: "after",
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
    getActiveDepartments,
    getDepartmentById,
    getActiveDepartmentById,
    updateDepartment,
    deleteDepartment
};