const mongoose = require("mongoose");

const stationSchema = mongoose.Schema(
  {
    station: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Station", stationSchema);
