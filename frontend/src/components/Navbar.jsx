import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">♻</span>
        <span className="navbar__title">Smart Waste</span>
      </Link>
      <div className="navbar__links">
        <Link
          to="/"
          className={`navbar__link${location.pathname === "/" ? " navbar__link--active" : ""}`}
          aria-current={location.pathname === "/" ? "page" : undefined}
        >
          Monitoring
        </Link>
        <Link
          to="/management"
          className={`navbar__link${location.pathname === "/management" ? " navbar__link--active" : ""}`}
          aria-current={location.pathname === "/management" ? "page" : undefined}
        >
          Management
        </Link>
        <Link
          to="/pickup-plan"
          className={`navbar__link${location.pathname === "/pickup-plan" ? " navbar__link--active" : ""}`}
          aria-current={location.pathname === "/pickup-plan" ? "page" : undefined}
        >
          Pickup Plan
        </Link>
        <Link
          to="/worker"
          className={`navbar__link${location.pathname === "/worker" ? " navbar__link--active" : ""}`}
          aria-current={location.pathname === "/worker" ? "page" : undefined}
        >
          Worker Route
        </Link>
        <Link
          to="/readings"
          className={`navbar__link${location.pathname === "/readings" ? " navbar__link--active" : ""}`}
          aria-current={location.pathname === "/readings" ? "page" : undefined}
        >
          Fill Readings
        </Link>
      </div>
      <ThemeSwitcher />
    </nav>
  );
}
