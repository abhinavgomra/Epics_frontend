import { useState, useEffect, useCallback } from "react";
import { getCollections, addCollection as addCollectionService } from "../services/collectionService";
import { emptyBin as emptyBinService } from "../services/binService";

export function useCollectionsData({ bins = [], updateBinInState } = {}) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCollections();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load collections");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const addCollection = useCallback(async (input) => {
    const entry = await addCollectionService(input);
    setCollections((prev) => [...prev, entry]);
    return entry;
  }, []);

  const markBinCollected = useCallback(
    async (binId) => {
      const bin = bins.find((b) => b.id === binId);
      if (!bin) throw new Error(`Bin ${binId} not found`);

      const weightKg = Math.round((bin.fillLevel / 100) * 15 * 10) / 10;
      const updatedBin = await emptyBinService(binId);
      updateBinInState?.(updatedBin);

      const entry = await addCollectionService({
        binId: bin.id,
        block: bin.block,
        type: bin.type,
        weightKg: weightKg || 1,
        status: "completed",
      });

      setCollections((prev) => [...prev, entry]);
      return { bin: updatedBin, collection: entry };
    },
    [bins, updateBinInState],
  );

  return {
    collections,
    loading,
    error,
    refetch: fetchCollections,
    addCollection,
    markBinCollected,
  };
}
