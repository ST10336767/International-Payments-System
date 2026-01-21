const {body} = require("express-validator");
//added -> luhn
const { isValidLuhn } = require("../utils/idValidator");


// Regex patterns for validation
const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const ACCOUNT_NUMBER_REGEX = /^\d{10,12}$/;
const ID_NUMBER_REGEX = /^\d{13}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

// First name validation (letters, spaces, hyphens, apostrophes, 2-50 chars)
const firstNameField = body("firstName")
    .isString()
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters")
    .matches(NAME_REGEX).withMessage("First name can only contain letters, spaces, hyphens, and apostrophes");

// Last name validation (letters, spaces, hyphens, apostrophes, 2-50 chars)
const lastNameField = body("lastName")
    .isString()
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters")
    .matches(NAME_REGEX).withMessage("Last name can only contain letters, spaces, hyphens, and apostrophes");

// Account number validation (10-12 digits)
const accountNumberField = body("accountNumber")
    .isString()
    .trim()
    .notEmpty().withMessage("Account number is required")
    .matches(ACCOUNT_NUMBER_REGEX).withMessage("Account number must be exactly 10-12 digits");

//shared password strtength rule (mirrors front-end, but authorative here)
const passwordStrength = body("password")
    .isString()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8}).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Za-z]/).withMessage("Password must contain at least one letter")
    .matches(/\d/).withMessage("Password must contain at least one number")
    .matches(PASSWORD_REGEX).withMessage("Password must be at least 8 characters and contain both letters and numbers");

    //Email for reg & login 
    const emailField = body("email")
    .isString()
    .trim()
    .notEmpty().withMessage("Email is required")
    .matches(EMAIL_REGEX).withMessage("Please provide a valid email address")
    .normalizeEmail();

    //optionnal: for username
    // const usernameField = body("username")
    //     .optional()
    //     .isLength({ min: 3, max: 40}).withMessage("Username must be 3-40 chars")
    //     .isAlphanumeric().withMessage("Username must be alphanumeric");


    // South African ID number (13 digits, must pass Luhn check if enabled)
const idNumberField = body("idNumber")
  .isString()
  .trim()
  .notEmpty().withMessage("ID number is required")
  .matches(ID_NUMBER_REGEX).withMessage("ID number must be exactly 13 digits")
  .bail()
  .custom(value => {
    // Allow bypassing Luhn check in development via environment variable
    const skipLuhnCheck = process.env.SKIP_LUHN_CHECK === 'true';
    
    if (!skipLuhnCheck && !isValidLuhn(value)) {
      throw new Error("Invalid South African ID number (failed Luhn check). For testing, set SKIP_LUHN_CHECK=true in .env");
    }
    return true;
  });

    //Reg rules: requires email + password + firstName + lastName + accountNumber + idNumber
    const registerRules = [
        emailField, 
        passwordStrength, 
        firstNameField,
        lastNameField,
        accountNumberField,
        idNumberField
    ];

    //Login rules: require email & non empty password
    //NOTE: do not .escape() pw on server - changes string and breaks bcrypt.
    //Trimming is fine if yo've documented that passwordss cannot start/.end with spaces
    //Many apps choose not to trim to avoid altering userinput. Below is no trium
    const loginRules = [
        emailField,
        body("password")
            .isString()
            .notEmpty().withMessage("Password is required"),
    ];

    module.exports = {
    registerRules, 
    loginRules,
    PASSWORD_REGEX,
    NAME_REGEX,
    EMAIL_REGEX,
    ACCOUNT_NUMBER_REGEX,
    ID_NUMBER_REGEX
};