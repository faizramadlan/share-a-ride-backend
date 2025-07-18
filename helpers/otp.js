// helpers/otp.js

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

function otpExpiry(minutes = 5) {
  return new Date(Date.now() + minutes * 60 * 1000); // 5 minutes default
}

module.exports = { generateOTP, otpExpiry }; 