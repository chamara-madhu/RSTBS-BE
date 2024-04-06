exports.secretOfKey = "RSTRSsecretkey";

exports.USER_ROLES = {
  ADMIN: 0,
  PASSENGER: 1,
  CHECKER: 2,
};

exports.APPLICATION_STATUSES = {
  APPLICATION_PENDING: 0,
  PAYMENT_PENDING: 1,
  PAYMENT_APPROVAL_PENDING: 2,
  APPLICATION_REJECTED: 3,
  ACTIVE: 4,
  PAYMENT_REJECTED: 5,
};

exports.FLOWS = {
  APPLY: "Applied for season ticket",
  APPLICATION_APPROVED: "Application accepted",
  APPLICATION_REJECTED: "Application rejected",
  APPLICATION_RE_SUBMITTED: "Application re-submitted",
  BANK_DEPOSIT_SLIP_UPLOADED_FOR_APPROVAL:
    "Bank deposit slip uploaded for approval",
  PAYMENT_APPROVED: "Payment approved",
  PAYMENT_REJECTED: "Payment rejected",
  SEASON_TICKET_ACTIVATED_AND_QR_GENERATED:
    "Season ticket activated and QR code generated",
  PAYMENT_RE_SUBMITTED: "Payment re-submitted",
};
