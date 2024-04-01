const { createStation, getAllStations } = require("../services/stationService");

exports.createStation = (req, res) => {
  return createStation(req, res);
};

exports.getAllStations = (req, res) => {
  return getAllStations(res);
};
