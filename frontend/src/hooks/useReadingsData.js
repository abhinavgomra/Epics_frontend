import { useState, useEffect, useCallback } from "react";
import { getReadingsByBinId } from "../services/readingService";

export function useReadingsData(binId) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReadings = useCallback(async () => {
    if (!binId) {
      setReadings([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getReadingsByBinId(binId);
      setReadings(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load reading history");
      setLoading(false);
    }
  }, [binId]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  return {
    readings,
    loading,
    error,
    refetch: fetchReadings,
  };
}