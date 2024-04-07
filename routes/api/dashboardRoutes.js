const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/dashboardController");
const { isAuth, isAdmin } = require("../../auth-middleware/check");

router.get("/stats/user", isAuth, isAdmin, dashboardController.userStats);

router.get(
  "/stats/pending-applications-and-payments",
  isAuth,
  isAdmin,
  dashboardController.pendingApplicationsAndPayments
);

module.exports = router;
