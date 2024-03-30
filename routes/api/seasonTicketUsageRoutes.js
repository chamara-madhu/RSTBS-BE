const express = require("express");
const router = express.Router();
const seasonTicketUsageController = require("../../controllers/seasonTicketUsageController");
const {
  isAuth,
  isPassenger,
  isChecker,
} = require("../../auth-middleware/check");

router.post("/add", isAuth, isChecker, seasonTicketUsageController.useBooking);

module.exports = router;
