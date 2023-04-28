const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient({ host: "redis-server" });

const User = require("../models/user");
const config = require("../config");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then((hashedpwd) => {
            const user = new User({
                email: email,
                fullName: fullName,
                password: hashedpwd,
            });
            return user.save();
        })
        .then((result) => {
            res
                .status(201)
                .json({ message: "user created successfuly", userId: result._id });
        })
        .catch((err) => next(err));
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                loadedUser.loginHistory.push({
                    ipAddress: req.ip,
                    userAgent: req.headers["user-agent"],
                    status: "failed",
                });
                loadedUser.save();
                const error = new Error("login failed");
                error.statusCode = 401;
                throw error;
            }
            loadedUser.loginHistory.push({
                ipAddress: req.ip,
                userAgent: req.headers["user-agent"],
                status: "success",
            });
            loadedUser.save();
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString(),
                },
                config.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString() });
        })
        .catch((err) => next(err));
};

exports.loginHistory = (req, res, next) => {
    User.findById(req.user._id)
        .then((user) => {
            const loginHistory = user?.loginHistory;
            res.status(200).json({
                loginHistory,
            });
        })
        .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        client.rpush("blackListTokens", authorization);
        return res.status(200).json({ message: "logedout" });
    } catch (err) {
        next(err);
    }
};
