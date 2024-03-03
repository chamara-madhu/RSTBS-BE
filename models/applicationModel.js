const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    nic: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    stations: {
      origin: { type: String, required: true, trim: true },
      destination: { type: String, required: true, trim: true },
    },
    nicImages: {
      fs: { type: String, required: true, trim: true },
      bs: { type: String, required: true, trim: true },
    },
    gnCertificate: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
