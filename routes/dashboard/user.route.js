const express = require("express");

const router = express.Router();

const userController = require("../../modules/user/user.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const roleMiddleware = require("../../middleware/role.middleware");


// Only logged-in admin can access user management

router.get("/", authMiddleware, roleMiddleware("admin"), userController.getUsers);


router.get("/:id", authMiddleware, roleMiddleware("admin"), userController.getUser);


router.put("/:id",authMiddleware,roleMiddleware("admin"),userController.updateUser);


router.delete("/:id",authMiddleware,roleMiddleware("admin"),userController.deleteUser);


module.exports = router;