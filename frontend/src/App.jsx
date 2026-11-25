import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppDataProvider } from "./context/AppDataContext";
import Navbar from "./components/Navbar";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { LoadingState } from "./components/Feedback";

const ManagementDashboard = lazy(() => import("./pages/ManagementDashboard"));
const PickupPlan = lazy(() => import("./pages/PickupPlan"));
const WorkerDashboard = lazy(() => import("./pages/WorkerDashboard"));
const ReadingsDashboard = lazy(() => import("./pages/ReadingsDashboard"));

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
            <Route
              path="/pickup-plan"
              element={
                <Suspense fallback={<LoadingState />}>
                  <PickupPlan />
                </Suspense>
              }
            />
            <Route
              path="/worker"
              element={
                <Suspense fallback={<LoadingState />}>
                  <WorkerDashboard />
                </Suspense>
              }
            />
            <Route
              path="/readings"
              element={
                <Suspense fallback={<LoadingState />}>
                  <ReadingsDashboard />
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
