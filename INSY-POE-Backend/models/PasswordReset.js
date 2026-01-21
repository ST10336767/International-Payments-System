const mongoose = require('mongoose');

/**
 * Password Reset Schema
 * Stores reset tokens and OTPs for password reset functionality
 */
const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    resetToken: {
        type: String,
        required: false, // Optional - only for token-based reset
        index: true
    },
    otp: {
        type: String,
        required: false, // Optional - only for OTP-based reset
        index: true
    },
    resetMethod: {
        type: String,
        enum: ['token', 'otp'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // Auto-delete expired documents
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient lookups
passwordResetSchema.index({ email: 1, resetToken: 1 });
passwordResetSchema.index({ email: 1, otp: 1 });
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);