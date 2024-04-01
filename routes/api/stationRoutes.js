const express = require("express");
const router = express.Router();
const stationController = require("../../controllers/stationController");
const { isAuth, isPassenger } = require("../../auth-middleware/check");

router.post(
  "/",
  // isAuth,
  // isPassenger,
  stationController.createStation
);

router.get(
  "/",
  //  isAuth, isPassenger,
  stationController.getAllStations
);

module.exports = router;
