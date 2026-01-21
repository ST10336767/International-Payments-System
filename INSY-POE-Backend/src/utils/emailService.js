const nodemailer = require('nodemailer');

/**
 * Email Service for sending password reset emails
 * Supports multiple email providers via SMTP
 */

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  // If transporter already exists, return it
  if (transporter) {
    return transporter;
  }

  // Check if email is enabled
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';
  
  if (!emailEnabled) {
    console.log('⚠️  Email service is disabled. Set EMAIL_ENABLED=true in .env to enable.');
    return null;
  }

  // Get email configuration from environment variables
  const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  };

  // Validate required configuration
  if (!emailConfig.host || !emailConfig.auth.user || !emailConfig.auth.pass) {
    console.error('❌ Email configuration incomplete. Please check your .env file.');
    console.error('   Required: SMTP_HOST, SMTP_USER, SMTP_PASSWORD');
    return null;
  }

  // Create transporter
  transporter = nodemailer.createTransport(emailConfig);

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email service connection failed:', error.message);
      console.error('   Please check your SMTP configuration in .env');
    } else {
      console.log('✅ Email service connected successfully');
    }
  });

  return transporter;
};

/**
 * Send password reset OTP email
 */
const sendPasswordResetOTP = async (email, otp) => {
  const emailTransporter = createTransporter();
  
  if (!emailTransporter) {
    // Fallback to console logging if email is disabled
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔐 PASSWORD RESET OTP (Email disabled - check console)`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Email: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log(`Expires in: 15 minutes`);
    console.log(`${'='.repeat(70)}\n`);
    return { success: false, message: 'Email service disabled' };
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'INSY POE'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password. Use the OTP below to complete the reset process:</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666;">Your OTP Code:</p>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This OTP expires in <strong>15 minutes</strong></li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>Enter this OTP on the password reset page to set a new password.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} INSY POE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset OTP

You have requested to reset your password. Use the OTP below to complete the reset process:

OTP: ${otp}

This OTP expires in 15 minutes.

If you didn't request this, please ignore this email.

This is an automated message. Please do not reply to this email.
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset OTP email:', error.message);
    // Fallback to console logging
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔐 PASSWORD RESET OTP (Email failed - check console)`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Email: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log(`Expires in: 15 minutes`);
    console.log(`${'='.repeat(70)}\n`);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset link email
 */
const sendPasswordResetLink = async (email, resetUrl, token) => {
  const emailTransporter = createTransporter();
  
  if (!emailTransporter) {
    // Fallback to console logging if email is disabled
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔐 PASSWORD RESET LINK (Email disabled - check console)`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token: ${token}`);
    console.log(`Expires in: 15 minutes`);
    console.log(`${'='.repeat(70)}\n`);
    return { success: false, message: 'Email service disabled' };
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'INSY POE'}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset Link',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .link-fallback { background: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password. Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>This link expires in <strong>15 minutes</strong></li>
                <li>Do not share this link with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <div class="link-fallback">${resetUrl}</div>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} INSY POE. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Link

You have requested to reset your password. Click the link below to reset your password:

${resetUrl}

This link expires in 15 minutes.

If you didn't request this, please ignore this email.

This is an automated message. Please do not reply to this email.
    `
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Password reset link email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset link email:', error.message);
    // Fallback to console logging
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔐 PASSWORD RESET LINK (Email failed - check console)`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token: ${token}`);
    console.log(`Expires in: 15 minutes`);
    console.log(`${'='.repeat(70)}\n`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetOTP,
  sendPasswordResetLink,
  createTransporter
};

