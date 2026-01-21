const express = require("express");
const router = express.Router();

// Controller functions
const { createPayment, getPayments } = require("../controllers/customerController");

// Auth middleware
const { protect, requireRole } = require("../middleware/authMiddleware");

// Validators
const { createPaymentRules } = require("../src/utils/customerTransactionValidator");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer payment endpoints
 */

/**
 * @swagger
 * /api/customers/payments:
 *   post:
 *     summary: Create a new international payment
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []  # JWT required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientAccount:
 *                 type: string
 *                 example: "1234567890123"
 *               amount:
 *                 type: number
 *                 example: 1000.50
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               provider:
 *                 type: string
 *                 example: "SWIFT"
 *               swiftCode:
 *                 type: string
 *                 example: "ABCDZAJJ"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - invalid or missing JWT
 *       500:
 *         description: Server error
 */
router.post(
    "/payments",
    protect, // verify JWT
    requireRole("Customer"), // only customers
    createPaymentRules, // run validators
    createPayment // controller handles actual creation (validation checked in controller)
);

/**
 * @swagger
 * /api/customers/payments:
 *   get:
 *     summary: Get all payments for the logged-in customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []  # JWT required
 *     responses:
 *       200:
 *         description: Returns list of transactions
 *       401:
 *         description: Unauthorized - invalid or missing JWT
 *       500:
 *         description: Server error
 */
router.get(
    "/payments",
    protect, // verify JWT
    requireRole("Customer"), // only customers
    getPayments
);

module.exports = router;
