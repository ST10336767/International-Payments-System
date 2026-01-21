const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Schema -- Defines how user documents will look
const userSchema = new mongoose.Schema({
     email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    idNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{13}$/
    },
    accountNumber: {
        type: String,
        //adapted from : https://stackoverflow.com/questions/65446658/how-to-create-an-object-for-a-specific-user-role-in-mongoose
        // changed for seeding admin purposes - > employee does not need to have an account number now
        required: function() { return this.role === 'Customer';},
        unique: true,
        match: /^[0-9]{10,12}$/
    },
    password: {
        type: String,
        required: true,
    },
    //RBAC
    role: {
        type: String,
        enum: ["Customer","Employee"],
        default: 'Customer'
    }
});

//Automatically hash pw before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    // Get salt rounds from environment variable (default: 10)
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    
    // Validate salt rounds (must be between 4 and 31 for bcrypt)
    // Handle NaN or invalid values by using default of 10
    const validSaltRounds = isNaN(saltRounds) 
        ? 10 
        : Math.max(4, Math.min(31, saltRounds));
    
    //define salt
    const salt = await bcrypt.genSalt(validSaltRounds);

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//compare plain text password with hashed password
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
