import { getStatusColor, getStatusLabel } from "../theme";
import { useTheme } from "../context/ThemeContext";
import DustbinIcon from "./DustbinIcon";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BinCard({ bin, highlighted = false }) {
  const { theme } = useTheme();
  const color = getStatusColor(bin.fillLevel, theme.colors);
  const statusLabel = getStatusLabel(bin.fillLevel);

  return (
    <div
      id={`bin-card-${bin.id}`}
      className={`bin-card${highlighted ? " bin-card--highlighted" : ""}`}
      style={{ "--bin-accent": color }}
      aria-label={`${bin.id}, ${statusLabel}, ${bin.fillLevel}% full`}
    >
      <div className="bin-card__top">
        <DustbinIcon fillLevel={bin.fillLevel} size={56} animated />
        <div className="bin-card__header">
          <h3 className="bin-card__id">{bin.id}</h3>
          <div className="bin-card__badges">
            <span className="bin-card__status">{statusLabel}</span>
            <span className="bin-card__type">{bin.type}</span>
          </div>
        </div>
      </div>

      <p className="bin-card__block">{bin.block}</p>
      <p className="bin-card__location">{bin.location || "Unknown location"}</p>

      <p className="bin-card__fill">{bin.fillLevel}%</p>

      <div className="bin-card__progress-track">
        <div
          className="bin-card__progress-fill"
          style={{ width: `${bin.fillLevel}%` }}
        />
      </div>

      <p className="bin-card__meta">Last emptied: {formatDate(bin.lastEmptied)}</p>
    </div>
  );
}
