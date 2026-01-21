const Transaction = require("../models/Transaction");
// const { createErrorResponse, formatBusinessErrors } = require("../src/utils/errorFormatter.js");

const STATUS_LABELS = {
    PendingVerification: "Pending",
    Verified: "Verified",
    Rejected: "Rejected",
    Submitted: "Submitted"
};

const buildTransactionQuery = ({ status, currency, provider } = {}) => {
    const query = {};

    if (status) {
        query.status = status;
    }

    if (currency) {
        query.currency = currency.toUpperCase();
    }

    if (provider) {
        query.provider = provider.toUpperCase();
    }

    return query;
};

const mapTransaction = (transaction) => ({
    id: transaction._id.toString(),
    reference: transaction._id.toString(),
    senderAccount: transaction.senderAccount,
    recipientAccount: transaction.recipientAccount,
    amount: transaction.amount,
    currency: transaction.currency,
    provider: transaction.provider,
    swiftCode: transaction.swiftCode,
    status: transaction.status,
    statusLabel: STATUS_LABELS[transaction.status] || transaction.status,
    timestamp: transaction.timestamp,
    verifiedAt: transaction.verifiedAt,
    verifiedBy: transaction.verifiedBy,
    rejectedAt: transaction.rejectedAt,
    rejectedBy: transaction.rejectedBy,
    rejectionReason: transaction.rejectionReason,
    submittedAt: transaction.submittedAt,
    submittedBy: transaction.submittedBy,
    swiftSubmissionRef: transaction.swiftSubmissionRef
});

const fetchTransactions = async (filters = {}) => {
    const query = buildTransactionQuery(filters);
    const transactions = await Transaction.find(query).sort({ timestamp: -1 });
    return transactions.map(mapTransaction);
};

exports.getTransactions = async (req, res) => {
    try {
        // Default to both PendingVerification and Verified if no status supplied
        const filters = { ...req.query };
        if (!filters.status) {
            filters.status = { $in: ["PendingVerification", "Verified"] };
        }

        const query = buildTransactionQuery(filters);
        if (filters.status && filters.status.$in) {
            query.status = { $in: filters.status.$in };
        }

        const transactions = await Transaction.find(query).sort({ timestamp: -1 });
        const payload = transactions.map(mapTransaction);

        return res.json({ success: true, transactions: payload });
    } catch (error) {
        console.error("getTransactions error:", error);
        return res.status(500).json(createErrorResponse(
            "Unable to fetch transactions",
            "SERVER_ERROR"
        ));
    }
};

exports.getPendingTransactions = async (req, res) => {
    try {
        const transactions = await fetchTransactions({
            ...req.query,
            status: "PendingVerification"
        });

        return res.json({ success: true, transactions });
    } catch (error) {
        console.error("getPendingTransactions error:", error);
        return res.status(500).json(createErrorResponse(
            "Unable to fetch pending transactions",
            "SERVER_ERROR"
        ));
    }
};

exports.verifyTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Transaction.findOneAndUpdate(
            { _id: id, status: "PendingVerification" },
            {
                $set: {
                    status: "Verified",
                    verifiedBy: req.user?.id || null,
                    verifiedAt: new Date(),
                    rejectedBy: null,
                    rejectedAt: null,
                    rejectionReason: null
                }
            },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json(createErrorResponse(
                "Transaction is not in a verifiable state",
                "INVALID_TRANSACTION_STATE"
            ));
        }

        return res.json({
            success: true,
            message: "Transaction verified",
            transaction: mapTransaction(updated)
        });
    } catch (error) {
        console.error("verifyTransaction error:", error);
        return res.status(500).json(createErrorResponse(
            "Unable to verify transaction",
            "SERVER_ERROR"
        ));
    }
};

exports.rejectTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const trimmedReason = reason?.trim();
        if (!trimmedReason || trimmedReason.length < 3) {
            return res.status(400).json(createErrorResponse(
                "Rejection reason must be at least 3 characters",
                "INVALID_REJECTION_REASON",
                "reason"
            ));
        }

        const updated = await Transaction.findOneAndUpdate(
            { _id: id, status: "PendingVerification" },
            {
                $set: {
                    status: "Rejected",
                    rejectedBy: req.user?.id || null,
                    rejectedAt: new Date(),
                    rejectionReason: trimmedReason
                }
            },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json(createErrorResponse(
                "Transaction is not in a rejectable state",
                "INVALID_TRANSACTION_STATE"
            ));
        }

        return res.json({
            success: true,
            message: "Transaction rejected",
            transaction: mapTransaction(updated)
        });
    } catch (error) {
        console.error("rejectTransaction error:", error);
        return res.status(500).json(createErrorResponse(
            "Unable to reject transaction",
            "SERVER_ERROR"
        ));
    }
};

exports.submitToSwift = async (req, res) => {
    try {
        const { transactionIds } = req.body || {};

        if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
            return res.status(400).json(createErrorResponse(
                "transactionIds array is required",
                "INVALID_SUBMISSION_PAYLOAD",
                "transactionIds"
            ));
        }

        const now = new Date();

        const updateResult = await Transaction.updateMany(
            { _id: { $in: transactionIds }, status: "Verified" },
            {
                $set: {
                    status: "Submitted",
                    submittedBy: req.user?.id || null,
                    submittedAt: now
                }
            }
        );

        const matched = updateResult.matchedCount ?? updateResult.nMatched ?? 0;
        const modified = updateResult.modifiedCount ?? updateResult.nModified ?? 0;
        const failed = transactionIds.length - modified;

        if (modified === 0) {
            return res.status(400).json(formatBusinessErrors([
                {
                    field: "transactionIds",
                    message: "No transactions were submitted. Ensure they are in Verified state.",
                    code: "NO_TRANSACTIONS_SUBMITTED"
                }
            ]));
        }

        return res.json({
            success: true,
            message: failed > 0
                ? `Submitted ${modified} transaction(s) to SWIFT. ${failed} could not be submitted.`
                : `Submitted ${modified} transaction(s) to SWIFT successfully.`,
            result: {
                requested: transactionIds.length,
                matched,
                submitted: modified,
                failed
            }
        });
    } catch (error) {
        console.error("submitToSwift error:", error);
        return res.status(500).json(createErrorResponse(
            "Unable to submit transactions to SWIFT",
            "SERVER_ERROR"
        ));
    }
};

//added

exports.verifyEmployeeTransactions = async (req, res) => {
  try {
    const { transactionIds } = req.body || {};

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "transactionIds array is required.",
      });
    }

    // Only PendingVerification transactions can be verified
    const now = new Date();

    const result = await Transaction.updateMany(
      { _id: { $in: transactionIds }, status: "PendingVerification" },
      {
        $set: {
          status: "Verified",
          verifiedBy: req.user?.id || null,
          verifiedAt: now,
          rejectedBy: null,
          rejectedAt: null,
          rejectionReason: null,
        },
      }
    );

    const modified = result.modifiedCount ?? result.nModified ?? 0;
    const failed = transactionIds.length - modified;

    if (modified === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No transactions were verified. Ensure they are in PendingVerification state.",
      });
    }

    res.json({
      success: true,
      message:
        failed > 0
          ? `Verified ${modified} transaction(s). ${failed} were not in verifiable state.`
          : `Verified ${modified} transaction(s) successfully.`,
      result: {
        requested: transactionIds.length,
        verified: modified,
        failed,
      },
    });
  } catch (error) {
    console.error("verifyEmployeeTransactions error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to verify transactions.",
      error: error.message,
    });
  }
};

