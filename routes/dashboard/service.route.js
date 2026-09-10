const express = require("express");

const router = express.Router();

const serviceController = require("../../modules/service/service.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const roleMiddleware = require("../../middleware/role.middleware");


// CREATE SERVICE

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    serviceController.createService
);


// GET ALL SERVICES

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    serviceController.getServices
);


// GET ONE SERVICE

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    serviceController.getService
);


// UPDATE SERVICE

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    serviceController.updateService
);


// DELETE SERVICE

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    serviceController.deleteService
);


module.exports = router;