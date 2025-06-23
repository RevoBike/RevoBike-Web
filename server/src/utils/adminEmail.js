const nodemailer = require("nodemailer");

exports.sendAdminEmail = async (email, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You have been added as an Admin",
    html: `
      <h1>Welcome to RevoBike</h1>
      <p>You have been added as an admin.</p>
      <p><strong>Your login credentials are:</strong></p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please log in and change your password as soon as possible.</p>
      <p>Thank you,</p>
      <p>The RevoBike Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendAdminRoleUpdateEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You have been updated",
    html: `
      <h1>Welcome to RevoBike</h1>
      <p>Your role have been updated.</p>
      <p>Please log in again to see the latest changes.</p>
      <p>Thank you,</p>
      <p>The RevoBike Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

exports.sendAdminDeleteEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You role has been removed",
    html: `
      <h1>Welcome to RevoBike</h1>
      <p>Your role have been removed.</p>
      <p>Thank you,</p>
      <p>The RevoBike Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};
