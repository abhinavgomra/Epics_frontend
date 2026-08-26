import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useBinsDataContext } from "../context/BinsDataContext";
import { filterBins, sortBinsByUrgency } from "../utils/binStats";
import { CAMPUS_BLOCKS, BIN_TYPES } from "../constants/bins";
import { LoadingState, ErrorState } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
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
  const [searchParams] = useSearchParams();
  const [blockFilter, setBlockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBinId, setSelectedBinId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const binId = searchParams.get("bin");
    if (!binId || bins.length === 0) return;
    if (!bins.some((b) => b.id === binId)) return;

    setSelectedBinId(binId);
    const timer = setTimeout(() => {
      document
        .getElementById(`bin-card-${binId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchParams, bins]);

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
    <div className="dashboard-page">
      <PageHeader
        title="Waste Bin Monitoring"
        subtitle="Live fill levels across campus blocks — updated every few seconds"
        actions={
          <>
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
          </>
        }
      />

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
        <span className="filter-card__meta">
          Showing {displayedBins.length} of {bins.length} bins
        </span>
      </div>

      <BinMap
        bins={displayedBins}
        selectedBinId={selectedBinId}
        onSelectBin={handleSelectBin}
      />

      <section>
        <h3 className="section-title">
          All Bins
          <span className="section-title__hint">sorted by urgency</span>
        </h3>
        {displayedBins.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon" aria-hidden="true">🔍</div>
            <p className="empty-state__text">No bins match the current filters.</p>
          </div>
        ) : (
          <div className="bin-grid">
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
