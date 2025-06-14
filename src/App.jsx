import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HistoryView from "./pages/HistoryView";
import CurrentLocationView from "./pages/CurrentLocationView";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GeoFenceView from "./pages/Geofence";
import SetGeofence from "./pages/SetGeofence";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="history" element={<HistoryView />} />
        <Route path="current" element={<CurrentLocationView />} />
        <Route path="geofence" element={<GeoFenceView />} />
        <Route path="setgeofence" element={<SetGeofence />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  );
}
