const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
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

    block: {
      type: String,
      required: true
    },

    collectedAt: {
      type: Date,
      default: Date.now
    },

    weightKg: {
      type: Number,
      required: true,
      min: 0
    },

    type: {
      type: String,
      required: true
    },

    status: {
      type: String,
      required: true,
      enum: ["completed", "pending", "missed"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Collection", collectionSchema);