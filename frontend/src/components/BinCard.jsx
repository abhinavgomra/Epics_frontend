import { theme, getStatusColor, getStatusLabel } from "../theme";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BinCard({ bin, highlighted = false }) {
  const color = getStatusColor(bin.fillLevel);
  const statusLabel = getStatusLabel(bin.fillLevel);

  return (
    <div
      id={`bin-card-${bin.id}`}
      className={`bin-card${highlighted ? " bin-card--highlighted" : ""}`}
      style={{
        background: theme.colors.surface,
        border: `2px solid ${color}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        boxShadow: theme.shadow.md,
      }}
      aria-label={`${bin.id}, ${statusLabel}, ${bin.fillLevel}% full`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.sm,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: theme.colors.text }}>
          {bin.id}
        </h3>
        <div style={{ display: "flex", gap: theme.spacing.xs, alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color,
              textTransform: "uppercase",
            }}
          >
            {statusLabel}
          </span>
          <span
            style={{
              background: color,
              color: theme.colors.navText,
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.2rem 0.6rem",
              borderRadius: theme.borderRadius.full,
              textTransform: "uppercase",
            }}
          >
            {bin.type}
          </span>
        </div>
      </div>

      <p
        style={{
          margin: `0 0 ${theme.spacing.xs}`,
          color: theme.colors.textMuted,
          fontSize: "0.9rem",
        }}
      >
        {bin.block}
      </p>

      <p
        style={{
          margin: `0 0 ${theme.spacing.sm}`,
          color: theme.colors.text,
          fontSize: "0.85rem",
          fontWeight: 500,
        }}
      >
        Location: {bin.location || "Unknown"}
      </p>

      <p
        style={{
          margin: `0 0 ${theme.spacing.xs}`,
          fontSize: "1.5rem",
          fontWeight: 700,
          color,
        }}
      >
        {bin.fillLevel}%
      </p>

      <div className="bin-card__progress-track">
        <div
          className="bin-card__progress-fill"
          style={{ width: `${bin.fillLevel}%`, background: color }}
        />
      </div>

      <p style={{ margin: 0, color: theme.colors.textLight, fontSize: "0.85rem" }}>
        Last emptied: {formatDate(bin.lastEmptied)}
      </p>
    </div>
  );
}
