// Haversine formula to calculate distance between two lat/lng points in meters
const getDistance = ([lat1, lon1], [lat2, lon2]) => {
  const R = 6371000;
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

// Calculate center point of all geofences for initial map view
const calculateMapCenter = (geofences) => {
  if (geofences.length === 0) return [0, 0];
  if (geofences.length === 1) {
    return geofences[0].center;
  }
  const avgLat =
    geofences.reduce((sum, geo) => sum + geo.center[0], 0) / geofences.length;
  const avgLng =
    geofences.reduce((sum, geo) => sum + geo.center[1], 0) / geofences.length;

  return [avgLat, avgLng];
};

// Create custom colored icons for different geofences
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color:${color};width:25px;height:25px;border-radius:50%;border:3px solid white;box-shadow:0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

export { getDistance, calculateMapCenter, createCustomIcon };
