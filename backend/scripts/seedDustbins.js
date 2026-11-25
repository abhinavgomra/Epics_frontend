const mongoose = require("mongoose");
require("dotenv").config();

const Dustbin = require("../models/Dustbin");
const bins = require("../data/bins");

const seedDustbins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.db.databaseName);

    await Dustbin.deleteMany();

    await Dustbin.insertMany(bins);

    console.log("Dustbins inserted successfully");

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error seeding dustbins:", error.message);
    process.exit(1);
  }
};

seedDustbins();