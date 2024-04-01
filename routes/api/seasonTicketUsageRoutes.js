const express = require("express");
const router = express.Router();
const seasonTicketUsageController = require("../../controllers/seasonTicketUsageController");
const { isAuth, isChecker } = require("../../auth-middleware/check");

router.post(
  "/",
  // isAuth, isChecker,
  seasonTicketUsageController.useBooking
);

module.exports = router;
