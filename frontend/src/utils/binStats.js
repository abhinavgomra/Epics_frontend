export function getCriticalCount(bins) {
  return bins.filter((b) => b.fillLevel > 80).length;
}

export function getAverageFill(bins) {
  if (bins.length === 0) return 0;
  return Math.round(
    bins.reduce((sum, b) => sum + b.fillLevel, 0) / bins.length,
  );
}

export function sortBinsByUrgency(bins) {
  return [...bins].sort((a, b) => b.fillLevel - a.fillLevel);
}

export function filterBins(bins, { block, type }) {
  return bins.filter((bin) => {
    if (block !== "all" && bin.block !== block) return false;
    if (type !== "all" && bin.type !== type) return false;
    return true;
  });
}
