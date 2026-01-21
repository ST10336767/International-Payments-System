const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { validationResult } = require('express-validator');
const { sendPasswordResetOTP, sendPasswordResetLink } = require('../src/utils/emailService');
// Simple error response helper
const createErrorResponse = (message, code = 'ERROR', field = null) => {
    const error = { message, code };
    if (field) error.field = field;
    return { success: false, error };
};

/**
 * Request password reset - generates token or OTP
 */
exports.requestReset = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array() 
        });
    }

    try {
        const { email, resetMethod = 'token' } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists (security best practice)
            return res.json({ 
                message: 'If an account with that email exists, a password reset link has been sent.',
                success: true 
            });
        }

        // Delete any existing reset requests for this email
        await PasswordReset.deleteMany({ email: user.email });

        // Generate reset token or OTP based on method
        let resetToken = null;
        let otp = null;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        if (resetMethod === 'otp') {
            // Generate 6-digit OTP
            otp = crypto.randomInt(100000, 999999).toString();
        } else {
            // Generate JWT reset token
            resetToken = jwt.sign(
                { 
                    userId: user._id, 
                    email: user.email,
                    type: 'password-reset'
                },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
        }

        // Store reset request in database
        await PasswordReset.create({
            email: user.email,
            resetToken,
            otp,
            resetMethod,
            expiresAt,
            used: false
        });

        // Send email with token/OTP
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const showInResponse = isDevelopment && process.env.SHOW_RESET_TOKEN === 'true';
        const emailEnabled = process.env.EMAIL_ENABLED === 'true';
        
        let emailSent = false;
        
        if (resetMethod === 'otp') {
            // Try to send email
            const emailResult = await sendPasswordResetOTP(user.email, otp);
            emailSent = emailResult.success;
            
            // If email failed or disabled, log to console
            if (!emailSent) {
                console.log(`\n${'='.repeat(70)}`);
                console.log(`🔐 PASSWORD RESET OTP`);
                console.log(`${'='.repeat(70)}`);
                console.log(`Email: ${user.email}`);
                console.log(`OTP: ${otp}`);
                console.log(`Expires in: 15 minutes`);
                console.log(`${'='.repeat(70)}\n`);
            }
        } else {
            const resetUrl = `${process.env.FRONTEND_URL || 'https://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
            
            // Try to send email
            const emailResult = await sendPasswordResetLink(user.email, resetUrl, resetToken);
            emailSent = emailResult.success;
            
            // If email failed or disabled, log to console
            if (!emailSent) {
                console.log(`\n${'='.repeat(70)}`);
                console.log(`🔐 PASSWORD RESET LINK`);
                console.log(`${'='.repeat(70)}`);
                console.log(`Email: ${user.email}`);
                console.log(`Reset URL: ${resetUrl}`);
                console.log(`Token: ${resetToken}`);
                console.log(`Expires in: 15 minutes`);
                console.log(`${'='.repeat(70)}\n`);
            }
        }

        // Return success
        // In development with SHOW_RESET_TOKEN=true, include token/OTP in response
        let message;
        if (emailSent) {
            message = resetMethod === 'otp' 
                ? 'A 6-digit OTP has been sent to your email. Please check your email and enter the OTP to reset your password.'
                : 'A password reset link has been sent to your email. Please check your email to reset your password.';
        } else if (isDevelopment) {
            message = resetMethod === 'otp' 
                ? 'OTP generated. Check server console for the code, or set EMAIL_ENABLED=true in .env to send emails.'
                : 'Reset link generated. Check server console for the link, or set EMAIL_ENABLED=true in .env to send emails.';
        } else {
            message = resetMethod === 'otp' 
                ? 'A 6-digit OTP has been sent to your email. Please check your email and enter the OTP to reset your password.'
                : 'A password reset link has been sent to your email. Please check your email to reset your password.';
        }
        
        const response = {
            message,
            success: true,
            method: resetMethod,
            emailSent
        };

        // Include token/OTP in development mode if enabled
        if (showInResponse) {
            if (resetMethod === 'otp') {
                response.otp = otp;
                response.message = `OTP: ${otp} (Expires in 15 minutes)`;
            } else {
                response.resetUrl = `${process.env.FRONTEND_URL || 'https://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
                response.token = resetToken;
                response.message = `Reset link generated. Use the URL or token below.`;
            }
        }

        return res.json(response);

    } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({ message: 'Error processing password reset request' });
    }
};

