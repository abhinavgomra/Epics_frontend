import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppDataProvider } from "./context/AppDataContext";
import Navbar from "./components/Navbar";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { LoadingState } from "./components/Feedback";

const ManagementDashboard = lazy(() => import("./pages/ManagementDashboard"));

function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<MonitoringDashboard />} />
            <Route
              path="/management"
              element={
                <Suspense fallback={<LoadingState />}>
                  <ManagementDashboard />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </ThemeProvider>
  );
}

export default App;
