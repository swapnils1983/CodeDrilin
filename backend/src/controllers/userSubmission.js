const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/user");
const { getIdByLanguage, submitBatch, submitToken } = require("../utils/problemUtils");


const submitCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;

        const { code, language } = req.body

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Some field Missing")
        }

        const problem = await Problem.findById(problemId)

        const submitedresult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length
        })

        const languageId = getIdByLanguage(language)

        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }))
        const submitResult = await submitBatch(submissions)
        const resultToken = submitResult.map((value) => value.token)
        const testResult = await submitToken(resultToken)

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory)
            }
            else {
                if (test.status_id == 4) {
                    status = 'error'
                    errorMessage = test.stderr
                }
                else {
                    status = 'wrong'
                    errorMessage = test.stderr
                }
            }
        }

        submitedresult.testCasesPassed = testCasesPassed
        submitedresult.runtime = runtime
        submitedresult.memory = memory
        submitedresult.status = status
        submitedresult.errorMessage = errorMessage

        await submitedresult.save();

        const user = await User.findById(req.user._id);
        if (status === 'accepted') {
            const user = await User.findById(req.user._id);
            if (!user.problemSolved.includes(problemId)) {
                user.problemSolved.push(problemId);
                await user.save();
            }
        }
        res.status(201).send(submitedresult);
    } catch (error) {
        res.status(500).send("Error: " + error)
    }
}



const runCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;

        const { code, language } = req.body

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Some field Missing")
        }

        const problem = await Problem.findById(problemId)
        // console.log(problem)

        const languageId = getIdByLanguage(language)

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }))
        const submitResult = await submitBatch(submissions)
        const resultToken = submitResult.map((value) => value.token)
        const testResult = await submitToken(resultToken)
        // console.log(testResult)
        res.status(201).send(testResult)
    } catch (error) {
        res.status(500).send("Error: " + error);
        console.log(error)

    }
}


const getAllSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;
        let problemId = req.params.problemId;

        if (problemId.startsWith(':')) {
            problemId = problemId.substring(1);
        }
        // console.log(problemId)
        const submissions = await Submission.find({
            userId,
            problemId
        });
        if (!submissions) {
            return res.status(400).json({ message: "No submissions found" })
        }

        res.status(200).json(submissions)
    } catch (error) {
        // console.log(error)
        return res.status(500).json(error)

    }
}

module.exports = { submitCode, runCode, getAllSubmissions }