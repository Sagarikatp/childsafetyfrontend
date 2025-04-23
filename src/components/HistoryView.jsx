import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getLocationHistory } from "../services/api"; // Adjust path if needed

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper to interpolate color
function interpolateColor(start, end, factor) {
  const result = start.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (end[i] - start[i]));
  }
  return `rgb(${result.join(",")})`;
}

// Component to auto-fit bounds to path
function FitBounds({ path }) {
  const map = useMap();

  useEffect(() => {
    if (path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, map]);

  return null;
}

export default function HistoryView() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getLocationHistory();
      setHistory(data);
    };

    fetchHistory();
  }, []);

  const path = history.map((entry) => [entry.latitude, entry.longitude]);

  // Color range: gray (start) to red (end)
  const startColor = [128, 128, 128];
  const endColor = [255, 0, 0];

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Markers with info popups */}
        {history.map((entry, index) => (
          <Marker key={index} position={[entry.latitude, entry.longitude]}>
            <Popup>
              <strong>Time:</strong> {entry.timestamp}
              <br />
              <strong>Lat:</strong> {entry.latitude}
              <br />
              <strong>Lng:</strong> {entry.longitude}
            </Popup>
          </Marker>
        ))}

        {/* Colored path lines */}
        {path.length > 1 &&
          path.slice(0, -1).map((point, i) => {
            const next = path[i + 1];
            const factor = i / (path.length - 2); // gradient progress
            const color = interpolateColor(startColor, endColor, factor);
            return (
              <Polyline
                key={i}
                positions={[point, next]}
                pathOptions={{ color, weight: 4 }}
              />
            );
          })}

        <FitBounds path={path} />
      </MapContainer>
    </div>
  );
}
