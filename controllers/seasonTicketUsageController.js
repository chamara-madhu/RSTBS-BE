const { useBooking } = require("../services/seasonTicketUsageService");

exports.useBooking = (req, res) => {
  return useBooking(req.body.seasonTicketId, res);
};
