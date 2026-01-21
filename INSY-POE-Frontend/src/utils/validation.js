/**
 * Frontend Validation Utilities
 * Client-side validation functions for form inputs
 */

// Regex patterns (must match backend)
const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const ACCOUNT_NUMBER_REGEX = /^\d{10,12}$/;
const ID_NUMBER_REGEX = /^\d{13}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
const SWIFT_CODE_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

/**
 * Validates first or last name
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (name.trim().length < 2 || name.trim().length > 50) {
    return 'Name must be between 2 and 50 characters';
  }
  if (!NAME_REGEX.test(name.trim())) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

/**
 * Validates email address
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please provide a valid email address';
  }
  return null;
};

/**
 * Validates password
 */
export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Za-z]/.test(password)) {
    return 'Password must contain at least one letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must be at least 8 characters and contain both letters and numbers';
  }
  return null;
};

/**
 * Validates account number (10-12 digits)
 */
export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.trim().length === 0) {
    return 'Account number is required';
  }
  if (!ACCOUNT_NUMBER_REGEX.test(accountNumber.trim())) {
    return 'Account number must be exactly 10-12 digits';
  }
  return null;
};

/**
 * Validates ID number (13 digits)
 */
export const validateIdNumber = (idNumber) => {
  if (!idNumber || idNumber.trim().length === 0) {
    return 'ID number is required';
  }
  if (!ID_NUMBER_REGEX.test(idNumber.trim())) {
    return 'ID number must be exactly 13 digits';
  }
  return null;
};

/**
 * Validates amount (positive number with up to 2 decimal places)
 */
export const validateAmount = (amount) => {
  if (!amount || amount.toString().trim().length === 0) {
    return 'Amount is required';
  }
  const amountStr = amount.toString().trim();
  if (!AMOUNT_REGEX.test(amountStr)) {
    return 'Amount must be a valid number with up to 2 decimal places';
  }
  const numValue = parseFloat(amountStr);
  if (isNaN(numValue) || numValue <= 0) {
    return 'Amount must be greater than zero';
  }
  if (numValue < 0.01) {
    return 'Amount must be at least 0.01';
  }
  return null;
};

/**
 * Validates SWIFT code (8 or 11 characters)
 */
export const validateSwiftCode = (swiftCode) => {
  if (!swiftCode || swiftCode.trim().length === 0) {
    return 'SWIFT code is required';
  }
  const upperSwift = swiftCode.trim().toUpperCase();
  if (!SWIFT_CODE_REGEX.test(upperSwift)) {
    return 'Invalid SWIFT code format. Must be exactly 8 characters (e.g., ABCDZAJJ) or 11 characters (e.g., ABCDZAJJ123)';
  }
  return null;
};

/**
 * Sanitizes text input (removes leading/trailing spaces)
 */
export const sanitizeText = (text) => {
  return text ? text.trim() : '';
};

/**
 * Sanitizes numeric input (removes non-digits, except decimal point)
 */
export const sanitizeDigits = (value) => {
  return value ? value.toString().replace(/[^\d.]/g, '') : '';
};

/**
 * Sanitizes SWIFT code (uppercase, alphanumeric)
 */
export const sanitizeSwiftCode = (swiftCode) => {
  return swiftCode ? swiftCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : '';
};

