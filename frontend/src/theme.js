export const theme = {
  colors: {
    primary: "#2563eb",
    background: "#f3f4f6",
    surface: "#ffffff",
    text: "#111827",
    textMuted: "#6b7280",
    textLight: "#9ca3af",
    border: "#e5e7eb",
    navBackground: "#111827",
    navText: "#ffffff",
    navTextMuted: "#9ca3af",
    navActive: "#374151",
    status: {
      ok: "#22c55e",
      warning: "#f97316",
      critical: "#ef4444",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "2.5rem",
  },
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  borderRadius: {
    sm: "6px",
    md: "12px",
    full: "999px",
  },
  shadow: {
    sm: "0 1px 4px rgba(0, 0, 0, 0.06)",
    md: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
};

export function getStatusColor(fillLevel) {
  if (fillLevel > 80) return theme.colors.status.critical;
  if (fillLevel >= 50) return theme.colors.status.warning;
  return theme.colors.status.ok;
}

export function getStatusLabel(fillLevel) {
  if (fillLevel > 80) return "Critical";
  if (fillLevel >= 50) return "Warning";
  return "OK";
}
