const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { body } = require("express-validator");
const User = require('../models/user');
const isAuth = require("../middlewares/auth").auth;

router.post(
    "/signup",
    [
        body("email", "Please enter a valid email")
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject("Email address already exists");
                    }
                });
            })
            .normalizeEmail(),
        body("fullName", "fullName must be greater than 5 characters").isLength({ min: 5 }).trim().not().isEmpty(),
        body("password", "Password must be greater than 5 characters").isLength({ min: 5 }).trim(),
    ],
    userController.signup
);


router.post("/login", userController.login);
router.get("/logout", isAuth, userController.logout);
router.get("/loginHistory", isAuth, userController.loginHistory);


module.exports = router;


