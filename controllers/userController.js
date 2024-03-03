const { getQR } = require("../services/userService");

exports.getQR = (req, res) => {
  console.log("req.user.id", req.user.id);
  return getQR(req.user.id, res);
};
