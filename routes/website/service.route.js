const express = require("express");

const router = express.Router();

const serviceService =
    require("../../modules/service/service.service");


// GET ALL SERVICES

router.get("/", async (req, res, next) => {
    try {
        const services =
            await serviceService.getAllServices();

        res.status(200).json({
            services
        });
    } catch (error) {
        next(error);
    }
});


// GET SERVICE BY ID

router.get("/:id", async (req, res, next) => {
    try {
        const service =
            await serviceService.getServiceById(
                req.params.id
            );

        res.status(200).json({
            service
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;