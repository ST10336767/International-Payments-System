/**
 * Error Handler Utility
 * Handles structured error messages from the backend API
 */

/**
 * Formats API error response into user-friendly messages
 * @param {Object} error - Error object from axios
 * @returns {String|Object} Formatted error message or structured error object
 */
export const formatApiError = (error) => {
  if (!error) return 'An unexpected error occurred';

  // Handle structured validation errors
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const errors = error.response.data.errors;
    
    // If multiple errors, return structured object
    if (errors.length > 1) {
      return {
        type: 'validation',
        message: error.response.data.message || 'Please fix the following errors:',
        errors: errors.map(err => ({
          field: err.field || err.param || 'unknown',
          message: err.message || err.msg || 'Invalid value',
          code: err.code || 'VALIDATION_ERROR'
        }))
      };
    }
    
    // Single error - return message string
    const firstError = errors[0];
    return firstError.message || firstError.msg || 'Validation error';
  }

  // Handle single structured error
  if (error.response?.data?.message && error.response?.data?.code) {
    return {
      type: 'error',
      message: error.response.data.message,
      code: error.response.data.code,
      field: error.response.data.field || null
    };
  }

  // Handle simple message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Handle network errors
  if (error.message === 'Network Error' || !error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  // Default error message
  return error.message || 'An unexpected error occurred';
};

/**
 * Gets error message for a specific field
 * @param {Object} error - Error object from formatApiError
 * @param {String} fieldName - Name of the field
 * @returns {String|null} Error message for the field or null
 */
export const getFieldError = (error, fieldName) => {
  if (!error || typeof error !== 'object') return null;
  
  if (error.type === 'validation' && error.errors) {
    const fieldError = error.errors.find(err => err.field === fieldName);
    return fieldError ? fieldError.message : null;
  }
  
  if (error.field === fieldName) {
    return error.message;
  }
  
  return null;
};

/**
 * Gets all field errors as an object
 * @param {Object} error - Error object from formatApiError
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const getAllFieldErrors = (error) => {
  if (!error || typeof error !== 'object' || error.type !== 'validation') {
    return {};
  }
  
  const fieldErrors = {};
  if (error.errors && Array.isArray(error.errors)) {
    error.errors.forEach(err => {
      if (err.field) {
        fieldErrors[err.field] = err.message;
      }
    });
  }

  
  return fieldErrors;
};

/**
 * Checks if error is a validation error
 * @param {Object} error - Error object
 * @returns {Boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error && typeof error === 'object' && error.type === 'validation';
};

/**
 * Gets the main error message (for display)
 * @param {Object|String} error - Error from formatApiError
 * @returns {String} Main error message
 */
export const getMainErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    return error.message || 'An error occurred';
  }
  
  return 'An unexpected error occurred';
};

