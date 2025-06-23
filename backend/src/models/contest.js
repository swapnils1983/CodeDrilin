const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
    rank: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    username: { type: String, required: true },
    problemsSolved: { type: Number, required: true },
    totalTime: { type: Number, required: true }
}, { _id: false });


const contestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'problem'
    }],
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],

    cachedLeaderboard: {
        type: [leaderboardEntrySchema],
        default: []
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

contestSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('contest', contestSchema);