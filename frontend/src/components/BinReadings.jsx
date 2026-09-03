import { useReadingsData } from "../hooks/useReadingsData";

export default function BinReadings({ binId }) {
  const { readings, loading, error } = useReadingsData(binId);

  if (!binId) {
    return null;
  }

  return (
    <section className="panel">
      <h3 className="panel__title">
        Fill Level History — {binId}
      </h3>

      {loading && <p>Loading reading history...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && readings.length === 0 && (
        <p>No reading history available for this bin.</p>
      )}

      {!loading && !error && readings.length > 0 && (
        <div>
          {readings.map((reading) => (
            <div key={reading.id}>
              <strong>{reading.fillLevel}%</strong>{" "}
              — {new Date(reading.timestamp).toLocaleString("en-IN")}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}