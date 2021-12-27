const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
var nodemailer = require('nodemailer');
const User = require("../model/User");
const auth = require("../middleware/auth");
const mail = require("../transporter/transporter");


/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        }),
        check("otpverified", "Please enter a otp verified status")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            username,
            email,
            password,
            otpverified,
            otp
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            user = new User({
                username,
                email,
                password,
                otpverified,
                otp
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.otp = await Math.floor(1000 + Math.random() * 9000);

            await user.save();

            res.status(200).json({
                status: "User created successfully"
            });
            mail.main(user).catch(console.error);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);
router.post(
    "/verifyotp",
    [
        check("email", "Please enter a valid email for otp verification").isEmail(),
        check("otp", "Please Enter a Valid Username")
            .not()
            .isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const {
            email,
            otp,
            otpverified
        } = req.body;

        try {
            let user = await User.findOne({
                email, otp
            });
            if (!user) {
                return res.status(400).json({
                    msg: "Credentials mismatched!!!"
                });
            }
            await User.updateOne({
                "email": email,
                "otp": otp
            }, {
                "otpverified": 'YES'
            });

            res.status(200).json({
                status: "OTP verified successfully"
            });

        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);
router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password, otpverified = 'YES' } = req.body;
        try {
            let user = await User.findOne({
                email, otpverified
            });

            if (!user)
                return res.status(400).json({
                    message: "User Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            var signedtoken = auth.signtoken(user.id)
            res.status(200).json({
                "status": "Logged In successfully",
                "token": signedtoken
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);
/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */


router.post("/getuserdetail", auth.verifytoken, async (req, res) => {
    try {
        // request.user is getting fetched from Middleware after token authentication
        console.log(req.user)
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});
module.exports = router;