/**
 * Verify reset token or OTP
 */
exports.verifyReset = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array() 
        });
    }

    try {
        const { email, token, otp } = req.body;

        // Find reset request
        const resetRequest = await PasswordReset.findOne({
            email: email.toLowerCase(),
            $or: [
                { resetToken: token },
                { otp: otp }
            ],
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!resetRequest) {
            return res.status(400).json(createErrorResponse(
                'Invalid or expired reset token/OTP. Please request a new one.',
                'INVALID_RESET_TOKEN',
                'token'
            ));
        }

        // Verify token if token method
        if (token && resetRequest.resetMethod === 'token') {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.type !== 'password-reset' || decoded.email !== email.toLowerCase()) {
                    return res.status(400).json(createErrorResponse(
                        'Invalid reset token',
                        'INVALID_RESET_TOKEN',
                        'token'
                    ));
                }
            } catch (jwtError) {
                return res.status(400).json(createErrorResponse(
                    'Invalid or expired reset token',
                    'INVALID_RESET_TOKEN',
                    'token'
                ));
            }
        }

        // Verify OTP if OTP method
        if (otp && resetRequest.resetMethod === 'otp') {
            if (resetRequest.otp !== otp) {
                return res.status(400).json(createErrorResponse(
                    'Invalid OTP. Please check and try again.',
                    'INVALID_OTP',
                    'otp'
                ));
            }
        }

        // Token/OTP is valid
        return res.json({
            message: 'Reset token/OTP verified successfully',
            success: true,
            verified: true
        });

    } catch (error) {
        console.error('Password reset verification error:', error);
        return res.status(500).json({ message: 'Error verifying reset token/OTP' });
    }
};

/**
 * Reset password with token or OTP
 */
exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array() 
        });
    }

    try {
        const { email, token, otp, newPassword } = req.body;

        // Find and verify reset request
        const resetRequest = await PasswordReset.findOne({
            email: email.toLowerCase(),
            $or: [
                { resetToken: token },
                { otp: otp }
            ],
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!resetRequest) {
            return res.status(400).json(createErrorResponse(
                'Invalid or expired reset token/OTP. Please request a new one.',
                'INVALID_RESET_TOKEN',
                'token'
            ));
        }

        // Verify token if token method
        if (token && resetRequest.resetMethod === 'token') {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.type !== 'password-reset' || decoded.email !== email.toLowerCase()) {
                    return res.status(400).json(createErrorResponse(
                        'Invalid reset token',
                        'INVALID_RESET_TOKEN',
                        'token'
                    ));
                }
            } catch (jwtError) {
                return res.status(400).json(createErrorResponse(
                    'Invalid or expired reset token',
                    'INVALID_RESET_TOKEN',
                    'token'
                ));
            }
        }

        // Verify OTP if OTP method
        if (otp && resetRequest.resetMethod === 'otp') {
            if (resetRequest.otp !== otp) {
                return res.status(400).json(createErrorResponse(
                    'Invalid OTP. Please check and try again.',
                    'INVALID_OTP',
                    'otp'
                ));
            }
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json(createErrorResponse(
                'User not found',
                'USER_NOT_FOUND',
                'email'
            ));
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        // Mark reset request as used
        resetRequest.used = true;
        await resetRequest.save();

        // Delete all reset requests for this email
        await PasswordReset.deleteMany({ email: user.email });

        return res.json({
            message: 'Password reset successfully. You can now login with your new password.',
            success: true
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ message: 'Error resetting password' });
    }
};