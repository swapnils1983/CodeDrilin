const User = require('../models/user')
const validate = require('../utils/validate')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const register = async (req, res) => {
    try {
        validate(req.body)

        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)
        req.body.role = 'user'
        const user = await User.create(req.body)

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: 'user' }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { httpOnly: true,      
                                    secure: true,       
                                    sameSite: 'none', 
                                    maxAge: 60 * 60 * 1000 })

        res.status(201).json({
            user,
            message: "Registered Successfully!"
        })
    } catch (error) {
        res.status(400).send("Error: " + error)
    }
}


const login = async (req, res) => {
    try {
        const { emailId, password } = req.body
        if (!emailId || !password) {
            throw new Error("Invalid Credentials")
        }

        const user = await User.findOne({ emailId })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error("Invalid Credentials")
        }

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { httpOnly: true,
                                        secure: true,      
                                        sameSite: 'none',   
                                        maxAge: 60 * 60 * 1000 })

        res.status(201).json({
            user,
            message: "Logged In Successfully!"
        })
    } catch (error) {
        res.status(401).send("Error: " + error)
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(500).send("Error during logout: " + error.message);
    }
}


const adminRegister = async (req, res) => {
    try {
        validate(req.body)

        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10)
        req.body.role = 'admin'
        const user = await User.create(req.body)

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: 'admin' }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })

        res.status(201).json({
            user,
            message: "Registered Successfully!"
        })
    } catch (error) {
        res.status(400).send("Error: " + error)
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(201).json({
            user: req.user,
            message: "Registered Successfully!"
        })
    } catch (error) {
        res.status(400).send("Error: " + error)

    }
}
module.exports = { register, login, logout, adminRegister, checkAuth }
