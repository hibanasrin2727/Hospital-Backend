const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");
const cors = require("cors");

dotenv.config();

const app = express();


// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json());

app.use(cors());


// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {

    res.status(200).json({
        message: "Hospital Management API is working"
    });

});


// ======================================
// MAIN API ROUTES
// ======================================

const routes =
    require("./routes/index.route");

app.use("/api", routes);


// ======================================
// ERROR HANDLING MIDDLEWARE
// ======================================

const errorMiddleware =
    require("./middleware/error.middleware");

app.use(errorMiddleware);


// ======================================
// PORT
// ======================================

const PORT =
    process.env.PORT || 5000;


// ======================================
// DATABASE + SERVER
// ======================================

connectDB()
    .then(() => {

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.log(
            "Server failed to start:"
        );

        console.log(error.message);

    });