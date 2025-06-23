const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware')
const { solveDoubt } = require('../controllers/aiChat')

router.post('/chat', userMiddleware, solveDoubt);

module.exports = router;