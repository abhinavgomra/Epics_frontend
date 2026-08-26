import binsData from "../data/bins.json";

const DELAY_MS = 300;

let binsStore = null;

function initStore() {
  if (!binsStore) {
    binsStore = binsData.map((bin) => ({ ...bin }));
  }
  return binsStore;
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

export async function addBin({ block, location, type, fillLevel = 0 }) {
  await delay();

  if (!block?.trim()) throw new Error("Block is required");
  if (!location?.trim()) throw new Error("Location is required");
  if (!type) throw new Error("Bin type is required");

  const store = initStore();
  const bin = {
    id: nextBinId(store),
    block: block.trim(),
    location: location.trim(),
    type,
    fillLevel: Math.min(100, Math.max(0, Number(fillLevel) || 0)),
    lastEmptied: new Date().toISOString().slice(0, 10),
  };

  store.push(bin);
  return { ...bin };
}

export async function emptyBin(binId) {
  await delay();

  const store = initStore();
  const bin = store.find((b) => b.id === binId);
  if (!bin) throw new Error(`Bin ${binId} not found`);

  bin.fillLevel = 0;
  bin.lastEmptied = new Date().toISOString().slice(0, 10);
  return { ...bin };
}
