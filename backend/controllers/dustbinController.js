
const bins = require("../data/bins");

const getAllBins = (req, res) => {
  res.json(bins);
};

const getBinById = (req, res) => {
  const bin = bins.find((bin) => bin.id === req.params.id);

  if (!bin) {
    return res.status(404).json({
      message: "Dustbin not found"
    });
  }

  res.json(bin);
};

const getNextBinId = () => {
  const maxId = bins.reduce((max, bin) => {
    const number = Number.parseInt(bin.id.slice(1), 10);

    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);

  return `B${maxId + 1}`;
};

const createBin = (req, res) => {
  const { block, location, type, fillLevel = 0 } = req.body;

  if (!block || !location || !type) {
    return res.status(400).json({
      message: "Block, location, and type are required"
    });
  }

  const newBin = {
    id: getNextBinId(),
    block,
    location,
    fillLevel,
    type,
    lastEmptied: null
  };

  bins.push(newBin);

  res.status(201).json(newBin);
};

const updateBin = (req, res) => {
  const bin = bins.find((bin) => bin.id === req.params.id);

  if (!bin) {
    return res.status(404).json({
      message: "Dustbin not found"
    });
  }

  const { block, location, type, fillLevel, lastEmptied } = req.body;

  if (block !== undefined) {
    bin.block = block;
  }

  if (location !== undefined) {
    bin.location = location;
  }

  if (type !== undefined) {
    bin.type = type;
  }

  if (fillLevel !== undefined) {
    bin.fillLevel = fillLevel;
  }

  if (lastEmptied !== undefined) {
    bin.lastEmptied = lastEmptied;
  }

  res.json(bin);
};

const getBinsByArea = (req, res) => {
  const area = req.params.area;

  const areaBins = bins.filter((bin) => bin.block === area);

  res.json(areaBins);
};

module.exports = {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  getBinsByArea
};      
    