import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BinsDataProvider } from "./context/BinsDataContext";
import Navbar from "./components/Navbar";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import { theme } from "./theme";
import ManagementDashboard from "./pages/ManagementDashboard";

function App() {
  return (
    <BinsDataProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MonitoringDashboard />} />
          <Route path="/management" element={<ManagementDashboard />} />
        </Routes>
      </BrowserRouter>
    </BinsDataProvider>
  );
}

export default App;
