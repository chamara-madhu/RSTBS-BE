const moment = require("moment");
const SeasonTicketUsage = require("../models/seasonTicketUsageModel");
const SeasonTicket = require("../models/seasonTicketModel");
const { APPLICATION_STATUSES } = require("../config/constant");

exports.useBooking = (userId, res) => {
  SeasonTicket.findOne({ userId, status: APPLICATION_STATUSES.ACTIVE })
    .then((data1) => {
      SeasonTicketUsage.find({
        seasonTicketId: data1._id,
        date: moment.utc().local().format("YYYY-MM-DD"),
      })
        .then((data2) => {
          console.log({ data2 });
          if (data2.length > 0) {
            res.status(200).json("Already used");
          } else {
            // create new seasonTicketUsage
            const seasonTicketUsage = new SeasonTicketUsage({
              seasonTicketId: data1._id,
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
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        code: 1000,
        message: "No active season tickets",
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
