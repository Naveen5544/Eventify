const express = require("express");
require("dotenv").config(); // Load env variables first
const mongoose = require("mongoose");
const eventRoute = require("./controller/eventRoute");
const weatherRoute = require("./controller/weatherRoute"); // <-- Import weatherRoute
const bodyParser = require("body-parser");
const cors = require("cors");
const initReminderTask = require("./utils/reminderTask");

const app = express();

// Database Connection with Improved Error Handling
mongoose.set("strictQuery", true);
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Management";
mongoose.connect(mongoURI)
    .then(() => {
        console.log("✅ Connected to DB");
        // Initialize scheduled reminders only after DB is ready
        initReminderTask();
    })
    .catch((err) => console.error("❌ Database connection error:", err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration (Add frontend URL for security)
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/eventRoute', eventRoute);
app.use('/weatherRoute', weatherRoute); // <-- Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("✅ Server is working!");
});
