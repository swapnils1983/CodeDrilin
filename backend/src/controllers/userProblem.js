const Problem = require("../models/problem");
const User = require("../models/user")
const { getIdByLanguage, submitBatch, submitToken } = require("../utils/problemUtils")

const createProblem = async (req, res) => {
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;

    try {
        if (!referenceSolution || !Array.isArray(referenceSolution)) {
            return res.status(400).send("Reference solutions are required");
        }

        for (const solution of referenceSolution) {
            const { language, completeCode } = solution;

            if (!language || !completeCode) {
                return res.status(400).send("Each reference solution must have language and completeCode");
            }

            const languageId = getIdByLanguage(language);
            if (!languageId) {
                return res.status(400).send(`Unsupported language: ${language}`);
            }

            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            console.log("Submitting:", submissions);

            const submitResult = await submitBatch(submissions);
            console.log("Submission result:", submitResult);

            const resultTokens = submitResult.map((value) => value.token);
            const testResults = await submitToken(resultTokens);

            for (const test of testResults) {
                if (test.status_id > 3) {
                    return res.status(400).send(`Test failed for ${language}: ${test.status.description}`);
                }
            }
        }

        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.user._id
        });

        res.status(200).json({ message: "Problem Saved Successfully", problem: userProblem });
    } catch (error) {
        console.error("Error creating problem:", error);
        res.status(500).send(`Error: ${error.message}`);
    }
};

const updateProblem = async (req, res) => {
    const { id } = req.params
    const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body
    try {
        if (!id) {
            return res.status(400).send("Missing Id")
        }

        const isExist = await Problem.findById(id)
        if (!isExist) {
            return res.status(404).send("Id dosen't Exists")
        }

        for (const { language, completeCode } of referenceSolution) {

            const languageId = getIdByLanguage(language)

            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }))
            // console.log(`submission: ` + submissions)
            const submitResult = await submitBatch(submissions)
            // console.log("submitResult: " + submitResult)
            const resultToken = submitResult.map((value) => value.token)
            // console.log("resultToken: " + resultToken)
            const testResult = await submitToken(resultToken)
            // console.log("testResult: " + testResult)
            for (const test of testResult) {
                if (test.status_id > 3) {
                    return res.status(400).send("Error occured: " + test.status_id)
                }
            }
        }

        const updatedProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true })

        res.status(200).send(updatedProblem)
    } catch (error) {
        res.status(400).send("Error: " + error)
        console.log(error)
    }
}

const deleteProblem = async (req, res) => {
    const { id } = req.params
    try {
        if (!id) {
            return res.status(400).send("Id is Missing")
        }

        const isExist = await Problem.findById(id)
        if (!isExist) {
            return res.status(404).send("Id dosent exists")
        }

        const deletedProblem = await Problem.findByIdAndDelete(id);

        res.status(200).send("Deleted Successfully")
    } catch (error) {
        res.status(400).send("Error: " + error)
    }
}

const getProblemById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).send("Id is Missing")
        }

        const isExist = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution')
        if (!isExist) {
            return res.status(404).send("Id dosent exists")
        }

        res.status(200).send(isExist)
    } catch (error) {
        res.status(500).send("Error: " + error)
    }
}

const getAllProblem = async (req, res) => {
    try {
        const allProblems = await Problem.find({ isContestProblem: false }).select('_id title difficulty tags')
        if (allProblems.length == 0) {
            return res.status(404).send("No Problems Exists")
        }
        return res.status(200).send(allProblems)
    } catch (error) {
        res.status(500).send("Error: " + error)

    }
}

const solvedAllProblembyUser = async (req, res) => {
    try {
        const userid = req.user._id
        const user = await User.findById(userid).populate({
            path: 'problemSolved',
            select: '_id title difficulty tags'
        })

        res.status(200).send(user.problemSolved)
    } catch (error) {
        res.status(500).send("Error: " + error)

    }
}
module.exports = { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser }