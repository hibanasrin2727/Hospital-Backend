const express = require("express");

const router = express.Router();

const userController = require("../../modules/user/user.controller");


// GET all users

router.get("/", userController.getUsers);


// GET one user

router.get("/:id", userController.getUser);


// UPDATE user

router.put("/:id", userController.updateUser);


// DELETE user

router.delete("/:id", userController.deleteUser);


module.exports = router;