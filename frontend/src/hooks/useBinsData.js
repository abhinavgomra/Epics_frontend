import { useState, useEffect, useCallback, useRef } from "react";
import { getBins, addBin as addBinService } from "../services/binService";

const UPDATE_INTERVAL_MS = 4500;

function nudgeFillLevel(level) {
  const delta =
    (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
  return Math.min(100, Math.max(0, level + delta));
}

export function useBinsData() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

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
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchBins]);

  useEffect(() => {
    if (loading || error || bins.length === 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => ({
          ...bin,
          fillLevel: nudgeFillLevel(bin.fillLevel),
        })),
      );
      setLastUpdated(new Date());
    }, UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading, error, bins.length]);

  return { bins, loading, error, lastUpdated, refetch: fetchBins, addBin };
}
