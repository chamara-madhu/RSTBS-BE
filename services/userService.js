const User = require("../models/userModel");

exports.getQR = (userId, res) => {
  User.findOne({ _id: userId })
    .select("_id, qr")
    .then((user) => {
      res.status(200).json(user);
    });
};
