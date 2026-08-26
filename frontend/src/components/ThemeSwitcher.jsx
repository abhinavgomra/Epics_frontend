import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { themeId, setThemeId, themeIds, themeLabels } = useTheme();

  return (
    <div className="theme-switcher">
      <label className="theme-switcher__label" htmlFor="theme-select">
        Theme
      </label>
      <select
        id="theme-select"
        className="theme-switcher__select"
        value={themeId}
        onChange={(e) => setThemeId(e.target.value)}
        aria-label="Choose color theme"
      >
        {themeIds.map((id) => (
          <option key={id} value={id}>
            {themeLabels[id]}
          </option>
        ))}
      </select>
    </div>
  );
}
