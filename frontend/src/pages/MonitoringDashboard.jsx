import { useState, useMemo } from "react";
import { theme } from "../theme";
import { useBinsDataContext } from "../context/BinsDataContext";
import { filterBins, sortBinsByUrgency } from "../utils/binStats";
import { CAMPUS_BLOCKS, BIN_TYPES } from "../constants/bins";
import { LoadingState, ErrorState } from "../components/Feedback";
import StatsBar from "../components/StatsBar";
import BinMap from "../components/BinMap";
import BinCard from "../components/BinCard";
import AddBinForm from "../components/AddBinForm";

const BLOCKS = ["all", ...CAMPUS_BLOCKS];
const TYPES = ["all", ...BIN_TYPES];

function formatLastUpdated(date) {
  if (!date) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function MonitoringDashboard() {
  const { bins, loading, error, lastUpdated, refetch, addBin } =
    useBinsDataContext();
  const [blockFilter, setBlockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBinId, setSelectedBinId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const displayedBins = useMemo(
    () =>
      sortBinsByUrgency(
        filterBins(bins, { block: blockFilter, type: typeFilter }),
      ),
    [bins, blockFilter, typeFilter],
  );

  function handleSelectBin(binId) {
    setSelectedBinId(binId);
    document
      .getElementById(`bin-card-${binId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleBinAdded(newBin) {
    setShowAddForm(false);
    if (newBin?.id) {
      setSelectedBinId(newBin.id);
      setTimeout(() => handleSelectBin(newBin.id), 100);
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div
      className="dashboard-page"
      style={{
        background: theme.colors.background,
        minHeight: "calc(100vh - 52px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xl,
        }}
      >
        <div>
          <h2 style={{ margin: `0 0 ${theme.spacing.xs}`, fontSize: "1.75rem" }}>
            Waste Bin Monitoring
          </h2>
          <p style={{ color: theme.colors.textMuted, fontSize: "0.95rem" }}>
            Live fill levels across campus blocks
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md }}>
          {lastUpdated && (
            <div className="live-badge">
              <span className="live-dot" aria-hidden="true" />
              Last updated: {formatLastUpdated(lastUpdated)}
            </div>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAddForm((v) => !v)}
          >
            {showAddForm ? "Close Form" : "+ Add Dustbin"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <AddBinForm onSubmit={addBin} onCancel={handleBinAdded} />
      )}

      <StatsBar bins={bins} />

      <div className="filter-bar">
        <label>
          Block
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
          >
            {BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b === "all" ? "All Blocks" : b}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <span style={{ fontSize: "0.85rem", color: theme.colors.textMuted }}>
          Showing {displayedBins.length} of {bins.length} bins
        </span>
      </div>

      <section style={{ marginBottom: theme.spacing.xxl }}>
        <BinMap
          bins={displayedBins}
          selectedBinId={selectedBinId}
          onSelectBin={handleSelectBin}
        />
      </section>

      <section>
        <h3 style={{ margin: `0 0 ${theme.spacing.md}`, fontSize: "1.1rem" }}>
          All Bins
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 400,
              color: theme.colors.textMuted,
              marginLeft: theme.spacing.sm,
            }}
          >
            sorted by urgency
          </span>
        </h3>
        {displayedBins.length === 0 ? (
          <p style={{ color: theme.colors.textMuted }}>
            No bins match the current filters.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: theme.spacing.md,
            }}
          >
            {displayedBins.map((bin) => (
              <BinCard
                key={bin.id}
                bin={bin}
                highlighted={selectedBinId === bin.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
