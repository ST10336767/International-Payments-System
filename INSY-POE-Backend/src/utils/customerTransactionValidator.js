const { body } = require("express-validator");

// Regex patterns
const ACCOUNT_NUMBER_REGEX = /^\d{10,12}$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
const CURRENCY_REGEX = /^[A-Z]{3}$/;

// Recipient account number validation (10-12 digits)
const recipientAccount = body("recipientAccount")
    .isString()
    .trim()
    .notEmpty().withMessage("Recipient account number is required")
    .matches(ACCOUNT_NUMBER_REGEX).withMessage("Recipient account number must be exactly 10-12 digits");

// Amount validation (positive number with up to 2 decimal places)
const amount = body("amount")
    .custom((value) => {
        // Convert to string for regex check
        const amountStr = String(value);
        if (!AMOUNT_REGEX.test(amountStr)) {
            throw new Error("Amount must be a valid number with up to 2 decimal places");
        }
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
            throw new Error("Amount must be greater than zero");
        }
        if (numValue < 0.01) {
            throw new Error("Amount must be at least 0.01");
        }
        if (!AMOUNT_REGEX.test(value.toString())) {
            throw new Error("Amount can have a maximum of 2 decimal places");
        }
        return true;
    });

// Currency must be one of the allowed currencies (validated with regex)
const currency = body("currency")
    .isString()
    .trim()
    .notEmpty().withMessage("Currency is required")
    .toUpperCase()
    .matches(CURRENCY_REGEX).withMessage("Currency must be a valid 3-letter ISO code (e.g., USD, ZAR, EUR)")
    .isIn(["ZAR","USD","EUR","GBP","JPY","CAD","AUD"])
    .withMessage("Unsupported currency. Supported currencies are: ZAR, USD, EUR, GBP, JPY, CAD, AUD");

// Provider validation (must be SWIFT currently)
const provider = body("provider")
    .isString()
    .trim()
    .notEmpty().withMessage("Payment provider is required")
    .toUpperCase()
    .equals("SWIFT")
    .withMessage("Unsupported payment provider. Currently only SWIFT transfers are supported");

// SWIFT code format validation (8 or 11 characters)
const swiftCode = body("swiftCode")
    .isString()
    .trim()
    .notEmpty().withMessage("SWIFT code is required")
    .toUpperCase()
    .matches(SWIFT_CODE_REGEX)
    .withMessage("Invalid SWIFT code format. Must be exactly 8 characters (e.g., ABCDZAJJ) or 11 characters (e.g., ABCDZAJJ123)");

// Export rules as array
const createPaymentRules = [
    recipientAccount,
    amount,
    currency,
    provider,
    swiftCode
];

module.exports = { createPaymentRules };
