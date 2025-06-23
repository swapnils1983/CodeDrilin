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

        // Get all submissions for this contest
        const submissions = await Submission.find({ contest: contestId })
            .populate('user', 'username')
            .populate('problem', 'title');

        // Process submissions to calculate scores
        const leaderboard = {};

        submissions.forEach(sub => {
            if (!leaderboard[sub.user._id]) {
                leaderboard[sub.user._id] = {
                    username: sub.user.username,
                    userId: sub.user._id,
                    problemsSolved: 0,
                    totalTime: 0,
                    problems: {}
                };
            }

            // Only count the first accepted submission
            if (sub.verdict === 'Accepted' && !leaderboard[sub.user._id].problems[sub.problem._id]) {
                leaderboard[sub.user._id].problems[sub.problem._id] = true;
                leaderboard[sub.user._id].problemsSolved += 1;

                // Calculate time penalty (in minutes)
                const contestStart = new Date(contest.startTime).getTime();
                const submissionTime = new Date(sub.submittedAt).getTime();
                const timeInMinutes = Math.floor((submissionTime - contestStart) / (1000 * 60));

                leaderboard[sub.user._id].totalTime += timeInMinutes;
            }
        });

        // Convert to array and sort
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




