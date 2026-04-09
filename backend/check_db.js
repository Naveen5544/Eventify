const mongoose = require("mongoose");
require("dotenv").config();
const eventSchema = require("./model/eventSchema");

async function check() {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Management";
        console.log("Connecting to:", mongoURI);
        await mongoose.connect(mongoURI);
        const count = await eventSchema.countDocuments();
        console.log("Total events in DB:", count);
        
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const upcomingCount = await eventSchema.countDocuments({ date: { $gte: twoDaysAgo } });
        console.log("Events within 2 days ago filter:", upcomingCount);

        if (count > 0) {
            const sample = await eventSchema.findOne();
            console.log("Sample event:", sample.name, "Date:", sample.date);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

check();
