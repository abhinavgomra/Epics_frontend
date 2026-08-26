import { useState } from "react";
import { Link } from "react-router-dom";
import { useBinsDataContext } from "../context/BinsDataContext";

export default function AlertLog() {
  const { bins, collections, markBinCollected } = useBinsDataContext();
  const [collectingId, setCollectingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const criticalBins = bins.filter((b) => b.fillLevel > 80);
  const missedCollections = collections.filter((c) => c.status === "missed");

  const alerts = [
    ...criticalBins.map((b) => ({
      id: `bin-${b.id}`,
      severity: "critical",
      binId: b.id,
      message: `Bin ${b.id} (${b.location}, ${b.block}) is ${b.fillLevel}% full`,
      time: "Just now",
      actionable: true,
    })),
    ...missedCollections.map((c) => ({
      id: `col-${c.id}`,
      severity: "warning",
      binId: c.binId,
      message: `Missed collection for ${c.binId} (${c.block}) on ${c.collectedAt.split("T")[0]}`,
      time: c.collectedAt.split("T")[0],
      actionable: false,
    })),
  ];

  async function handleCollect(binId) {
    setCollectingId(binId);
    setActionError("");
    try {
      await markBinCollected(binId);
    } catch (err) {
      setActionError(err.message || "Failed to mark bin as collected");
    } finally {
      setCollectingId(null);
    }
  }

  return (
    <div className="panel">
      <h3 className="panel__title">Alert Log</h3>
      {actionError && <p className="alert-action-error">{actionError}</p>}
      {alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">✓</div>
          <p className="empty-state__text">
            All bins are within safe levels. No active alerts.
          </p>
        </div>
      ) : (
        alerts.map((a) => (
          <div key={a.id} className={`alert-item alert-item--${a.severity}`}>
            <div className="alert-item__content">
              <span className="alert-item__message">{a.message}</span>
              <div className="alert-item__actions">
                <Link to={`/?bin=${a.binId}`} className="btn-ghost">
                  View bin
                </Link>
                {a.actionable && (
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    disabled={collectingId === a.binId}
                    onClick={() => handleCollect(a.binId)}
                  >
                    {collectingId === a.binId ? "Collecting…" : "Mark collected"}
                  </button>
                )}
              </div>
            </div>
            <span className="alert-item__time">{a.time}</span>
          </div>
        ))
      )}
    </div>
  );
}
