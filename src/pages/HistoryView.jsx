"use client";

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
import MapPlaceholder from "../components/MapPlaceHolder";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getLocationHistory();
        setHistory(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load location history");
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const path = history.map((entry) => [entry.latitude, entry.longitude]);

  // Color range: blue (start) to red (end)
  const startColor = [66, 133, 244];
  const endColor = [234, 67, 53];

  return (
    <div className="flex flex-col h-full md:ml-64 pb-16 md:pb-0">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Location History
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {history.length} locations recorded
        </p>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <MapPlaceholder message="Loading location history..." />
        ) : error ? (
          <MapPlaceholder message={error} isError />
        ) : history.length === 0 ? (
          <MapPlaceholder message="No location history found" />
        ) : (
          <MapContainer
            center={[22.9734, 78.6569]}
            zoom={5}
            className="h-full w-full z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Markers with info popups */}
            {history.map((entry, index) => (
              <Marker key={index} position={[entry.latitude, entry.longitude]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold mb-1">Location Point {index + 1}</p>
                    <p>Time: {new Date(entry.timestamp).toLocaleString()}</p>
                    <p>Latitude: {entry.latitude.toFixed(6)}</p>
                    <p>Longitude: {entry.longitude.toFixed(6)}</p>
                  </div>
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
        )}
      </div>
    </div>
  );
}
