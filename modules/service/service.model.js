const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        icon: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

const Service = mongoose.model(
    "Service",
    serviceSchema
);

module.exports = Service;