const mongoose = require("mongoose");

const dustbinSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },

    block: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    fillLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    type: {
      type: String,
      required: true
    },

    lastEmptied: {
      type: Date,
      default: null
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Dustbin", dustbinSchema);
