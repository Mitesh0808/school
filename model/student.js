const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var generator = require("generate-password");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/mailer");

// 8. student :- [school: ID from school table,
//     faculty:  ID from faculty table,
//     isActive: Boolean,-
//     firstName: String,-
//     middleName: String,-
//     lastName: String,-
//     email:  String,-
//     age: String,-
//     gender: String]-
//school,faculty,isActive,firstName,middleName,lastName,email,age,gender
const StudentSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  firstName: {
    type: String,
    trim: true,
    maxLength: [255, "firstName should be less than 50 characters"],
    required: [true, "please provide coursename"],
  },
  middleName: {
    type: String,
    trim: true,
    maxLength: [255, "middleName should be less than 50 characters"],
    required: [true, "must provide description"],
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: [255, "middleName should be less than 50 characters"],
    required: [true, "must provide description"],
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
  age: {
    type: String,
    trim: true,
    maxLength: [255, "age should be less than 50 characters"],
    required: [true, "must provide description"],
  },
  gender: {
    type: String,
    trim: true,
    maxLength: [255, "gender should be less than 50 characters"],
    required: [true, "must provide description"],
  },
  password: { type: "String" },
});
StudentSchema.pre("save", async function (next) {
  const password = generator.generate({
    length: 8,
    uppercase: false,
  });
  console.log(password);
  this.password = password;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  const logsDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
  const logFile = path.join(logsDir, "Student.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "student");

  next();
});
module.exports = mongoose.model("Student", StudentSchema);
