const {
  calculateTicketFee,
  myBookingHistory,
  getBookingUsage,
  mySeasonTicket,
  renewSeasonTicket,
} = require("../services/seasonTicketService");

exports.calculateTicketFee = (req, res) => {
  const { distance, start, end } = req.body;
  return calculateTicketFee(distance, start, end, res);
};

exports.myBookingHistory = (req, res) => {
  return myBookingHistory(req.user.id, res);
};

exports.mySeasonTicket = (req, res) => {
  return mySeasonTicket(req.params.id, res);
};

exports.getBookingUsage = (req, res) => {
  return getBookingUsage(req.params.id, res);
};

exports.renewSeasonTicket = (req, res) => {
  return renewSeasonTicket(req, res);
};
