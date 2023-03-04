// [( superadminID/adminID): ID from perticular table,
// accessToken: String,
// refreshToken: String,
// isValid: Boolean, default: true]
const mongoose = require("mongoose");
const AdminToken = new mongoose.Schema({
  isValid: {
    type: Boolean,
    default: true,
  },
  Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  refreshToken: { type: String, required: true },
  accessToken: { type: String, required: true },
});
module.exports = mongoose.model("AdminToken", AdminToken);
