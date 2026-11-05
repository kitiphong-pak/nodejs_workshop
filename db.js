const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connect DB Success.");
    } catch (err) {
        console.error("Connect DB Failed:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
