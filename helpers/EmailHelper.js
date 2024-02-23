const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const username = "articustomercare@gmail.com";
// require("dotenv").config();

const CLIENT_ID =
  "164909810718-ep2k22ml7tenpg2ds123s7s7j52erggb.apps.googleusercontent.com";
const CLIENT_SECRET = "https://developers.google.com/oauthplayground";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04cto0IPp9UZ3CgYIARAAGAQSNwF-L9IrfRT3dJ16o6hhVZvW5pKrwe631a3EhymplUGvyRhkG4FVYU2O_TNotkC9IsbeBgrA7YU";

// send email
exports.sendMailHelper = async (res, to, subject, body) => {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();

  if (accessToken.token) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: username,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `"Arti.lk" <${username}>`, // sender address
      to,
      subject,
      html: body, // html body
    };

    return transporter.sendMail(mailOptions);
  } else {
    res.status(403).json({
      code: 1100,
      message: "Unauthorized to send mails",
    });
  }
};
