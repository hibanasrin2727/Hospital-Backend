const express = require("express");

const router = express.Router();


// Main dashboard router
const dashboardRoutes = require("./dashboard/dashboard.route");


// Main website router
const websiteRoutes = require("./website/website.route");


// Dashboard
router.use("/dashboard", dashboardRoutes);


// Website
router.use("/website", websiteRoutes);


module.exports = router;