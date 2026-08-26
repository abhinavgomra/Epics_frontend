import collectionsData from "../data/collections.json";

const DELAY_MS = 300;

let collectionsStore = null;

function initStore() {
  if (!collectionsStore) {
    collectionsStore = collectionsData.map((entry) => ({ ...entry }));
  }
  return collectionsStore;
}

function nextCollectionId(store) {
  const nums = store
    .map((c) => parseInt(c.id.replace(/\D/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `C${max + 1}`;
}

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCollections() {
  await delay();
  return initStore().map((entry) => ({ ...entry }));
}

export async function addCollection({ binId, block, type, weightKg, status = "completed" }) {
  await delay();

  if (!binId) throw new Error("Bin ID is required");
  if (!block?.trim()) throw new Error("Block is required");
  if (!type) throw new Error("Bin type is required");

  const store = initStore();
  const entry = {
    id: nextCollectionId(store),
    binId,
    block: block.trim(),
    type,
    weightKg: Math.round((Number(weightKg) || 0) * 10) / 10,
    collectedAt: new Date().toISOString().slice(0, 16),
    status,
  };

  store.push(entry);
  return { ...entry };
}
