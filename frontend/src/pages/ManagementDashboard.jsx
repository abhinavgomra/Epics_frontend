import { useMemo, useState } from "react";
import { useBinsDataContext } from "../context/BinsDataContext";
import { LoadingState, ErrorState } from "../components/Feedback";
import PageHeader from "../components/PageHeader";
import FillTrendChart from "../components/FillTrendChart";
import AlertLog from "../components/AlertLog";
import CollectionTable from "../components/CollectionTable";
import ManagementStatsBar from "../components/ManagementStatsBar";
import { filterCollections } from "../utils/collectionStats";
import { CAMPUS_BLOCKS } from "../constants/bins";

const BLOCKS = ["all", ...CAMPUS_BLOCKS];
const STATUSES = ["all", "completed", "missed", "pending"];
const DATE_RANGES = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

export default function ManagementDashboard() {
  const {
    loading,
    error,
    refetch,
    collections,
    collectionsLoading,
    collectionsError,
    refetchCollections,
  } = useBinsDataContext();

  const [blockFilter, setBlockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [daysFilter, setDaysFilter] = useState("all");

  const filteredCollections = useMemo(
    () =>
      filterCollections(collections, {
        block: blockFilter,
        status: statusFilter,
        days: daysFilter,
      }),
    [collections, blockFilter, statusFilter, daysFilter],
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} message={error} />;

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Waste Management & Analytics"
        subtitle="Collection trends, alerts, and history across campus"
      />

      <ManagementStatsBar collections={filteredCollections} />

      <div className="filter-bar">
        <label>
          Block
          <select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)}>
            {BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b === "all" ? "All Blocks" : b}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date range
          <select value={daysFilter} onChange={(e) => setDaysFilter(e.target.value)}>
            {DATE_RANGES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <span className="filter-card__meta">
          Showing {filteredCollections.length} of {collections.length} records
        </span>
      </div>

      <div className="management-grid">
        <FillTrendChart collections={filteredCollections} />
        <div className="management-grid__split">
          <AlertLog />
          <CollectionTable
            collections={filteredCollections}
            loading={collectionsLoading}
            error={collectionsError}
            onRetry={refetchCollections}
          />
        </div>
      </div>
    </div>
  );
}
