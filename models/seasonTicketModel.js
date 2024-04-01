const mongoose = require("mongoose");
const { APPLICATION_STATUSES } = require("../config/constant");

const seasonTicketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    duration: {
      start: { type: Date },
      end: { type: Date },
    },
    amount: { type: Number, required: true, trim: true },
    km: { type: Number, required: true, trim: true },
    status: { type: Number, default: APPLICATION_STATUSES.APPLICATION_PENDING },
    note: { type: String, default: null },
    bankSlipImage: { type: String, default: null },
    isApplicationResubmission: { type: Boolean, default: false },
    isPaymentResubmission: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SeasonTicket", seasonTicketSchema);
