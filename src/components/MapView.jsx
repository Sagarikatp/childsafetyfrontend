import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to move the map to new position
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15); // smoothly scroll to position
    }
  }, [position]);

  return null;
}

export default function MapView({ position }) {
  const [isBrowser, setIsBrowser] = useState(false);

  // Default to India's coordinates
  const defaultPosition = [22.9734, 78.6569];
  const currentPosition = position || defaultPosition;

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={currentPosition}
      zoom={5} // Zoomed out for full India view
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={currentPosition}>
        <Popup>Student's Current Location</Popup>
      </Marker>
      <MapUpdater position={position} />
    </MapContainer>
  );
}
