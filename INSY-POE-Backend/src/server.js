/*
MAIN ENTRY POINT & STARTS APP
HANDLES THINGS LIKE:
    ERROR HANDLING
    LOGGING,
    DB CONNECTION
*/


//import mongoose to connect mongodb
const mongoose = require('mongoose');

//import express app defined in app.js
const app = require('./app');

// // switch to https later
// const http = require("http");

//dont forget to trust certificate if u want to test https locally to avoid browser warnings
// For Windows: to trust certificate for u guys
// Press Win + R → type certmgr.msc → Enter
// Navigate to Trusted Root Certification Authorities > Certificates
// Right-click and choose All Tasks > Import
// Import ssl/cert.pem
// Select Trusted Root Certification Authorities as the destination
// Complete the wizard and restart your browser
//Configure to use https set up here. Added ssl certs in ssl folder and now can use HTTPS from tristan
const https = require('https');
const fs = require('fs');
// WHY DID YOU ADD IT AGAIN TRISTAN
// const app = require('./app'); // Your Express app
//load env vars again
require('dotenv').config()

//Define the server port if env variable available or default to 5000
const PORT = process.env.PORT || 5000;

//ssl added from tristan
const options = {
  key: fs.readFileSync('ssl/privatekey.pem'),
  cert: fs.readFileSync('ssl/certificate.pem'),
};
//for ssl to work, need to use https server instead of http server from tristan
// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Secure API running at https://localhost:${PORT}`);
// });


//connecting to MongoDb and starting https server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        https.createServer(options, app).listen(PORT, ()=> {
            console.log(`Secure server running at https://localhost:${PORT}`);
            console.log(
    `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
  );
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error: ',err);
    });

// if (MONGO_URI) {
//   mongoose.connect(MONGO_URI)
//     .then(() => {
//       console.log('MongoDB connected successfully');
//       startServer();
//     })
//     .catch((err) => {
//       console.error("MongoDB connection error: ", err.message);
//       console.log("Starting server without database connection...");
//       startServer();
//     });
// } else {
//   console.log("No MONGO_URI provided, starting server without database...");
//   startServer();
// }

//COMMENT IT OUT TRISTAN WHATS YOUR PROBLEM
// function startServer() {
//   http.createServer(app).listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//     console.log(`CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`);
//     console.log(`Security test endpoint: http://localhost:${PORT}/api/security-test`);
//   });
// }
// test comm

//start express server & listen on port defined
// app.listen(PORT, ()=>{
//     console.log(`Server is running on ${PORT}`);
// });
