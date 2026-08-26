export function getMissedCount(collections) {
  return collections.filter((c) => c.status === "missed").length;
}

export function getPendingCount(collections) {
  return collections.filter((c) => c.status === "pending").length;
}

export function getTotalWeight(collections) {
  return Math.round(
    collections.reduce((sum, c) => sum + (c.weightKg || 0), 0) * 10,
  ) / 10;
}

export function getCompletedCount(collections) {
  return collections.filter((c) => c.status === "completed").length;
}

export function filterCollections(collections, { block = "all", status = "all", days = "all" }) {
  const now = new Date();

  return collections.filter((c) => {
    if (block !== "all" && c.block !== block) return false;
    if (status !== "all" && c.status !== status) return false;
    if (days !== "all") {
      const collected = new Date(c.collectedAt);
      const diffDays = (now - collected) / (1000 * 60 * 60 * 24);
      if (diffDays > Number(days)) return false;
    }
    return true;
  });
}
