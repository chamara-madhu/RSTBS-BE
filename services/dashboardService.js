const moment = require("moment");
const { pay } = require("../config/stripe");
const SeasonTicket = require("../models/seasonTicketModel");
const User = require("../models/userModel");
const { getAllBookingUsages } = require("./seasonTicketUsageService");
const { APPLICATION_STATUSES, FLOWS } = require("../config/constant");
const { generateQRCode } = require("./applicationService");

exports.userStats = (res) => {
  User.aggregate([
    { $group: { _id: { role: "$role" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(400).json({ error: "no active users" });
    });
};

exports.pendingApplicationsAndPayments = async (res) => {
  try {
    const pendingApp = await SeasonTicket.countDocuments({
      status: APPLICATION_STATUSES.APPLICATION_PENDING,
    });
    const pendingPay = await SeasonTicket.countDocuments({
      status: APPLICATION_STATUSES.PAYMENT_APPROVAL_PENDING,
    });

    res.status(200).json([
      {
        status: "Pending application approvals",
        count: pendingApp,
      },
      {
        status: "Pending payment approvals",
        count: pendingPay,
      },
    ]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error occurred while retrieving data" });
  }
};
