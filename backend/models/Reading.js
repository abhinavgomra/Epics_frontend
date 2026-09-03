const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },

    binId: {
      type: String,
      required: true
    },

    fillLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reading", readingSchema);