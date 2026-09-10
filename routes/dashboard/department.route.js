const express = require("express");

const router = express.Router();

const departmentController = require("../../modules/department/department.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");


// CREATE DEPARTMENT
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    departmentController.createDepartment
);


// GET ALL DEPARTMENTS
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    departmentController.getDepartments
);


// GET ONE DEPARTMENT
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    departmentController.getDepartment
);


// UPDATE DEPARTMENT
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    departmentController.updateDepartment
);


// DELETE DEPARTMENT
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    departmentController.deleteDepartment
);


module.exports = router;