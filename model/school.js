const mongoose = require("mongoose");

// 6. school :- [isActive: Boolean,
//     email:  String,
//     schoolName: String,
//     phoneNo:  String]
//isActive,email,schoolName,phoneNo
const SchoolSchema = new mongoose.Schema({
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
  schoolName: {
    type: String,
    trim: true,
    maxLength: [255, "coursename should be less than 50 characters"],
    required: [true, "please provide coursename"],
  },
  phoneNo: {
    type: String,
    trim: true,
    match: [
      /^(\+\d{1,2}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}|\d{10})$/,
      "Please enter a valid phone number",
    ],
    required: [true, "must provide PhoneNo"],
  },
});

module.exports = mongoose.model("School", SchoolSchema);
