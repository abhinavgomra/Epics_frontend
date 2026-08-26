import { useTheme } from "../context/ThemeContext";

const STATUS_STYLES = {
  completed: (colors) => ({
    bg: colors.primaryLight,
    color: colors.status.ok,
    label: "Completed",
  }),
  missed: () => ({
    bg: "color-mix(in srgb, var(--color-status-critical) 15%, var(--color-surface))",
    color: "var(--color-status-critical)",
    label: "Missed",
  }),
  pending: () => ({
    bg: "color-mix(in srgb, var(--color-status-warning) 15%, var(--color-surface))",
    color: "var(--color-status-warning)",
    label: "Pending",
  }),
};

export default function StatusBadge({ status }) {
  const { theme } = useTheme();
  const factory = STATUS_STYLES[status];
  const style = factory
    ? factory(theme.colors)
    : {
        bg: theme.colors.background,
        color: theme.colors.textMuted,
        label: status,
      };

  return (
    <span
      className="status-badge"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}
