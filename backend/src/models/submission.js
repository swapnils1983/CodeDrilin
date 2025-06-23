const mongoose = require('mongoose');
const { Schema } = mongoose;

const submissionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    contestId: {
        type: Schema.Types.ObjectId,
        ref: 'contest'
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'java', 'c++', 'python', 'c', 'typescript']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error'],
        default: 'pending'
    },
    runtime: {
        type: Number, // milliseconds
        default: 0
    },
    memory: {
        type: Number, // k-bytes
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
});


submissionSchema.index({ contestId: 1, createdAt: 1 });

const Submission = mongoose.model('submission', submissionSchema);

module.exports = Submission;