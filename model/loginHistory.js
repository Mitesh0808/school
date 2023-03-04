const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    superAdminID: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin" },
    adminID: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    facultyID: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    financeID: { type: mongoose.Schema.Types.ObjectId, ref: "Finance" },
    marketingID: { type: mongoose.Schema.Types.ObjectId, ref: "Marketing" },
    studentID: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    property: { type: String },
    userAgent: { type: String },
    os: { type: String },
    browser: { type: String },
    device: { type: String },
    os_version: { type: String },
    browser_version: { type: String },
    deviceType: { type: String },
    orientation: { type: String },
    isDesktop: { type: Boolean },
    isMobile: { type: Boolean },
    isTablet: { type: Boolean },
    ip: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogHistory", logSchema);
