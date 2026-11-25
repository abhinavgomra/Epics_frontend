const Dustbin = require("../models/Dustbin");
const Reading = require("../models/Reading");
const Collection = require("../models/Collection");

const DAY_MS = 24 * 60 * 60 * 1000;

const daysBetween = (from, to) =>
  Math.max(0, (new Date(to).getTime() - new Date(from).getTime()) / DAY_MS);

const latestByBin = (collections) => {
  const latest = new Map();

  collections.forEach((collection) => {
    if (collection.status !== "completed") return;

    const previous = latest.get(collection.binId);
    if (!previous || new Date(collection.collectedAt) > new Date(previous.collectedAt)) {
      latest.set(collection.binId, collection);
    }
  });

  return latest;
};

// Fits a small local linear model: fill level gained per day from recent readings.
// It deliberately uses no cloud service or external data.
const estimateDailyFillRate = (bin, readings, lastCollection, now) => {
  const collectionTime = lastCollection ? new Date(lastCollection.collectedAt) : null;
  const usableReadings = readings
    .filter((reading) => !collectionTime || new Date(reading.timestamp) >= collectionTime)
    .slice(-8);

  if (usableReadings.length >= 2) {
    const origin = new Date(usableReadings[0].timestamp);
    const points = usableReadings.map((reading) => ({
      x: daysBetween(origin, reading.timestamp),
      y: reading.fillLevel
    }));
    const meanX = points.reduce((total, point) => total + point.x, 0) / points.length;
    const meanY = points.reduce((total, point) => total + point.y, 0) / points.length;
    const denominator = points.reduce((total, point) => total + (point.x - meanX) ** 2, 0);
    const numerator = points.reduce(
      (total, point) => total + (point.x - meanX) * (point.y - meanY),
      0
    );

    if (denominator > 0) {
      return {
        rate: Math.max(0, numerator / denominator),
        confidence: "high",
        source: `${usableReadings.length} recent readings`
      };
    }
  }

  const referenceDate = bin.lastEmptied || (lastCollection && lastCollection.collectedAt);
  if (referenceDate) {
    const elapsedDays = daysBetween(referenceDate, now);
    if (elapsedDays >= 0.25) {
      return {
        rate: Math.max(0, bin.fillLevel / elapsedDays),
        confidence: "estimated",
        source: "current fill level since last emptying"
      };
    }
  }

  return { rate: 0, confidence: "low", source: "not enough history" };
};

const getPickupPlan = async (req, res) => {
  try {
    const area = req.query.area;
    const now = new Date();
    const binFilter = area ? { block: area } : {};

    const [bins, readings, collections] = await Promise.all([
      Dustbin.find(binFilter).lean(),
      Reading.find().sort({ timestamp: 1 }).lean(),
      Collection.find().sort({ collectedAt: 1 }).lean()
    ]);

    const readingsByBin = new Map();
    readings.forEach((reading) => {
      const binReadings = readingsByBin.get(reading.binId) || [];
      binReadings.push(reading);
      readingsByBin.set(reading.binId, binReadings);
    });

    const lastCollections = latestByBin(collections);
    const pickupPlan = bins.map((bin) => {
      const lastCollection = lastCollections.get(bin.id);
      const { rate, confidence, source } = estimateDailyFillRate(
        bin,
        readingsByBin.get(bin.id) || [],
        lastCollection,
        now
      );
      const predictedTomorrow = Math.min(100, Math.round(bin.fillLevel + rate));
      const predictedInThreeDays = Math.min(100, Math.round(bin.fillLevel + rate * 3));
      const lastEmptied = bin.lastEmptied || (lastCollection && lastCollection.collectedAt);
      const daysSinceEmptying = lastEmptied ? daysBetween(lastEmptied, now) : null;
      const isWet = bin.type.toLowerCase() === "wet";
      const wetDueToday = isWet && bin.fillLevel > 10 && (!daysSinceEmptying || daysSinceEmptying >= 1);
      const dryDue = !isWet && (bin.fillLevel >= 80 || predictedInThreeDays >= 90 || daysSinceEmptying >= 3);
      const urgent = bin.fillLevel >= 90 || predictedTomorrow >= 90;
      const scheduled = wetDueToday || dryDue || urgent;
      const priorityScore = (urgent ? 1000 : 0) + (wetDueToday ? 500 : 0) + bin.fillLevel + rate * 10;

      return {
        binId: bin.id,
        area: bin.block,
        location: bin.location,
        wasteType: bin.type,
        currentFillLevel: bin.fillLevel,
        predictedTomorrow,
        predictedInThreeDays,
        dailyFillRate: Number(rate.toFixed(1)),
        modelConfidence: confidence,
        modelData: source,
        daysSinceEmptying: daysSinceEmptying === null ? null : Number(daysSinceEmptying.toFixed(1)),
        scheduled,
        priority: urgent ? "critical" : scheduled ? "high" : "normal",
        reason: urgent
          ? "Expected to reach 90% capacity by tomorrow"
          : wetDueToday
            ? "Wet waste requires same-day collection"
            : dryDue
              ? "Dry-waste collection is due within the three-day limit"
              : "No collection needed today",
        priorityScore
      };
    });

    const route = pickupPlan
      .filter((item) => item.scheduled)
      .sort((a, b) => b.priorityScore - a.priorityScore || a.location.localeCompare(b.location))
      .map(({ priorityScore, ...item }, index) => ({ stop: index + 1, ...item }));

    res.json({
      area: area || "All areas",
      generatedAt: now,
      route,
      unscheduledBins: pickupPlan.filter((item) => !item.scheduled).map(({ priorityScore, ...item }) => item),
      summary: {
        totalBins: bins.length,
        scheduledPickups: route.length,
        criticalPickups: route.filter((item) => item.priority === "critical").length,
        wetWastePickups: route.filter((item) => item.wasteType.toLowerCase() === "wet").length
      }
    });
  } catch (error) {
    console.error("Pickup planning error:", error);
    res.status(500).json({ message: "Failed to create pickup plan" });
  }
};

module.exports = { getPickupPlan };
