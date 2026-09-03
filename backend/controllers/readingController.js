
const Reading = require("../models/Reading");
const Dustbin = require("../models/Dustbin");

const getReadingsByBinId = async (req, res) => {
  try {
    const binReadings = await Reading.find({
      binId: req.params.id
    }).sort({ timestamp: 1 });

    res.json(binReadings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch readings"
    });
  }
};

const createReading = async (req, res) => {
  try {
    const { binId, fillLevel } = req.body;

    if (!binId || fillLevel === undefined) {
      return res.status(400).json({
        message: "Bin ID and fill level are required"
      });
    }

    const bin = await Dustbin.findOne({ id: binId });

    if (!bin) {
      return res.status(404).json({
        message: "Dustbin not found"
      });
    }

    if (fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({
        message: "Fill level must be between 0 and 100"
      });
    }

    const lastReading = await Reading.findOne().sort({ id: -1 });

    let nextReadingNumber = 1;

    if (lastReading) {
      nextReadingNumber =
        Number.parseInt(lastReading.id.slice(1), 10) + 1;
    }

    const newReading = await Reading.create({
      id: `R${nextReadingNumber}`,
      binId,
      fillLevel,
      timestamp: new Date()
    });

    bin.fillLevel = fillLevel;
    await bin.save();

    res.status(201).json(newReading);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create reading"
    });
  }
};

module.exports = {
  getReadingsByBinId,
  createReading
};