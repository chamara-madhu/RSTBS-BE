const moment = require("moment");
const SeasonTicket = require("../models/seasonTicketModel");
const { getAllBookingUsages } = require("./seasonTicketUsageService");

exports.calculateTicketFee = (distance, start, end, res) => {
  const start_date = moment(start);
  const end_date = moment(end);

  // Calculate the difference in days
  const durationInDays = end_date.diff(start_date, "days");
  const fee = 2.77 * durationInDays * distance;

  res.status(200).json(fee);
};

exports.myBookingHistory = (userId, res) => {
  SeasonTicket.find({ userId })
    .populate("applicationId", "stations")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.mySeasonTicket = (bookingId, res) => {
  SeasonTicket.findOne({ _id: bookingId })
    .populate(
      "applicationId",
      "fullName address nic phone stations nicImages gnCertificate"
    )
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.getBookingUsage = (seasonTicketId, res) => {
  SeasonTicket.findOne({ _id: seasonTicketId })
    .then((data1) => {
      getAllBookingUsages(seasonTicketId)
        .then((data2) => {
          const obj = {
            start: data1.duration.start,
            end: data1.duration.end,
            status: data1.status,
            dates: data2.map((el) => el.date),
          };
          res.status(200).json(obj);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log({ err });
      res.status(400).json(err);
    });
};

exports.renewSeasonTicket = (req, res) => {
  const { start, end, amount } = req.body;

  const sTicket = new SeasonTicket({
    userId: req.user.id,
    // applicationId: data._id,
    duration: {
      start,
      end,
    },
    amount,
  });

  // save to database
  sTicket
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
};
