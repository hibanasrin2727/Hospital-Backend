const Service = require("./service.model");


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


// GET SERVICE BY ID

const getServiceById = async (id) => {

    const service = await Service.findById(id);

    if (!service) {
        throw new Error("Service not found");
    }

    return service;
};


// UPDATE SERVICE

const updateService = async (id, updateData) => {

    const service = await Service.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!service) {
        throw new Error("Service not found");
    }

    return service;
};


// DELETE SERVICE

const deleteService = async (id) => {

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
        throw new Error("Service not found");
    }

    return service;
};


module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};