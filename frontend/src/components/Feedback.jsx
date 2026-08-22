import { theme } from "../theme";

export function LoadingState() {
  return (
    <div className="dashboard-page">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-stat" />
        ))}
      </div>
      <p style={{ color: theme.colors.textMuted, textAlign: "center" }}>
        Loading bin data…
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="dashboard-page" style={{ textAlign: "center" }}>
      <div className="error-box">
        <h3 style={{ margin: `0 0 ${theme.spacing.sm}`, color: theme.colors.status.critical }}>
          Unable to load bin data
        </h3>
        <p style={{ margin: `0 0 ${theme.spacing.md}`, color: theme.colors.textMuted }}>
          {message}
        </p>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
