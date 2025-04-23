import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HistoryView from "./components/HistoryView";
import CurrentLocationView from "./components/CurrentLocationView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<HistoryView />} />
        <Route path="/current" element={<CurrentLocationView />} />
      </Routes>
    </Router>
  );
}
