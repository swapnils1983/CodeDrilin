require('dotenv').config();
const mongoose = require('mongoose');

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to DB");
    } catch (error) {
        console.error("❌ Failed to connect to DB:", error);
        process.exit(1); 
    }
}

module.exports = main;