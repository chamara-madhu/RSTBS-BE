const express = require("express");
const router = express.Router();
const seasonTicketController = require("../../controllers/seasonTicketController");
const {
  isAuth,
  isPassenger,
  isChecker,
} = require("../../auth-middleware/check");

router.post(
  "/fee",
  isAuth,
  isPassenger,
  seasonTicketController.calculateTicketFee
);

router.post(
  "/create-checkout-session",
  isAuth,
  isPassenger,
  seasonTicketController.createCheckoutSession
);

router.post(
  "/active",
  isAuth,
  isPassenger,
  seasonTicketController.activateSeasonTicket
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

router.get(
  "/active/:userId",
  // isAuth,
  // isChecker,
  seasonTicketController.getActiveSeasonTicket
);

module.exports = router;
