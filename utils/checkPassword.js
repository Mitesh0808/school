const bcrypt = require("bcryptjs");

async function comparePassword(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error(error);
    return false;
  }
}
module.exports = comparePassword;
