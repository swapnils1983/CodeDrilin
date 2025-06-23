const express = require("express")
const { register, login, logout, adminRegister, checkAuth } = require("../controllers/userAuth")
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', userMiddleware, logout)
authRouter.post('/admin/register', adminMiddleware, adminRegister)
authRouter.get('/check-auth', userMiddleware, checkAuth)
// authRouter.get('/getProfile', getProfile)


module.exports = authRouter