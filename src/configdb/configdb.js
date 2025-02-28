const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = function () {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.error("Failed to connect to MongoDB");
    });
};

module.exports = dbConnection;
