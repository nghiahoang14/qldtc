const mongoose = require('mongoose');

const otpCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 
  }
});

const OtpCode = mongoose.model('OtpCode', otpCodeSchema);
module.exports = OtpCode;