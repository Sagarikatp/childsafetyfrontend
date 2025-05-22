"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapPlaceholder from "../components/MapPlaceHolder";
import { getCurrentLocation } from "../services/api";

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

export default function GeoFenceView() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insideFence, setInsideFence] = useState(null);

  // Define geofence center and radius (in meters)
  const geofenceCenter = [22.9734, 78.6569]; // Change to your desired location
  const geofenceRadius = 500; // 500 meters

  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      try {
        const data = await getCurrentLocation();
        const currentLoc = [data.latitude, data.longitude];
        setLocation(currentLoc);
        setLoading(false);

        // Check if inside geofence
        const distance = getDistance(currentLoc, geofenceCenter);
        setInsideFence(distance <= geofenceRadius);
      } catch (err) {
        setError("Failed to get location" + err.message);
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  // Haversine formula to calculate distance between two lat/lng points in meters
  const getDistance = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371000; // Radius of Earth in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="flex flex-col h-full md:ml-64 pb-16 md:pb-0">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Geofence View</h2>
        {insideFence !== null && (
          <p
            className={`mt-2 text-sm font-medium ${
              insideFence ? "text-green-600" : "text-red-600"
            }`}
          >
            You are {insideFence ? "inside" : "outside"} the geofence.
          </p>
        )}
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <MapPlaceholder message="Getting your location..." />
        ) : error ? (
          <MapPlaceholder message={error} isError />
        ) : (
          <MapContainer
            center={geofenceCenter}
            zoom={15}
            className="h-full w-full z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Geofence Circle */}
            <Circle
              center={geofenceCenter}
              radius={geofenceRadius}
              pathOptions={{ color: "blue", fillOpacity: 0.1 }}
            />

            {/* Geofence Center Marker */}
            <Marker position={geofenceCenter}>
              <Popup>
                <strong>Geofence Center</strong>
              </Popup>
            </Marker>

            {/* User Marker */}
            {location && (
              <Marker position={location}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold mb-1">Your Location</p>
                    <p>Latitude: {location[0].toFixed(6)}</p>
                    <p>Longitude: {location[1].toFixed(6)}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          insideFence ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {insideFence ? "Inside Geofence" : "Outside Geofence"}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
