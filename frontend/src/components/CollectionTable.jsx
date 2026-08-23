import { useEffect, useState } from "react";
import { getCollections } from "../services/collectionService";
import { theme } from "../theme";
import { LoadingState, ErrorState } from "./Feedback";

const COLUMNS = ["id", "binId", "block", "type", "weightKg", "collectedAt", "status"];
const LABELS = {
  id: "ID", binId: "Bin", block: "Block", type: "Type",
  weightKg: "Weight (kg)", collectedAt: "Date", status: "Status",
};

export default function CollectionTable() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("collectedAt");
  const [sortAsc, setSortAsc] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    getCollections()
      .then(setCollections)
      .catch((e) => setError(e.message ?? "Failed to load collections"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={load} message={error} />;
  if (collections.length === 0) {
    return <p style={{ color: theme.colors.textMuted ?? "#888" }}>No collection records yet.</p>;
  }

  const sorted = [...collections].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    return a[sortKey] > b[sortKey] ? dir : -dir;
  });

  const toggleSort = (key) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <div style={{
      background: theme.colors.surface ?? "#fff",
      borderRadius: theme.radius ?? "12px",
      padding: theme.spacing?.lg ?? "1.5rem",
      boxShadow: theme.shadows?.card ?? "0 1px 4px rgba(0,0,0,0.08)",
      overflowX: "auto",
    }}>
      <h3 style={{ marginBottom: "0.75rem" }}>Collection History</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col}
                onClick={() => toggleSort(col)}
                style={{
                  textAlign: "left",
                  padding: "0.5rem",
                  cursor: "pointer",
                  borderBottom: `2px solid ${theme.colors.border ?? "#eee"}`,
                  fontSize: "0.85rem",
                  userSelect: "none",
                }}
              >
                {LABELS[col]} {sortKey === col ? (sortAsc ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id}>
              {COLUMNS.map((col) => (
                <td key={col} style={{ padding: "0.5rem", borderBottom: `1px solid ${theme.colors.border ?? "#f2f2f2"}`, fontSize: "0.9rem" }}>
                  {col === "collectedAt" ? row[col].split("T")[0] : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}