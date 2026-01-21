const { body, param, query, validationResult } = require("express-validator");
const { formatValidationErrors } = require("./errorFormatter.js");

const STATUS_VALUES = [
    "PendingVerification",
    "Verified",
    "Rejected",
    "Submitted"
];

const listTransactionsRules = [
    query("status")
        .optional()
        .isString()
        .trim()
        .isIn(STATUS_VALUES)
        .withMessage(`Status must be one of: ${STATUS_VALUES.join(", ")}`),
    query("currency")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage("Currency must be a 3-letter ISO code"),
    query("provider")
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage("Provider must be between 2 and 20 characters")
];

const idParamRule = param("id")
    .isMongoId()
    .withMessage("Transaction ID must be a valid MongoDB ObjectId");

const rejectionRules = [
    idParamRule,
    body("reason")
        .isString()
        .trim()
        .isLength({ min: 3, max: 250 })
        .withMessage("Reason must be between 3 and 250 characters")
];

const verifyRules = [idParamRule];

const submitRules = [
    body("transactionIds")
        .isArray({ min: 1 })
        .withMessage("transactionIds must be an array with at least one item"),
    body("transactionIds.*")
        .isMongoId()
        .withMessage("Each transaction ID must be a valid MongoDB ObjectId")
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(formatValidationErrors(errors.array()));
    }
    next();
};

module.exports = {
    listTransactionsRules,
    verifyRules,
    rejectionRules,
    submitRules,
    validate
};


