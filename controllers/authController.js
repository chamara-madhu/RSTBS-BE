const {
  userLogin,
  verifyOtp,
  userSignUp,
  checkerLogin,
} = require("../services/authService");

exports.userLogin = (req, res) => {
  return userLogin(req.body.email, res);
};

exports.checkerLogin = (req, res) => {
  return checkerLogin(req.body.email, res);
};

exports.userSignUp = (req, res) => {
  return userSignUp(req.body, res);
};

exports.verifyOtp = (req, res) => {
  return verifyOtp(req.body.email, req.body.otp, res);
};
