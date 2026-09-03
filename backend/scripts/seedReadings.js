const mongoose = require("mongoose");
require("dotenv").config();

const Reading = require("../models/Reading");
const readings = require("../data/readings");

const seedReadings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.db.databaseName);

    await Reading.deleteMany();

    await Reading.insertMany(readings);

    console.log("Readings inserted successfully");

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error seeding readings:", error.message);
    process.exit(1);
  }
};

seedReadings();