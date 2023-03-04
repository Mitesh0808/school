const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/mailer");

// 2. faculty :- [school: ID from school table,-
//     isActive: Boolean,-
//     fullName:  String,-
//     email:  String,-
//     phoneNo:  String]
//school,isActive,fullName,email,phoneNo
const FacultySchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  fullName: {
    type: String,
    trim: true,
    maxLength: [255, "coursename should be less than 50 characters"],
    required: [true, "please provide coursename"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: { type: "String" },
  phoneNo: {
    type: String,
    trim: true,
    match: [
      /^(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/,
      "Please enter a valid phone number",
    ],
    required: [true, "must provide PhoneNo"],
  },
});
FacultySchema.pre("save", async function (next) {
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
  const logFile = path.join(logsDir, "faculty.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "faculty");
  next();
});
module.exports = mongoose.model("Faculty", FacultySchema);
