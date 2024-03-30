const moment = require("moment");
const SeasonTicketUsage = require("../models/seasonTicketUsageModel");

exports.useBooking = (seasonTicketId, res) => {
  SeasonTicketUsage.find({
    seasonTicketId,
    date: moment.utc().local().format("YYYY-MM-DD"),
  })
    .then(() => {
      res.status(200).json("Already booked");
    })
    .catch(() => {
      // create new seasonTicketUsage
      const seasonTicketUsage = new SeasonTicketUsage({
        seasonTicketId,
        date: moment.utc().local().format("YYYY-MM-DD"),
      });

      // save to database
      seasonTicketUsage
        .save()
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            code: 1000,
            message: "Season ticket is not added successfully",
          });
        });
    });
};

exports.getAllBookingUsages = (seasonTicketId, res) => {
  return SeasonTicketUsage.find({
    seasonTicketId,
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
