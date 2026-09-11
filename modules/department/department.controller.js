const departmentService =
    require("./department.service");


// CREATE DEPARTMENT

const createDepartment = async (req, res, next) => {
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

        next(error);

    }
};


// GET ALL DEPARTMENTS

const getDepartments = async (req, res, next) => {
    try {

        const departments =
            await departmentService.getAllDepartments();

        res.status(200).json({
            departments
        });

    } catch (error) {

        next(error);

    }
};


// GET DEPARTMENT BY ID

const getDepartment = async (req, res, next) => {
    try {

        const department =
            await departmentService.getDepartmentById(
                req.params.id
            );

        res.status(200).json({
            department
        });

    } catch (error) {

        next(error);

    }
};


// UPDATE DEPARTMENT

const updateDepartment = async (req, res, next) => {
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

        next(error);

    }
};


// DELETE DEPARTMENT

const deleteDepartment = async (req, res, next) => {
    try {

        await departmentService.deleteDepartment(
            req.params.id
        );

        res.status(200).json({
            message: "Department deleted successfully"
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    createDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
};