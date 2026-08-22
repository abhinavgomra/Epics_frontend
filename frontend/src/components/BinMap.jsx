import { theme, getStatusColor } from "../theme";
import { CAMPUS_BLOCKS } from "../constants/bins";

export default function BinMap({ bins, selectedBinId, onSelectBin }) {
  const binsByBlock = CAMPUS_BLOCKS.map((block) => ({
    block,
    bins: bins.filter((bin) => bin.block === block),
  }));

  return (
    <div style={{ textAlign: "left" }}>
      <h3
        style={{
          margin: `0 0 ${theme.spacing.md}`,
          fontSize: "1.1rem",
          color: theme.colors.text,
        }}
      >
        Campus Bin Map
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: theme.spacing.md,
        }}
      >
        {binsByBlock.map(({ block, bins: blockBins }) => (
          <div
            key={block}
            style={{
              background: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              padding: theme.spacing.md,
              boxShadow: theme.shadow.sm,
            }}
          >
            <p
              style={{
                margin: `0 0 ${theme.spacing.sm}`,
                fontWeight: 600,
                fontSize: "0.9rem",
                color: theme.colors.text,
              }}
            >
              {block}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))",
                gap: theme.spacing.sm,
                minHeight: "100px",
                alignContent: "center",
              }}
            >
              {blockBins.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: theme.colors.textMuted, gridColumn: "1 / -1" }}>
                  No bins in this block
                </p>
              ) : (
                blockBins.map((bin) => {
                  const color = getStatusColor(bin.fillLevel);
                  const isCritical = bin.fillLevel > 80;
                  const isSelected = selectedBinId === bin.id;

                  return (
                    <button
                      key={bin.id}
                      type="button"
                      className={`map-tile${isSelected ? " map-tile--selected" : ""}`}
                      title={`${bin.id} — ${bin.location} — ${bin.fillLevel}% (${bin.type})`}
                      aria-label={`${bin.id} at ${bin.location}, ${bin.fillLevel}% full`}
                      onClick={() => onSelectBin?.(bin.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <div
                        className={`map-tile__dot${isCritical ? " map-tile__dot--critical" : ""}`}
                        style={{
                          background: color,
                          boxShadow: `0 2px 6px ${color}55`,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: theme.colors.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        {bin.id}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: theme.spacing.lg,
          marginTop: theme.spacing.md,
          fontSize: "0.8rem",
          color: theme.colors.textMuted,
        }}
      >
        {[
          { label: "OK (<50%)", color: theme.colors.status.ok },
          { label: "Warning (50–80%)", color: theme.colors.status.warning },
          { label: "Critical (>80%)", color: theme.colors.status.critical },
        ].map(({ label, color }) => (
          <span key={label}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                marginRight: 6,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
