const mongoose = require('mongoose')

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to db")
}

module.exports = main