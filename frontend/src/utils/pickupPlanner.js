const DAY_MS = 24 * 60 * 60 * 1000;

const ASHTA_BIN_COORDINATES = {
  B1: [23.0175, 76.7221],
  B2: [23.0190, 76.7198],
  B3: [23.0159, 76.7244],
  B4: [23.0204, 76.7262],
  B5: [23.0139, 76.7186],
  B6: [23.0118, 76.7239],
  B7: [23.0220, 76.7169],
  B8: [23.0232, 76.7285],
  B9: [23.0142, 76.7301],
};

function daysSince(date) {
  if (!date) return 0;
  return Math.max(0, (Date.now() - new Date(date).getTime()) / DAY_MS);
}

export function getBinPrediction(bin, readings = []) {
  const binReadings = readings
    .filter((reading) => reading.binId === bin.id)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-7);
  const daysUnemptied = daysSince(bin.lastEmptied);
  let dailyFillRate = bin.demoDailyFillRate ?? (daysUnemptied > 0.25 ? bin.fillLevel / daysUnemptied : 0);
  let confidence = "Low";

  if (binReadings.length >= 2) {
    const origin = new Date(binReadings[0].timestamp).getTime();
    const points = binReadings.map((reading) => ({
      x: (new Date(reading.timestamp).getTime() - origin) / DAY_MS,
      y: reading.fillLevel,
    }));
    const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    const denominator = points.reduce((sum, point) => sum + (point.x - meanX) ** 2, 0);
    if (denominator > 0) {
      const numerator = points.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
      dailyFillRate = Math.max(0, numerator / denominator);
      confidence = binReadings.length >= 4 ? "High" : "Medium";
    }
  }

  const predictedTomorrow = Math.min(100, Math.round(bin.fillLevel + dailyFillRate));
  const predictedInThreeDays = Math.min(100, Math.round(bin.fillLevel + dailyFillRate * 3));
  const daysToFull = dailyFillRate > 0 ? Math.max(0, (100 - bin.fillLevel) / dailyFillRate) : null;
  return {
    dailyFillRate: Number(dailyFillRate.toFixed(1)),
    predictedTomorrow,
    predictedInThreeDays,
    daysToFull,
    confidence,
    readingCount: binReadings.length,
  };
}

export function createPickupPlan(bins, area, readings = []) {
  return bins
    .filter((bin) => area === "all" || bin.block === area)
    .map((bin) => {
      const daysUnemptied = daysSince(bin.lastEmptied);
      const prediction = getBinPrediction(bin, readings);
      const { dailyFillRate, predictedTomorrow, predictedInThreeDays } = prediction;
      const isWet = bin.type === "wet";
      const urgent = bin.fillLevel >= 90 || predictedTomorrow >= 90;
      const wetDue = isWet && bin.fillLevel > 10 && daysUnemptied >= 1;
      const dryDue = !isWet && (
        bin.fillLevel >= 80 || predictedInThreeDays >= 90 || daysUnemptied >= 3
      );
      const scheduled = urgent || wetDue || dryDue;
      const priority = urgent ? "critical" : scheduled ? "high" : "normal";
      const reason = urgent
        ? "Likely to reach 90% capacity by tomorrow"
        : wetDue
          ? "Wet waste needs same-day collection"
          : dryDue
            ? "Dry-waste collection is due within three days"
            : "No pickup needed today";

      return {
        ...bin,
        ...prediction,
        coordinates: Number.isFinite(bin.latitude) && Number.isFinite(bin.longitude)
          ? [bin.latitude, bin.longitude]
          : ASHTA_BIN_COORDINATES[bin.id] || [23.0175, 76.7221],
        scheduled,
        priority,
        reason,
        score: (urgent ? 1000 : 0) + (wetDue ? 500 : 0) + bin.fillLevel + dailyFillRate * 10,
      };
    })
    .filter((bin) => bin.scheduled)
    .sort((a, b) => b.score - a.score || a.location.localeCompare(b.location))
    .map((bin, index) => ({ ...bin, stop: index + 1 }));
}
