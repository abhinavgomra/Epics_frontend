import { useTheme } from "../context/ThemeContext";

export function PanelLoadingState({ label = "Loading…" }) {
  const { theme } = useTheme();

  return (
    <div className="panel">
      <div className="skeleton skeleton-title" style={{ width: "50%", height: 20 }} />
      <div className="skeleton" style={{ height: 120, marginTop: theme.spacing.md }} />
      <p style={{ color: theme.colors.textMuted, textAlign: "center", marginTop: theme.spacing.md }}>
        {label}
      </p>
    </div>
  );
}

export function LoadingState() {
  const { theme } = useTheme();

  return (
    <div className="dashboard-page">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-stat" />
        ))}
      </div>
      <p style={{ color: theme.colors.textMuted, textAlign: "center", fontWeight: 500 }}>
        Loading dashboard…
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="dashboard-page" style={{ textAlign: "center" }}>
      <div className="error-box">
        <h3 className="error-box__title">Unable to load data</h3>
        <p className="error-box__message">{message}</p>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
