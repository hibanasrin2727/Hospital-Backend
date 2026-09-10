const serviceService = require("./service.service");


// CREATE SERVICE

const createService = async (req, res) => {
    try {

        const service =
            await serviceService.createService(
                req.body
            );

        res.status(201).json({
            message: "Service created successfully",
            service
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// GET ALL SERVICES

const getServices = async (req, res) => {
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
};


// GET ONE SERVICE

const getService = async (req, res) => {
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
};


// UPDATE SERVICE

const updateService = async (req, res) => {
    try {

        const service =
            await serviceService.updateService(
                req.params.id,
                req.body
            );

        res.status(200).json({
            message: "Service updated successfully",
            service
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};


// DELETE SERVICE

const deleteService = async (req, res) => {
    try {

        await serviceService.deleteService(
            req.params.id
        );

        res.status(200).json({
            message: "Service deleted successfully"
        });

    } catch (error) {

        res.status(404).json({
            message: error.message
        });

    }
};


module.exports = {
    createService,
    getServices,
    getService,
    updateService,
    deleteService
};