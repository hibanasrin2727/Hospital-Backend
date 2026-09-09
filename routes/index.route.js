const express = require("express");

const router = express.Router();


// Dashboard routes
const dashboardRoutes = require("./dashboard");


// Website routes
const websiteRoutes = require("./website");


// Dashboard
router.use("/dashboard", dashboardRoutes);


// Website
router.use("/website", websiteRoutes);


module.exports = router;