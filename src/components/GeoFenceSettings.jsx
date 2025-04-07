import { useState } from "react";

export default function GeoFenceSettings({ onSave }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");

  const handleSave = () => {
    onSave({ latitude, longitude, radius: Number(radius) });
  };

  return (
    <div>
      <h2>Set Geofence</h2>
      <input
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <input
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <input
        placeholder="Radius (meters)"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
      />
      <button onClick={handleSave}>Save Geofence</button>
    </div>
  );
}
