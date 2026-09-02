const collections = require("../data/collections");
const bins = require("../data/bins");

const getAllCollections = (req, res) => {
  res.json(collections);
};

const getCollectionsByBinId = (req, res) => {
  const binCollections = collections.filter(
    (collection) => collection.binId === req.params.id
  );

  res.json(binCollections);
};

const createCollection = (req, res) => {
  const { binId, weightKg, type, status = "completed" } = req.body;

  if (!binId || weightKg === undefined || !type) {
    return res.status(400).json({
      message: "Bin ID, weight, and type are required"
    });
  }

  const bin = bins.find((bin) => bin.id === binId);

  if (!bin) {
    return res.status(404).json({
      message: "Dustbin not found"
    });
  }

  if (weightKg < 0) {
    return res.status(400).json({
      message: "Weight cannot be negative"
    });
  }

  const nextIdNumber = collections.length + 1;

  const newCollection = {
    id: `C${nextIdNumber}`,
    binId,
    block: bin.block,
    collectedAt: new Date().toISOString(),
    weightKg,
    type,
    status
  };

  collections.push(newCollection);

  bin.fillLevel = 0;
  bin.lastEmptied = newCollection.collectedAt;

  res.status(201).json(newCollection);
};

module.exports = {
  getAllCollections,
  getCollectionsByBinId,
  createCollection
};