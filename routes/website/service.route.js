const express = require("express");

const router = express.Router();

const serviceService =
    require("../../modules/service/service.service");


router.get("/", async (req, res) => {

    try {

        const services =
            await serviceService.getAllServices();

        res.status(200).json({
            services
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


router.get("/:id", async (req, res) => {

    try {

        const service =
            await serviceService.getServiceById(
                req.params.id
            );

        res.status(200).json({
            service
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }

});


module.exports = router;