const User = require("../models/userModel");
const SeasonTicket = require("../models/seasonTicketModel");

exports.getQR = (userId, res) => {
  User.findOne({ _id: userId })
    .select("_id, qr")
    .then((user) => {
      SeasonTicket.findOne({ userId })
        .populate("applicationId", "fullName address nic phone stations")
        .select("applicationId")
        .then((data) => {
          const obj = {
            fullName: data.applicationId.fullName,
            address: data.applicationId.address,
            nic: data.applicationId.nic,
            phone: data.applicationId.phone,
            stations: data.applicationId.stations,
            qr: user.qr,
          };

          res.status(200).json(obj);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    });
};
