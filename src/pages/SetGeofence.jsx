"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import axiosInstance from "../api/axiosInstance";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ setCenter }) {
  useMapEvents({
    click(e) {
      setCenter([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function SetGeofence() {
  const [center, setCenter] = useState(null);
  const [radius, setRadius] = useState(300);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    if (!center) {
      setError("Please select a location on the map.");
      return;
    }

    const geoData = {
      name: `Geofence @ ${center[0].toFixed(4)}, ${center[1].toFixed(4)}`,
      center: {
        type: "Point",
        coordinates: [center[1], center[0]], // [lng, lat] format
      },
      radius,
    };

    setLoading(true);
    try {
      const response = await axiosInstance.post("/geofence/geofences", geoData);

      if (response.data.success) {
        setMessage("Geofence created successfully!");
        setCenter(null);
        setRadius(300);
      } else {
        setError("Failed to create geofence.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error creating geofence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full md:ml-64 pb-16 md:pb-0">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Interactive Geofence Setup
        </h2>
      </div>

      <div className="h-96 mb-4">
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector setCenter={setCenter} />
          {center && (
            <>
              <Marker position={center} />
              <Circle
                center={center}
                radius={radius}
                pathOptions={{ color: "blue", fillOpacity: 0.2 }}
              >
                <Tooltip direction="top" offset={[0, -10]} permanent>
                  Radius: {radius} meters
                </Tooltip>
              </Circle>
            </>
          )}
        </MapContainer>
      </div>
      <div className="p-4">
        {center && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm">
              Selected Coordinates:{" "}
              <span className="font-mono">
                {center[0].toFixed(6)}, {center[1].toFixed(6)}
              </span>
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">
            Radius: {radius} meters
          </label>
          <input
            type="range"
            min="100"
            max="5000"
            step="50"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Geofence"}
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
}
