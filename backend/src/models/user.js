const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    age: {
        type: Number,
        min: 5,
        max: 100
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'problem',
            unique: true
        }],

    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const User = mongoose.model("user", userSchema)
module.exports = User