const { body } = require('express-validator');
const { PASSWORD_REGEX } = require('./validator');

// Email validation for password reset request
const emailField = body('email')
    .isString()
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail();

// Reset method validation
const resetMethodField = body('resetMethod')
    .optional()
    .isIn(['token', 'otp'])
    .withMessage('Reset method must be either "token" or "otp"');

// Token validation
const tokenField = body('token')
    .isString()
    .trim()
    .notEmpty().withMessage('Reset token is required')
    .isLength({ min: 20 }).withMessage('Invalid reset token format');

// OTP validation (6-digit code)
const otpField = body('otp')
    .isString()
    .trim()
    .notEmpty().withMessage('OTP is required')
    .matches(/^\d{6}$/).withMessage('OTP must be exactly 6 digits');

// New password validation
const newPasswordField = body('newPassword')
    .isString()
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(PASSWORD_REGEX).withMessage('Password must be at least 8 characters and contain both letters and numbers');

// Password reset request rules
const requestResetRules = [
    emailField,
    resetMethodField
];

// Password reset verification rules (for token)
const verifyTokenRules = [
    emailField,
    tokenField
];

// Password reset verification rules (for OTP)
const verifyOTPRules = [
    emailField,
    otpField
];

// Password reset completion rules (accepts either token or OTP)
const resetPasswordRules = [
    emailField,
    newPasswordField,
    body('token')
        .optional()
        .isString()
        .trim()
        .notEmpty().withMessage('Reset token is required if using token method'),
    body('otp')
        .optional()
        .isString()
        .trim()
        .matches(/^\d{6}$/).withMessage('OTP must be exactly 6 digits'),
    body().custom((value) => {
        if (!value.token && !value.otp) {
            throw new Error('Either token or OTP must be provided');
        }
        return true;
    })
];

module.exports = {
    requestResetRules,
    verifyTokenRules,
    verifyOTPRules,
    resetPasswordRules
};

