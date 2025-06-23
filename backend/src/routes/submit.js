const express = require('express')
const userMiddleware = require('../middleware/userMiddleware')
const { submitCode, runCode, getAllSubmissions } = require('../controllers/userSubmission')
const { submitContestProblem } = require('../controllers/contestSubmission')
const submitRouter = express.Router()

submitRouter.post('/submit/:id', userMiddleware, submitCode)
submitRouter.post('/run/:id', userMiddleware, runCode)
submitRouter.get('/get-submissions/:problemId', userMiddleware, getAllSubmissions)

module.exports = submitRouter