/**
 * Structured Error Message Formatter
 * Formats validation errors into a consistent, structured response
 */

/**
 * Formats express-validator errors into structured format
 * @param {Array} errors - Array of validation errors from express-validator
 * @returns {Object} Structured error response
 */
function formatValidationErrors(errors) {
    if (!errors || errors.length === 0) {
        return {
            success: false,
            message: "Validation failed",
            errors: []
        };
    }

    const formattedErrors = errors.map(error => ({
        field: error.path || error.param || 'unknown',
        value: error.value !== undefined ? error.value : null,
        message: error.msg || error.message || 'Invalid value',
        code: getErrorCode(error)
    }));

    return {
        success: false,
        message: "Validation failed",
        errorCount: formattedErrors.length,
        errors: formattedErrors
    };
}

/**
 * Gets error code based on error type
 * @param {Object} error - Validation error object
 * @returns {String} Error code
 */
function getErrorCode(error) {
    const msg = (error.msg || error.message || '').toLowerCase();
    
    if (msg.includes('required') || msg.includes('empty')) {
        return 'FIELD_REQUIRED';
    }
    if (msg.includes('email')) {
        return 'INVALID_EMAIL';
    }
    if (msg.includes('password')) {
        return 'INVALID_PASSWORD';
    }
    if (msg.includes('length') || msg.includes('characters')) {
        return 'INVALID_LENGTH';
    }
    if (msg.includes('digits') || msg.includes('numeric')) {
        return 'INVALID_NUMERIC';
    }
    if (msg.includes('format') || msg.includes('pattern')) {
        return 'INVALID_FORMAT';
    }
    if (msg.includes('luhn')) {
        return 'INVALID_ID_NUMBER';
    }
    if (msg.includes('currency')) {
        return 'INVALID_CURRENCY';
    }
    if (msg.includes('swift')) {
        return 'INVALID_SWIFT_CODE';
    }
    if (msg.includes('amount') || msg.includes('positive')) {
        return 'INVALID_AMOUNT';
    }
    if (msg.includes('provider')) {
        return 'INVALID_PROVIDER';
    }
    
    return 'VALIDATION_ERROR';
}

/**
 * Creates a structured error response for business logic errors
 * @param {String} message - Error message
 * @param {String} code - Error code
 * @param {String} field - Field name (optional)
 * @returns {Object} Structured error response
 */
function createErrorResponse(message, code = 'ERROR', field = null) {
    const response = {
        success: false,
        message: message,
        code: code
    };
    
    if (field) {
        response.field = field;
    }
    
    return response;
}

/**
 * Formats multiple business logic errors
 * @param {Array} errors - Array of error objects with message, code, field
 * @returns {Object} Structured error response
 */
function formatBusinessErrors(errors) {
    return {
        success: false,
        message: "Request failed validation",
        errorCount: errors.length,
        errors: errors.map(err => ({
            field: err.field || null,
            message: err.message,
            code: err.code || 'BUSINESS_ERROR'
        }))
    };
}

module.exports = {
    formatValidationErrors,
    createErrorResponse,
    formatBusinessErrors,
    getErrorCode
};

