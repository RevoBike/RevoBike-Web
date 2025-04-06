const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

module.exports = mongoose.model("User", userSchema);
