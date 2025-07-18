const logger = require("./logger");
const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "me@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

function sendMailWithLogging(details, callback) {
  mailTransporter.sendMail(details, (err, info) => {
    if (err) {
      logger.error("Email send failed", err);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
    if (callback) callback(err, info);
  });
}

module.exports = { mailTransporter, sendMailWithLogging };