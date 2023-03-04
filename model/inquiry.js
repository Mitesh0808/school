const mongoose = require("mongoose");

// 4. inquiry :- [school: ID from school table,-
//     firstName: String,-
//     lastName: String,-
//     email:  String,-
//     subject: String,-
//     message: String]-
//school,//firstName,lastName,email,subject,message
const InquirySchema = new mongoose.Schema({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  firstName: {
    type: String,
    trim: true,
    maxLength: [255, "firstName should be less than 50 characters"],
    required: [true, "must provide fullName"],
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: [255, "lastName should be less than 50 characters"],
    required: [true, "must provide fullName"],
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
  subject: {
    type: String,
    trim: true,
    maxLength: [255, "subject should be less than 50 characters"],
    required: [true, "must provide fullName"],
  },
  message: {
    type: String,
    trim: true,
    maxLength: [255, "subject should be less than 50 characters"],
    required: [true, "must provide fullName"],
  },
});

module.exports = mongoose.model("Inquiry", InquirySchema);
