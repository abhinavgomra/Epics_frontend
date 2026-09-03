const mongoose = require("mongoose");
require("dotenv").config();

const Collection = require("../models/Collection");
const collections = require("../data/collections");

const seedCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.db.databaseName);

    await Collection.deleteMany();

    await Collection.insertMany(collections);

    console.log("Collections inserted successfully");

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error seeding collections:", error.message);
    process.exit(1);
  }
};

seedCollections();