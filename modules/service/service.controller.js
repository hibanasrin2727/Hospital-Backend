const serviceService =
    require("./service.service");


// CREATE SERVICE

const createService = async (req, res, next) => {
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

        next(error);

    }
};


// GET ALL SERVICES

const getServices = async (req, res, next) => {
    try {

        const services =
            await serviceService.getAllServices();

        res.status(200).json({
            services
        });

    } catch (error) {

        next(error);

    }
};


// GET SERVICE BY ID

const getService = async (req, res, next) => {
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
};


// UPDATE SERVICE

const updateService = async (req, res, next) => {
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

        next(error);

    }
};


// DELETE SERVICE

const deleteService = async (req, res, next) => {
    try {

        await serviceService.deleteService(
            req.params.id
        );

        res.status(200).json({
            message: "Service deleted successfully"
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    createService,
    getServices,
    getService,
    updateService,
    deleteService
};