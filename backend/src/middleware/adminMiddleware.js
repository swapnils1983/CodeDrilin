const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token missing");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User doesn't exist");
        }
        if (user.role != 'admin') {
            throw new Error("Invalid Credentials")
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Authentication failed: " + error.message);
    }
};

module.exports = adminMiddleware;
