const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

function connectToDb() {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectToDb;
