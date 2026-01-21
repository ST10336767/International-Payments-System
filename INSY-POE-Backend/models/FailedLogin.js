const mongoose = require('mongoose');

const FailedLoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String } // Optional: e.g. "Incorrect password"
});

module.exports = mongoose.model('FailedLogin', FailedLoginSchema);