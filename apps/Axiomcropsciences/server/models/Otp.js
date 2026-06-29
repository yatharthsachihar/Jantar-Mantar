const mongoose = require('mongoose');

// Short-lived OTP records. A TTL index on `expiresAt` makes MongoDB delete
// each document automatically once it expires, so no manual cleanup is needed.
const otpSchema = new mongoose.Schema({
  phone:     { type: String, required: true, index: true }, // full E.164, e.g. +919876543210
  otpHash:   { type: String, required: true },              // hashed OTP, never stored in plain text
  purpose:   { type: String, default: 'auth' },             // login | register | auth
  attempts:  { type: Number, default: 0 },                  // failed verify attempts
  verified:  { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// TTL: Mongo purges the doc at expiresAt.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
