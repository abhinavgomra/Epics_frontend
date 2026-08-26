import { createContext, useContext, useEffect, useState } from "react";
import {
  THEME_IDS,
  THEME_LABELS,
  applyThemeToDocument,
  getThemePreset,
  spacing,
  borderRadius,
  shadow,
  fontFamily,
} from "../theme";

const STORAGE_KEY = "smart-waste-theme";

const ThemeContext = createContext(null);

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEME_IDS.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "eco";
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(getInitialTheme);
  const preset = getThemePreset(themeId);

  useEffect(() => {
    applyThemeToDocument(themeId);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      /* ignore */
    }
  }, [themeId]);

  const setThemeId = (id) => {
    if (THEME_IDS.includes(id)) setThemeIdState(id);
  };

  const theme = {
    colors: preset.colors,
    spacing,
    borderRadius,
    shadow,
    fontFamily,
  };

  return (
    <ThemeContext.Provider
      value={{ themeId, setThemeId, theme, themeLabels: THEME_LABELS, themeIds: THEME_IDS }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
