const bins = require("../data/bins");
const collections = require("../data/collections");

const getDashboardStats = (req, res) => {
  const totalBins = bins.length;

  const totalFillLevel = bins.reduce(
    (total, bin) => total + bin.fillLevel,
    0
  );

  const averageFillLevel = totalFillLevel / totalBins;

  const highFillBins = bins.filter(
    (bin) => bin.fillLevel >= 80
  ).length;

  const criticalFillBins = bins.filter(
    (bin) => bin.fillLevel >= 95
  ).length;

  const totalWasteCollected = collections.reduce(
    (total, collection) => total + collection.weightKg,
    0
  );

  const completedCollections = collections.filter(
    (collection) => collection.status === "completed"
  ).length;

  const pendingCollections = collections.filter(
    (collection) => collection.status === "pending"
  ).length;

  const missedCollections = collections.filter(
    (collection) => collection.status === "missed"
  ).length;

  const areaStats = {};

  bins.forEach((bin) => {
    if (!areaStats[bin.block]) {
      areaStats[bin.block] = {
        totalBins: 0,
        totalFillLevel: 0
      };
    }

    areaStats[bin.block].totalBins += 1;
    areaStats[bin.block].totalFillLevel += bin.fillLevel;
  });

  Object.keys(areaStats).forEach((area) => {
    areaStats[area].averageFillLevel =
      areaStats[area].totalFillLevel /
      areaStats[area].totalBins;
  });

  Object.keys(areaStats).forEach((area) => {
    delete areaStats[area].totalFillLevel;
  });

  res.json({
    totalBins,
    averageFillLevel,
    highFillBins,
    criticalFillBins,
    totalWasteCollected,
    completedCollections,
    pendingCollections,
    missedCollections,
    areaStats
  });
};

module.exports = {
  getDashboardStats
};