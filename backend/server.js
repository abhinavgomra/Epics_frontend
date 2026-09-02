const express = require("express");
const cors = require("cors");

const dustbinRoutes = require("./routes/dustbinRoutes");
const readingRoutes = require("./routes/readingRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/dustbins", dustbinRoutes);
app.use("/api/readings", readingRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Waste Monitoring Backend is running!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});