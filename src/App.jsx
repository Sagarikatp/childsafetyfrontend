import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryView from "./components/HistoryView";
import GeoFenceSettings from "./components/GeoFenceSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/history" element={<HistoryView />} />
        <Route path="/settings" element={<GeoFenceSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
