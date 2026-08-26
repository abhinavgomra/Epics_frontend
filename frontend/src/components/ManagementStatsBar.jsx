import {
  getCompletedCount,
  getMissedCount,
  getTotalWeight,
} from "../utils/collectionStats";
import { useTheme } from "../context/ThemeContext";
import StatCard from "./StatCard";

export default function ManagementStatsBar({ collections }) {
  const { theme } = useTheme();

  const stats = [
    {
      label: "Total Collections",
      value: collections.length,
      accent: theme.colors.primary,
      icon: "📋",
    },
    {
      label: "Completed",
      value: getCompletedCount(collections),
      accent: theme.colors.status.ok,
      icon: "✓",
    },
    {
      label: "Missed",
      value: getMissedCount(collections),
      accent: theme.colors.status.critical,
      icon: "✕",
    },
    {
      label: "Total Weight",
      value: `${getTotalWeight(collections)} kg`,
      accent: theme.colors.status.warning,
      icon: "⚖",
    },
  ];

  return (
    <div className="stat-grid">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
