import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapPlaceholder from "../components/MapPlaceHolder";
import { getCurrentLocation } from "../services/api";
import axiosInstance from "../api/axiosInstance";
import {
  calculateMapCenter,
  createCustomIcon,
  getDistance,
} from "../utils/map";

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

// Define colors for different geofences
const geofenceColors = { outside: "#ff6b6b", inside: "#4ecdc4" };

export default function GeoFenceView() {
  const [location, setLocation] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geofenceStatuses, setGeofenceStatuses] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [geoRes, locData] = await Promise.all([
          axiosInstance.get("/geofence/geofences"),
          getCurrentLocation(),
        ]);

        const geofencesData = geoRes.data.data;

        if (!geofencesData || geofencesData.length === 0) {
          throw new Error("No geofences found");
        }

        const currentLoc = [locData.latitude, locData.longitude];

        // // Filter out any geofences missing center/coordinates
        const validGeofences = geofencesData.filter(
          (geo) =>
            geo.center &&
            Array.isArray(geo.center.coordinates) &&
            geo.center.coordinates.length === 2
        );

        const processedGeofences = validGeofences.map((geo, index) => ({
          ...geo,
          center: [geo.center.coordinates[1], geo.center.coordinates[0]], // [lat, lng]
        }));

        const statuses = {};
        processedGeofences.forEach((geo) => {
          const distance = getDistance(currentLoc, geo.center);
          statuses[geo._id] = {
            inside: distance <= geo.radius,
            distance: distance,
          };
        });

        setGeofences(processedGeofences);
        setLocation(currentLoc);
        setGeofenceStatuses(statuses);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load geofences or location: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count how many geofences the user is inside
  const insideCount = Object.values(geofenceStatuses).filter(
    (status) => status.inside
  ).length;

  return (
    <div className="flex flex-col h-full md:ml-64 pb-16 md:pb-0">
      <div className="p-4 bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Geofence View</h2>
        {geofences.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              Total Geofences:{" "}
              <span className="font-medium">{geofences.length}</span>
            </p>
            <p className="text-sm font-medium">
              inside{" "}
              <span
                className={insideCount > 0 ? "text-green-600" : "text-gray-500"}
              >
                {insideCount}
              </span>{" "}
              of {geofences.length} geofence{geofences.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <MapPlaceholder message="Loading geofences and location..." />
        ) : error ? (
          <MapPlaceholder message={error} isError />
        ) : (
          <MapContainer
            center={calculateMapCenter(geofences)}
            zoom={10}
            className="h-full w-full z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Render all geofences */}
            {geofences.map((geofence, index) => (
              <div key={geofence._id}>
                {/* Geofence Circle */}
                <Circle
                  center={geofence.center}
                  radius={geofence.radius}
                  pathOptions={{
                    color: geofenceStatuses[geofence._id]?.inside
                      ? geofenceColors.inside
                      : geofenceColors.outside,
                    fillColor: geofenceStatuses[geofence._id]?.inside
                      ? geofenceColors.inside
                      : geofenceColors.outside,
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />

                {/* Geofence Center Marker */}
                <Marker
                  position={geofence.center}
                  icon={createCustomIcon(
                    geofenceStatuses[geofence._id]?.inside
                      ? geofenceColors.inside
                      : geofenceColors.outside
                  )}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold mb-2">
                        {geofence.name || `Geofence ${index + 1}`}
                      </p>
                      <p>
                        <strong>Center:</strong>
                      </p>
                      <p>Lat: {geofence.center[0].toFixed(6)}</p>
                      <p>Lng: {geofence.center[1].toFixed(6)}</p>
                      <p>
                        <strong>Radius:</strong> {geofence.radius}m
                      </p>
                      {geofence.createdBy && (
                        <p>
                          <strong>Created by:</strong> {geofence.createdBy.name}
                        </p>
                      )}
                      <p className="mt-2">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            geofenceStatuses[geofence._id]?.inside
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {geofenceStatuses[geofence._id]?.inside
                            ? "Inside"
                            : "Outside"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Distance:{" "}
                        {geofenceStatuses[geofence._id]?.distance?.toFixed(0)}m
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </div>
            ))}

            {/* User Location Marker */}
            {location && (
              <Marker position={location}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold mb-1">Your Location</p>
                    <p>Latitude: {location[0].toFixed(6)}</p>
                    <p>Longitude: {location[1].toFixed(6)}</p>
                    <div className="mt-2">
                      <p className="font-semibold">Geofence Status:</p>
                      {geofences.map((geo, index) => (
                        <p key={geo._id} className="text-xs">
                          <span
                            style={{
                              color: geofenceStatuses[geo._id]?.inside
                                ? geofenceColors.inside
                                : geofenceColors.outside,
                            }}
                          >
                            ●
                          </span>{" "}
                          {geo.name || `Fence ${index + 1}`}:{" "}
                          <span
                            className={`font-medium ${
                              geofenceStatuses[geo._id]?.inside
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {geofenceStatuses[geo._id]?.inside
                              ? "Inside"
                              : "Outside"}
                          </span>
                        </p>
                      ))}
                    </div>
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
