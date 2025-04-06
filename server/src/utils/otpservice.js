const nodemailer = require("nodemailer");

// Function to generate a 6-digit OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via email
exports.sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // email
      pass: process.env.EMAIL_PASS, // email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Account Verification",
    text: `Your OTP code is ${otp}. This code will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
