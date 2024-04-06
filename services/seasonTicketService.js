const moment = require("moment");
const { pay } = require("../config/stripe");
const stripe = require("stripe")(pay.STRIPE_SECRET_KEY);
const SeasonTicket = require("../models/seasonTicketModel");
const { getAllBookingUsages } = require("./seasonTicketUsageService");
const { APPLICATION_STATUSES, FLOWS } = require("../config/constant");
const { generateQRCode } = require("./applicationService");

exports.calculateTicketFee = (distance, start, end, res) => {
  const start_date = moment(start);
  const end_date = moment(end);

  // Calculate the difference in days
  const durationInDays = end_date.diff(start_date, "days");
  const fee = 2.77 * durationInDays * distance;

  res.status(200).json(fee);
};

exports.createCheckoutSession = (seasonTicketId, amount, res) => {
  stripe.checkout.sessions.create(
    {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "LKR",
            product_data: {
              name: "Season Ticket Fee",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1, // Set the quantity of this item
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/success/${seasonTicketId}`,
      cancel_url: `http://localhost:3000/booking/payments/${seasonTicketId}`,
    },
    (err, session) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create checkout session" });
      } else {
        res.status(200).json({ sessionId: session.id });
      }
    }
  );
};

exports.activateSeasonTicket = (seasonTicketId, res) => {
  SeasonTicket.findOne({ _id: seasonTicketId })
    .populate("applicationId", "nic")
    .then((sTicket) => {
      sTicket.status = APPLICATION_STATUSES.ACTIVE;
      sTicket.note = null;
      (sTicket.flow = [
        ...sTicket.flow,
        {
          name: FLOWS.PAYMENT_APPROVED,
        },
        {
          name: FLOWS.SEASON_TICKET_ACTIVATED_AND_QR_GENERATED,
        },
      ]),
        console.log({ sTicket });

      sTicket
        .save()
        .then(() => {
          generateQRCode(sTicket.userId.toString(), res);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

exports.myBookingHistory = (userId, res) => {
  SeasonTicket.find({ userId })
    .populate("applicationId", "stations")
    .sort({ "duration.end": -1 })
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
            flow: data1.flow,
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
  const { start, end, amount, applicationId, km } = req.body;

  const sTicket = new SeasonTicket({
    userId: req.user.id,
    applicationId,
    duration: {
      start,
      end,
    },
    amount,
    km,
    status: APPLICATION_STATUSES.PAYMENT_PENDING,
    flow: [
      {
        name: FLOWS.APPLY_FOR_RENEW,
      },
    ],
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

exports.getActiveSeasonTicket = (userId, res) => {
  const currentDate = moment(); // Get current date

  SeasonTicket.findOne({
    userId,
    status: APPLICATION_STATUSES.ACTIVE,
    "duration.start": { $lte: currentDate }, // Check if current date is after or equal to start date
    "duration.end": { $gte: currentDate }, // Check if current date is before or equal to end date
  })
    .populate("applicationId", "stations")
    .select("applicationId duration status")
    .then((data) => {
      console.log({ data });
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        code: 1000,
        message: "No active season tickets",
      });
    });
};

exports.getRecentSeasonTicket = (userId, res) => {
  SeasonTicket.find({ userId })
    .sort({ "duration.end": -1 }) // Sort by end date in descending order
    .limit(1) // Limit the result to 1
    .select("duration km applicationId")
    .then((data) => {
      console.log({ data });
      if (data.length > 0) {
        res.status(200).json(data[0]); // Send the first (most recent) season ticket
      } else {
        res.status(400).json({
          code: 1100,
          message: "No season tickets found for the user",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        code: 1000,
        message: "Error retrieving season tickets",
      });
    });
};
