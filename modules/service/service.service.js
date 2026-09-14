const Service = require("./service.model");

const AppError =
    require("../../utils/AppError");


// CREATE SERVICE

const createService = async (serviceData) => {

    const service = await Service.create(
        serviceData
    );

    return service;
};


// GET ALL SERVICES

const getAllServices = async () => {

    const services = await Service.find()
        .sort({ createdAt: -1 });

    return services;
};

// ===============================
// GET ACTIVE SERVICES
// ===============================
// Used by PUBLIC WEBSITE

const getActiveServices = async () => {

    const services = await Service.find({
        status: "active"
    }).sort({ createdAt: -1 });

    return services;
};

// GET SERVICE BY ID

const getServiceById = async (id) => {

    const service = await Service.findById(id);

    if (!service) {
        throw new AppError(
            "Service not found",
            404
        );
    }

    return service;
};

// ===============================
// GET ACTIVE SERVICE BY ID
// ===============================
// Used by PUBLIC WEBSITE

const getActiveServiceById = async (id) => {

    const service = await Service.findOne({
        _id: id,
        status: "active"
    });

    if (!service) {
        throw new AppError(
            "Service not found",
            404
        );
    }

    return service;
};

// UPDATE SERVICE

const updateService = async (id, updateData) => {

    const service = await Service.findByIdAndUpdate(
        id,
        updateData,
        {
            returnDocument: "after",
            runValidators: true
        }
    );

    if (!service) {
        throw new AppError(
            "Service not found",
            404
        );
    }

    return service;
};


// DELETE SERVICE

const deleteService = async (id) => {

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
        throw new AppError(
            "Service not found",
            404
        );
    }

    return service;
};


module.exports = {
    createService,
    getAllServices,
    getActiveServices,
    getServiceById,
    getActiveServiceById,
    updateService,
    deleteService
};