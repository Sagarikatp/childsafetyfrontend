import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getLocationHistory } from "../services/api";

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

export default function HistoryView() {
  const [history, setHistory] = useState([]);

  // Default to center of India
  const defaultCenter = [22.9734, 78.6569];

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getLocationHistory(); // Should return [{ latitude, longitude, timestamp }]
      setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Location History</h2>

      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
      </MapContainer>
    </div>
  );
}
