export const THEME_IDS = ["eco", "dark", "ocean"];

export const THEME_LABELS = {
  eco: "Eco Light",
  dark: "Dark",
  ocean: "Ocean",
};

export const THEME_PRESETS = {
  eco: {
    colors: {
      primary: "#059669",
      primaryLight: "#d1fae5",
      primaryDark: "#047857",
      background: "#f4f7f5",
      backgroundAlt: "#ecfdf5",
      surface: "#ffffff",
      text: "#0f172a",
      textMuted: "#64748b",
      textLight: "#94a3b8",
      border: "#e2e8f0",
      navBackground: "#0f172a",
      navText: "#ffffff",
      navTextMuted: "#94a3b8",
      navActive: "#059669",
      status: { ok: "#10b981", warning: "#f59e0b", critical: "#ef4444" },
    },
    gradient: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(5, 150, 105, 0.12), transparent), linear-gradient(180deg, #ecfdf5 0%, #f4f7f5 220px)",
  },
  dark: {
    colors: {
      primary: "#34d399",
      primaryLight: "#064e3b",
      primaryDark: "#6ee7b7",
      background: "#0f172a",
      backgroundAlt: "#1e293b",
      surface: "#1e293b",
      text: "#f1f5f9",
      textMuted: "#94a3b8",
      textLight: "#64748b",
      border: "#334155",
      navBackground: "#020617",
      navText: "#f1f5f9",
      navTextMuted: "#64748b",
      navActive: "#059669",
      status: { ok: "#34d399", warning: "#fbbf24", critical: "#f87171" },
    },
    gradient: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(52, 211, 153, 0.08), transparent), linear-gradient(180deg, #1e293b 0%, #0f172a 220px)",
  },
  ocean: {
    colors: {
      primary: "#0284c7",
      primaryLight: "#e0f2fe",
      primaryDark: "#0369a1",
      background: "#f0f9ff",
      backgroundAlt: "#e0f2fe",
      surface: "#ffffff",
      text: "#0c4a6e",
      textMuted: "#64748b",
      textLight: "#94a3b8",
      border: "#bae6fd",
      navBackground: "#0c4a6e",
      navText: "#ffffff",
      navTextMuted: "#7dd3fc",
      navActive: "#0284c7",
      status: { ok: "#06b6d4", warning: "#f59e0b", critical: "#ef4444" },
    },
    gradient: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(2, 132, 199, 0.14), transparent), linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 220px)",
  },
};

/** @deprecated Use useTheme() from ThemeContext for dynamic theming */
export const theme = THEME_PRESETS.eco;

export function getThemePreset(themeId) {
  return THEME_PRESETS[themeId] ?? THEME_PRESETS.eco;
}

export function applyThemeToDocument(themeId) {
  const preset = getThemePreset(themeId);
  const root = document.documentElement;
  root.dataset.theme = themeId;

  const c = preset.colors;
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-primary-light", c.primaryLight);
  root.style.setProperty("--color-primary-dark", c.primaryDark);
  root.style.setProperty("--color-background", c.background);
  root.style.setProperty("--color-background-alt", c.backgroundAlt);
  root.style.setProperty("--color-surface", c.surface);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-text-muted", c.textMuted);
  root.style.setProperty("--color-text-light", c.textLight);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--color-nav-bg", c.navBackground);
  root.style.setProperty("--color-nav-text", c.navText);
  root.style.setProperty("--color-nav-muted", c.navTextMuted);
  root.style.setProperty("--color-nav-active", c.navActive);
  root.style.setProperty("--color-status-ok", c.status.ok);
  root.style.setProperty("--color-status-warning", c.status.warning);
  root.style.setProperty("--color-status-critical", c.status.critical);
  root.style.setProperty("--body-gradient", preset.gradient);

  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c.primary);
}

export function getStatusColor(fillLevel, colors = theme.colors) {
  if (fillLevel > 80) return colors.status.critical;
  if (fillLevel >= 50) return colors.status.warning;
  return colors.status.ok;
}

export function getStatusLabel(fillLevel) {
  if (fillLevel > 80) return "Critical";
  if (fillLevel >= 50) return "Warning";
  return "OK";
}

export function getStatusClass(fillLevel) {
  if (fillLevel > 80) return "critical";
  if (fillLevel >= 50) return "warning";
  return "ok";
}

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "2.5rem",
};

export const borderRadius = {
  sm: "8px",
  md: "14px",
  lg: "20px",
  full: "999px",
};

export const shadow = {
  sm: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
  md: "0 4px 14px rgba(15, 23, 42, 0.08)",
  lg: "0 10px 30px rgba(15, 23, 42, 0.1)",
};

export const fontFamily = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
