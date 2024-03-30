const mongoose = require("mongoose");

const seasonTicketUsageSchema = mongoose.Schema(
  {
    seasonTicketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seasonTicketUsage",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("seasonTicketUsage", seasonTicketUsageSchema);
