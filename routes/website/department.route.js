const express = require("express");

const router = express.Router();

const departmentService =
    require("../../modules/department/department.service");


// ===============================
// GET ALL ACTIVE DEPARTMENTS
// ===============================

router.get("/", async (req, res, next) => {

    try {

        const departments =
            await departmentService.getActiveDepartments();

        res.status(200).json({
            departments
        });

    } catch (error) {
        next(error);
    }

});


// ===============================
// GET ACTIVE DEPARTMENT BY ID
// ===============================

router.get("/:id", async (req, res, next) => {

    try {

        const department =
            await departmentService.getActiveDepartmentById(
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