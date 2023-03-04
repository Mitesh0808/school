const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(email, password, role) {
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILID,
      pass: process.env.MAILPASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MAILID,
    to: email,
    subject: "Info",
    text: `Your Info are: Email: ${email}, Password: ${password} ,Role : ${role}`,
  });

  console.log("Message sent:", info.response);
}
module.exports = sendEmail;
