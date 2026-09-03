
const Dustbin = require("../models/Dustbin");

const getAllBins = async (req, res) => {
  try {
    const bins = await Dustbin.find();

    res.json(bins);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dustbins"
    });
  }
};

const getBinById = async (req, res) => {
  try {
    const bin = await Dustbin.findOne({ id: req.params.id });

    if (!bin) {
      return res.status(404).json({
        message: "Dustbin not found"
      });
    }

    res.json(bin);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dustbin"
    });
  }
};



const createBin = async (req, res) => {
  try {
    const { block, location, type, fillLevel = 0 } = req.body;

    if (!block || !location || !type) {
      return res.status(400).json({
        message: "Block, location, and type are required"
      });
    }

    const allBins = await Dustbin.find();

    let nextBinNumber = 1;

    if (allBins.length > 0) {
      const highestBinNumber = allBins.reduce(
        (max, bin) => {
          const number = Number.parseInt(bin.id.slice(1), 10);

          return Number.isNaN(number) ? max : Math.max(max, number);
        },
        0
      );

      nextBinNumber = highestBinNumber + 1;
    }

    const newBin = await Dustbin.create({
      id: `B${nextBinNumber}`,
      block,
      location,
      fillLevel,
      type,
      lastEmptied: null
    });

    res.status(201).json(newBin);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create dustbin"
    });
  }
};

const updateBin = async (req, res) => {
  try {
    const { block, location, type, fillLevel, lastEmptied } = req.body;

    const updatedBin = await Dustbin.findOneAndUpdate(
      { id: req.params.id },
      {
        block,
        location,
        type,
        fillLevel,
        lastEmptied
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBin) {
      return res.status(404).json({
        message: "Dustbin not found"
      });
    }

    res.json(updatedBin);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update dustbin"
    });
  }
};

const getBinsByArea = async (req, res) => {
  try {
    const area = req.params.area;

    const areaBins = await Dustbin.find({ block: area });

    res.json(areaBins);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dustbins by area"
    });
  }
};

module.exports = {
  getAllBins,
  getBinById,
  createBin,
  updateBin,
  getBinsByArea
};      
    