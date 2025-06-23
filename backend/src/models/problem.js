const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
    },
    tags: [
        {
            type: String,
            // enum: ['array', 'linkedList', 'graph', 'dp']
        }
    ],
    visibleTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            },
            explanation: {
                type: String,
                required: true
            }
        }
    ],
    hiddenTestCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ],
    startCode: [
        {
            language: {
                type: String,
                required: true
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],
    referenceSolution: [
        {
            language: {
                type: String,
                required: true
            },
            completeCode: {
                type: String,
                required: true
            }
        }
    ],
    isContestProblem: {
        type: Boolean,
        default: false
    },
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }

})


const Problem = mongoose.model('problem', problemSchema)

module.exports = Problem