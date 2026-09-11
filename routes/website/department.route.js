const express = require("express");

const router = express.Router();

const departmentService =
    require("../../modules/department/department.service");


// GET ALL DEPARTMENTS

router.get("/", async (req, res, next) => {
    try {
        const departments =
            await departmentService.getAllDepartments();

        res.status(200).json({
            departments
        });
    } catch (error) {
        next(error);
    }
});


// GET DEPARTMENT BY ID

router.get("/:id", async (req, res, next) => {
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
});


module.exports = router;