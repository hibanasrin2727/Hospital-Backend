const departmentService = require("./department.service");


// CREATE DEPARTMENT

const createDepartment = async (req, res) => {
    try {

        const department =
            await departmentService.createDepartment(
                req.body
            );

        res.status(201).json({
            message: "Department created successfully",
            department
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// GET ALL DEPARTMENTS

const getDepartments = async (req, res) => {
    try {

        const departments =
            await departmentService.getAllDepartments();

        res.status(200).json({
            departments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET ONE DEPARTMENT

const getDepartment = async (req, res) => {
    try {

        const department =
            await departmentService.getDepartmentById(
                req.params.id
            );

        res.status(200).json({
            department
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};


// UPDATE DEPARTMENT

const updateDepartment = async (req, res) => {
    try {

        const department =
            await departmentService.updateDepartment(
                req.params.id,
                req.body
            );

        res.status(200).json({
            message: "Department updated successfully",
            department
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// DELETE DEPARTMENT

const deleteDepartment = async (req, res) => {
    try {

        await departmentService.deleteDepartment(
            req.params.id
        );

        res.status(200).json({
            message: "Department deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};


module.exports = {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
};