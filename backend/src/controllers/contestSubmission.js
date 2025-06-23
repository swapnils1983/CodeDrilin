const Contest = require("../models/Contest");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/user");
const { getIdByLanguage, submitBatch, submitToken } = require("../utils/problemUtils");
const { emitLeaderboardUpdate } = require("../utils/socketUtils");

/**
 * Recalculates the entire leaderboard for a contest and broadcasts the update.
 * This is a robust method that ensures consistency.
 */
// const updateContestLeaderboard = async (contestId) => {
//     try {
//         // Find the contest and populate participants' info for the leaderboard
//         const contest = await Contest.findById(contestId).populate('participants', 'username').lean();
//         if (!contest) {
//             console.error(`Contest not found for leaderboard update: ${contestId}`);
//             return;
//         }

//         // 1. Fetch ALL submissions for the contest, sorted chronologically.
//         const allSubmissions = await Submission.find({ contestId }).sort({ submittedAt: 'asc' }).lean();

//         // 2. Initialize a map to hold the state for each participant.
//         const leaderboardState = {};
//         contest.participants.forEach(p => {
//             leaderboardState[p._id.toString()] = {
//                 userId: p._id,
//                 username: p.username,
//                 problemsSolved: 0,
//                 totalTime: 0, // Penalty time included, in minutes
//                 problems: {}  // Stores details per problem: { attempts: 0, solved: false, solveTime: 0 }
//             };
//         });

//         // 3. Process each submission to calculate scores.
//         for (const sub of allSubmissions) {
//             const userKey = sub.userId.toString();
//             const problemKey = sub.problemId.toString();

//             // Ensure the user is a valid participant
//             if (!leaderboardState[userKey]) continue;

//             const userProgress = leaderboardState[userKey];
//             // Initialize problem state for the user if it's their first submission for this problem
//             if (!userProgress.problems[problemKey]) {
//                 userProgress.problems[problemKey] = { attempts: 0, solved: false, solveTime: 0 };
//             }

//             const problemProgress = userProgress.problems[problemKey];

//             // Only process submissions for problems that are not yet solved by this user
//             if (!problemProgress.solved) {
//                 if (sub.status === 'accepted') {
//                     problemProgress.solved = true;
//                     userProgress.problemsSolved++;

//                     const solveTimeInMinutes = Math.floor((new Date(sub.submittedAt) - new Date(contest.startTime)) / (1000 * 60));
//                     const penaltyTime = problemProgress.attempts * 20; // 20 min penalty per wrong attempt

//                     problemProgress.solveTime = solveTimeInMinutes;
//                     userProgress.totalTime += solveTimeInMinutes + penaltyTime;
//                 } else {
//                     // This was a wrong attempt before the first correct one
//                     problemProgress.attempts++;
//                 }
//             }
//         }

//         // 4. Convert the state map to a sorted array.
//         const leaderboardArray = Object.values(leaderboardState).sort((a, b) => {
//             if (b.problemsSolved !== a.problemsSolved) {
//                 return b.problemsSolved - a.problemsSolved; // More problems solved is better
//             }
//             return a.totalTime - b.totalTime; // Less total time is better
//         });

//         // 5. Add ranks to the sorted array.
//         leaderboardArray.forEach((entry, index) => {
//             entry.rank = index + 1;
//         });

//         // 6. Cache the new leaderboard in the Contest document and broadcast it.
//         await Contest.findByIdAndUpdate(contestId, { $set: { cachedLeaderboard: leaderboardArray } });
//         emitLeaderboardUpdate(contestId, leaderboardArray);

//     } catch (error) {
//         console.error("Error updating leaderboard:", error);
//     }
// };


