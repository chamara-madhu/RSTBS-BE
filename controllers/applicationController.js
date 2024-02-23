const {
  applyForSeasonTicket,
  acceptOrRejectApplication,
  getAllApplications,
  getAnApplication,
  generateQRCode,
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

exports.getAnApplication = (req, res) => {
  return getAnApplication(req.params.id, res);
};

exports.generateQRCode = (req, res) => {
  const { userId } = req.body;

  return generateQRCode(userId, res);
};
