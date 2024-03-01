const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../models/userModel");
const { secretOfKey } = require("../config/constant");
const { USER_ROLES } = require("../config/constant");
const { sendEmail } = require("../helpers/EmailHelper");

exports.userLogin = (email, res) => {
  User.findOne({ email })
    .exec()
    .then((user) => {
      // Generate four random numbers OTP
      const otp = Math.floor(1000 + Math.random() * 9000); // "0000";

      // check email is already exist or not
      if (user) {
        user.otp = otp.toString();
        user.otpExpireAt = moment().add(5, "minutes").toDate();

        user
          .save()
          .then(async () => {
            // send email
            await sendEmail("nlc.madhushanka@gmail.com", otp.toString());

            res
              .status(200)
              .json({ message: "OTP has been sent to the given email" });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(400)
              .json({ code: 1100, message: "User is not updated" });
          });
      } else {
        res.status(400).json({ code: 1100, message: "User is not exist" });
      }
    });
};

exports.userSignUp = (data, res) => {
  const { fName, lName, email } = data;

  User.findOne({ email: email })
    .exec()
    .then((user) => {
      // Generate four random numbers OTP
      const otp = "0000"; // Math.floor(1000 + Math.random() * 9000);

      // check email is already exist or not
      if (user) {
        res
          .status(400)
          .json({ code: 1100, message: "Email already exists. Please login." });
      } else {
        // create new user object
        const user = new User({
          fName,
          lName,
          email,
          role: USER_ROLES.PASSENGER,
          otp: otp.toString(),
          otpExpireAt: moment().add(5, "minutes").toDate(),
        });

        // save to the database
        user
          .save()
          .then(async () => {
            // send email
            await sendEmail("nlc.madhushanka@gmail.com", otp.toString());

            res
              .status(200)
              .json({ message: "OTP has been sent to the given email" });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({ code: 1100, message: "User is not added" });
          });
      }
    });
};

exports.verifyOtp = (email, otp, res) => {
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user.otp === otp) {
        if (!moment(user.otpExpireAt).isAfter(moment())) {
          res.status(400).json({ code: 1100, message: "OTP has expired" });
        } else {
          user.otp = null;
          user.otpExpireAt = null;

          user
            .save()
            .then(() => {
              const token = jwt.sign(
                {
                  id: user._id,
                  role: user.role,
                },
                secretOfKey,
                {
                  expiresIn: "30d",
                }
              );

              const userObj = {
                email: user.email,
                role: user.role,
              };

              res.status(200).json({ token, user: userObj });
            })
            .catch((err) => {
              console.log(err);
              res
                .status(400)
                .json({ code: 1100, message: "User is not updated" });
            });
        }
      } else {
        res.status(400).json({ code: 1100, message: "Invalid OTP" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ code: 1100, message: "Invalid OTP" });
    });
};
