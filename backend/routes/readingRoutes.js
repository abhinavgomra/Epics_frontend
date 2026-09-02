const express = require("express");

const {
  getReadingsByBinId,
  createReading
} = require("../controllers/readingController");

const router = express.Router();

router.get("/dustbins/:id/readings", getReadingsByBinId);

router.post("/", createReading);

module.exports = router;