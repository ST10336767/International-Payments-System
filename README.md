
# International Payments System (INSY7314 Final POE)

A secure Node.js + Express web API for handling international payments.  
This project includes authentication, customer transactions, role-based access, and robust security layers.

---

##  Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [API Documentation (Swagger)](#-api-documentation-swagger)
- [Security Implementations](#-security-implementations)
- [Validation](#-validation)
- [Team Contributions](#-team-contributions)
- [Example API Inputs](#-example-api-inputs)

---

## Overview

This system allows **customers** to register, authenticate, and perform international payments through various providers (e.g., SWIFT).  

---

## Features
 User Registration and Login  
 JWT Authentication  
 Role-based Access Control (Customer, Employee, Admin)  
 International Payments (Customer → Provider)  
 ID Number Luhn Validation (South African IDs)  
 Account Number and SWIFT Code Validation  
 Express Rate Limiting for DDoS Protection  
 Helmet for HTTP Header Security  
 Centralized Error Handling  
 API Documentation via Swagger UI  

---

## Tech Stack

| Category | Technologies |
|-----------|---------------|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JSON Web Tokens (JWT) |
| Validation | Express-Validator |
| Security | Helmet, Rate Limiter |
| Documentation | Swagger UI |
| Version Control | Git + GitHub |

---

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/<your-repo-name>.git
   cd INSY7314-Poe-Part-2
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Create a `.env` file** in the project root and configure it as below:
```
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
 ```  

4. **Run the server:**

   ```
   npm run dev
   ```

5. **Access the API locally:**

   
   https://localhost:5000
   

---

## API Documentation (Swagger)

Swagger provides an interactive UI to test and view all endpoints.

### How to Access Swagger

Once the server is running, open:


https://localhost:5000/api-docs


### How It’s Implemented

In `server.js`:

```
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
```

### Swagger Endpoints Examples

#### Auth Endpoints

* `POST /api/auth/register` → Register a new user
* `POST /api/auth/login` → Login and receive JWT

#### Customer Endpoints

* `POST /api/customers/payments` → Create a payment (JWT required)
* `GET /api/customers/payments` → View all your payments

---

##  Security Implementations

###  Helmet

Used to secure HTTP headers and prevent common web vulnerabilities.
```
const helmet = require("helmet");
app.use(helmet());
```

###  Rate Limiting

Prevents brute-force attacks and request flooding.

```
const { registerLimiter, loginLimiter } = require("./middleware/rateLimiter");
router.post("/register", registerLimiter, registerRules, authController.register);
router.post("/login", loginLimiter, loginRules, authController.login);
```

### Luhn Check (for ID Validation)

This ensures valid South African ID numbers before registration.


###  Password Hashing

All passwords are hashed with `bcrypt` before storage.

###  Role-Based Access Control

Middleware ensures only certain roles can access specific routes.

```
router.post("/payments", protect, requireRole("Customer"), createPayment);
```

###  Input Validation

All input fields are validated using `express-validator` to prevent SQL/NoSQL injection and invalid data.

---

## Validation Rules

### Registration Validation

* **Email:** must be valid and unique
* **Password:** minimum 6 characters
* **ID Number:** exactly 13 digits, must pass Luhn check
* **Account Number:** 10–12 digits
* **Role:** defaults to “Customer”

### Login Validation

* **Email** and **Password** must be provided

---

## Example API Inputs

### Registration (POST `/api/auth/register`)

```
{
  "email": "johnjohnson@email.com",
  "password": "SuperStrongPassword!23",
  "firstName": "John",
  "lastName": "Johnson",
  "accountNumber": "12345678901",
  "idNumber": "8001015009087",
  "role": "Customer"
}
```

###  Login (POST `/api/auth/login`)

```
{
  "email": "johnjohnson@email.com",
  "password": "SuperStrongPassword!23"
}
```

###  Create Payment (POST `/api/customers/payments`)

```
{
  "recipientAccount": "9876543210987",
  "amount": 1000.50,
  "currency": "USD",
  "provider": "SWIFT",
  "swiftCode": "ABCDZAJJ"
}
```

---


##  Git Workflow Summary

1. Each team member worked on their feature branch.
2. All branches were merged into `dev` for integration testing.
3. After successful testing, `dev` was merged into `main`.
4. Final version pushed to GitHub:

---

## Notes

* Ensure MongoDB Atlas or local MongoDB is running before starting the server.
* All endpoints (except register/login) require a valid JWT token in the header:

  
  Authorization: Bearer <token>
  

---

 **Developed by the DarkMoon Solutions and Tristan — 2025**


