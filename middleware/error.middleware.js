const errorMiddleware = (err, req, res, next) => {

    console.log("ERROR:", err.message);


    // Invalid MongoDB ObjectId

    if (err.name === "CastError") {

        return res.status(400).json({
            message: "Invalid ID format"
        });

    }


    // Duplicate value

    if (err.code === 11000) {

        const field =
            Object.keys(err.keyPattern)[0];

        return res.status(400).json({
            message: `${field} already exists`
        });

    }


    // Mongoose validation error

    if (err.name === "ValidationError") {

        const errors = {};

        Object.keys(err.errors).forEach((field) => {

            errors[field] =
                err.errors[field].message;

        });

        return res.status(400).json({
            message: "Validation failed",
            errors
        });

    }


    // Custom error with status code

    const statusCode =
        err.statusCode || 500;


    // Default error

    return res.status(statusCode).json({

        message:
            err.message ||
            "Internal server error"

    });

};


module.exports = errorMiddleware;