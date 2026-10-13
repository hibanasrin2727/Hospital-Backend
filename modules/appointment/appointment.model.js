const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        patientName: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },

        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },

        date: {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        reason: {
            type: String,
            required: false,
            maxlength: 500,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "rescheduled",
                "cancelled",
                "completed"
            ],
            default: "pending"
        },

        // =================================================
        // CANCELLATION INFORMATION
        // =================================================

        cancellationReason: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Appointment = mongoose.model(
    "Appointment",
    appointmentSchema
);

module.exports = Appointment;