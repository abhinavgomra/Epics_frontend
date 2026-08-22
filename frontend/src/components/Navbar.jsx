import { Link, useLocation } from "react-router-dom";
import { theme } from "../theme";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    color:
      location.pathname === path
        ? theme.colors.navText
        : theme.colors.navTextMuted,
    textDecoration: "none",
    fontWeight: location.pathname === path ? 600 : 400,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.sm,
    background:
      location.pathname === path ? theme.colors.navActive : "transparent",
    transition: "background 0.15s, color 0.15s",
    fontFamily: theme.fontFamily,
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.sm,
        padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
        background: theme.colors.navBackground,
        color: theme.colors.navText,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          marginRight: theme.spacing.lg,
          letterSpacing: "-0.02em",
          fontFamily: theme.fontFamily,
        }}
      >
        Smart Waste
      </span>
      <Link to="/" style={linkStyle("/")} aria-current={location.pathname === "/" ? "page" : undefined}>
        Monitoring
      </Link>
      <Link
        to="/management"
        style={linkStyle("/management")}
        aria-current={location.pathname === "/management" ? "page" : undefined}
      >
        Management
      </Link>
    </nav>
  );
}
