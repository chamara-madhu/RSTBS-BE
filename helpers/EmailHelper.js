const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

exports.sendEmail = (email, otp) => {
  mg.messages
    .create(process.env.MAILGUN_DOMAIN, {
      from: "RSTBS <rstbs@gmail.com>",
      to: [email],
      subject: "OTP for login",
      text: `Your OTP for login is ${otp}`,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
};
