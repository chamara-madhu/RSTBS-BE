const {
  calculateTicketFee,
  myBookingHistory,
  getBookingUsage,
  mySeasonTicket,
  renewSeasonTicket,
  createCheckoutSession,
  activateSeasonTicket,
  getActiveSeasonTicket,
  getRecentSeasonTicket,
} = require("../services/seasonTicketService");

exports.calculateTicketFee = (req, res) => {
  const { distance, start, end } = req.body;
  return calculateTicketFee(distance, start, end, res);
};

exports.createCheckoutSession = (req, res) => {
  const { seasonTicketId, amount } = req.body;
  return createCheckoutSession(seasonTicketId, amount, res);
};

exports.activateSeasonTicket = (req, res) => {
  const { seasonTicketId } = req.body;
  return activateSeasonTicket(seasonTicketId, res);
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

exports.getActiveSeasonTicket = (req, res) => {
  return getActiveSeasonTicket(req.params.userId, res);
};

exports.getRecentSeasonTicket = (req, res) => {
  return getRecentSeasonTicket(req.user.id, res);
};
