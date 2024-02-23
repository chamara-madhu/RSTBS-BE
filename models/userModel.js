const mongoose = require("mongoose");
const { USER_ROLES } = require("../config/constant");

const userSchema = mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      default: null,
      trim: true,
    },
    otpExpireAt: {
      type: Date,
      default: null,
      trim: true,
    },
    role: { type: Number, default: USER_ROLES.PASSENGER, required: true },
    qr: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
