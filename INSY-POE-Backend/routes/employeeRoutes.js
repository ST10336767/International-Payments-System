const express = require("express");
const router = express.Router();

const {
    getTransactions,
    getPendingTransactions,
    verifyEmployeeTransactions,
    verifyTransaction,
    rejectTransaction,
    submitToSwift
} = require("../controllers/employeeController");

const { protect, requireRole } = require("../middleware/authMiddleware");
const {
    listTransactionsRules,
    verifyRules,
    rejectionRules,
    submitRules,
    validate
} = require("../src/utils/employeeValidator");

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee review and SWIFT submission endpoints
 */

/**
 * @swagger
 * /api/employee/transactions/pending:
 *   get:
 *     summary: List transactions pending employee verification
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: Optional currency filter (e.g. USD)
 *       - in: query
 *         name: provider
 *         schema:
 *           type: string
 *         description: Optional provider/routing filter (e.g. SWIFT)
 *     responses:
 *       200:
 *         description: Returns list of pending transactions
 *       401:
 *         description: Unauthorized - invalid or missing JWT
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Server error
 */
// List transactions (Pending + Verified by default)
router.get(
    "/transactions",
    protect,
    requireRole("Employee"),
    listTransactionsRules,
    validate,
    getTransactions
);

// List pending transactions for employees (legacy endpoint)
router.get(
    "/transactions/pending",
    protect,
    requireRole("Employee"),
    listTransactionsRules,
    validate,
    getPendingTransactions
);

/**
 * @swagger
 * /api/employee/transactions/{id}/verify:
 *   post:
 *     summary: Verify a transaction (employee review)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction verified
 *       400:
 *         description: Not in a verifiable state or bad input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Server error
 */
// Verify a single transaction
router.post(
    "/transactions/:id/verify",
    protect,
    requireRole("Employee"),
    verifyRules,
    validate,
    verifyTransaction
);

/**
 * @swagger
 * /api/employee/transactions/{id}/reject:
 *   post:
 *     summary: Reject a transaction with a reason
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Name mismatch against internal records"
 *     responses:
 *       200:
 *         description: Transaction rejected
 *       400:
 *         description: Not in a rejectable state or missing reason
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Server error
 */
// Reject a single transaction
router.post(
    "/transactions/:id/reject",
    protect,
    requireRole("Employee"),
    rejectionRules,
    validate,
    rejectTransaction
);

/**
 * @swagger
 * /api/employee/transactions/submit-swift:
 *   post:
 *     summary: Submit verified transactions to SWIFT (batch)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["665f8a...", "665f8b..."]
 *     responses:
 *       200:
 *         description: Submission attempt complete; returns counts
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 *       500:
 *         description: Server error
 */
// Submit verified transactions to SWIFT (batch)
router.post(
    "/transactions/submit-swift",
    protect,
    requireRole("Employee"),
    submitRules,
    validate,
    submitToSwift
);

//added
router.post(
  "/transactions/mass-verify",
  protect,
  requireRole("Employee"),
  verifyEmployeeTransactions
);



module.exports = router;


