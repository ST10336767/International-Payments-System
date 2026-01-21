/*
CONFIGS AND SETUP GOES HERE 
MIDDLEWARE, ROUTES, SECURITY, CORS, PARSING....
NO SERVER LOGIC
*/

//Importing express framework to build web server
const express = require('express');
  
// Import cors middleware to allow cross origin requests
const cors = require('cors');

// Import cookie-parser for secure cookie handling
const cookieParser = require('cookie-parser');
  
//import custom helmet configuration for security headers
const helmetConfig = require('./security/helmet');
  
//import dotenv to load env vars from a .env file into process.env
const dotenv = require('dotenv');
 
//load env vars --> db, port, uri
dotenv.config();

//create instance of express application
const app = express();
 
app.set('trust proxy', 1); // 1 - > means trust the first proxy in front


//Sites: https://medium.com/@samuelnoye35/simplifying-api-development-in-node-js-with-swagger-a5021ac45742
// https://dev.to/qbentil/swagger-express-documenting-your-nodejs-rest-api-4lj7

//adding swagger
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));


//apply custom helmet configuration with comprehensive security headers
app.use(helmetConfig);

  
  

//CORS configuration for frontend communication
  
  
//--switching to https
app.use(cors({
    origin: "https://localhost:5173",
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}));
//redirect http to https in production
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});
//HSTS - HTTP Strict Transport Security
const helmet = require("helmet");
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}));
//enable express to parse incoming parse incoming JSON payloads
app.use(express.json());

//enable cookie parser for secure cookie handling
app.use(cookieParser());
  
//ROUTES
const authRoutes = require("../routes/authRoutes");
const customerRoutes = require("../routes/customerRoutes")
const employeeRoutes = require("../routes/employeeRoutes")
  
app.use("/api/auth", authRoutes);

app.use("/api/customers", customerRoutes);
app.use("/api/employee", employeeRoutes);
  
//example protected route
// app.get("/api/protected", protect, (req,res) => {
//     res.json({
//         message: `Welcome, user ${req.user.id}!`,
//         timestamp: new Date()
//     });
// });
  
//Define simple route at root url to confirm server runs
app.get('/', (req, res) => {
    res.send("Secure blog API is running")
});

//Security headers test endpoint
app.get('/api/security-test', (req, res) => {
    res.json({
        message: "Security headers test endpoint",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        cspMode: process.env.NODE_ENV !== "production" ? "REPORT-ONLY" : "ENFORCED"
    });
});

//added -> Liniting & unit testing
// app.get('/health', (req,res) =>{
//     res.status(200).json({
//         ok:true,
//         ts: Date.now()
//     })
// });
    
//export app to be used in server,js
module.exports = app;