const express = require("express");

const router = express.Router();

const userController = require("../../modules/user/user.controller");


// ===============================
// REGISTER
// ===============================

router.post("/register", userController.register);


// ===============================
// LOGIN
// ===============================

router.post("/login", userController.login);


module.exports = router;