import { useBinsDataContext } from "../context/BinsDataContext";
import { theme } from "../theme";
import collections from "../data/collections.json";

export default function AlertLog() {
  const { bins } = useBinsDataContext();

  const criticalBins = bins.filter((b) => b.fillLevel > 80);
  const missedCollections = collections.filter((c) => c.status === "missed");

  const alerts = [
    ...criticalBins.map((b) => ({
      id: `bin-${b.id}`,
      severity: "critical",
      message: `Bin ${b.id} (${b.location}, ${b.block}) is ${b.fillLevel}% full`,
      time: "Just now",
    })),
    ...missedCollections.map((c) => ({
      id: `col-${c.id}`,
      severity: "warning",
      message: `Missed collection for ${c.binId} (${c.block}) on ${c.collectedAt.split("T")[0]}`,
      time: c.collectedAt.split("T")[0],
    })),
  ];

  if (alerts.length === 0) {
    return (
      <div style={{ padding: theme.spacing?.md ?? "1rem" }}>
        <h3>Alert Log</h3>
        <p style={{ color: theme.colors.textMuted ?? "#888" }}>No active alerts.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: theme.colors.surface ?? "#fff",
      borderRadius: theme.radius ?? "12px",
      padding: theme.spacing?.lg ?? "1.5rem",
      boxShadow: theme.shadows?.card ?? "0 1px 4px rgba(0,0,0,0.08)",
    }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Alert Log</h3>
      {alerts.map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem 0",
            borderBottom: `1px solid ${theme.colors.border ?? "#eee"}`,
            color: a.severity === "critical" ? (theme.colors.danger ?? "#dc2626") : (theme.colors.warning ?? "#d97706"),
          }}
        >
          <span>{a.message}</span>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{a.time}</span>
        </div>
      ))}
    </div>
  );
}