const {
  applyForSeasonTicket,
  acceptOrRejectApplication,
  getAllApplications,
  getAnApplication,
  generateQRCode,
  myBookingHistory,
  getPendingApplications,
  getAnApplicationForReview,
} = require("../services/applicationService");

exports.applyForSeasonTicket = (req, res) => {
  return applyForSeasonTicket(req, res);
};

exports.acceptOrRejectApplication = (req, res) => {
  const { id, status, note } = req.body;

  return acceptOrRejectApplication(id, status, note, res);
};

exports.getAllApplications = (req, res) => {
  return getAllApplications(res);
};

exports.myBookingHistory = (req, res) => {
  return myBookingHistory(req.user.id, res);
};

exports.getPendingApplications = (req, res) => {
  return getPendingApplications(res);
};

exports.getAnApplicationForReview = (req, res) => {
  return getAnApplicationForReview(req.params.id, res);
};

exports.getAnApplication = (req, res) => {
  return getAnApplication(req.params.id, res);
};

exports.generateQRCode = (req, res) => {
  const { userId } = req.body;

  return generateQRCode(userId, res);
};
