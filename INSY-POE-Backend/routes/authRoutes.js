const express = require("express");


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johnjohnson@email.com"
 *               password:
 *                 type: string
 *                 example: "SuperStrongPassword!23"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Johnson"
 *               accountNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 12
 *                 description: "Bank account number – must be 10 to 12 digits"
 *                 example: "12345678901"
 *               idNumber:
 *                 type: string
 *                 minLength: 13
 *                 maxLength: 13
 *                 description: "South African ID number – must be exactly 13 digits"
 *                 example: "8001015009087"
 *               role:
 *                 type: string
 *                 example: "Customer"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error / email/account/id already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johnjohnson@email.com"
 *               password:
 *                 type: string
 *                 example: "SuperStrongPassword!23"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
  *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts from this IP or email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Too many login attempts"
 *       500:
 *         description: Server error
 */

const authController = require("../controllers/authController");
const passwordResetController = require("../controllers/passwordResetController");
const {registerRules, loginRules} = require("../src/utils/validator");
const {requestResetRules, verifyTokenRules, verifyOTPRules, resetPasswordRules} = require("../src/utils/passwordResetValidator");
const router = express.Router();
const {registerLimiter, loginLimiter, emailLimiter, banner, bannerEmail} = require("../middleware/rateLimiter");

// Create rate limiter for password reset (5 requests per hour per IP)
const resetLimiter = require("express-rate-limit")({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: "Too many password reset requests. Please try again later." },
    skipSuccessfulRequests: true
});

router.post("/register",registerLimiter, registerRules, authController.register);
router.post("/login", loginLimiter, loginRules, banner, bannerEmail, emailLimiter, authController.login);
router.post("/logout", authController.logout);

// Password reset routes
router.post("/forgot-password", resetLimiter, requestResetRules, passwordResetController.requestReset);
router.post("/verify-reset", resetLimiter, verifyTokenRules, passwordResetController.verifyReset);
router.post("/verify-reset-otp", resetLimiter, verifyOTPRules, passwordResetController.verifyReset);
router.post("/reset-password", resetLimiter, resetPasswordRules, passwordResetController.resetPassword);

//temp added == seeding employee
// router.post("/seed-employee", authController.seedEmployee);

module.exports = router;