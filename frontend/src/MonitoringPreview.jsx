import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BinsDataProvider } from "./context/BinsDataContext";
import Navbar from "./components/Navbar";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { theme } from "./theme";

export default function MonitoringPreview() {
  return (
    <BinsDataProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MonitoringDashboard />} />
          <Route
            path="/management"
            element={
              <div
                style={{
                  padding: theme.spacing.xl,
                  color: theme.colors.textMuted,
                  fontFamily: theme.fontFamily,
                }}
              >
                <h2 style={{ color: theme.colors.text }}>Management Dashboard</h2>
                <p>Coming soon — Member 2 module</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </BinsDataProvider>
  );
}
