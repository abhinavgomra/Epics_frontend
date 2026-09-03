import api from "./api";

export async function getBins() {
  const response = await api.get("/dustbins");
  return response.data;
}

export async function addBin({
  block,
  location,
  type,
  fillLevel = 0,
}) {
  if (!block?.trim()) {
    throw new Error("Block is required");
  }

  if (!location?.trim()) {
    throw new Error("Location is required");
  }

  if (!type) {
    throw new Error("Bin type is required");
  }

  const response = await api.post("/dustbins", {
    block: block.trim(),
    location: location.trim(),
    type,
    fillLevel: Number(fillLevel) || 0,
  });

  return response.data;
}

export async function emptyBin(binId) {
  const response = await api.put(`/dustbins/${binId}`, {
    fillLevel: 0,
    lastEmptied: new Date().toISOString(),
  });

  return response.data;
}