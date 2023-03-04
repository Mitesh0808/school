const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var generator = require("generate-password");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/mailer");

// 3. Finance :- [isActive: Boolean,-
//     email:  String,-
//     school: ID from school table]-
//isActive,email,school

const FinanceSchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  isActive: {
    type: Boolean,
    default: true,
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
});
FinanceSchema.pre("save", async function (next) {
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
  const logFile = path.join(logsDir, "Finance.log");
  const writeStream = fs.createWriteStream(logFile, { flags: "a" });
  writeStream.write(`email: ${this.email}, password: ${password}\n`);
  writeStream.end();
  sendEmail(this.email, password, "finance");
  next();
});
module.exports = mongoose.model("Finance", FinanceSchema);
