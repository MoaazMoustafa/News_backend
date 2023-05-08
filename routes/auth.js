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
            .custom(async value => {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw new Error('Email address already exists');
                }
                // return true;
            })
            .normalizeEmail(),
        body("fullName", "fullName must be greater than 5 characters").isLength({ min: 5 }).trim().not().isEmpty(),
        body("password", "Password must be greater than 5 characters").isLength({ min: 5 }).trim(),
        body('passwordConfirmation').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }

            return true;
        })
    ],
    userController.signup
);


router.post("/login", userController.login);
router.get("/logout", isAuth, userController.logout);
router.get("/loginHistory", isAuth, userController.loginHistory);


module.exports = router;


