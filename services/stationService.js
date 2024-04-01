const Station = require("../models/stationModel");

exports.createStation = (req, res) => {
  const station = new Station({
    station: req.body.station,
  });

  // save to database
  station
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        code: 1000,
        message: "Station is not added successfully",
      });
    });
};

exports.getAllStations = (res) => {
  Station.find()
    .sort("station ASC")
    .select("station -_id")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};
