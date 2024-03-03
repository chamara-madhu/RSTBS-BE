const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const { isAuth, isPassenger } = require("../../auth-middleware/check");

router.get("/", isAuth, isPassenger, userController.getQR);

module.exports = router;
