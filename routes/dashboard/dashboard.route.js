const express = require("express");

const router = express.Router();


// Import dashboard routes

const authRoutes = require("./auth.route");
const statsRoutes = require("./stats.route");
const doctorRoutes = require("./doctor.route");
const departmentRoutes = require("./department.route");
const serviceRoutes = require("./service.route");
const appointmentRoutes = require("./appointment.route");
const userRoutes = require("./user.route");


// Mount routes

router.use("/auth", authRoutes);

router.use("/stats", statsRoutes);

router.use("/doctors", doctorRoutes);

router.use("/departments", departmentRoutes);

router.use("/services", serviceRoutes);

router.use("/appointments", appointmentRoutes);

router.use("/users", userRoutes);


module.exports = router;