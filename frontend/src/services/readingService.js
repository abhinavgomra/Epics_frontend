import api from "./api";

export async function getReadingsByBinId(binId) {
  const response = await api.get(`/readings/dustbins/${binId}/readings`);
  return response.data;
}

export async function addReading({ binId, fillLevel }) {
  if (!binId) {
    throw new Error("Bin ID is required");
  }

  if (fillLevel === undefined) {
    throw new Error("Fill level is required");
  }

  const response = await api.post("/readings", {
    binId,
    fillLevel: Number(fillLevel),
  });

  return response.data;
}