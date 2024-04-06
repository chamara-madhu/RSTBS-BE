const {
  applyForSeasonTicket,
  acceptOrRejectApplication,
  getAllApplications,
  getAnApplication,
  getPendingApplications,
  getAnApplicationForReview,
  getPendingPaymentInfo,
  uploadBankSlip,
  getPendingPaymentApprovals,
  getAnApplicationForPaymentApprovalReview,
  acceptOrRejectPayment,
  updateSeasonTicket,
  generateQRCode,
} = require("../services/applicationService");

exports.applyForSeasonTicket = (req, res) => {
  return applyForSeasonTicket(req, res);
};

exports.updateSeasonTicket = (req, res) => {
  return updateSeasonTicket(req, res);
};

exports.acceptOrRejectApplication = (req, res) => {
  const { id, status, note } = req.body;

  return acceptOrRejectApplication(id, status, note, res);
};

exports.getAllApplications = (req, res) => {
  return getAllApplications(res);
};

exports.getPendingApplications = (req, res) => {
  return getPendingApplications(res);
};

exports.getPendingPaymentApprovals = (req, res) => {
  return getPendingPaymentApprovals(res);
};

exports.getAnApplicationForReview = (req, res) => {
  return getAnApplicationForReview(req.params.id, res);
};

exports.getAnApplicationForPaymentApprovalReview = (req, res) => {
  return getAnApplicationForPaymentApprovalReview(req.params.id, res);
};

exports.getAnApplication = (req, res) => {
  return getAnApplication(req.params.id, res);
};

exports.getPendingPaymentInfo = (req, res) => {
  return getPendingPaymentInfo(req.params.id, res);
};

exports.uploadBankSlip = (req, res) => {
  return uploadBankSlip(req, res);
};

exports.acceptOrRejectPayment = (req, res) => {
  const { id, status, note } = req.body;

  return acceptOrRejectPayment(id, status, note, res);
};

exports.generateQRCode = (req, res) => {
  const { userId } = req.body;

  return generateQRCode(userId, res);
};
