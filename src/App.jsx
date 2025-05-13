import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HistoryView from "./pages/HistoryView";
import CurrentLocationView from "./pages/CurrentLocationView";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="history" element={<HistoryView />} />
          <Route path="current" element={<CurrentLocationView />} />
        </Route>
      </Routes>
    </Router>
  );
}
