const express = require("express");

const router = express.Router();

const departmentService =
    require("../../modules/department/department.service");


router.get("/", async (req, res) => {

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

});


router.get("/:id", async (req, res) => {

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

});


module.exports = router;