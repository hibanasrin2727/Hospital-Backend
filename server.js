const express = require("express");

const dotenv = require("dotenv");

const connectDB = require("./db");

const cors = require("cors");

const path = require("path");

dotenv.config();


// =====================================================
// TIMEZONE
// =====================================================

process.env.TZ = "Asia/Kolkata";


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

app.use(cors());


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.status(200).json({
        message:
            "Hospital Management API is working"
    });

});


// =====================================================
// MAIN API ROUTES
// =====================================================

const routes =
    require("./routes/index.route");

app.use(
    "/api",
    routes
);


// =====================================================
// ERROR HANDLING
// =====================================================

const errorMiddleware =
    require("./middleware/error.middleware");

app.use(
    errorMiddleware
);


// =====================================================
// PORT
// =====================================================

const PORT =
    process.env.PORT || 5000;


// =====================================================
// UPLOADED FILES
// =====================================================

app.use(
    "/uploads",
    express.static(
        path.join(
            process.cwd(),
            "uploads"
        )
    )
);


// =====================================================
// AUTOMATIC APPOINTMENT CANCELLATION
// =====================================================

const {
    autoCancelExpiredAppointments
} = require(
    "./modules/appointment/appointment.service"
);


// =====================================================
// DATABASE + SERVER
// =====================================================

connectDB()

    .then(
        async () => {

            // Check immediately when server starts
            await autoCancelExpiredAppointments();


            // Check every 60 seconds
            setInterval(
                autoCancelExpiredAppointments,
                60 * 1000
            );


            app.listen(
                PORT,
                () => {

                    console.log(
                        `Server running on http://localhost:${PORT}`
                    );

                }
            );

        }
    )

    .catch(
        (error) => {

            console.log(
                "Server failed to start:"
            );

            console.log(
                error.message
            );

        }
    );