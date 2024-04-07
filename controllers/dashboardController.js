const {
  userStats,
  pendingApplicationsAndPayments,
} = require("../services/dashboardService");

exports.userStats = (req, res) => {
  return userStats(res);
};

exports.pendingApplicationsAndPayments = (req, res) => {
  return pendingApplicationsAndPayments(res);
};
