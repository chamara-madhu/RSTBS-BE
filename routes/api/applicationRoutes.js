const express = require("express");
const router = express.Router();
const applicationController = require("../../controllers/applicationController");
const { isPassenger, isAuth, isAdmin } = require("../../auth-middleware/check");

router.post(
  "/apply",
  isAuth,
  isPassenger,
  applicationController.applyForSeasonTicket
);

router.post(
  "/accept-or-reject-application",
  //   isAuth,
  //   isAdmin,
  applicationController.acceptOrRejectApplication
);

router.get("/", isAuth, isAdmin, applicationController.getAllApplications);

router.get("/my", isAuth, isPassenger, applicationController.myBookingHistory);

router.get("/:id", isAuth, applicationController.getAnApplication);

router.post(
  "/generate-qr-code",
  //   isAuth,
  //   isAdmin,
  applicationController.generateQRCode
);

module.exports = router;
