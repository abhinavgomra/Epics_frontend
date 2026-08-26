import { getStatusColor } from "../theme";
import { useTheme } from "../context/ThemeContext";
import { CAMPUS_BLOCKS } from "../constants/bins";
import DustbinIcon from "./DustbinIcon";

export default function BinMap({ bins, selectedBinId, onSelectBin }) {
  const { theme } = useTheme();

  const binsByBlock = CAMPUS_BLOCKS.map((block) => ({
    block,
    bins: bins.filter((bin) => bin.block === block),
  }));

  return (
    <div className="map-section">
      <h3 className="section-title">Campus Bin Map</h3>

      <div className="map-grid">
        {binsByBlock.map(({ block, bins: blockBins }) => (
          <div key={block} className="map-block">
            <p className="map-block__title">{block}</p>

            <div className="map-block__tiles">
              {blockBins.length === 0 ? (
                <p className="map-block__empty">No bins in this block</p>
              ) : (
                blockBins.map((bin) => {
                  const color = getStatusColor(bin.fillLevel, theme.colors);
                  const isSelected = selectedBinId === bin.id;

                  return (
                    <button
                      key={bin.id}
                      type="button"
                      className={`map-tile${isSelected ? " map-tile--selected" : ""}`}
                      title={`${bin.id} — ${bin.location} — ${bin.fillLevel}% (${bin.type})`}
                      aria-label={`${bin.id} at ${bin.location}, ${bin.fillLevel}% full`}
                      onClick={() => onSelectBin?.(bin.id)}
                      style={{ "--tile-accent": color }}
                    >
                      <DustbinIcon
                        fillLevel={bin.fillLevel}
                        size={44}
                        animated
                        className="map-tile__dustbin"
                      />
                      <span className="map-tile__label">{bin.id}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="map-legend">
        {[
          { label: "OK (<50%)", color: "var(--color-status-ok)" },
          { label: "Warning (50–80%)", color: "var(--color-status-warning)" },
          { label: "Critical (>80%)", color: "var(--color-status-critical)" },
        ].map(({ label, color }) => (
          <span key={label} className="map-legend__item">
            <span className="map-legend__dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
