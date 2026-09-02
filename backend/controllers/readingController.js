
const readings = require("../data/readings");
const bins = require("../data/bins");

const getReadingsByBinId = (req, res) => {
  const binReadings = readings.filter(
    (reading) => reading.binId === req.params.id
  );

  res.json(binReadings);
};

const createReading = (req, res) => {
  const { binId, fillLevel } = req.body;

  if (!binId || fillLevel === undefined) {
    return res.status(400).json({
      message: "Bin ID and fill level are required"
    });
  }

  const bin = bins.find((bin) => bin.id === binId);

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

  const nextIdNumber = readings.length + 1;

  const newReading = {
    id: `R${nextIdNumber}`,
    binId,
    fillLevel,
    timestamp: new Date().toISOString()
  };

  readings.push(newReading);

  res.status(201).json(newReading);
};

module.exports = {
  getReadingsByBinId,
  createReading
};