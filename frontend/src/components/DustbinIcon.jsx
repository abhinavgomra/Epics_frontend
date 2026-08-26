import { useId } from "react";
import { getStatusClass, getStatusColor } from "../theme";
import { useTheme } from "../context/ThemeContext";

export default function DustbinIcon({
  fillLevel = 0,
  size = 52,
  animated = true,
  className = "",
}) {
  const { theme } = useTheme();
  const uid = useId().replace(/:/g, "");
  const status = getStatusClass(fillLevel);
  const color = getStatusColor(fillLevel, theme.colors);
  const clamped = Math.min(100, Math.max(0, fillLevel));
  const fillH = (34 * clamped) / 100;
  const fillY = 46 - fillH;

  return (
    <svg
      className={`dustbin-icon dustbin-icon--${status}${animated ? " dustbin-icon--animated" : ""} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 48 56"
      aria-hidden="true"
      style={{ "--bin-fill-color": color }}
    >
      <defs>
        <clipPath id={`bin-body-${uid}`}>
          <path d="M13 14 L15 50 Q15 52 17 52 L31 52 Q33 52 33 50 L35 14 Z" />
        </clipPath>
      </defs>

      <g className="dustbin-icon__lid-group">
        <rect x="17" y="2" width="14" height="3" rx="1.5" className="dustbin-icon__handle" />
        <rect x="9" y="6" width="30" height="5" rx="2" className="dustbin-icon__lid" />
      </g>

      <path
        d="M13 14 L15 50 Q15 52 17 52 L31 52 Q33 52 33 50 L35 14 Z"
        className="dustbin-icon__body"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="13"
        y={fillY}
        width="22"
        height={fillH}
        fill={color}
        clipPath={`url(#bin-body-${uid})`}
        className="dustbin-icon__fill"
      />

      <line x1="19" y1="20" x2="18" y2="48" className="dustbin-icon__line" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="24" y1="20" x2="24" y2="48" className="dustbin-icon__line" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="29" y1="20" x2="30" y2="48" className="dustbin-icon__line" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}
