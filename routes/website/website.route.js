const express = require("express");

const router = express.Router();


// Import website routes

const doctorRoutes = require("./doctor.route");
const departmentRoutes = require("./department.route");
const serviceRoutes = require("./service.route");
const appointmentRoutes = require("./appointment.route");
const statsRoutes = require("./stats.route");


// Mount website routes

router.use("/doctors", doctorRoutes);
router.use("/departments", departmentRoutes);
router.use("/services", serviceRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/stats", statsRoutes);


module.exports = router;