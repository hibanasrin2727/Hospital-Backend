const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./db");

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/",(req,res) => {
    res.send("Hospital Management API is working ");

});

connectDB()
    .then(() => {
        app.listen (PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            
        });
    })
    .catch(() => {
        console.log("Failed to connect database");
        
    });