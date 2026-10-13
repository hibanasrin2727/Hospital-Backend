
const express = require("express");

const router = express.Router();

const doctorController =
    require("../../modules/doctor/doctor.controller");

const doctorUpload =
    require("../../modules/doctor/doctor.upload");

const authMiddleware =
    require("../../middleware/auth.middleware");

const roleMiddleware =
    require("../../middleware/role.middleware");


// ===============================
// CREATE DOCTOR
// ===============================

router.post(

    "/",

    authMiddleware,

    roleMiddleware("admin"),

    doctorUpload.single("image"),

    doctorController.createDoctor

);


// ===============================
// GET ALL DOCTORS
// ===============================

router.get(

    "/",

    authMiddleware,

    roleMiddleware("admin"),

    doctorController.getDoctors

);


// ===============================
// GET ONE DOCTOR
// ===============================

router.get(

    "/:id",

    authMiddleware,

    roleMiddleware("admin"),

    doctorController.getDoctor

);


// ===============================
// UPDATE DOCTOR
// ===============================

router.put(

    "/:id",

    authMiddleware,

    roleMiddleware("admin"),

    doctorUpload.single("image"),

    doctorController.updateDoctor

);


// ===============================
// DELETE DOCTOR
// ===============================

router.delete(

    "/:id",

    authMiddleware,

    roleMiddleware("admin"),

    doctorController.deleteDoctor

);


module.exports = router;
