import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import StatusBadge from "./StatusBadge";
import { PanelLoadingState } from "./Feedback";

const COLUMNS = ["id", "binId", "block", "type", "weightKg", "collectedAt", "status"];
const LABELS = {
  id: "ID",
  binId: "Bin",
  block: "Block",
  type: "Type",
  weightKg: "Weight (kg)",
  collectedAt: "Date",
  status: "Status",
};

export default function CollectionTable({ collections, loading, error, onRetry }) {
  const { theme } = useTheme();
  const [sortKey, setSortKey] = useState("collectedAt");
  const [sortAsc, setSortAsc] = useState(false);

  if (loading) return <PanelLoadingState label="Loading collections…" />;
  if (error) {
    return (
      <div className="panel">
        <h3 className="panel__title">Collection History</h3>
        <p style={{ color: theme.colors.status.critical, margin: `0 0 ${theme.spacing.md}` }}>
          {error}
        </p>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  const sorted = [...collections].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    return a[sortKey] > b[sortKey] ? dir : -dir;
  });

  const toggleSort = (key) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="panel" style={{ overflowX: "auto" }}>
      <h3 className="panel__title">Collection History</h3>
      {collections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">📭</div>
          <p className="empty-state__text">
            No collection records match the current filters.
          </p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  aria-sort={
                    sortKey === col ? (sortAsc ? "ascending" : "descending") : "none"
                  }
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
                  <td key={col}>
                    {col === "collectedAt" && row[col].split("T")[0]}
                    {col === "status" && <StatusBadge status={row[col]} />}
                    {col === "binId" && (
                      <Link to={`/?bin=${row[col]}`} className="table-link">
                        {row[col]}
                      </Link>
                    )}
                    {col !== "collectedAt" && col !== "status" && col !== "binId" && row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
