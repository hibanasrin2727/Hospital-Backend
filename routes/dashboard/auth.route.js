const express = require("express");

const router = express.Router();

const userController =
    require("../../modules/user/user.controller");

const rateLimit =
    require("express-rate-limit");


// ===============================
// LOGIN RATE LIMITER
// ===============================

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message:
            "Too many login attempts. Please try again later."
    }
});


// ===============================
// REGISTER
// ===============================

router.post(
    "/register",
    userController.register
);


// ===============================
// LOGIN
// ===============================

router.post(
    "/login",
    loginLimiter,
    userController.login
);


module.exports = router;