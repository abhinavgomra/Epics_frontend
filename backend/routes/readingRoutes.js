const express = require("express");

const {
  getAllReadings,
  getReadingsByBinId,
  createReading
} = require("../controllers/readingController");

const router = express.Router();

router.get("/", getAllReadings);

router.get("/dustbins/:id/readings", getReadingsByBinId);

router.post("/", createReading);

module.exports = router;
