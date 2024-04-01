const express = require("express");
const router = express.Router();
const seasonTicketController = require("../../controllers/seasonTicketController");
const { isAuth, isPassenger } = require("../../auth-middleware/check");

router.post(
  "/fee",
  isAuth,
  isPassenger,
  seasonTicketController.calculateTicketFee
);

router.get("/my", isAuth, isPassenger, seasonTicketController.myBookingHistory);

router.get("/:id", isAuth, isPassenger, seasonTicketController.mySeasonTicket);

router.get(
  "/usage/:id",
  isAuth,
  isPassenger,
  seasonTicketController.getBookingUsage
);

router.post(
  "/renew",
  isAuth,
  isPassenger,
  seasonTicketController.renewSeasonTicket
);

module.exports = router;
