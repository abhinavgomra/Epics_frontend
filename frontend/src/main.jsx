import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { applyThemeToDocument, THEME_IDS } from "./theme";
import "./index.css";
import "./dashboard.css";
import App from "./App.jsx";

try {
  const saved = localStorage.getItem("smart-waste-theme");
  applyThemeToDocument(saved && THEME_IDS.includes(saved) ? saved : "eco");
} catch {
  applyThemeToDocument("eco");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
