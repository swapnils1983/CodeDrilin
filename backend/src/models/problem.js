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
                required: false,
                default: "",
                validate: {
                    validator: (v) => v !== null && v !== undefined,
                    message: "Input cannot be null or undefined (but empty string is allowed)"
                }
            },
            output: {
                type: String,
                required: false,
                default: "",
                validate: {
                    validator: (v) => v !== null && v !== undefined,
                    message: "Output cannot be null or undefined (but empty string is allowed)"
                }
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
                required: false,
                default: "",
                validate: {
                    validator: (v) => v !== null && v !== undefined,
                    message: "Input cannot be null or undefined (but empty string is allowed)"
                }
            },
            output: {
                type: String,
                required: false,
                default: "",
                validate: {
                    validator: (v) => v !== null && v !== undefined,
                    message: "Output cannot be null or undefined (but empty string is allowed)"
                }
            }
        },
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