const updateContestLeaderboard = async (contestId) => {
    try {
        const contest = await Contest.findById(contestId).populate('participants', 'username').lean();
        if (!contest) {
            console.error(`Contest not found: ${contestId}`);
            return;
        }

        const allSubmissions = await Submission.find({ contestId }).sort({ submittedAt: 'asc' }).lean();

        const leaderboardState = {};
        contest.participants.forEach(p => {
            leaderboardState[p._id.toString()] = {
                userId: p._id,
                username: p.username,
                problemsSolved: 0,
                totalTime: 0,
                problems: {}
            };
        });

        for (const sub of allSubmissions) {
            const userKey = sub.userId.toString();
            const problemKey = sub.problemId.toString();

            if (!leaderboardState[userKey]) continue;

            const userProgress = leaderboardState[userKey];
            if (!userProgress.problems[problemKey]) {
                userProgress.problems[problemKey] = { attempts: 0, solved: false, solveTime: 0 };
            }

            const problemProgress = userProgress.problems[problemKey];

            if (!problemProgress.solved) {
                if (sub.status === 'accepted') {
                    problemProgress.solved = true;
                    userProgress.problemsSolved++;

                    // Ensure dates are valid before calculation
                    const contestStart = new Date(contest.startTime);
                    const submissionTime = new Date(sub.submittedAt);

                    if (!isNaN(contestStart.getTime()) && !isNaN(submissionTime.getTime())) {
                        const solveTimeInMinutes = Math.floor((submissionTime - contestStart) / (1000 * 60));
                        const penaltyTime = problemProgress.attempts * 20;

                        problemProgress.solveTime = solveTimeInMinutes;
                        userProgress.totalTime += solveTimeInMinutes + penaltyTime;
                    }
                } else {
                    problemProgress.attempts++;
                }
            }
        }

        const leaderboardArray = Object.values(leaderboardState).sort((a, b) => {
            if (b.problemsSolved !== a.problemsSolved) {
                return b.problemsSolved - a.problemsSolved;
            }
            return a.totalTime - b.totalTime;
        });

        leaderboardArray.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // Make sure we're saving valid numbers
        const cleanLeaderboard = leaderboardArray.map(entry => ({
            ...entry,
            totalTime: isNaN(entry.totalTime) ? 0 : entry.totalTime,
            problems: Object.fromEntries(
                Object.entries(entry.problems).map(([key, problem]) => [
                    key,
                    {
                        ...problem,
                        solveTime: isNaN(problem.solveTime) ? 0 : problem.solveTime
                    }
                ])
            )
        }));

        await Contest.findByIdAndUpdate(contestId, { $set: { cachedLeaderboard: cleanLeaderboard } });
        emitLeaderboardUpdate(contestId, cleanLeaderboard);

    } catch (error) {
        console.error("Error updating leaderboard:", error);
    }
};

const submitContestProblem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { problemId, contestId } = req.params;
        const { code, language } = req.body;

        if (!userId || !problemId || !contestId || !code || !language) {
            return res.status(400).send("Some fields are missing");
        }

        // Verify contest exists and is ongoing
        const contest = await Contest.findById(contestId);
        if (!contest) {
            return res.status(404).send("Contest not found");
        }

        const currentTime = new Date();
        if (currentTime < contest.startTime || currentTime > contest.endTime) {
            return res.status(400).send("Contest is not currently active");
        }

        // Verify problem is part of the contest and user is registered
        if (!contest.problems.includes(problemId)) {
            return res.status(400).send("Problem is not part of this contest");
        }
        if (!contest.participants.includes(userId)) {
            return res.status(403).send("You are not registered for this contest");
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        // Create submission record
        const submission = await Submission.create({
            userId,
            problemId,
            contestId,
            code,
            language,
            status: 'pending', // Initial status
            testCasesTotal: problem.hiddenTestCases.length,
            submittedAt: currentTime
        });

        // Prepare and submit to judge
        const languageId = getIdByLanguage(language);
        const batchToJudge = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(batchToJudge);
        const resultTokens = submitResult.map((value) => value.token);
        const testResults = await submitToken(resultTokens);

        // Process results
        let testCasesPassed = 0;
        let totalRuntime = 0;
        let maxMemory = 0;
        let finalStatus = 'accepted';
        let errorMessage = null;

        for (const test of testResults) {
            if (test.status_id === 3) { // Accepted
                testCasesPassed++;
                totalRuntime += parseFloat(test.time);
                maxMemory = Math.max(maxMemory, test.memory);
            } else {
                // If any test case fails, the overall status is not 'accepted'
                finalStatus = test.status_id === 4 ? 'error' : 'wrong';
                errorMessage = test.stderr || test.message || "Execution failed";
                break; // Stop checking on the first failure
            }
        }

        // If not all test cases passed, it's a wrong answer
        if (testCasesPassed !== problem.hiddenTestCases.length && finalStatus === 'accepted') {
            finalStatus = 'wrong';
            errorMessage = `Failed on hidden test cases.`;
        }


        // Update submission with results
        submission.testCasesPassed = testCasesPassed;
        submission.runtime = totalRuntime;
        submission.memory = maxMemory;
        submission.status = finalStatus;
        submission.errorMessage = errorMessage;
        await submission.save();

        // If submission was accepted, update leaderboard
        // This is done regardless of whether it's the user's first accept for this problem
        // The leaderboard function is smart enough to handle duplicates.
        await updateContestLeaderboard(contestId);

        // Update user's global solved problems list (optional)
        if (finalStatus === 'accepted') {
            await User.findByIdAndUpdate(userId, { $addToSet: { problemSolved: problemId } });
        }

        res.status(201).json({
            submission,
            contestId,
            problemId,
            userId,
        });

    } catch (error) {
        console.error("Error in submitContestProblem:", error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    submitContestProblem,
    updateContestLeaderboard
};