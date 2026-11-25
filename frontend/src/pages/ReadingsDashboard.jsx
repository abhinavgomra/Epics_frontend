import { useMemo, useState } from "react";
import { useBinsDataContext } from "../context/BinsDataContext";
import { LoadingState, ErrorState } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
import { getBinPrediction } from "../utils/pickupPlanner";

function formatFullTime(daysToFull) {
  if (daysToFull === null) return "Not enough growth data";
  if (daysToFull < 1) return `in about ${Math.max(1, Math.round(daysToFull * 24))} hours`;
  return `in about ${Math.ceil(daysToFull)} days`;
}

export default function ReadingsDashboard() {
  const { bins, readings, loading, error, refetch, recordReading } = useBinsDataContext();
  const [selectedBinId, setSelectedBinId] = useState("");
  const [fillLevel, setFillLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const selectedBin = bins.find((bin) => bin.id === (selectedBinId || bins[0]?.id));
  const prediction = useMemo(
    () => selectedBin ? getBinPrediction(selectedBin, readings) : null,
    [selectedBin, readings],
  );
  const recentReadings = useMemo(
    () => readings.filter((reading) => reading.binId === selectedBin?.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5),
    [readings, selectedBin],
  );

  async function submitReading(event) {
    event.preventDefault();
    if (!selectedBin) return;
    setSaving(true);
    setMessage("");
    try {
      await recordReading({ binId: selectedBin.id, fillLevel });
      setMessage(`Reading saved for ${selectedBin.id}. The prediction has been updated.`);
      setFillLevel("");
    } catch (saveError) {
      setMessage(saveError.message || "Unable to save the reading.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} message={error} />;

  return (
    <main className="dashboard-page readings-page">
      <PageHeader
        title="Daily Fill Readings"
        subtitle="Record today’s observation and see how the local prediction changes."
      />

      <div className="readings-layout">
        <section className="reading-entry-card">
          <h2 className="section-title">Record a reading</h2>
          <form onSubmit={submitReading} className="reading-entry-form">
            <label>
              Dustbin
              <select value={selectedBin?.id || ""} onChange={(event) => setSelectedBinId(event.target.value)}>
                {bins.map((bin) => <option key={bin.id} value={bin.id}>{bin.id} · {bin.location} ({bin.block})</option>)}
              </select>
            </label>
            <label>
              Current fill level (%)
              <input type="number" min="0" max="100" value={fillLevel} onChange={(event) => setFillLevel(event.target.value)} placeholder={`Current: ${selectedBin?.fillLevel ?? 0}%`} required />
            </label>
            <p className="reading-entry-card__hint">Use a visual estimate of how full the bin is. The current time is saved automatically.</p>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save reading"}</button>
          </form>
          {message && <p className="reading-message">{message}</p>}
        </section>

        {selectedBin && prediction && (
          <section className="prediction-card">
            <div className="prediction-card__heading">
              <div>
                <p className="prediction-card__eyebrow">Local model prediction</p>
                <h2>{selectedBin.id} · {selectedBin.location}</h2>
              </div>
              <span className={`confidence-badge confidence-badge--${prediction.confidence.toLowerCase()}`}>{prediction.confidence} confidence</span>
            </div>
            <div className="prediction-grid">
              <div><span>Current</span><strong>{selectedBin.fillLevel}%</strong></div>
              <div><span>Daily growth</span><strong>+{prediction.dailyFillRate}%</strong></div>
              <div><span>Tomorrow</span><strong>{prediction.predictedTomorrow}%</strong></div>
              <div><span>In 3 days</span><strong>{prediction.predictedInThreeDays}%</strong></div>
            </div>
            <p className="prediction-full-time">Expected to reach full capacity: <strong>{formatFullTime(prediction.daysToFull)}</strong></p>
            <p className="prediction-source">Based on {prediction.readingCount} recent readings for this bin.</p>
          </section>
        )}
      </div>

      <section className="reading-history-card">
        <h2 className="section-title">Recent readings for {selectedBin?.id}</h2>
        <div className="reading-history-list">
          {recentReadings.map((reading) => (
            <div key={reading.id} className="reading-history-row">
              <strong>{reading.fillLevel}%</strong>
              <span>{new Date(reading.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
