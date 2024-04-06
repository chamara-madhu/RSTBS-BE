const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

router.post("/login", authController.userLogin);

router.post("/checker-login", authController.checkerLogin);

router.post("/sign-up", authController.userSignUp);

router.post("/verify-otp", authController.verifyOtp);

module.exports = router;
