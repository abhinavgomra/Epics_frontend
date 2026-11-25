import binsData from "../data/bins.json";

const STORAGE_KEY = "smart-waste-demo-readings-v1";
let readingsStore = null;

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readingsStore));
  } catch {
    // Keep the demo usable if browser storage is unavailable.
  }
}

function initStore() {
  if (readingsStore) return readingsStore;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) readingsStore = JSON.parse(saved);
  } catch {
    readingsStore = null;
  }

  if (!readingsStore) {
    readingsStore = binsData.flatMap((bin, index) => {
      const rate = bin.demoDailyFillRate || 5;
      return [2, 1, 0].map((days, offset) => ({
        id: `R${index * 3 + offset + 1}`,
        binId: bin.id,
        fillLevel: Math.max(0, Math.round(bin.fillLevel - rate * days)),
        timestamp: daysAgo(days),
      }));
    });
    saveStore();
  }
  return readingsStore;
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 200));
}

export async function getReadings() {
  await delay();
  return initStore().map((reading) => ({ ...reading }));
}

export async function addReading({ binId, fillLevel }) {
  await delay();
  const level = Number(fillLevel);
  if (!binId) throw new Error("Select a bin");
  if (!Number.isFinite(level) || level < 0 || level > 100) {
    throw new Error("Fill level must be between 0 and 100");
  }

  const store = initStore();
  const nextNumber = store.reduce((highest, reading) => {
    const number = Number.parseInt(reading.id.replace(/\D/g, ""), 10);
    return Number.isNaN(number) ? highest : Math.max(highest, number);
  }, 0) + 1;
  const reading = { id: `R${nextNumber}`, binId, fillLevel: level, timestamp: new Date().toISOString() };
  store.push(reading);
  saveStore();
  return { ...reading };
}
