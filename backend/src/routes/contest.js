const express = require('express');
const { getAllContests, getContestById, createContest, registerForContest, getLeaderboard, isRegisterd } = require('../controllers/contest');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const { submitContestProblem } = require('../controllers/contestSubmission');

const router = express.Router();


router.get('/', getAllContests);
router.get('/:id', getContestById);



router.post('/create', adminMiddleware, createContest);
router.post('/:contestId/register', userMiddleware, registerForContest);
router.get('/check/is-registered/:contestId', userMiddleware, isRegisterd)

router.post('/:contestId/submit/:problemId', userMiddleware, submitContestProblem);

// router.post('/:contestId/submit', submitSolution);
// router.get('/:contestId/submissions', getContestSubmissions);
// router.get('/:contestId/my-submissions', getUserContestSubmissions);

module.exports = router;