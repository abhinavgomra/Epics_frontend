import binsData from "../data/bins.json";

const DELAY_MS = 300;
const STORAGE_KEY = "smart-waste-demo-bins-v2";

let binsStore = null;

function dateDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function initStore() {
  if (!binsStore) {
    try {
      const savedBins = localStorage.getItem(STORAGE_KEY);
      if (savedBins) binsStore = JSON.parse(savedBins);
    } catch {
      binsStore = null;
    }

    if (!binsStore) {
      binsStore = binsData.map(({ demoDaysSinceEmptying, ...bin }) => ({
        ...bin,
        // Keeps the demonstration meaningful whenever it is opened.
        lastEmptied: dateDaysAgo(demoDaysSinceEmptying),
      }));
      saveStore();
    }
  }
  return binsStore;
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(binsStore));
  } catch {
    // The app stays usable if browser storage is unavailable.
  }
}

function nextBinId(store) {
  const nums = store
    .map((b) => parseInt(b.id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `B${max + 1}`;
}

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBins() {
  await delay();
  return initStore().map((bin) => ({ ...bin }));
}

export async function addBin({ block, location, type, fillLevel = 0, latitude, longitude }) {
  await delay();

  if (!block?.trim()) throw new Error("Block is required");
  if (!location?.trim()) throw new Error("Location is required");
  if (!type) throw new Error("Bin type is required");
  if ((latitude === undefined) !== (longitude === undefined)) {
    throw new Error("Both latitude and longitude are required for a map location");
  }
  if (latitude !== undefined && (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)) {
    throw new Error("Enter a valid map location");
  }

  const store = initStore();
  const bin = {
    id: nextBinId(store),
    block: block.trim(),
    location: location.trim(),
    type,
    fillLevel: Math.min(100, Math.max(0, Number(fillLevel) || 0)),
    lastEmptied: new Date().toISOString().slice(0, 10),
    latitude,
    longitude,
  };

  store.push(bin);
  saveStore();
  return { ...bin };
}

export async function emptyBin(binId) {
  await delay();

  const store = initStore();
  const bin = store.find((b) => b.id === binId);
  if (!bin) throw new Error(`Bin ${binId} not found`);

  bin.fillLevel = 0;
  bin.lastEmptied = new Date().toISOString().slice(0, 10);
  saveStore();
  return { ...bin };
}

export async function updateBinFill(binId, fillLevel) {
  await delay();
  const bin = initStore().find((item) => item.id === binId);
  if (!bin) throw new Error(`Bin ${binId} not found`);

  bin.fillLevel = Math.min(100, Math.max(0, Number(fillLevel)));
  saveStore();
  return { ...bin };
}
