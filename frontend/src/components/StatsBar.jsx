import { getCriticalCount, getAverageFill } from "../utils/binStats";
import { useTheme } from "../context/ThemeContext";
import StatCard from "./StatCard";

export default function StatsBar({ bins }) {
  const { theme } = useTheme();

  const stats = [
    { label: "Total Bins", value: bins.length, accent: theme.colors.primary, icon: "🗑" },
    {
      label: "Critical (>80%)",
      value: getCriticalCount(bins),
      accent: theme.colors.status.critical,
      icon: "⚠",
    },
    {
      label: "Average Fill",
      value: `${getAverageFill(bins)}%`,
      accent: theme.colors.status.warning,
      icon: "📊",
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
