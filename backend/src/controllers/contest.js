const Contest = require('../models/Contest');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/user');
const { submitBatch, submitToken, getIdByLanguage } = require('../utils/problemUtils');

const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;

        const createdProblemIds = [];

        for (const problem of problems) {
            const {
                title,
                description,
                difficulty,
                tags,
                visibleTestCases,
                hiddenTestCases,
                startCode,
                referenceSolution
            } = problem;

            for (const { language, completeCode } of referenceSolution) {
                const languageId = getIdByLanguage(language);
                if (!languageId) {
                    return res.status(400).json({ error: `Unsupported language: ${language}` });
                }

                const submissions = visibleTestCases.map(tc => ({
                    source_code: completeCode,
                    language_id: languageId,
                    stdin: tc.input,
                    expected_output: tc.output
                }));
                // console.log(submissions)
                const submitResult = await submitBatch(submissions);
                const tokens = submitResult.map(r => r.token);
                const testResults = await submitToken(tokens);

                for (const result of testResults) {
                    if (result.status_id > 3) {
                        return res.status(400).json({ error: `Test failed for ${language}: ${result.status.description}` });
                    }
                }
            }

            const savedProblem = await Problem.create({
                title,
                ...problem,
                isContestProblem: true,
                problemCreator: req.user._id
            });

            createdProblemIds.push(savedProblem._id);
        }



        const createdContest = await Contest.create({
            title,
            description,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            problems: createdProblemIds,
            isPublished: false
        });

        res.status(201).json({ message: "Contest and Problems Created", createdContest });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


getAllContests = async (req, res) => {
    try {
        const contests = await Contest.find({})
            .sort({ startTime: -1 });
        res.json(contests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('problems', 'title difficulty tags')
            .populate('participants', 'firstName');

        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        res.json(contest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

registerForContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.contestId);
        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        if (new Date() >= new Date(contest.endTime)) {
            return res.status(400).json({ error: 'Contest has already ended' });
        }

        if (contest.participants.includes(req.user._id)) {
            return res.status(400).json({ error: 'Already registered for this contest' });
        }

        contest.participants.push(req.user._id);
        await contest.save();
        res.json({ message: 'Successfully registered for the contest' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};
getLeaderboard = async (req, res) => {
    try {
        const contestId = req.params.contestId;
        const contest = await Contest.findById(contestId);

        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        const submissions = await Submission.find({ contestId })
            .populate('userId', 'firstName lastName')
            .populate('problemId', 'title');

        const leaderboard = {};

        submissions.forEach(sub => {
            if (!sub.userId) return;

            if (!leaderboard[sub.userId._id]) {
                leaderboard[sub.userId._id] = {
                    username: `${sub.userId.firstName} ${sub.userId.lastName || ''}`.trim(),
                    userId: sub.userId._id,
                    problemsSolved: 0,
                    totalTime: 0,
                    problems: {}
                };
            }

            if (sub.status === 'accepted' && !leaderboard[sub.userId._id].problems[sub.problemId._id]) {
                leaderboard[sub.userId._id].problems[sub.problemId._id] = true;
                leaderboard[sub.userId._id].problemsSolved += 1;

                const contestStart = new Date(contest.startTime).getTime();
                const submissionTime = new Date(sub.createdAt).getTime();
                const timeInSeconds = Math.floor((submissionTime - contestStart) / 1000);

                leaderboard[sub.userId._id].totalTime += timeInSeconds;
            }
        });

        const leaderboardArray = Object.values(leaderboard);
        leaderboardArray.sort((a, b) => {
            if (b.problemsSolved !== a.problemsSolved) {
                return b.problemsSolved - a.problemsSolved;
            }
            return a.totalTime - b.totalTime;
        });

        res.json(leaderboardArray);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const isRegisterd = async (req, res) => {
    try {
        const { contestId } = req.params;
        const userId = req.user._id;

        const contest = await Contest.findById(contestId);

        const isExist = contest.participants.includes(userId);

        if (!isExist) {
            return res.status(200).json({ status: false });
        }
        return res.status(200).json({ status: true });

    } catch (error) {
        return res.status(500).json({ status: false });

    }
}

module.exports = { createContest, getAllContests, getContestById, registerForContest, getLeaderboard, isRegisterd }




