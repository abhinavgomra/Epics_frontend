import { useState, useEffect, useCallback } from "react";
import { getBins, addBin as addBinService } from "../services/binService";

export function useBinsData() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchBins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBins();
      setBins(data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load bin data");
      setLoading(false);
    }
  }, []);

  const addBin = useCallback(async (binInput) => {
    const newBin = await addBinService(binInput);

    setBins((prev) => [...prev, newBin]);
    setLastUpdated(new Date());

    return newBin;
  }, []);

  useEffect(() => {
    fetchBins();
  }, [fetchBins]);

  return {
    bins,
    setBins,
    loading,
    error,
    lastUpdated,
    setLastUpdated,
    refetch: fetchBins,
    addBin,
  };
}