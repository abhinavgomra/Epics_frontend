const Collection = require("../models/Collection");
const Dustbin = require("../models/Dustbin");

const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ collectedAt: 1 });

    res.json(collections);
  } catch (error) {
    console.error("Get all collections error:", error);

    res.status(500).json({
      message: "Failed to fetch collections"
    });
  }
};

const getCollectionsByBinId = async (req, res) => {
  try {
    const binCollections = await Collection.find({
      binId: req.params.id
    }).sort({ collectedAt: 1 });

    res.json(binCollections);
  } catch (error) {
    console.error("Get collections by bin error:", error);

    res.status(500).json({
      message: "Failed to fetch collections"
    });
  }
};

const createCollection = async (req, res) => {
  try {
    const { binId, weightKg, type, status = "completed" } = req.body;

    if (!binId || weightKg === undefined || !type) {
      return res.status(400).json({
        message: "Bin ID, weight, and type are required"
      });
    }

    const bin = await Dustbin.findOne({ id: binId });

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

    const allCollections = await Collection.find();

    let nextCollectionNumber = 1;

    if (allCollections.length > 0) {
      const highestCollectionNumber = allCollections.reduce(
        (max, collection) => {
          const number = Number.parseInt(collection.id.slice(1), 10);

          return Number.isNaN(number) ? max : Math.max(max, number);
        },
        0
      );

      nextCollectionNumber = highestCollectionNumber + 1;
    }

    const newCollection = await Collection.create({
      id: `C${nextCollectionNumber}`,
      binId,
      block: bin.block,
      collectedAt: new Date(),
      weightKg,
      type,
      status
    });

    bin.fillLevel = 0;
    bin.lastEmptied = newCollection.collectedAt;

    await bin.save();

    res.status(201).json(newCollection);
  } catch (error) {
    console.error("Create collection error:", error);

    res.status(500).json({
      message: "Failed to create collection"
    });
  }
};

module.exports = {
  getAllCollections,
  getCollectionsByBinId,
  createCollection
};