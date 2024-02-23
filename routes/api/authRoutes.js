const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const { isAuth } = require("../../auth-middleware/check");

router.post("/login", authController.userLogin);

router.post("/sign-up", authController.userSignUp);

router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
