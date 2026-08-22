import { getCriticalCount, getAverageFill } from "../utils/binStats";
import { theme } from "../theme";

export default function StatsBar({ bins }) {
  const stats = [
    { label: "Total Bins", value: bins.length, color: theme.colors.primary },
    {
      label: "Critical (>80%)",
      value: getCriticalCount(bins),
      color: theme.colors.status.critical,
    },
    {
      label: "Average Fill",
      value: `${getAverageFill(bins)}%`,
      color: theme.colors.status.warning,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
      }}
    >
      {stats.map(({ label, value, color }) => (
        <div
          key={label}
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.lg,
            boxShadow: theme.shadow.sm,
            borderTop: `3px solid ${color}`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              color: theme.colors.textMuted,
            }}
          >
            {label}
          </p>
          <p
            style={{
              margin: `${theme.spacing.xs} 0 0`,
              fontSize: "1.75rem",
              fontWeight: 700,
              color: theme.colors.text,
            }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
