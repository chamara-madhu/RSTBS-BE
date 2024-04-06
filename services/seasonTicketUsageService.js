const moment = require("moment");
const SeasonTicketUsage = require("../models/seasonTicketUsageModel");

exports.useBooking = (seasonTicketId, res) => {
  SeasonTicketUsage.find({
    seasonTicketId,
    date: moment.utc().local().format("YYYY-MM-DD"),
  })
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json("Already used");
      } else {
        // create new seasonTicketUsage
        const seasonTicketUsage = new SeasonTicketUsage({
          seasonTicketId,
          date: moment.utc().local().format("YYYY-MM-DD"),
        });

        // save to database
        seasonTicketUsage
          .save()
          .then((data3) => {
            res.status(200).json(data3);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              code: 1000,
              message: "Usage is not added successfully",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        code: 1000,
        message: "Season tickets usage error",
      });
    });
};

exports.getAllBookingUsages = (seasonTicketId) => {
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
