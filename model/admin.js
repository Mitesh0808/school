const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var generator = require("generate-password");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/mailer");
// Admin :- [isActive: Boolean,
//     email: String,
//     password: String,
//     school: ID from school table]
const AdminSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  password: { type: "String" },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
});
AdminSchema.pre("save", async function (next) {
  const password = generator.generate({
    length: 8,
    uppercase: false,
  });
  this.password = password;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  const logsDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  const logFile = path.join(logsDir, "Admin.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "schoolAdmin");
  next();
});
module.exports = mongoose.model("Admin", AdminSchema);
