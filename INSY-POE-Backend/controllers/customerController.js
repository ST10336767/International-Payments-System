const Transaction = require("../models/Transaction");
const { validationResult } = require("express-validator");
const { formatValidationErrors } = require("../src/utils/errorFormatter");

// ============================
// CREATE A PAYMENT
// ============================
exports.createPayment = async (req, res) => {
    // Run validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatValidationErrors(errors.array());
        return res.status(400).json(formattedErrors);
    }

    try {
        const { recipientAccount, amount, currency, provider, swiftCode } = req.body;

        // Automatically attach senderAccount from JWT
        const senderAccount = req.user.accountNumber;

        // Create new transaction in DB
        const transaction = await Transaction.create({
            senderAccount,
            recipientAccount,
            amount,
            currency,
            provider,
            swiftCode,
            status: "PendingVerification"
        });

        res.status(201).json({ message: "Payment created", transaction });

    } catch (err) {
        console.error('Payment creation error:', err);
        res.status(500).json(createErrorResponse(
            "An error occurred while processing your payment. Please try again later.",
            "SERVER_ERROR"
        ));
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Transaction.find({ senderAccount: req.user.accountNumber });
        res.status(200).json(payments);
    } catch (err) {
        console.error('Payment fetch error:', err);
        res.status(500).json(createErrorResponse(
            "An error occurred while fetching your payments. Please try again later.",
            "SERVER_ERROR"
        ));
    }
};

