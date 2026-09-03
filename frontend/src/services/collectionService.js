import api from "./api";

export async function getCollections() {
  const response = await api.get("/collections");
  return response.data;
}

export async function addCollection({
  binId,
  block,
  type,
  weightKg,
  status = "completed",
}) {
  if (!binId) {
    throw new Error("Bin ID is required");
  }

  if (!type) {
    throw new Error("Bin type is required");
  }

  const response = await api.post("/collections", {
    binId,
    type,
    weightKg: Number(weightKg) || 0,
    status,
  });

  return response.data;
}