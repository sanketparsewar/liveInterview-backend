const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Admin",
    },
    role: {
      type: String,
      default: "admin",
    },
    organization: {
      type: String,
      default: "LiveInterview",
    },
    _activeOrg: {
      type: String,
      default: "LiveInterview",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
