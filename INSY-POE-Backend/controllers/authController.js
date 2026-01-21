const jwt = require("jsonwebtoken");
const User = require("../models/User");

//add validator for secure login
//Added -- Secure Login --> 4) Enforce Validation in the controller
const { validationResult } = require("express-validator");
const FailedLogin = require('../models/FailedLogin');
const { formatValidationErrors, createErrorResponse } = require("../src/utils/errorFormatter");

//register
exports.register = async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatValidationErrors(errors.array());
        return res.status(400).json(formattedErrors);
    }
    
    try{
        const {email, firstName, lastName, password, accountNumber, idNumber, role} = req.body;

        // Normalize email to lowercase for consistency
        const normalizedEmail = email.toLowerCase();

        const existingEmail = await User.findOne({email: normalizedEmail});
        const existingAccountNumber = await User.findOne({accountNumber});
        const existingIdNumber = await User.findOne({idNumber});

        if (existingEmail) {
            return res.status(400).json(createErrorResponse(
                "An account with this email address already exists",
                "EMAIL_EXISTS",
                "email"
            ));
        }
        if (existingAccountNumber) {
            return res.status(400).json(createErrorResponse(
                "This account number is already registered",
                "ACCOUNT_NUMBER_EXISTS",
                "accountNumber"
            ));
        }
        if (existingIdNumber) {
            return res.status(400).json(createErrorResponse(
                "This ID number is already registered",
                "ID_NUMBER_EXISTS",
                "idNumber"
            ));
        }
        
        const user = await User.create({email: normalizedEmail, firstName, lastName, password, idNumber, accountNumber, role});

        //added account number for customer transaction -> will be autofilled so user doesnt manyally enter it
        const token = jwt.sign({ id: user._id, role: user.role, accountNumber: user.accountNumber }, process.env.JWT_SECRET, {expiresIn: "15m"});
        
        // Set secure cookie with token
        // Note: secure: true works with HTTPS (including localhost HTTPS)
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access (XSS protection)
            secure: true, // Only send over HTTPS (required for secure cookies)
            sameSite: 'strict', // CSRF protection - strict prevents cross-site requests
            maxAge: 15 * 60 * 1000, // 15 minutes
            path: '/'
        });
        
        return res.status(201).json({
            id: user._id, 
            email: user.email, 
            role: user.role
        });

    } catch(e){
        console.error('Registration error:', e);
        return res.status(500).json(createErrorResponse(
            "An error occurred while creating your account. Please try again later.",
            "SERVER_ERROR"
        ));
    }
};

//login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid Input", error: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      await FailedLogin.create({
        email: email.toLowerCase(),
        ip: req.ip,
        reason: "User not found"
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      await FailedLogin.create({
        email: email.toLowerCase(),
        ip: req.ip,
        reason: "Incorrect password"
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //added account number for customer transaction -> will be autofilled so user doesnt manyally enter it
    const token = jwt.sign({ sub: user._id, role: user.role, accountNumber: user.accountNumber  }, process.env.JWT_SECRET, { expiresIn: "2h" });
    
    // Set secure cookie with token
    // Note: secure: true works with HTTPS (including localhost HTTPS)
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: true, // Only send over HTTPS (required for secure cookies)
        sameSite: 'strict', // CSRF protection - strict prevents cross-site requests
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        path: '/'
    });
    
    return res.json({ user: { id: user._id, role: user.role } });
    }catch (e){
        return res.status(500).json({ message: e.message });
    }
};
    

exports.logout = async (req, res) => {
  try {
    // Clear the secure cookie (must match the same options used when setting)
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, // Must match the secure flag used when setting the cookie
      sameSite: 'strict',
      path: '/'
    });
    
    return res.json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error during logout' });
  }
};


// exports.seedEmployee = async (req, res) => {
//   try {
//     const user = await User.create({
//       email: "employee@gmail.com",
//       password: "employee123",
//       firstName: "John",
//       lastName: "Doe",
//       idNumber: "8001015009088", 
//       role: "Employee"
//     });

//     res.json({ message: "Employee created successfully", user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error creating employee", error: err.message });
//   }
// };

