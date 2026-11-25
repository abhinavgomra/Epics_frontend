import { useCallback, useEffect, useState } from "react";
import { addReading, getReadings } from "../services/readingService";
import { updateBinFill } from "../services/binService";

export function useReadingsData({ updateBinInState } = {}) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReadings(await getReadings());
    } catch (requestError) {
      setError(requestError.message || "Failed to load readings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const recordReading = useCallback(async ({ binId, fillLevel }) => {
    const reading = await addReading({ binId, fillLevel });
    const updatedBin = await updateBinFill(binId, fillLevel);
    updateBinInState?.(updatedBin);
    setReadings((previous) => [...previous, reading]);
    return reading;
  }, [updateBinInState]);

  return { readings, readingsLoading: loading, readingsError: error, refetchReadings: refetch, recordReading };
}
