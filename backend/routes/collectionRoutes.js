const express = require("express");

const {
  getAllCollections,
  getCollectionsByBinId,
  createCollection
} = require("../controllers/collectionController");

const router = express.Router();

router.get("/", getAllCollections);

router.get("/:id", getCollectionsByBinId);

router.post("/", createCollection);

module.exports = router;