import { useBinsDataContext } from "../context/BinsDataContext";
import { LoadingState, ErrorState } from "../components/Feedback";
import FillTrendChart from "../components/FillTrendChart";
import AlertLog from "../components/Alertlog";
import CollectionTable from "../components/CollectionTable";
import { theme } from "../theme";

export default function ManagementDashboard() {
  const { loading, error, refetch } = useBinsDataContext();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState onRetry={refetch} message={error} />;

  return (
    <div style={{ padding: theme.spacing?.lg ?? "1.5rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Waste Management & Analytics</h2>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        <FillTrendChart />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <AlertLog />
          <CollectionTable />
        </div>
      </div>
    </div>
  );
}