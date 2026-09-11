const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();

const app = express();


// Middleware
app.use(express.json());


// Main routes
const routes = require("./routes/index.route");

app.use("/api", routes);

// Error Handling Middleware
const errorMiddleware =
    require("./middleware/error.middleware");

app.use(errorMiddleware);


// Port
const PORT = process.env.PORT || 5000;


// Test route
app.get("/", (req, res) => {
    res.send("Hospital Management API is working");
});


// Connect database and start server
connectDB().then(() => {

    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });

});