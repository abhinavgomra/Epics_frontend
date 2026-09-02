const express = require("express");

const {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  getBinsByArea
} = require("../controllers/dustbinController");

const router = express.Router();

router.get("/", getAllBins);

router.get("/areas/:area/dustbins", getBinsByArea);

router.get("/:id", getBinById);

router.post("/", createBin);

router.put("/:id", updateBin);

module.exports = router;