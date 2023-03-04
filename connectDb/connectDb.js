const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGOURI, () => {
      console.log("connected to db");
    });
  } catch (error) {
    console.log("check db connection", error);
  }
}
module.exports = connectToDb;
