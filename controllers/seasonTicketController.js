const {
  calculateTicketFee,
  myBookingHistory,
  getBookingUsage,
} = require("../services/seasonTicketService");

exports.calculateTicketFee = (req, res) => {
  const { distance, start, end } = req.body;
  return calculateTicketFee(distance, start, end, res);
};

exports.myBookingHistory = (req, res) => {
  return myBookingHistory(req.user.id, res);
};

exports.getBookingUsage = (req, res) => {
  return getBookingUsage(req.params.id, res);
};
