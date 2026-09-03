const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


const dustbinRoutes = require("./routes/dustbinRoutes");
const readingRoutes = require("./routes/readingRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/dustbins", dustbinRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Waste Monitoring Backend is running!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});