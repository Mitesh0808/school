// [( superadminID/adminID): ID from perticular table,
// accessToken: String,
// refreshToken: String,
// isValid: Boolean, default: true]
const mongoose = require("mongoose");
const SuperAdminToken = new mongoose.Schema({
  isValid: {
    type: Boolean,
    default: true,
  },
  Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperAdmin",
  },
  refreshToken: { type: String, required: true },
  accessToken: { type: String, required: true },
});
module.exports = mongoose.model("SuperAdminToken", SuperAdminToken);
