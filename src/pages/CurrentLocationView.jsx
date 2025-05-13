"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

export default function CurrentLocationView() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      const data = await getCurrentLocation();
      console.log(data);
      setLocation([data.latitude, data.longitude]);
      setLoading(false);

      // navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     setLocation([position.coords.latitude, position.coords.longitude]);
      //     setLoading(false);
      //   },
      //   (error) => {
      //     setError(`Error getting location: ${error.message}`);
      //     setLoading(false);
      //   }
      // );
    };

    getLocation();
  }, []);

  return (
    <div className="flex flex-col h-full md:ml-64 pb-16 md:pb-0">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Current Location
        </h2>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <MapPlaceholder message="Getting your location..." />
        ) : error ? (
          <MapPlaceholder message={error} isError />
        ) : (
          <MapContainer
            center={location || [22.9734, 78.6569]}
            zoom={15}
            className="h-full w-full z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {location && (
              <Marker position={location}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold mb-1">Your Current Location</p>
                    <p>Latitude: {location[0].toFixed(6)}</p>
                    <p>Longitude: {location[1].toFixed(6)}</p>
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
