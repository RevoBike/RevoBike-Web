const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: function(value) {
          return value.endsWith("@aastustudent.edu.et"); 
        },
        message: "Only university emails are allowed."
      } 
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^0[79]\d{8}$/.test(value); // RegEX-09. or 07., total 10 digits
        },
        message: "Phone number must start with 09 or 07 and be 10 digits long."
      }
    },
    password: { type: String, required: true, select: false },
    universityId: { 
      type: String, 
      required: function() { return this.role === "User"; }, 
      unique: function() { return this.role === "User"; } 
    }, 
    isVerified: { 
      type: Boolean, 
      default: false 
    }, 
    otpCode: { 
      type: String 
    },
    otpExpires: { 
      type: Date 
    },
    // Password reset fields
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    },
    role: {
      type: String,
      enum: ["User", "Admin", "SuperAdmin"],
      default: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);

  //verify Admins & SuperAdmins
  if (this.role !== "User") {
    this.isVerified = true;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash the token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
