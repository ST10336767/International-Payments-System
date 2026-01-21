const mongoose = require("mongoose");


//Schema -- Defines how user documents will look
const transactionSchema = new mongoose.Schema({
    senderAccount: {
         type: String, 
         required: true,
         match: /^[0-9]{10,12}$/
         }, // account making the payment
    recipientAccount: { 
        type: String, 
        required: true 
    }, // recipient's account
    amount: {
         type: Number,
          required: true,
           min: 0.01 
        }, // payment amount
    currency: {
         type: String,
          required: true,
         },
    provider: {
        type: String,
         required: true
         }, //SWIFT ...
    swiftCode: {
         type: String, 
         required: true,
           match: /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/
         }, 
    status: {
         type: String,
          default: "PendingVerification"
         },
    timestamp: {
         type: Date,
          default: Date.now
         } 
});


module.exports = mongoose.model("Transaction", transactionSchema);
