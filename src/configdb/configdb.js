const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
require("dotenv").config();

const seedAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@liveinterview.app").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        organization: "LiveInterview",
        _activeOrg: "LiveInterview",
      });
      console.log(`Default admin seeded (${adminEmail})`);
    } else if (!admin._activeOrg) {
      admin._activeOrg = admin.organization || "LiveInterview";
      await admin.save();
    }
  } catch (error) {
    console.error("Error seeding default admin:", error.message);
  }
};

const dbConnection = function () {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error("MONGO_URL environment variable is missing in .env");
    return;
  }

  mongoose
    .connect(mongoUrl)
    .then(async () => {
      console.log("Connected to MongoDB");
      await seedAdminUser();
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
    });
};

module.exports = dbConnection;

